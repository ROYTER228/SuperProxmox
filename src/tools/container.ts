import type { PveClient } from "../client.js";
import type { ToolDefinition } from "../types.js";
import { json } from "../utils.js";

export const tools: ToolDefinition[] = [
  { name: "pve_list_containers", description: "List all LXC containers", inputSchema: { type: "object", properties: { node: { type: "string", description: "Optional: filter by node" } } } },
  { name: "pve_get_container_status", description: "Get status of a container", inputSchema: { type: "object", properties: { node: { type: "string" }, vmid: { type: "number" } }, required: ["node", "vmid"] } },
  { name: "pve_get_container_config", description: "Get container configuration", inputSchema: { type: "object", properties: { node: { type: "string" }, vmid: { type: "number" } }, required: ["node", "vmid"] } },
  { name: "pve_create_container", description: "Create a new LXC container", inputSchema: { type: "object", properties: {
    node: { type: "string", description: "Node name" },
    vmid: { type: "number", description: "Container ID" },
    hostname: { type: "string", description: "Hostname" },
    ostemplate: { type: "string", description: "OS template (e.g. local:vztmpl/debian-12-standard_12.12-1_amd64.tar.zst)" },
    memory: { type: "number", description: "RAM in MB (default: 512)" },
    swap: { type: "number", description: "Swap in MB (default: 512)" },
    cores: { type: "number", description: "CPU cores (default: 1)" },
    storage: { type: "string", description: "Root disk storage (default: local-lvm)" },
    rootfsSize: { type: "number", description: "Root disk size in GB (default: 8)" },
    password: { type: "string", description: "Root password" },
    ip: { type: "string", description: "IP address with CIDR (e.g. 192.168.3.50/24)" },
    gateway: { type: "string", description: "Gateway (e.g. 192.168.3.1)" },
    nameserver: { type: "string", description: "DNS server (default: 8.8.8.8)" },
    unprivileged: { type: "boolean", description: "Unprivileged container (default: true)" },
    nesting: { type: "boolean", description: "Enable nesting (default: true)" },
    onboot: { type: "boolean", description: "Start on boot" },
    start: { type: "boolean", description: "Start after creation" },
  }, required: ["node", "vmid", "ostemplate"] } },
  { name: "pve_update_container_config", description: "Update container configuration", inputSchema: { type: "object", properties: {
    node: { type: "string" }, vmid: { type: "number" },
    memory: { type: "number" }, cores: { type: "number" },
    hostname: { type: "string" }, onboot: { type: "boolean" },
    description: { type: "string" },
  }, required: ["node", "vmid"] } },
  { name: "pve_start_container", description: "Start a container", inputSchema: { type: "object", properties: { node: { type: "string" }, vmid: { type: "number" } }, required: ["node", "vmid"] } },
  { name: "pve_stop_container", description: "Stop a container. ⚠ Causes service downtime. Confirm with user before calling.", inputSchema: { type: "object", properties: { node: { type: "string" }, vmid: { type: "number" } }, required: ["node", "vmid"] } },
  { name: "pve_reboot_container", description: "Reboot a container", inputSchema: { type: "object", properties: { node: { type: "string" }, vmid: { type: "number" } }, required: ["node", "vmid"] } },
  { name: "pve_clone_container", description: "Clone a container", inputSchema: { type: "object", properties: { node: { type: "string" }, vmid: { type: "number" }, newid: { type: "number" }, hostname: { type: "string" }, full: { type: "boolean" } }, required: ["node", "vmid", "newid"] } },
  { name: "pve_delete_container", description: "⚠ DESTRUCTIVE: Permanently delete a container and all its data. REQUIRES explicit user confirmation. State what will be destroyed, check backups, wait for 'yes'.", inputSchema: { type: "object", properties: { node: { type: "string" }, vmid: { type: "number" }, purge: { type: "boolean" } }, required: ["node", "vmid"] } },
  { name: "pve_resize_container", description: "Resize container disk", inputSchema: { type: "object", properties: { node: { type: "string" }, vmid: { type: "number" }, disk: { type: "string", description: "Disk (default: rootfs)" }, size: { type: "string", description: "Size (e.g. +5G)" } }, required: ["node", "vmid", "size"] } },
];

export async function handle(client: PveClient, name: string, args: Record<string, unknown>): Promise<string> {
  const n = args.node as string;
  const id = args.vmid as number;

  switch (name) {
    case "pve_list_containers":
      return args.node
        ? json(await client.get(`/nodes/${n}/lxc`))
        : json(await client.get("/cluster/resources", { type: "lxc" }));

    case "pve_get_container_status":
      return json(await client.get(`/nodes/${n}/lxc/${id}/status/current`));

    case "pve_get_container_config":
      return json(await client.get(`/nodes/${n}/lxc/${id}/config`));

    case "pve_create_container": {
      const params: Record<string, unknown> = {
        vmid: id,
        ostemplate: args.ostemplate,
        hostname: args.hostname || `ct-${id}`,
        memory: args.memory || 512,
        swap: args.swap || 512,
        cores: args.cores || 1,
        rootfs: `${args.storage || "local-lvm"}:${args.rootfsSize || 8}`,
        unprivileged: args.unprivileged !== false ? 1 : 0,
        features: args.nesting !== false ? "nesting=1" : undefined,
        nameserver: args.nameserver || "8.8.8.8",
        start: args.start ? 1 : 0,
        onboot: args.onboot ? 1 : 0,
      };
      if (args.password) params.password = args.password;
      if (args.ip) params.net0 = `name=eth0,bridge=vmbr0,ip=${args.ip}${args.gateway ? `,gw=${args.gateway}` : ""}`;
      const task = await client.post(`/nodes/${n}/lxc`, params);
      return `Container ${id} created. Task: ${task}`;
    }

    case "pve_update_container_config": {
      const params: Record<string, unknown> = {};
      if (args.memory) params.memory = args.memory;
      if (args.cores) params.cores = args.cores;
      if (args.hostname) params.hostname = args.hostname;
      if (args.onboot !== undefined) params.onboot = args.onboot ? 1 : 0;
      if (args.description) params.description = args.description;
      await client.put(`/nodes/${n}/lxc/${id}/config`, params);
      return `Container ${id} config updated.`;
    }

    case "pve_start_container":
      return `Container ${id} start initiated. Task: ${await client.post(`/nodes/${n}/lxc/${id}/status/start`)}`;

    case "pve_stop_container":
      return `Container ${id} stop initiated. Task: ${await client.post(`/nodes/${n}/lxc/${id}/status/stop`)}`;

    case "pve_reboot_container":
      return `Container ${id} reboot initiated. Task: ${await client.post(`/nodes/${n}/lxc/${id}/status/reboot`)}`;

    case "pve_clone_container": {
      const data: Record<string, unknown> = { newid: args.newid };
      if (args.hostname) data.hostname = args.hostname;
      if (args.full) data.full = 1;
      return `Container ${id} clone initiated. Task: ${await client.post(`/nodes/${n}/lxc/${id}/clone`, data)}`;
    }

    case "pve_delete_container":
      return `Container ${id} deletion initiated. Task: ${await client.del(`/nodes/${n}/lxc/${id}`, args.purge ? { purge: 1 } : undefined)}`;

    case "pve_resize_container":
      await client.put(`/nodes/${n}/lxc/${id}/resize`, { disk: args.disk || "rootfs", size: args.size });
      return `Container ${id} disk resized to ${args.size}`;

    default:
      throw new Error(`Unknown container tool: ${name}`);
  }
}
