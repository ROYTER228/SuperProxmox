import type { PveClient } from "../client.js";
import type { ToolDefinition } from "../types.js";
import { json } from "../utils.js";

export const tools: ToolDefinition[] = [
  // Node-level firewall
  { name: "pve_get_firewall_rules", description: "List firewall rules at node, VM, or CT level", inputSchema: { type: "object", properties: { node: { type: "string" }, vmid: { type: "number", description: "Optional: VM/CT ID for VM-level rules" }, vmtype: { type: "string", enum: ["qemu", "lxc"], description: "VM type if vmid specified" } }, required: ["node"] } },
  { name: "pve_add_firewall_rule", description: "⚠ Add a firewall rule. May affect connectivity. Confirm with user.", inputSchema: { type: "object", properties: { node: { type: "string" }, vmid: { type: "number" }, vmtype: { type: "string", enum: ["qemu", "lxc"] }, action: { type: "string", enum: ["ACCEPT", "DROP", "REJECT"], description: "Rule action" }, type: { type: "string", enum: ["in", "out", "group"], description: "Direction" }, source: { type: "string", description: "Source IP/CIDR (e.g. 192.168.3.0/24)" }, dest: { type: "string", description: "Destination IP/CIDR" }, dport: { type: "string", description: "Destination port(s) (e.g. 22, 80:443)" }, proto: { type: "string", enum: ["tcp", "udp", "icmp"], description: "Protocol" }, comment: { type: "string" }, enable: { type: "number", enum: [0, 1], description: "Enable rule (default: 1)" } }, required: ["node", "action", "type"] } },
  { name: "pve_delete_firewall_rule", description: "⚠ DESTRUCTIVE: Delete a firewall rule by position. May expose services. Confirm with user.", inputSchema: { type: "object", properties: { node: { type: "string" }, vmid: { type: "number" }, vmtype: { type: "string", enum: ["qemu", "lxc"] }, pos: { type: "number", description: "Rule position number" } }, required: ["node", "pos"] } },
  { name: "pve_get_firewall_options", description: "Get firewall options (enabled/disabled, policy)", inputSchema: { type: "object", properties: { node: { type: "string" }, vmid: { type: "number" }, vmtype: { type: "string", enum: ["qemu", "lxc"] } }, required: ["node"] } },
  { name: "pve_set_firewall_options", description: "⚠ Set firewall options (enable/disable, default policy). Confirm with user.", inputSchema: { type: "object", properties: { node: { type: "string" }, vmid: { type: "number" }, vmtype: { type: "string", enum: ["qemu", "lxc"] }, enable: { type: "number", enum: [0, 1] }, policy_in: { type: "string", enum: ["ACCEPT", "DROP", "REJECT"] }, policy_out: { type: "string", enum: ["ACCEPT", "DROP", "REJECT"] } }, required: ["node"] } },
  { name: "pve_get_firewall_log", description: "Get firewall log entries", inputSchema: { type: "object", properties: { node: { type: "string" }, vmid: { type: "number" }, vmtype: { type: "string", enum: ["qemu", "lxc"] }, limit: { type: "number" } }, required: ["node"] } },
  // Cluster-level firewall
  { name: "pve_get_cluster_firewall_aliases", description: "List cluster firewall IP aliases", inputSchema: { type: "object", properties: {} } },
  { name: "pve_add_cluster_firewall_alias", description: "Add cluster firewall IP alias", inputSchema: { type: "object", properties: { name: { type: "string", description: "Alias name" }, cidr: { type: "string", description: "IP/CIDR" }, comment: { type: "string" } }, required: ["name", "cidr"] } },
  { name: "pve_get_cluster_firewall_ipsets", description: "List cluster firewall IP sets", inputSchema: { type: "object", properties: {} } },
];

function fwPath(args: Record<string, unknown>): string {
  if (args.vmid && args.vmtype) return `/nodes/${args.node}/${args.vmtype}/${args.vmid}/firewall`;
  return `/nodes/${args.node}/firewall`;
}

export async function handle(client: PveClient, name: string, args: Record<string, unknown>): Promise<string> {
  switch (name) {
    case "pve_get_firewall_rules":
      return json(await client.get(`${fwPath(args)}/rules`));
    case "pve_add_firewall_rule": {
      const data: Record<string, unknown> = { action: args.action, type: args.type };
      if (args.source) data.source = args.source;
      if (args.dest) data.dest = args.dest;
      if (args.dport) data.dport = args.dport;
      if (args.proto) data.proto = args.proto;
      if (args.comment) data.comment = args.comment;
      data.enable = args.enable ?? 1;
      await client.post(`${fwPath(args)}/rules`, data);
      return "Firewall rule added.";
    }
    case "pve_delete_firewall_rule":
      await client.del(`${fwPath(args)}/rules/${args.pos}`);
      return `Firewall rule at position ${args.pos} deleted.`;
    case "pve_get_firewall_options":
      return json(await client.get(`${fwPath(args)}/options`));
    case "pve_set_firewall_options": {
      const data: Record<string, unknown> = {};
      if (args.enable !== undefined) data.enable = args.enable;
      if (args.policy_in) data.policy_in = args.policy_in;
      if (args.policy_out) data.policy_out = args.policy_out;
      await client.put(`${fwPath(args)}/options`, data);
      return "Firewall options updated.";
    }
    case "pve_get_firewall_log":
      return json(await client.get(`${fwPath(args)}/log`, args.limit ? { limit: args.limit } : undefined));
    case "pve_get_cluster_firewall_aliases":
      return json(await client.get("/cluster/firewall/aliases"));
    case "pve_add_cluster_firewall_alias":
      await client.post("/cluster/firewall/aliases", { name: args.name, cidr: args.cidr, comment: args.comment });
      return `Alias '${args.name}' → ${args.cidr} created.`;
    case "pve_get_cluster_firewall_ipsets":
      return json(await client.get("/cluster/firewall/ipset"));
    default:
      throw new Error(`Unknown firewall tool: ${name}`);
  }
}
