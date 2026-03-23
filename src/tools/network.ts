import type { PveClient } from "../client.js";
import type { ToolDefinition } from "../types.js";
import { json } from "../utils.js";

export const tools: ToolDefinition[] = [
  { name: "pve_list_networks", description: "List network interfaces on a node", inputSchema: { type: "object", properties: { node: { type: "string" }, type: { type: "string", enum: ["bridge", "bond", "eth", "alias", "vlan", "OVSBridge", "OVSBond", "OVSPort", "OVSIntPort", "any_bridge", "any_local_bridge"], description: "Filter by type" } }, required: ["node"] } },
  { name: "pve_get_network", description: "Get network interface details", inputSchema: { type: "object", properties: { node: { type: "string" }, iface: { type: "string", description: "Interface name (e.g. vmbr0)" } }, required: ["node", "iface"] } },
  { name: "pve_create_network", description: "Create a network interface (bridge, bond, VLAN)", inputSchema: { type: "object", properties: { node: { type: "string" }, iface: { type: "string", description: "Interface name (e.g. vmbr1)" }, type: { type: "string", enum: ["bridge", "bond", "eth", "alias", "vlan", "OVSBridge", "OVSBond", "OVSPort", "OVSIntPort"] }, address: { type: "string", description: "IP address" }, netmask: { type: "string", description: "Netmask (e.g. 255.255.255.0)" }, cidr: { type: "string", description: "CIDR notation (e.g. 192.168.1.1/24)" }, gateway: { type: "string" }, bridge_ports: { type: "string", description: "Bridge ports (e.g. eno1)" }, bridge_vlan_aware: { type: "boolean" }, autostart: { type: "boolean" }, comments: { type: "string" } }, required: ["node", "iface", "type"] } },
  { name: "pve_update_network", description: "⚠ Update a network interface. May cause connectivity loss. Confirm.", inputSchema: { type: "object", properties: { node: { type: "string" }, iface: { type: "string" }, address: { type: "string" }, netmask: { type: "string" }, cidr: { type: "string" }, gateway: { type: "string" }, bridge_ports: { type: "string" }, comments: { type: "string" } }, required: ["node", "iface"] } },
  { name: "pve_delete_network", description: "⚠ DESTRUCTIVE: Delete a network interface. May break VM connectivity. Confirm.", inputSchema: { type: "object", properties: { node: { type: "string" }, iface: { type: "string" } }, required: ["node", "iface"] } },
  { name: "pve_apply_network", description: "⚠ Apply pending network changes. May cause brief connectivity loss. Confirm.", inputSchema: { type: "object", properties: { node: { type: "string" } }, required: ["node"] } },
  { name: "pve_revert_network", description: "Revert pending network changes (undo before apply)", inputSchema: { type: "object", properties: { node: { type: "string" } }, required: ["node"] } },
  { name: "pve_get_dns", description: "Get DNS configuration of a node", inputSchema: { type: "object", properties: { node: { type: "string" } }, required: ["node"] } },
  { name: "pve_set_dns", description: "Set DNS configuration of a node", inputSchema: { type: "object", properties: { node: { type: "string" }, search: { type: "string" }, dns1: { type: "string" }, dns2: { type: "string" }, dns3: { type: "string" } }, required: ["node", "dns1"] } },
];

export async function handle(client: PveClient, name: string, args: Record<string, unknown>): Promise<string> {
  const n = args.node as string;
  switch (name) {
    case "pve_list_networks": return json(await client.get(`/nodes/${n}/network`, args.type ? { type: args.type } : undefined));
    case "pve_get_network": return json(await client.get(`/nodes/${n}/network/${args.iface}`));
    case "pve_create_network": {
      const data: Record<string, unknown> = { iface: args.iface, type: args.type };
      for (const k of ["address", "netmask", "cidr", "gateway", "bridge_ports", "comments"]) if (args[k]) data[k] = args[k];
      if (args.bridge_vlan_aware) data.bridge_vlan_aware = 1;
      if (args.autostart !== false) data.autostart = 1;
      await client.post(`/nodes/${n}/network`, data);
      return `Network interface '${args.iface}' created. Run pve_apply_network to activate.`;
    }
    case "pve_update_network": {
      const data: Record<string, unknown> = {};
      for (const k of ["address", "netmask", "cidr", "gateway", "bridge_ports", "comments"]) if (args[k]) data[k] = args[k];
      await client.put(`/nodes/${n}/network/${args.iface}`, data);
      return `Network '${args.iface}' updated. Run pve_apply_network to activate.`;
    }
    case "pve_delete_network": await client.del(`/nodes/${n}/network/${args.iface}`); return `Network '${args.iface}' deleted. Run pve_apply_network to activate.`;
    case "pve_apply_network": await client.put(`/nodes/${n}/network`); return "Network changes applied.";
    case "pve_revert_network": await client.del(`/nodes/${n}/network`); return "Pending network changes reverted.";
    case "pve_get_dns": return json(await client.get(`/nodes/${n}/dns`));
    case "pve_set_dns": {
      const data: Record<string, unknown> = { dns1: args.dns1 };
      if (args.search) data.search = args.search;
      if (args.dns2) data.dns2 = args.dns2;
      if (args.dns3) data.dns3 = args.dns3;
      await client.put(`/nodes/${n}/dns`, data);
      return "DNS updated.";
    }
    default: throw new Error(`Unknown network tool: ${name}`);
  }
}
