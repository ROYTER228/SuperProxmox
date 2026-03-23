import axios, { AxiosInstance } from "axios";
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

async function createClient(config: ServiceConfig): Promise<AxiosInstance> {
  if (config.tokenId && config.tokenSecret) {
    const auth = `PVEAPIToken=${config.user}!${config.tokenId}=${config.tokenSecret}`;
    return axios.create({
      baseURL: `${config.url}/api2/json`,
      headers: { Authorization: auth, "Content-Type": "application/json" },
      httpsAgent,
      timeout: 30000,
    });
  }

  if (config.password) {
    const res = await axios.post(
      `${config.url}/api2/json/access/ticket`,
      new URLSearchParams({ username: config.user, password: config.password }),
      { httpsAgent }
    );
    const { ticket, CSRFPreventionToken } = res.data.data;
    return axios.create({
      baseURL: `${config.url}/api2/json`,
      headers: {
        Cookie: `PVEAuthCookie=${ticket}`,
        CSRFPreventionToken,
        "Content-Type": "application/json",
      },
      httpsAgent,
      timeout: 30000,
    });
  }

  throw new Error("Auth required: set TOKEN_ID/TOKEN_SECRET or PASSWORD");
}

export class ApiClient {
  private api!: AxiosInstance;
  private config: ServiceConfig;
  public readonly service: "pve" | "pbs" | "pdm";

  constructor(config: ServiceConfig, service: "pve" | "pbs" | "pdm") {
    this.config = config;
    this.service = service;
  }

  async init(): Promise<void> {
    this.api = await createClient(this.config);
  }

  async get(path: string, params?: Record<string, unknown>) {
    const res = await this.api.get(path, { params });
    return res.data.data;
  }

  async post(path: string, data?: Record<string, unknown>) {
    const res = await this.api.post(path, data);
    return res.data.data;
  }

  async put(path: string, data?: Record<string, unknown>) {
    const res = await this.api.put(path, data);
    return res.data.data;
  }

  async del(path: string, params?: Record<string, unknown>) {
    const res = await this.api.delete(path, { params });
    return res.data.data;
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

    // Backward compat: PROXMOX_URL → PVE_URL
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
