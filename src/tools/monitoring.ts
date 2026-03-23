import type { PveClient } from "../client.js";
import type { ToolDefinition } from "../types.js";
import { json } from "../utils.js";

export const tools: ToolDefinition[] = [
  { name: "pve_get_rrddata", description: "Get RRD monitoring data (CPU, memory, IO, network) for a node", inputSchema: { type: "object", properties: { node: { type: "string" }, timeframe: { type: "string", enum: ["hour", "day", "week", "month", "year"], description: "Time range (default: hour)" } }, required: ["node"] } },
  { name: "pve_get_vm_rrddata", description: "Get RRD monitoring data for a VM", inputSchema: { type: "object", properties: { node: { type: "string" }, vmid: { type: "number" }, timeframe: { type: "string", enum: ["hour", "day", "week", "month", "year"] } }, required: ["node", "vmid"] } },
  { name: "pve_get_syslog", description: "Get system log entries", inputSchema: { type: "object", properties: { node: { type: "string" }, limit: { type: "number" }, since: { type: "string", description: "Start datetime" }, until: { type: "string", description: "End datetime" } }, required: ["node"] } },
  { name: "pve_get_journal", description: "Get systemd journal entries", inputSchema: { type: "object", properties: { node: { type: "string" }, lastentries: { type: "number", description: "Number of entries (default: 50)" }, since: { type: "string" }, until: { type: "string" } }, required: ["node"] } },
  { name: "pve_get_report", description: "Get full system report for a node", inputSchema: { type: "object", properties: { node: { type: "string" } }, required: ["node"] } },
  { name: "pve_list_pci", description: "List PCI devices on a node", inputSchema: { type: "object", properties: { node: { type: "string" } }, required: ["node"] } },
  { name: "pve_list_usb", description: "List USB devices on a node", inputSchema: { type: "object", properties: { node: { type: "string" } }, required: ["node"] } },
  { name: "pve_get_netstat", description: "Get network connection statistics", inputSchema: { type: "object", properties: { node: { type: "string" } }, required: ["node"] } },
  { name: "pve_get_apt_updates", description: "List available package updates", inputSchema: { type: "object", properties: { node: { type: "string" } }, required: ["node"] } },
  { name: "pve_apply_apt_update", description: "⚠ Apply package updates. May require reboot. Confirm with user.", inputSchema: { type: "object", properties: { node: { type: "string" } }, required: ["node"] } },
  { name: "pve_get_apt_versions", description: "Get installed package versions", inputSchema: { type: "object", properties: { node: { type: "string" } }, required: ["node"] } },
  { name: "pve_get_subscription", description: "Get subscription status", inputSchema: { type: "object", properties: { node: { type: "string" } }, required: ["node"] } },
  { name: "pve_get_time", description: "Get node time and timezone", inputSchema: { type: "object", properties: { node: { type: "string" } }, required: ["node"] } },
  { name: "pve_set_time", description: "Set node timezone", inputSchema: { type: "object", properties: { node: { type: "string" }, timezone: { type: "string", description: "Timezone (e.g. Europe/Moscow)" } }, required: ["node", "timezone"] } },
  { name: "pve_get_hosts", description: "Get /etc/hosts content", inputSchema: { type: "object", properties: { node: { type: "string" } }, required: ["node"] } },
  { name: "pve_set_hosts", description: "Update /etc/hosts content", inputSchema: { type: "object", properties: { node: { type: "string" }, data: { type: "string", description: "Full hosts file content" }, digest: { type: "string", description: "Digest from get_hosts for conflict detection" } }, required: ["node", "data"] } },
  { name: "pve_list_services", description: "List system services on a node", inputSchema: { type: "object", properties: { node: { type: "string" } }, required: ["node"] } },
  { name: "pve_get_service_state", description: "Get state of a service", inputSchema: { type: "object", properties: { node: { type: "string" }, service: { type: "string", description: "Service name (e.g. pvedaemon, sshd)" } }, required: ["node", "service"] } },
  { name: "pve_service_action", description: "Start/stop/restart a service. ⚠ May cause downtime. Confirm.", inputSchema: { type: "object", properties: { node: { type: "string" }, service: { type: "string" }, action: { type: "string", enum: ["start", "stop", "restart", "reload"] } }, required: ["node", "service", "action"] } },
];

export async function handle(client: PveClient, name: string, args: Record<string, unknown>): Promise<string> {
  const n = args.node as string;
  switch (name) {
    case "pve_get_rrddata": return json(await client.get(`/nodes/${n}/rrddata`, { timeframe: args.timeframe || "hour" }));
    case "pve_get_vm_rrddata": return json(await client.get(`/nodes/${n}/qemu/${args.vmid}/rrddata`, { timeframe: args.timeframe || "hour" }));
    case "pve_get_syslog": return json(await client.get(`/nodes/${n}/syslog`, { limit: args.limit || 50, ...(args.since ? { since: args.since } : {}), ...(args.until ? { until: args.until } : {}) }));
    case "pve_get_journal": return json(await client.get(`/nodes/${n}/journal`, { lastentries: args.lastentries || 50, ...(args.since ? { since: args.since } : {}), ...(args.until ? { until: args.until } : {}) }));
    case "pve_get_report": return json(await client.get(`/nodes/${n}/report`));
    case "pve_list_pci": return json(await client.get(`/nodes/${n}/hardware/pci`));
    case "pve_list_usb": return json(await client.get(`/nodes/${n}/hardware/usb`));
    case "pve_get_netstat": return json(await client.get(`/nodes/${n}/netstat`));
    case "pve_get_apt_updates": return json(await client.get(`/nodes/${n}/apt/update`));
    case "pve_apply_apt_update": return `Update initiated. Task: ${await client.post(`/nodes/${n}/apt/update`)}`;
    case "pve_get_apt_versions": return json(await client.get(`/nodes/${n}/apt/versions`));
    case "pve_get_subscription": return json(await client.get(`/nodes/${n}/subscription`));
    case "pve_get_time": return json(await client.get(`/nodes/${n}/time`));
    case "pve_set_time": await client.put(`/nodes/${n}/time`, { timezone: args.timezone }); return `Timezone set to ${args.timezone}`;
    case "pve_get_hosts": return json(await client.get(`/nodes/${n}/hosts`));
    case "pve_set_hosts": await client.post(`/nodes/${n}/hosts`, { data: args.data, ...(args.digest ? { digest: args.digest } : {}) }); return "Hosts file updated.";
    case "pve_list_services": return json(await client.get(`/nodes/${n}/services`));
    case "pve_get_service_state": return json(await client.get(`/nodes/${n}/services/${args.service}/state`));
    case "pve_service_action": return `Service ${args.action} initiated. Task: ${await client.post(`/nodes/${n}/services/${args.service}/${args.action}`)}`;
    default: throw new Error(`Unknown monitoring tool: ${name}`);
  }
}
