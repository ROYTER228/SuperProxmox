import type { PveClient } from "../client.js";
import type { ToolDefinition } from "../types.js";
import { json } from "../utils.js";

export const tools: ToolDefinition[] = [
  { name: "pve_list_storage", description: "List all storage pools", inputSchema: { type: "object", properties: { node: { type: "string", description: "Optional: filter by node" } } } },
  { name: "pve_get_storage_content", description: "List content of a storage pool", inputSchema: { type: "object", properties: { node: { type: "string" }, storage: { type: "string" }, content: { type: "string", description: "Filter: images, iso, backup, vztmpl, rootdir" } }, required: ["node", "storage"] } },
  { name: "pve_get_storage_status", description: "Get storage pool status and usage", inputSchema: { type: "object", properties: { node: { type: "string" }, storage: { type: "string" } }, required: ["node", "storage"] } },
  { name: "pve_download_url", description: "Download file from URL to storage", inputSchema: { type: "object", properties: { node: { type: "string" }, storage: { type: "string" }, url: { type: "string" }, filename: { type: "string" }, content: { type: "string", description: "Content type: iso or vztmpl" } }, required: ["node", "storage", "url", "filename", "content"] } },
  { name: "pve_list_cluster_storage", description: "List cluster-wide storage configuration", inputSchema: { type: "object", properties: {} } },
  { name: "pve_create_storage", description: "Create a new storage pool in cluster config", inputSchema: { type: "object", properties: { storage: { type: "string", description: "Storage name" }, type: { type: "string", enum: ["dir", "lvm", "lvmthin", "zfspool", "nfs", "cifs", "btrfs"], description: "Storage type" }, path: { type: "string", description: "Path (for dir type)" }, vgname: { type: "string", description: "Volume group (for lvm/lvmthin)" }, pool: { type: "string", description: "ZFS pool name (for zfspool)" }, server: { type: "string", description: "Server (for nfs/cifs)" }, export_path: { type: "string", description: "Export path (for nfs)" }, share: { type: "string", description: "Share name (for cifs)" }, content: { type: "string", description: "Content types (e.g. images,rootdir,iso,backup,vztmpl)" }, nodes: { type: "string", description: "Comma-separated node list" } }, required: ["storage", "type"] } },
  { name: "pve_update_storage", description: "Update storage configuration", inputSchema: { type: "object", properties: { storage: { type: "string" }, content: { type: "string" }, nodes: { type: "string" }, disable: { type: "number", enum: [0, 1] } }, required: ["storage"] } },
  { name: "pve_delete_storage", description: "⚠ DESTRUCTIVE: Remove storage pool from config. Data on disk remains. Confirm with user.", inputSchema: { type: "object", properties: { storage: { type: "string" } }, required: ["storage"] } },
  { name: "pve_delete_volume", description: "⚠ DESTRUCTIVE: Delete a specific volume from storage. Permanent data loss. Confirm.", inputSchema: { type: "object", properties: { node: { type: "string" }, storage: { type: "string" }, volume: { type: "string", description: "Volume ID" } }, required: ["node", "storage", "volume"] } },
  { name: "pve_list_aplinfo", description: "List available appliance/container templates for download", inputSchema: { type: "object", properties: { node: { type: "string" } }, required: ["node"] } },
];

export async function handle(client: PveClient, name: string, args: Record<string, unknown>): Promise<string> {
  switch (name) {
    case "pve_list_storage":
      return args.node ? json(await client.get(`/nodes/${args.node}/storage`)) : json(await client.get("/storage"));
    case "pve_get_storage_content":
      return json(await client.get(`/nodes/${args.node}/storage/${args.storage}/content`, args.content ? { content: args.content } : undefined));
    case "pve_get_storage_status":
      return json(await client.get(`/nodes/${args.node}/storage/${args.storage}/status`));
    case "pve_download_url":
      return `Download initiated. Task: ${await client.post(`/nodes/${args.node}/storage/${args.storage}/download-url`, { url: args.url, filename: args.filename, content: args.content })}`;
    case "pve_list_cluster_storage":
      return json(await client.get("/storage"));
    case "pve_create_storage": {
      const data: Record<string, unknown> = { storage: args.storage, type: args.type };
      for (const k of ["path", "vgname", "pool", "server", "export_path", "share", "content", "nodes"]) if (args[k]) data[k === "export_path" ? "export" : k] = args[k];
      await client.post("/storage", data);
      return `Storage '${args.storage}' created.`;
    }
    case "pve_update_storage": {
      const data: Record<string, unknown> = {};
      for (const k of ["content", "nodes", "disable"]) if (args[k] !== undefined) data[k] = args[k];
      await client.put(`/storage/${args.storage}`, data);
      return `Storage '${args.storage}' updated.`;
    }
    case "pve_delete_storage": await client.del(`/storage/${args.storage}`); return `Storage '${args.storage}' removed from config.`;
    case "pve_delete_volume": await client.del(`/nodes/${args.node}/storage/${args.storage}/content/${args.volume}`); return `Volume ${args.volume} deleted.`;
    case "pve_list_aplinfo": return json(await client.get(`/nodes/${args.node}/aplinfo`));
    default: throw new Error(`Unknown storage tool: ${name}`);
  }
}
