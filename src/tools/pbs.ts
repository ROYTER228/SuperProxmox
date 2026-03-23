import type { PveClient } from "../client.js";
import type { ToolDefinition } from "../types.js";
import { json } from "../utils.js";

// PBS tools work via:
// 1. Direct PBS API if PBS_URL configured (client.service === 'pbs')
// 2. PVE API proxy to PBS storage if only PVE configured

export const tools: ToolDefinition[] = [
  { name: "pbs_list_datastores", description: "List PBS datastores", inputSchema: { type: "object", properties: { node: { type: "string", description: "PVE node (proxy mode) — omit for direct PBS" } } } },
  { name: "pbs_get_datastore_status", description: "Get datastore usage, GC status, and verification state", inputSchema: { type: "object", properties: { node: { type: "string" }, store: { type: "string", description: "Datastore name" } }, required: ["store"] } },
  { name: "pbs_list_snapshots", description: "List backup snapshots in a datastore", inputSchema: { type: "object", properties: { node: { type: "string" }, store: { type: "string" }, ns: { type: "string", description: "Namespace (optional)" }, backup_type: { type: "string", enum: ["vm", "ct", "host"], description: "Filter by type" } }, required: ["store"] } },
  { name: "pbs_list_backup_jobs", description: "List scheduled backup jobs", inputSchema: { type: "object", properties: {} } },
  { name: "pbs_get_backup_job", description: "Get backup job configuration", inputSchema: { type: "object", properties: { id: { type: "string", description: "Job ID" } }, required: ["id"] } },
  { name: "pbs_get_gc_status", description: "Get garbage collection status for a datastore", inputSchema: { type: "object", properties: { store: { type: "string" } }, required: ["store"] } },
  { name: "pbs_run_gc", description: "Start garbage collection on a datastore. May take hours on large stores.", inputSchema: { type: "object", properties: { store: { type: "string" } }, required: ["store"] } },
  { name: "pbs_run_verify", description: "Start verification of backups in a datastore", inputSchema: { type: "object", properties: { store: { type: "string" }, outdated_after: { type: "number", description: "Re-verify after N days" } }, required: ["store"] } },
  { name: "pbs_list_sync_jobs", description: "List remote sync jobs", inputSchema: { type: "object", properties: {} } },
  { name: "pbs_list_verify_jobs", description: "List scheduled verification jobs", inputSchema: { type: "object", properties: {} } },
  { name: "pbs_list_prune_jobs", description: "List prune/retention jobs", inputSchema: { type: "object", properties: {} } },
  { name: "pbs_list_tasks", description: "List recent PBS tasks", inputSchema: { type: "object", properties: { limit: { type: "number" }, typefilter: { type: "string", description: "Filter: backup, restore, prune, gc, verify, sync" }, store: { type: "string" } } } },
  { name: "pbs_get_task_status", description: "Get PBS task status", inputSchema: { type: "object", properties: { upid: { type: "string" } }, required: ["upid"] } },
  { name: "pbs_get_status", description: "Get PBS server status, version, and info", inputSchema: { type: "object", properties: {} } },
  { name: "pbs_delete_snapshot", description: "⚠ DESTRUCTIVE: Delete a backup snapshot. Permanent data loss. Requires explicit confirmation.", inputSchema: { type: "object", properties: { store: { type: "string" }, backup_type: { type: "string", enum: ["vm", "ct", "host"] }, backup_id: { type: "string" }, backup_time: { type: "number", description: "Backup epoch timestamp" }, ns: { type: "string" } }, required: ["store", "backup_type", "backup_id", "backup_time"] } },
  { name: "pbs_prune_datastore", description: "⚠ DESTRUCTIVE: Prune old backups from datastore. Use dry_run=true first. Confirm with user.", inputSchema: { type: "object", properties: { store: { type: "string" }, keep_last: { type: "number" }, keep_daily: { type: "number" }, keep_weekly: { type: "number" }, keep_monthly: { type: "number" }, keep_yearly: { type: "number" }, backup_type: { type: "string", enum: ["vm", "ct", "host"] }, backup_id: { type: "string" }, ns: { type: "string" }, dry_run: { type: "boolean", description: "Preview without deleting (default: true)" } }, required: ["store"] } },
];

export async function handle(client: PveClient, name: string, args: Record<string, unknown>): Promise<string> {
  // Direct PBS API paths (when PBS_URL configured)
  // PBS API structure: /api2/json/admin/datastore/{store}/...
  const store = args.store as string;
  const node = args.node as string;

  switch (name) {
    case "pbs_list_datastores":
      // Direct PBS: /admin/datastore, PVE proxy: /nodes/{node}/storage?type=pbs
      if (node) return json(await client.get(`/nodes/${node}/storage`, { type: "pbs" }));
      return json(await client.get("/admin/datastore"));

    case "pbs_get_datastore_status":
      if (node) return json(await client.get(`/nodes/${node}/storage/${store}/status`));
      return json(await client.get(`/admin/datastore/${store}`));

    case "pbs_list_snapshots": {
      const params: Record<string, unknown> = {};
      if (args.ns) params.ns = args.ns;
      if (args.backup_type) params["backup-type"] = args.backup_type;
      if (node) return json(await client.get(`/nodes/${node}/storage/${store}/content`, { content: "backup", ...params }));
      return json(await client.get(`/admin/datastore/${store}/snapshots`, params));
    }

    case "pbs_list_backup_jobs":
      return json(await client.get("/config/sync") ?? await client.get("/cluster/backup"));

    case "pbs_get_backup_job":
      return json(await client.get(`/config/sync/${args.id}`) ?? await client.get(`/cluster/backup/${args.id}`));

    case "pbs_get_gc_status":
      return json(await client.get(`/admin/datastore/${store}/gc`));

    case "pbs_run_gc":
      return `GC initiated. Task: ${json(await client.post(`/admin/datastore/${store}/gc`))}`;

    case "pbs_run_verify": {
      const data: Record<string, unknown> = {};
      if (args.outdated_after) data["outdated-after"] = args.outdated_after;
      return `Verify initiated. Task: ${json(await client.post(`/admin/datastore/${store}/verify`, data))}`;
    }

    case "pbs_list_sync_jobs":
      return json(await client.get("/admin/sync"));

    case "pbs_list_verify_jobs":
      return json(await client.get("/admin/verify"));

    case "pbs_list_prune_jobs":
      return json(await client.get("/admin/prune"));

    case "pbs_list_tasks": {
      const params: Record<string, unknown> = {};
      if (args.limit) params.limit = args.limit;
      if (args.typefilter) params.typefilter = args.typefilter;
      if (args.store) params.store = args.store;
      return json(await client.get("/nodes/localhost/tasks", params));
    }

    case "pbs_get_task_status":
      return json(await client.get(`/nodes/localhost/tasks/${args.upid}/status`));

    case "pbs_get_status":
      return json(await client.get("/nodes/localhost/status"));

    case "pbs_delete_snapshot": {
      const path = `/admin/datastore/${store}/snapshots`;
      const params: Record<string, unknown> = {
        "backup-type": args.backup_type,
        "backup-id": args.backup_id,
        "backup-time": args.backup_time,
      };
      if (args.ns) params.ns = args.ns;
      return `Snapshot deleted. ${json(await client.del(path, params))}`;
    }

    case "pbs_prune_datastore": {
      const data: Record<string, unknown> = {};
      for (const k of ["keep_last", "keep_daily", "keep_weekly", "keep_monthly", "keep_yearly"]) {
        if (args[k] !== undefined) data[k.replace("_", "-")] = args[k];
      }
      if (args.backup_type) data["backup-type"] = args.backup_type;
      if (args.backup_id) data["backup-id"] = args.backup_id;
      if (args.ns) data.ns = args.ns;
      const dryRun = args.dry_run !== false;
      if (dryRun) {
        data["dry-run"] = true;
        const result = await client.post(`/admin/datastore/${store}/prune`, data);
        return `DRY RUN (no data deleted):\n${json(result)}`;
      }
      const result = await client.post(`/admin/datastore/${store}/prune`, data);
      return `Prune executed:\n${json(result)}`;
    }

    default:
      throw new Error(`Unknown PBS tool: ${name}`);
  }
}
