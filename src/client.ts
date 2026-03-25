import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from "axios";
import https from "https";

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

export interface ServiceConfig {
  url: string;
  user: string;
  tokenId?: string;
  tokenSecret?: string;
  password?: string;
}

export interface SuperProxmoxConfig {
  pve?: ServiceConfig;
  pbs?: ServiceConfig;
  pdm?: ServiceConfig;
}

export class ApiError extends Error {
  public status: number;
  public endpoint: string;
  public details: unknown;

  constructor(status: number, endpoint: string, details: unknown) {
    const msg = `Proxmox API ${status} on ${endpoint}: ${typeof details === 'string' ? details : JSON.stringify(details)}`;
    super(msg);
    this.name = 'ApiError';
    this.status = status;
    this.endpoint = endpoint;
    this.details = details;
  }
}

export class ValidationError extends Error {
  constructor(tool: string, param: string, message: string) {
    super(`[${tool}] Invalid param '${param}': ${message}`);
    this.name = 'ValidationError';
  }
}

// Validate required params before sending to API
export function validateParams(tool: string, args: Record<string, unknown>, required: string[]): void {
  for (const param of required) {
    if (args[param] === undefined || args[param] === null || args[param] === '') {
      throw new ValidationError(tool, param, 'is required');
    }
  }
}

export function validateNode(tool: string, node: unknown): asserts node is string {
  if (typeof node !== 'string' || node.length === 0) {
    throw new ValidationError(tool, 'node', 'must be a non-empty string');
  }
  if (!/^[a-zA-Z0-9\-_.]+$/.test(node)) {
    throw new ValidationError(tool, 'node', 'contains invalid characters');
  }
}

export function validateVmid(tool: string, vmid: unknown): asserts vmid is number {
  if (typeof vmid !== 'number' || !Number.isInteger(vmid) || vmid < 100 || vmid > 999999999) {
    throw new ValidationError(tool, 'vmid', 'must be an integer >= 100');
  }
}

const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 2000, 4000]; // ms

function isRetryable(error: AxiosError): boolean {
  if (!error.response) return true; // Network error, timeout
  const status = error.response.status;
  return status === 429 || status === 502 || status === 503 || status === 504;
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function createTokenClient(config: ServiceConfig): Promise<AxiosInstance> {
  const auth = `PVEAPIToken=${config.user}!${config.tokenId}=${config.tokenSecret}`;
  return axios.create({
    baseURL: `${config.url}/api2/json`,
    headers: { Authorization: auth, "Content-Type": "application/json" },
    httpsAgent,
    timeout: 30000,
  });
}

async function createTicketClient(config: ServiceConfig): Promise<{ client: AxiosInstance; ticket: string; csrf: string }> {
  const res = await axios.post(
    `${config.url}/api2/json/access/ticket`,
    new URLSearchParams({ username: config.user, password: config.password! }),
    { httpsAgent, timeout: 10000 }
  );
  const { ticket, CSRFPreventionToken } = res.data.data;
  const client = axios.create({
    baseURL: `${config.url}/api2/json`,
    headers: {
      Cookie: `PVEAuthCookie=${ticket}`,
      CSRFPreventionToken,
      "Content-Type": "application/json",
    },
    httpsAgent,
    timeout: 30000,
  });
  return { client, ticket, csrf: CSRFPreventionToken };
}

export class ApiClient {
  private api!: AxiosInstance;
  private config: ServiceConfig;
  private useTicket: boolean = false;
  private ticketExpiry: number = 0;
  public readonly service: "pve" | "pbs" | "pdm";

  constructor(config: ServiceConfig, service: "pve" | "pbs" | "pdm") {
    this.config = config;
    this.service = service;
  }

  async init(): Promise<void> {
    if (this.config.tokenId && this.config.tokenSecret) {
      this.api = await createTokenClient(this.config);
      this.useTicket = false;
    } else if (this.config.password) {
      const { client } = await createTicketClient(this.config);
      this.api = client;
      this.useTicket = true;
      this.ticketExpiry = Date.now() + 7000 * 1000; // PVE tickets last ~2h, refresh at 1h56m
    } else {
      throw new Error("Auth required: set TOKEN_ID/TOKEN_SECRET or PASSWORD");
    }
  }

  private async refreshTicketIfNeeded(): Promise<void> {
    if (!this.useTicket) return;
    if (Date.now() < this.ticketExpiry) return;
    try {
      const { client } = await createTicketClient(this.config);
      this.api = client;
      this.ticketExpiry = Date.now() + 7000 * 1000;
    } catch {
      // If refresh fails, continue with current ticket — it might still work
    }
  }

  private async request<T>(method: 'get' | 'post' | 'put' | 'delete', path: string, config?: AxiosRequestConfig): Promise<T> {
    await this.refreshTicketIfNeeded();

    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const res = await this.api.request({ method, url: path, ...config });
        return res.data.data;
      } catch (error) {
        const axiosErr = error as AxiosError;

        // 401 with ticket auth — try refresh once
        if (axiosErr.response?.status === 401 && this.useTicket && attempt === 0) {
          try {
            const { client } = await createTicketClient(this.config);
            this.api = client;
            this.ticketExpiry = Date.now() + 7000 * 1000;
            continue; // Retry with fresh ticket
          } catch {
            // Refresh failed — throw original error
          }
        }

        // Retryable errors (429, 5xx, network)
        if (isRetryable(axiosErr) && attempt < MAX_RETRIES) {
          lastError = axiosErr;
          await sleep(RETRY_DELAYS[attempt] || 4000);
          continue;
        }

        // Non-retryable error — throw immediately
        if (axiosErr.response) {
          throw new ApiError(
            axiosErr.response.status,
            `${method.toUpperCase()} ${path}`,
            axiosErr.response.data
          );
        }

        // Network error (no response)
        if (axiosErr.code === 'ECONNABORTED') {
          throw new ApiError(0, `${method.toUpperCase()} ${path}`, 'Request timeout (30s)');
        }
        if (axiosErr.code === 'ECONNREFUSED') {
          throw new ApiError(0, `${method.toUpperCase()} ${path}`, `Connection refused: ${this.config.url}`);
        }

        throw new ApiError(0, `${method.toUpperCase()} ${path}`, axiosErr.message);
      }
    }

    throw lastError || new Error('Max retries exceeded');
  }

  async get(path: string, params?: Record<string, unknown>): Promise<any> {
    return this.request('get', path, { params });
  }

  async post(path: string, data?: Record<string, unknown>): Promise<any> {
    return this.request('post', path, { data } as any);
  }

  async put(path: string, data?: Record<string, unknown>): Promise<any> {
    return this.request('put', path, { data } as any);
  }

  async del(path: string, params?: Record<string, unknown>): Promise<any> {
    return this.request('delete', path, { params });
  }
}

// Backward compat
export type PveClient = ApiClient;

export class SuperProxmoxClient {
  public pve?: ApiClient;
  public pbs?: ApiClient;
  public pdm?: ApiClient;

  constructor(config: SuperProxmoxConfig) {
    if (config.pve) this.pve = new ApiClient(config.pve, "pve");
    if (config.pbs) this.pbs = new ApiClient(config.pbs, "pbs");
    if (config.pdm) this.pdm = new ApiClient(config.pdm, "pdm");
  }

  async init(): Promise<string[]> {
    const connected: string[] = [];
    if (this.pve) { await this.pve.init(); connected.push("PVE"); }
    if (this.pbs) { await this.pbs.init(); connected.push("PBS"); }
    if (this.pdm) { await this.pdm.init(); connected.push("PDM"); }
    if (connected.length === 0) throw new Error("No services configured. Set PVE_URL, PBS_URL, or PDM_URL.");
    return connected;
  }

  static fromEnv(): SuperProxmoxClient {
    const config: SuperProxmoxConfig = {};

    if (process.env.PVE_URL) {
      config.pve = {
        url: process.env.PVE_URL,
        user: process.env.PVE_USER || "root@pam",
        tokenId: process.env.PVE_TOKEN_ID,
        tokenSecret: process.env.PVE_TOKEN_SECRET,
        password: process.env.PVE_PASSWORD,
      };
    }

    if (process.env.PBS_URL) {
      config.pbs = {
        url: process.env.PBS_URL,
        user: process.env.PBS_USER || "root@pam",
        tokenId: process.env.PBS_TOKEN_ID,
        tokenSecret: process.env.PBS_TOKEN_SECRET,
        password: process.env.PBS_PASSWORD,
      };
    }

    if (process.env.PDM_URL) {
      config.pdm = {
        url: process.env.PDM_URL,
        user: process.env.PDM_USER || "root@pam",
        tokenId: process.env.PDM_TOKEN_ID,
        tokenSecret: process.env.PDM_TOKEN_SECRET,
        password: process.env.PDM_PASSWORD,
      };
    }

    if (!config.pve && process.env.PROXMOX_URL) {
      config.pve = {
        url: process.env.PROXMOX_URL,
        user: process.env.PROXMOX_USER || "root@pam",
        tokenId: process.env.PROXMOX_TOKEN_ID,
        tokenSecret: process.env.PROXMOX_TOKEN_SECRET,
        password: process.env.PROXMOX_PASSWORD,
      };
    }

    return new SuperProxmoxClient(config);
  }
}
