import type { PveClient } from "../client.js";
import type { ToolDefinition } from "../types.js";
import { json } from "../utils.js";

export const tools: ToolDefinition[] = [
  { name: "pve_list_backups", description: "List backups", inputSchema: { type: "object", properties: { node: { type: "string" }, storage: { type: "string" }, vmid: { type: "number" } }, required: ["node", "storage"] } },
  { name: "pve_create_backup", description: "Create backup of VM or container", inputSchema: { type: "object", properties: { node: { type: "string" }, vmid: { type: "number" }, storage: { type: "string" }, mode: { type: "string", enum: ["snapshot", "suspend", "stop"] }, compress: { type: "string", enum: ["0", "gzip", "lzo", "zstd"] } }, required: ["node", "vmid", "storage"] } },
  { name: "pve_list_snapshots", description: "List snapshots of a VM", inputSchema: { type: "object", properties: { node: { type: "string" }, vmid: { type: "number" } }, required: ["node", "vmid"] } },
  { name: "pve_create_snapshot", description: "Create snapshot of a VM", inputSchema: { type: "object", properties: { node: { type: "string" }, vmid: { type: "number" }, snapname: { type: "string" }, description: { type: "string" }, vmstate: { type: "boolean" } }, required: ["node", "vmid", "snapname"] } },
  { name: "pve_rollback_snapshot", description: "⚠ DESTRUCTIVE: Rollback VM to snapshot. Current state will be PERMANENTLY LOST. REQUIRES explicit user confirmation.", inputSchema: { type: "object", properties: { node: { type: "string" }, vmid: { type: "number" }, snapname: { type: "string" } }, required: ["node", "vmid", "snapname"] } },
  { name: "pve_delete_snapshot", description: "⚠ DESTRUCTIVE: Delete a snapshot recovery point. Cannot be undone. Confirm with user.", inputSchema: { type: "object", properties: { node: { type: "string" }, vmid: { type: "number" }, snapname: { type: "string" } }, required: ["node", "vmid", "snapname"] } },
];

export async function handle(client: PveClient, name: string, args: Record<string, unknown>): Promise<string> {
  const n = args.node as string, id = args.vmid as number;
  switch (name) {
    case "pve_list_backups":
      return json(await client.get(`/nodes/${n}/storage/${args.storage}/content`, { content: "backup", ...(id ? { vmid: id } : {}) }));
    case "pve_create_backup":
      return `Backup initiated. Task: ${await client.post(`/nodes/${n}/vzdump`, { vmid: id, storage: args.storage, mode: args.mode || "snapshot", ...(args.compress ? { compress: args.compress } : {}) })}`;
    case "pve_list_snapshots":
      return json(await client.get(`/nodes/${n}/qemu/${id}/snapshot`));
    case "pve_create_snapshot": {
      const data: Record<string, unknown> = { snapname: args.snapname };
      if (args.description) data.description = args.description;
      if (args.vmstate) data.vmstate = 1;
      return `Snapshot created. Task: ${await client.post(`/nodes/${n}/qemu/${id}/snapshot`, data)}`;
    }
    case "pve_rollback_snapshot":
      return `Rollback initiated. Task: ${await client.post(`/nodes/${n}/qemu/${id}/snapshot/${args.snapname}/rollback`)}`;
    case "pve_delete_snapshot":
      return `Snapshot deleted. Task: ${await client.del(`/nodes/${n}/qemu/${id}/snapshot/${args.snapname}`)}`;
    default:
      throw new Error(`Unknown backup tool: ${name}`);
  }
}
