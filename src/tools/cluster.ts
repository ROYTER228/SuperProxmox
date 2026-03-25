import type { PveClient } from "../client.js";
import type { ToolDefinition } from "../types.js";
import { json } from "../utils.js";
import { formatNodeResources, formatNodeList } from "../format.js";

export const tools: ToolDefinition[] = [
  { name: "pve_get_cluster_status", description: "Get Proxmox cluster status and health", inputSchema: { type: "object", properties: {} } },
  { name: "pve_list_nodes", description: "List all nodes in the Proxmox cluster with CPU/RAM/uptime", inputSchema: { type: "object", properties: {} } },
  { name: "pve_get_node_status", description: "Get detailed status of a specific node", inputSchema: { type: "object", properties: { node: { type: "string", description: "Node name" } }, required: ["node"] } },
  { name: "pve_get_node_resources", description: "Get CPU, memory, storage, temperature for a node with visual progress bars", inputSchema: { type: "object", properties: { node: { type: "string", description: "Node name" } }, required: ["node"] } },
  { name: "pve_get_version", description: "Get Proxmox VE version info", inputSchema: { type: "object", properties: {} } },
];

export async function handle(client: PveClient, name: string, args: Record<string, unknown>): Promise<string> {
  switch (name) {
    case "pve_get_cluster_status":
      return json(await client.get("/cluster/status"));

    case "pve_list_nodes": {
      const nodes = await client.get("/nodes");
      return formatNodeList(nodes);
    }

    case "pve_get_node_status":
      return json(await client.get(`/nodes/${args.node}/status`));

    case "pve_get_node_resources": {
      const data = await client.get(`/nodes/${args.node}/status`);
      // Also try to get thermal data
      try {
        const sensors = await client.get(`/nodes/${args.node}/status`);
        if (sensors?.cpuinfo) data.cpuinfo = { ...data.cpuinfo, ...sensors.cpuinfo };
      } catch {}
      return formatNodeResources(data);
    }

    case "pve_get_version":
      return json(await client.get("/version"));

    default:
      throw new Error(`Unknown cluster tool: ${name}`);
  }
}
