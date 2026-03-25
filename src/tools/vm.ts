import type { PveClient } from "../client.js";
import type { ToolDefinition } from "../types.js";
import { json } from "../utils.js";
import { formatVmList } from "../format.js";

const nodeVmid = {
  properties: { node: { type: "string", description: "Node name" }, vmid: { type: "number", description: "VM ID" } },
  required: ["node", "vmid"],
};

export const tools: ToolDefinition[] = [
  { name: "pve_list_vms", description: "List all VMs across the cluster or on a specific node", inputSchema: { type: "object", properties: { node: { type: "string", description: "Optional: filter by node" } } } },
  { name: "pve_get_vm_status", description: "Get detailed status of a specific VM", inputSchema: { type: "object", ...nodeVmid } },
  { name: "pve_get_vm_config", description: "Get configuration of a specific VM", inputSchema: { type: "object", ...nodeVmid } },
  { name: "pve_create_vm", description: "Create a new VM with specified configuration", inputSchema: { type: "object", properties: {
    node: { type: "string", description: "Node name" },
    vmid: { type: "number", description: "VM ID" },
    name: { type: "string", description: "VM name" },
    memory: { type: "number", description: "RAM in MB (default: 2048)" },
    cores: { type: "number", description: "CPU cores (default: 1)" },
    sockets: { type: "number", description: "CPU sockets (default: 1)" },
    cpu: { type: "string", description: "CPU type (default: host)" },
    ostype: { type: "string", description: "OS type: l26, win11, other" },
    bios: { type: "string", description: "BIOS type: seabios or ovmf" },
    storage: { type: "string", description: "Storage for boot disk" },
    diskSize: { type: "number", description: "Boot disk size in GB" },
    iso: { type: "string", description: "ISO image (e.g. local:iso/ubuntu.iso)" },
    bridge: { type: "string", description: "Network bridge (default: vmbr0)" },
    start: { type: "boolean", description: "Start VM after creation" },
  }, required: ["node", "vmid"] } },
  { name: "pve_update_vm_config", description: "Update VM configuration (CPU, RAM, etc)", inputSchema: { type: "object", properties: {
    node: { type: "string", description: "Node name" },
    vmid: { type: "number", description: "VM ID" },
    memory: { type: "number", description: "RAM in MB" },
    cores: { type: "number", description: "CPU cores" },
    name: { type: "string", description: "VM name" },
    onboot: { type: "boolean", description: "Start on boot" },
    description: { type: "string", description: "Description" },
  }, required: ["node", "vmid"] } },
  { name: "pve_start_vm", description: "Start a VM", inputSchema: { type: "object", ...nodeVmid } },
  { name: "pve_stop_vm", description: "Stop a VM (graceful shutdown). ⚠ Causes service downtime. Confirm with user before calling.", inputSchema: { type: "object", properties: { ...nodeVmid.properties, force: { type: "boolean", description: "Force stop" } }, required: ["node", "vmid"] } },
  { name: "pve_reboot_vm", description: "Reboot a VM", inputSchema: { type: "object", ...nodeVmid } },
  { name: "pve_suspend_vm", description: "Suspend a VM", inputSchema: { type: "object", ...nodeVmid } },
  { name: "pve_resume_vm", description: "Resume a suspended VM", inputSchema: { type: "object", ...nodeVmid } },
  { name: "pve_clone_vm", description: "Clone a VM", inputSchema: { type: "object", properties: { ...nodeVmid.properties, newid: { type: "number", description: "New VM ID" }, name: { type: "string", description: "New VM name" }, full: { type: "boolean", description: "Full clone" }, target: { type: "string", description: "Target node" } }, required: ["node", "vmid", "newid"] } },
  { name: "pve_delete_vm", description: "⚠ DESTRUCTIVE: Permanently delete a VM and all its disks. REQUIRES explicit user confirmation before calling. State what will be destroyed, check backups, wait for 'yes'.", inputSchema: { type: "object", properties: { ...nodeVmid.properties, purge: { type: "boolean", description: "Remove from backup jobs" } }, required: ["node", "vmid"] } },
  { name: "pve_migrate_vm", description: "Migrate VM to another node", inputSchema: { type: "object", properties: { ...nodeVmid.properties, target: { type: "string", description: "Target node" }, online: { type: "boolean", description: "Live migration" } }, required: ["node", "vmid", "target"] } },
  { name: "pve_resize_vm_disk", description: "Resize a VM disk", inputSchema: { type: "object", properties: { ...nodeVmid.properties, disk: { type: "string", description: "Disk name (e.g. scsi0)" }, size: { type: "string", description: "New size (e.g. +10G or 50G)" } }, required: ["node", "vmid", "disk", "size"] } },
];

export async function handle(client: PveClient, name: string, args: Record<string, unknown>): Promise<string> {
  const n = args.node as string;
  const id = args.vmid as number;

  switch (name) {
    case "pve_list_vms": {
      const vms = args.node
        ? await client.get(`/nodes/${n}/qemu`)
        : await client.get("/cluster/resources", { type: "vm" });
      return formatVmList(vms);
    }

    case "pve_get_vm_status":
      return json(await client.get(`/nodes/${n}/qemu/${id}/status/current`));

    case "pve_get_vm_config":
      return json(await client.get(`/nodes/${n}/qemu/${id}/config`));

    case "pve_create_vm": {
      const params: Record<string, unknown> = { vmid: id };
      if (args.name) params.name = args.name;
      if (args.memory) params.memory = args.memory;
      if (args.cores) params.cores = args.cores;
      if (args.sockets) params.sockets = args.sockets;
      if (args.cpu) params.cpu = args.cpu;
      if (args.ostype) params.ostype = args.ostype;
      if (args.bios) params.bios = args.bios;
      if (args.storage && args.diskSize) params.scsi0 = `${args.storage}:${args.diskSize}`;
      if (args.iso) params.ide2 = `${args.iso},media=cdrom`;
      params.net0 = `virtio,bridge=${args.bridge || "vmbr0"}`;
      params.scsihw = "virtio-scsi-single";
      const task = await client.post(`/nodes/${n}/qemu`, params);
      if (args.start) await client.post(`/nodes/${n}/qemu/${id}/status/start`);
      return `VM ${id} created. Task: ${task}`;
    }

    case "pve_update_vm_config": {
      const params: Record<string, unknown> = {};
      if (args.memory) params.memory = args.memory;
      if (args.cores) params.cores = args.cores;
      if (args.name) params.name = args.name;
      if (args.onboot !== undefined) params.onboot = args.onboot ? 1 : 0;
      if (args.description) params.description = args.description;
      await client.put(`/nodes/${n}/qemu/${id}/config`, params);
      return `VM ${id} config updated.`;
    }

    case "pve_start_vm":
      return `VM ${id} start initiated. Task: ${await client.post(`/nodes/${n}/qemu/${id}/status/start`)}`;

    case "pve_stop_vm": {
      const ep = args.force ? "stop" : "shutdown";
      return `VM ${id} ${ep} initiated. Task: ${await client.post(`/nodes/${n}/qemu/${id}/status/${ep}`)}`;
    }

    case "pve_reboot_vm":
      return `VM ${id} reboot initiated. Task: ${await client.post(`/nodes/${n}/qemu/${id}/status/reboot`)}`;

    case "pve_suspend_vm":
      return `VM ${id} suspend initiated. Task: ${await client.post(`/nodes/${n}/qemu/${id}/status/suspend`)}`;

    case "pve_resume_vm":
      return `VM ${id} resume initiated. Task: ${await client.post(`/nodes/${n}/qemu/${id}/status/resume`)}`;

    case "pve_clone_vm": {
      const data: Record<string, unknown> = { newid: args.newid };
      if (args.name) data.name = args.name;
      if (args.full) data.full = 1;
      if (args.target) data.target = args.target;
      return `VM ${id} clone initiated. Task: ${await client.post(`/nodes/${n}/qemu/${id}/clone`, data)}`;
    }

    case "pve_delete_vm":
      return `VM ${id} deletion initiated. Task: ${await client.del(`/nodes/${n}/qemu/${id}`, args.purge ? { purge: 1 } : undefined)}`;

    case "pve_migrate_vm":
      return `VM ${id} migration initiated. Task: ${await client.post(`/nodes/${n}/qemu/${id}/migrate`, { target: args.target, online: args.online ? 1 : 0 })}`;

    case "pve_resize_vm_disk":
      await client.put(`/nodes/${n}/qemu/${id}/resize`, { disk: args.disk, size: args.size });
      return `VM ${id} disk ${args.disk} resized to ${args.size}`;

    default:
      throw new Error(`Unknown VM tool: ${name}`);
  }
}
