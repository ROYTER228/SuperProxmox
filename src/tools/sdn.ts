import type { PveClient } from "../client.js";
import type { ToolDefinition } from "../types.js";
import { json } from "../utils.js";

export const tools: ToolDefinition[] = [
  { name: "pve_list_sdn_zones", description: "List SDN zones", inputSchema: { type: "object", properties: {} } },
  { name: "pve_list_sdn_vnets", description: "List SDN VNets", inputSchema: { type: "object", properties: {} } },
  { name: "pve_list_sdn_subnets", description: "List subnets for a VNet", inputSchema: { type: "object", properties: { vnet: { type: "string" } }, required: ["vnet"] } },
  { name: "pve_create_sdn_zone", description: "Create an SDN zone", inputSchema: { type: "object", properties: { zone: { type: "string" }, type: { type: "string", enum: ["simple", "vlan", "qinq", "vxlan", "evpn"] } }, required: ["zone", "type"] } },
  { name: "pve_create_sdn_vnet", description: "Create an SDN VNet", inputSchema: { type: "object", properties: { vnet: { type: "string" }, zone: { type: "string" }, tag: { type: "number" }, alias: { type: "string" } }, required: ["vnet", "zone"] } },
  { name: "pve_apply_sdn", description: "⚠ Apply pending SDN changes to all nodes. Confirm with user.", inputSchema: { type: "object", properties: {} } },
  { name: "pve_delete_sdn_zone", description: "⚠ DESTRUCTIVE: Delete SDN zone. Confirm.", inputSchema: { type: "object", properties: { zone: { type: "string" } }, required: ["zone"] } },
  { name: "pve_delete_sdn_vnet", description: "⚠ DESTRUCTIVE: Delete SDN VNet. Confirm.", inputSchema: { type: "object", properties: { vnet: { type: "string" } }, required: ["vnet"] } },
];

export async function handle(client: PveClient, name: string, args: Record<string, unknown>): Promise<string> {
  switch (name) {
    case "pve_list_sdn_zones": return json(await client.get("/cluster/sdn/zones"));
    case "pve_list_sdn_vnets": return json(await client.get("/cluster/sdn/vnets"));
    case "pve_list_sdn_subnets": return json(await client.get(`/cluster/sdn/vnets/${args.vnet}/subnets`));
    case "pve_create_sdn_zone": return json(await client.post("/cluster/sdn/zones", { zone: args.zone, type: args.type }));
    case "pve_create_sdn_vnet": {
      const data: Record<string, unknown> = { vnet: args.vnet, zone: args.zone };
      if (args.tag) data.tag = args.tag;
      if (args.alias) data.alias = args.alias;
      return json(await client.post("/cluster/sdn/vnets", data));
    }
    case "pve_apply_sdn": await client.put("/cluster/sdn"); return "SDN changes applied.";
    case "pve_delete_sdn_zone": await client.del(`/cluster/sdn/zones/${args.zone}`); return `Zone '${args.zone}' deleted.`;
    case "pve_delete_sdn_vnet": await client.del(`/cluster/sdn/vnets/${args.vnet}`); return `VNet '${args.vnet}' deleted.`;
    default: throw new Error(`Unknown SDN tool: ${name}`);
  }
}
