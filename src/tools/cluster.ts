import type { PveClient } from "../client.js";
import type { ToolDefinition } from "../types.js";
import { formatBytes, formatUptime, json } from "../utils.js";

export const tools: ToolDefinition[] = [
  { name: "pve_get_cluster_status", description: "Get Proxmox cluster status and health", inputSchema: { type: "object", properties: {} } },
  { name: "pve_list_nodes", description: "List all nodes in the Proxmox cluster", inputSchema: { type: "object", properties: {} } },
  { name: "pve_get_node_status", description: "Get detailed status of a specific node", inputSchema: { type: "object", properties: { node: { type: "string", description: "Node name" } }, required: ["node"] } },
  { name: "pve_get_node_resources", description: "Get CPU, memory, and storage usage for a node", inputSchema: { type: "object", properties: { node: { type: "string", description: "Node name" } }, required: ["node"] } },
  { name: "pve_get_version", description: "Get Proxmox VE version info", inputSchema: { type: "object", properties: {} } },
];

export async function handle(client: PveClient, name: string, args: Record<string, unknown>): Promise<string> {
  switch (name) {
    case "pve_get_cluster_status":
      return json(await client.get("/cluster/status"));

    case "pve_list_nodes":
      return json(await client.get("/nodes"));

    case "pve_get_node_status":
      return json(await client.get(`/nodes/${args.node}/status`));

    case "pve_get_node_resources": {
      const data = await client.get(`/nodes/${args.node}/status`);
      return json({
        cpu: { usage: (data.cpu * 100).toFixed(2) + "%", cores: data.cpuinfo?.cores, model: data.cpuinfo?.model },
        memory: { used: formatBytes(data.memory?.used), total: formatBytes(data.memory?.total), free: formatBytes(data.memory?.free), usagePercent: ((data.memory?.used / data.memory?.total) * 100).toFixed(2) + "%" },
        swap: { used: formatBytes(data.swap?.used), total: formatBytes(data.swap?.total) },
        uptime: formatUptime(data.uptime),
        loadavg: data.loadavg,
      });
    }

    case "pve_get_version":
      return json(await client.get("/version"));

    default:
      throw new Error(`Unknown cluster tool: ${name}`);
  }
}
