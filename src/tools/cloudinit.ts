import type { PveClient } from "../client.js";
import type { ToolDefinition } from "../types.js";
import { json } from "../utils.js";

export const tools: ToolDefinition[] = [
  { name: "pve_get_cloudinit", description: "Get cloud-init configuration for a VM", inputSchema: { type: "object", properties: { node: { type: "string" }, vmid: { type: "number" } }, required: ["node", "vmid"] } },
  { name: "pve_set_cloudinit", description: "Set cloud-init config: user, password, SSH keys, network. VM must have cloud-init drive.", inputSchema: { type: "object", properties: {
    node: { type: "string" }, vmid: { type: "number" },
    ciuser: { type: "string", description: "Default user name" },
    cipassword: { type: "string", description: "Default user password" },
    sshkeys: { type: "string", description: "SSH public keys (URL-encoded, newline separated)" },
    ipconfig0: { type: "string", description: "IP config (e.g. ip=192.168.3.50/24,gw=192.168.3.1 or ip=dhcp)" },
    nameserver: { type: "string", description: "DNS server(s)" },
    searchdomain: { type: "string", description: "DNS search domain" },
    citype: { type: "string", enum: ["configdrive2", "nocloud", "opennebula"], description: "Cloud-init type (default: nocloud)" }
  }, required: ["node", "vmid"] } },
  { name: "pve_regenerate_cloudinit", description: "Regenerate cloud-init image after config changes", inputSchema: { type: "object", properties: { node: { type: "string" }, vmid: { type: "number" } }, required: ["node", "vmid"] } },
  { name: "pve_get_cloudinit_dump", description: "Dump generated cloud-init config (user-data, network, meta)", inputSchema: { type: "object", properties: { node: { type: "string" }, vmid: { type: "number" }, type: { type: "string", enum: ["user", "network", "meta"], description: "Config type to dump" } }, required: ["node", "vmid", "type"] } },
];

export async function handle(client: PveClient, name: string, args: Record<string, unknown>): Promise<string> {
  const n = args.node as string, id = args.vmid as number;
  switch (name) {
    case "pve_get_cloudinit":
      return json(await client.get(`/nodes/${n}/qemu/${id}/cloudinit`));
    case "pve_set_cloudinit": {
      const data: Record<string, unknown> = {};
      for (const k of ["ciuser", "cipassword", "sshkeys", "ipconfig0", "nameserver", "searchdomain", "citype"]) if (args[k] !== undefined) data[k] = args[k];
      await client.put(`/nodes/${n}/qemu/${id}/config`, data);
      return `Cloud-init config updated for VM ${id}. Run pve_regenerate_cloudinit to apply.`;
    }
    case "pve_regenerate_cloudinit":
      await client.put(`/nodes/${n}/qemu/${id}/cloudinit`);
      return `Cloud-init image regenerated for VM ${id}.`;
    case "pve_get_cloudinit_dump":
      return json(await client.get(`/nodes/${n}/qemu/${id}/cloudinit/dump`, { type: args.type }));
    default: throw new Error(`Unknown cloudinit tool: ${name}`);
  }
}
