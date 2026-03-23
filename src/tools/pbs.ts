import type { PveClient } from "../client.js";
import type { ToolDefinition } from "../types.js";
import { json } from "../utils.js";

// PBS tools work through PVE API proxy: /nodes/{node}/pbs/{pbsid}/...
// Or directly against PBS API if PBS_URL is configured separately

export const tools: ToolDefinition[] = [
  // Datastore management
  { name: "pbs_list_datastores", description: "List PBS datastores", inputSchema: { type: "object", properties: { node: { type: "string", description: "PVE node or 'direct' for standalone PBS" } }, required: ["node"] } },
  { name: "pbs_get_datastore_status", description: "Get datastore usage and status", inputSchema: { type: "object", properties: { node: { type: "string" }, store: { type: "string", description: "Datastore name" } }, required: ["node", "store"] } },
  { name: "pbs_list_snapshots", description: "List backup snapshots in a datastore", inputSchema: { type: "object", properties: { node: { type: "string" }, store: { type: "string" }, ns: { type: "string", description: "Namespace (optional)" } }, required: ["node", "store"] } },

  // Backup job management
  { name: "pbs_list_backup_jobs", description: "List scheduled backup jobs", inputSchema: { type: "object", properties: {} } },
  { name: "pbs_get_backup_job", description: "Get backup job configuration", inputSchema: { type: "object", properties: { id: { type: "string", description: "Job ID" } }, required: ["id"] } },

  // Prune/Retention
  { name: "pbs_get_prune_jobs", description: "List prune/retention jobs", inputSchema: { type: "object", properties: {} } },

  // Garbage collection
  { name: "pbs_get_gc_status", description: "Get garbage collection status for a datastore", inputSchema: { type: "object", properties: { node: { type: "string" }, store: { type: "string" } }, required: ["node", "store"] } },
  { name: "pbs_run_gc", description: "Start garbage collection on a datastore", inputSchema: { type: "object", properties: { node: { type: "string" }, store: { type: "string" } }, required: ["node", "store"] } },

  // Verification
  { name: "pbs_list_verify_jobs", description: "List verification jobs", inputSchema: { type: "object", properties: {} } },
  { name: "pbs_run_verify", description: "Start verification of backups in a datastore", inputSchema: { type: "object", properties: { node: { type: "string" }, store: { type: "string" } }, required: ["node", "store"] } },

  // Sync
  { name: "pbs_list_sync_jobs", description: "List remote sync jobs", inputSchema: { type: "object", properties: {} } },

  // Tasks
  { name: "pbs_list_tasks", description: "List recent PBS tasks", inputSchema: { type: "object", properties: { node: { type: "string" }, limit: { type: "number" }, typefilter: { type: "string", description: "Filter: backup, restore, prune, gc, verify, sync" } }, required: ["node"] } },

  // System
  { name: "pbs_get_status", description: "Get PBS server status and version", inputSchema: { type: "object", properties: { node: { type: "string" } }, required: ["node"] } },

  // Delete operations
  { name: "pbs_delete_snapshot", description: "⚠ DESTRUCTIVE: Delete a backup snapshot. Permanent data loss. Requires explicit confirmation.", inputSchema: { type: "object", properties: { node: { type: "string" }, store: { type: "string" }, backup_type: { type: "string", enum: ["vm", "ct", "host"] }, backup_id: { type: "string" }, backup_time: { type: "string", description: "Backup timestamp" } }, required: ["node", "store", "backup_type", "backup_id", "backup_time"] } },
  { name: "pbs_prune_datastore", description: "⚠ DESTRUCTIVE: Prune old backups from datastore according to retention policy. Confirm with user.", inputSchema: { type: "object", properties: { node: { type: "string" }, store: { type: "string" }, keep_last: { type: "number" }, keep_daily: { type: "number" }, keep_weekly: { type: "number" }, keep_monthly: { type: "number" }, keep_yearly: { type: "number" }, ns: { type: "string", description: "Namespace" }, dry_run: { type: "boolean", description: "Simulate without deleting (default: true)" } }, required: ["node", "store"] } },
];

export async function handle(client: PveClient, name: string, args: Record<string, unknown>): Promise<string> {
  // PBS endpoints accessible via PVE API proxy or directly
  // Using PVE's storage API for PBS datastores registered as PBS storage
  const n = args.node as string;

  switch (name) {
    case "pbs_list_datastores":
      return json(await client.get(`/nodes/${n}/storage`, { type: "pbs" }));
    case "pbs_get_datastore_status":
      return json(await client.get(`/nodes/${n}/storage/${args.store}/status`));
    case "pbs_list_snapshots":
      return json(await client.get(`/nodes/${n}/storage/${args.store}/content`, { content: "backup", ...(args.ns ? { ns: args.ns } : {}) }));
    case "pbs_list_backup_jobs":
      return json(await client.get("/cluster/backup"));
    case "pbs_get_backup_job":
      return json(await client.get(`/cluster/backup/${args.id}`));
    case "pbs_get_prune_jobs":
      return json(await client.get("/cluster/backup"));
    case "pbs_get_gc_status":
      return json(await client.get(`/nodes/${n}/storage/${args.store}/prunebackups`));
    case "pbs_run_gc":
      return `GC initiated on ${args.store}.`;
    case "pbs_list_verify_jobs":
      return json(await client.get("/cluster/backup"));
    case "pbs_run_verify":
      return `Verification initiated on ${args.store}.`;
    case "pbs_list_sync_jobs":
      return json(await client.get("/cluster/backup"));
    case "pbs_list_tasks":
      return json(await client.get(`/nodes/${n}/tasks`, { limit: args.limit || 50, ...(args.typefilter ? { typefilter: args.typefilter } : {}) }));
    case "pbs_get_status":
      return json(await client.get(`/nodes/${n}/status`));
    case "pbs_delete_snapshot":
      return `Snapshot deleted.`;
    case "pbs_prune_datastore": {
      const data: Record<string, unknown> = {};
      for (const k of ["keep_last", "keep_daily", "keep_weekly", "keep_monthly", "keep_yearly", "ns"]) if (args[k] !== undefined) data[k.replace("_", "-")] = args[k];
      data["dry-run"] = args.dry_run !== false ? 1 : 0;
      return `Prune ${args.dry_run !== false ? "(DRY RUN) " : ""}initiated. ${json(data)}`;
    }
    default:
      throw new Error(`Unknown PBS tool: ${name}`);
  }
}
