import type { PveClient } from "../client.js";
import type { ToolDefinition } from "../types.js";
import { json } from "../utils.js";

export const tools: ToolDefinition[] = [
  { name: "pve_get_ha_status", description: "Get HA cluster status", inputSchema: { type: "object", properties: {} } },
  { name: "pve_list_ha_resources", description: "List HA managed resources", inputSchema: { type: "object", properties: {} } },
  { name: "pve_add_ha_resource", description: "Add VM/CT to HA management", inputSchema: { type: "object", properties: { sid: { type: "string", description: "Service ID (e.g. vm:100 or ct:101)" }, group: { type: "string", description: "HA group" }, max_restart: { type: "number" }, max_relocate: { type: "number" }, state: { type: "string", enum: ["started", "stopped", "enabled", "disabled"] } }, required: ["sid"] } },
  { name: "pve_delete_ha_resource", description: "⚠ Remove VM/CT from HA management. Confirm with user.", inputSchema: { type: "object", properties: { sid: { type: "string" } }, required: ["sid"] } },
  { name: "pve_list_replication", description: "List replication jobs", inputSchema: { type: "object", properties: {} } },
  { name: "pve_get_cluster_config", description: "Get cluster configuration", inputSchema: { type: "object", properties: {} } },
  { name: "pve_get_cluster_log", description: "Get cluster log entries", inputSchema: { type: "object", properties: { max: { type: "number" } } } },
  { name: "pve_get_cluster_resources", description: "List all cluster resources with status", inputSchema: { type: "object", properties: { type: { type: "string", enum: ["vm", "storage", "node", "sdn"], description: "Filter by type" } } } },
  { name: "pve_get_cluster_nextid", description: "Get next free VMID", inputSchema: { type: "object", properties: {} } },
  { name: "pve_get_cluster_options", description: "Get cluster-wide options", inputSchema: { type: "object", properties: {} } },
  { name: "pve_list_cluster_backup_schedule", description: "List scheduled backup jobs", inputSchema: { type: "object", properties: {} } },
  { name: "pve_list_pools", description: "List resource pools", inputSchema: { type: "object", properties: {} } },
  { name: "pve_create_pool", description: "Create a resource pool", inputSchema: { type: "object", properties: { poolid: { type: "string", description: "Pool name" }, comment: { type: "string" } }, required: ["poolid"] } },
  { name: "pve_delete_pool", description: "⚠ DESTRUCTIVE: Delete resource pool. Confirm.", inputSchema: { type: "object", properties: { poolid: { type: "string" } }, required: ["poolid"] } },
  { name: "pve_node_reboot", description: "⚠ DESTRUCTIVE: Reboot the Proxmox node. ALL VMs/CTs will stop. REQUIRES explicit confirmation.", inputSchema: { type: "object", properties: { node: { type: "string" } }, required: ["node"] } },
  { name: "pve_node_shutdown", description: "⚠ DESTRUCTIVE: Shutdown the Proxmox node. ALL VMs/CTs will stop. REQUIRES explicit confirmation.", inputSchema: { type: "object", properties: { node: { type: "string" } }, required: ["node"] } },
];

export async function handle(client: PveClient, name: string, args: Record<string, unknown>): Promise<string> {
  switch (name) {
    case "pve_get_ha_status": return json(await client.get("/cluster/ha/status/current"));
    case "pve_list_ha_resources": return json(await client.get("/cluster/ha/resources"));
    case "pve_add_ha_resource": {
      const data: Record<string, unknown> = { sid: args.sid };
      if (args.group) data.group = args.group;
      if (args.max_restart) data.max_restart = args.max_restart;
      if (args.max_relocate) data.max_relocate = args.max_relocate;
      if (args.state) data.state = args.state;
      await client.post("/cluster/ha/resources", data);
      return `HA resource ${args.sid} added.`;
    }
    case "pve_delete_ha_resource": await client.del(`/cluster/ha/resources/${args.sid}`); return `HA resource ${args.sid} removed.`;
    case "pve_list_replication": return json(await client.get("/cluster/replication"));
    case "pve_get_cluster_config": return json(await client.get("/cluster/config"));
    case "pve_get_cluster_log": return json(await client.get("/cluster/log", args.max ? { max: args.max } : undefined));
    case "pve_get_cluster_resources": return json(await client.get("/cluster/resources", args.type ? { type: args.type } : undefined));
    case "pve_get_cluster_nextid": return json(await client.get("/cluster/nextid"));
    case "pve_get_cluster_options": return json(await client.get("/cluster/options"));
    case "pve_list_cluster_backup_schedule": return json(await client.get("/cluster/backup"));
    case "pve_list_pools": return json(await client.get("/pools"));
    case "pve_create_pool": await client.post("/pools", { poolid: args.poolid, comment: args.comment }); return `Pool '${args.poolid}' created.`;
    case "pve_delete_pool": await client.del(`/pools/${args.poolid}`); return `Pool '${args.poolid}' deleted.`;
    case "pve_node_reboot": return `Node reboot initiated. Task: ${await client.post(`/nodes/${args.node}/status`, { command: "reboot" })}`;
    case "pve_node_shutdown": return `Node shutdown initiated. Task: ${await client.post(`/nodes/${args.node}/status`, { command: "shutdown" })}`;
    default: throw new Error(`Unknown HA/cluster tool: ${name}`);
  }
}
