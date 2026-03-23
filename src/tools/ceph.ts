import type { PveClient } from "../client.js";
import type { ToolDefinition } from "../types.js";
import { json } from "../utils.js";

export const tools: ToolDefinition[] = [
  { name: "pve_get_ceph_status", description: "Get Ceph cluster status", inputSchema: { type: "object", properties: { node: { type: "string" } }, required: ["node"] } },
  { name: "pve_list_ceph_osds", description: "List Ceph OSDs", inputSchema: { type: "object", properties: { node: { type: "string" } }, required: ["node"] } },
  { name: "pve_list_ceph_pools", description: "List Ceph pools", inputSchema: { type: "object", properties: { node: { type: "string" } }, required: ["node"] } },
  { name: "pve_list_ceph_monitors", description: "List Ceph monitors", inputSchema: { type: "object", properties: { node: { type: "string" } }, required: ["node"] } },
  { name: "pve_get_ceph_flags", description: "Get Ceph cluster flags", inputSchema: { type: "object", properties: { node: { type: "string" } }, required: ["node"] } },
  { name: "pve_list_ceph_mds", description: "List Ceph MDS (metadata servers)", inputSchema: { type: "object", properties: { node: { type: "string" } }, required: ["node"] } },
];

export async function handle(client: PveClient, name: string, args: Record<string, unknown>): Promise<string> {
  const n = args.node as string;
  switch (name) {
    case "pve_get_ceph_status": return json(await client.get(`/nodes/${n}/ceph/status`));
    case "pve_list_ceph_osds": return json(await client.get(`/nodes/${n}/ceph/osd`));
    case "pve_list_ceph_pools": return json(await client.get(`/nodes/${n}/ceph/pool`));
    case "pve_list_ceph_monitors": return json(await client.get(`/nodes/${n}/ceph/mon`));
    case "pve_get_ceph_flags": return json(await client.get(`/nodes/${n}/ceph/flags`));
    case "pve_list_ceph_mds": return json(await client.get(`/nodes/${n}/ceph/mds`));
    default: throw new Error(`Unknown ceph tool: ${name}`);
  }
}
