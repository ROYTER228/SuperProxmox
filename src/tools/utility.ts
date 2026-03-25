import type { PveClient } from "../client.js";
import type { ToolDefinition } from "../types.js";
import { json } from "../utils.js";

export const tools: ToolDefinition[] = [
  // Task wait/polling
  { name: "pve_wait_task", description: "Wait for a task to complete with polling. Returns final status.", inputSchema: { type: "object", properties: {
    node: { type: "string" }, upid: { type: "string", description: "Task UPID" },
    timeout: { type: "number", description: "Max wait seconds (default: 300)" },
    poll: { type: "number", description: "Poll interval seconds (default: 5)" }
  }, required: ["node", "upid"] } },

  // Find by name
  { name: "pve_find_vm", description: "Find a VM by name across all nodes. Returns VMID and node.", inputSchema: { type: "object", properties: { name: { type: "string", description: "VM name to search for" } }, required: ["name"] } },
  { name: "pve_find_container", description: "Find a container by name across all nodes. Returns VMID and node.", inputSchema: { type: "object", properties: { name: { type: "string", description: "Container name to search for" } }, required: ["name"] } },

  // Template conversion
  { name: "pve_convert_to_template", description: "⚠ Convert a VM to a template. VM must be stopped. Cannot be undone. Confirm with user.", inputSchema: { type: "object", properties: { node: { type: "string" }, vmid: { type: "number" } }, required: ["node", "vmid"] } },

  // Backup restore
  { name: "pve_restore_backup", description: "⚠ DESTRUCTIVE: Restore a VM/CT from backup. Overwrites existing if same VMID. Confirm with user.", inputSchema: { type: "object", properties: {
    node: { type: "string" }, storage: { type: "string", description: "Backup storage" },
    volid: { type: "string", description: "Backup volume ID (e.g. local:backup/vzdump-qemu-100-...)" },
    vmid: { type: "number", description: "Target VMID (optional, uses original if omitted)" },
    target_storage: { type: "string", description: "Storage for restored disks (optional)" },
    force: { type: "boolean", description: "Overwrite existing VM with same VMID" }
  }, required: ["node", "storage", "volid"] } },

  // NIC management
  { name: "pve_add_nic", description: "Add a network interface to a VM", inputSchema: { type: "object", properties: {
    node: { type: "string" }, vmid: { type: "number" },
    netid: { type: "string", description: "Interface ID (e.g. net1, net2)" },
    bridge: { type: "string", description: "Bridge (default: vmbr0)" },
    model: { type: "string", description: "NIC model (default: virtio)" },
    firewall: { type: "boolean", description: "Enable firewall on this NIC" },
    tag: { type: "number", description: "VLAN tag" }
  }, required: ["node", "vmid", "netid"] } },
  { name: "pve_remove_nic", description: "⚠ Remove a network interface from a VM. Confirm with user.", inputSchema: { type: "object", properties: {
    node: { type: "string" }, vmid: { type: "number" },
    netid: { type: "string", description: "Interface ID to remove (e.g. net1)" }
  }, required: ["node", "vmid", "netid"] } },

  // Ansible inventory
  { name: "pve_generate_ansible_inventory", description: "Generate Ansible inventory YAML from running VMs and containers", inputSchema: { type: "object", properties: {
    node: { type: "string", description: "Optional: filter by node" },
    group: { type: "string", description: "Ansible group name (default: proxmox)" }
  } } },
];

export async function handle(client: PveClient, name: string, args: Record<string, unknown>): Promise<string> {
  switch (name) {
    case "pve_wait_task": {
      const timeout = (args.timeout as number) || 300;
      const poll = (args.poll as number) || 5;
      const start = Date.now();
      while (Date.now() - start < timeout * 1000) {
        const status = await client.get(`/nodes/${args.node}/tasks/${args.upid}/status`);
        if (status.status === "stopped") {
          return json({ status: status.exitstatus, duration: ((Date.now() - start) / 1000).toFixed(1) + "s", ...status });
        }
        await new Promise(r => setTimeout(r, poll * 1000));
      }
      return json({ status: "timeout", waited: timeout + "s" });
    }

    case "pve_find_vm": {
      const all = await client.get("/cluster/resources", { type: "vm" });
      const found = all.filter((r: any) => r.name && r.name.toLowerCase().includes((args.name as string).toLowerCase()));
      if (!found.length) return `No VM found matching "${args.name}"`;
      return json(found.map((r: any) => ({ vmid: r.vmid, name: r.name, node: r.node, status: r.status })));
    }

    case "pve_find_container": {
      const all = await client.get("/cluster/resources", { type: "lxc" });
      const found = all.filter((r: any) => r.name && r.name.toLowerCase().includes((args.name as string).toLowerCase()));
      if (!found.length) return `No container found matching "${args.name}"`;
      return json(found.map((r: any) => ({ vmid: r.vmid, name: r.name, node: r.node, status: r.status })));
    }

    case "pve_convert_to_template":
      await client.post(`/nodes/${args.node}/qemu/${args.vmid}/template`);
      return `VM ${args.vmid} converted to template.`;

    case "pve_restore_backup": {
      const data: Record<string, unknown> = { archive: args.volid };
      if (args.vmid) data.vmid = args.vmid;
      if (args.target_storage) data.storage = args.target_storage;
      if (args.force) data.force = 1;
      const task = await client.post(`/nodes/${args.node}/qemu`, data);
      return `Restore initiated. Task: ${task}`;
    }

    case "pve_add_nic": {
      const model = args.model || "virtio";
      const bridge = args.bridge || "vmbr0";
      let val = `${model},bridge=${bridge}`;
      if (args.firewall) val += ",firewall=1";
      if (args.tag) val += `,tag=${args.tag}`;
      await client.put(`/nodes/${args.node}/qemu/${args.vmid}/config`, { [args.netid as string]: val });
      return `NIC ${args.netid} added to VM ${args.vmid} (${bridge}).`;
    }

    case "pve_remove_nic":
      await client.put(`/nodes/${args.node}/qemu/${args.vmid}/config`, { delete: args.netid });
      return `NIC ${args.netid} removed from VM ${args.vmid}.`;

    case "pve_generate_ansible_inventory": {
      const group = (args.group as string) || "proxmox";
      const vms = args.node
        ? await client.get(`/nodes/${args.node}/qemu`)
        : await client.get("/cluster/resources", { type: "vm" });
      const cts = args.node
        ? await client.get(`/nodes/${args.node}/lxc`)
        : await client.get("/cluster/resources", { type: "lxc" });

      const running = [...(vms || []), ...(cts || [])].filter((r: any) => r.status === "running");

      let inventory = `all:\n  children:\n    ${group}:\n      hosts:\n`;
      for (const r of running as any[]) {
        inventory += `        ${r.name || `id-${r.vmid}`}:\n`;
        inventory += `          ansible_host: "${r.vmid}"  # Replace with actual IP\n`;
        inventory += `          proxmox_vmid: ${r.vmid}\n`;
        inventory += `          proxmox_node: "${r.node || 'unknown'}"\n`;
        inventory += `          proxmox_type: "${r.type || 'unknown'}"\n`;
      }
      return inventory;
    }

    default:
      throw new Error(`Unknown utility tool: ${name}`);
  }
}
