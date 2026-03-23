import type { PveClient } from "../client.js";
import type { ToolDefinition } from "../types.js";
import { json } from "../utils.js";

export const tools: ToolDefinition[] = [
  { name: "pve_list_disks", description: "List physical disks on a node", inputSchema: { type: "object", properties: { node: { type: "string" } }, required: ["node"] } },
  { name: "pve_get_smart", description: "Get SMART health data for a disk", inputSchema: { type: "object", properties: { node: { type: "string" }, disk: { type: "string", description: "Disk device (e.g. /dev/sda)" } }, required: ["node", "disk"] } },
  { name: "pve_list_zfs", description: "List ZFS pools on a node", inputSchema: { type: "object", properties: { node: { type: "string" } }, required: ["node"] } },
  { name: "pve_create_zfs", description: "Create a ZFS pool on a node", inputSchema: { type: "object", properties: { node: { type: "string" }, name: { type: "string", description: "Pool name" }, raidlevel: { type: "string", enum: ["single", "mirror", "raid10", "raidz", "raidz2", "raidz3"] }, devices: { type: "string", description: "Comma-separated disk devices" }, compression: { type: "string", enum: ["on", "off", "lz4", "lzjb", "zle", "gzip", "zstd"] }, ashift: { type: "number", description: "Pool sector size shift (default: 12 for 4K)" } }, required: ["node", "name", "raidlevel", "devices"] } },
  { name: "pve_list_lvm", description: "List LVM volume groups on a node", inputSchema: { type: "object", properties: { node: { type: "string" } }, required: ["node"] } },
  { name: "pve_create_lvm", description: "Create LVM volume group on a disk", inputSchema: { type: "object", properties: { node: { type: "string" }, name: { type: "string", description: "VG name" }, device: { type: "string", description: "Disk device" } }, required: ["node", "name", "device"] } },
  { name: "pve_list_lvmthin", description: "List LVM-thin pools on a node", inputSchema: { type: "object", properties: { node: { type: "string" } }, required: ["node"] } },
  { name: "pve_create_lvmthin", description: "Create LVM-thin pool", inputSchema: { type: "object", properties: { node: { type: "string" }, name: { type: "string", description: "Pool name" }, device: { type: "string", description: "Disk device" } }, required: ["node", "name", "device"] } },
  { name: "pve_init_gpt", description: "⚠ DESTRUCTIVE: Initialize GPT partition table on disk. ERASES ALL DATA. Requires explicit confirmation.", inputSchema: { type: "object", properties: { node: { type: "string" }, disk: { type: "string" } }, required: ["node", "disk"] } },
  { name: "pve_wipe_disk", description: "⚠ DESTRUCTIVE: Wipe all partition data on disk. PERMANENT DATA LOSS. Requires explicit confirmation.", inputSchema: { type: "object", properties: { node: { type: "string" }, disk: { type: "string" } }, required: ["node", "disk"] } },
  { name: "pve_list_directories", description: "List directory-based storage on a node", inputSchema: { type: "object", properties: { node: { type: "string" } }, required: ["node"] } },
  { name: "pve_create_directory", description: "Create a directory-based storage", inputSchema: { type: "object", properties: { node: { type: "string" }, name: { type: "string" }, device: { type: "string" }, filesystem: { type: "string", enum: ["ext4", "xfs"] } }, required: ["node", "name", "device"] } },
];

export async function handle(client: PveClient, name: string, args: Record<string, unknown>): Promise<string> {
  const n = args.node as string;
  switch (name) {
    case "pve_list_disks": return json(await client.get(`/nodes/${n}/disks/list`));
    case "pve_get_smart": return json(await client.get(`/nodes/${n}/disks/smart`, { disk: args.disk }));
    case "pve_list_zfs": return json(await client.get(`/nodes/${n}/disks/zfs`));
    case "pve_create_zfs": {
      const data: Record<string, unknown> = { name: args.name, raidlevel: args.raidlevel, devices: args.devices };
      if (args.compression) data.compression = args.compression;
      if (args.ashift) data.ashift = args.ashift;
      return `ZFS pool creation initiated. Task: ${await client.post(`/nodes/${n}/disks/zfs`, data)}`;
    }
    case "pve_list_lvm": return json(await client.get(`/nodes/${n}/disks/lvm`));
    case "pve_create_lvm": return `LVM VG creation initiated. Task: ${await client.post(`/nodes/${n}/disks/lvm`, { name: args.name, device: args.device })}`;
    case "pve_list_lvmthin": return json(await client.get(`/nodes/${n}/disks/lvmthin`));
    case "pve_create_lvmthin": return `LVM-thin creation initiated. Task: ${await client.post(`/nodes/${n}/disks/lvmthin`, { name: args.name, device: args.device })}`;
    case "pve_init_gpt": return `GPT init initiated. Task: ${await client.post(`/nodes/${n}/disks/initgpt`, { disk: args.disk })}`;
    case "pve_wipe_disk": return `Disk wipe initiated. Task: ${await client.put(`/nodes/${n}/disks/wipedisk`, { disk: args.disk })}`;
    case "pve_list_directories": return json(await client.get(`/nodes/${n}/disks/directory`));
    case "pve_create_directory": return `Directory storage creation initiated. Task: ${await client.post(`/nodes/${n}/disks/directory`, { name: args.name, device: args.device, filesystem: args.filesystem || "ext4" })}`;
    default: throw new Error(`Unknown disks tool: ${name}`);
  }
}
