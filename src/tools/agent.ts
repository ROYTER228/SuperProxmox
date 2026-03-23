import type { PveClient } from "../client.js";
import type { ToolDefinition } from "../types.js";
import { json } from "../utils.js";

export const tools: ToolDefinition[] = [
  { name: "pve_agent_ping", description: "Check if QEMU guest agent is responding in a VM", inputSchema: { type: "object", properties: { node: { type: "string" }, vmid: { type: "number" } }, required: ["node", "vmid"] } },
  { name: "pve_agent_get_info", description: "Get guest agent info (OS, hostname, etc)", inputSchema: { type: "object", properties: { node: { type: "string" }, vmid: { type: "number" } }, required: ["node", "vmid"] } },
  { name: "pve_agent_get_interfaces", description: "Get network interfaces from inside the VM via guest agent", inputSchema: { type: "object", properties: { node: { type: "string" }, vmid: { type: "number" } }, required: ["node", "vmid"] } },
  { name: "pve_agent_get_fsinfo", description: "Get filesystem info from inside the VM", inputSchema: { type: "object", properties: { node: { type: "string" }, vmid: { type: "number" } }, required: ["node", "vmid"] } },
  { name: "pve_agent_get_memory", description: "Get memory info from inside the VM", inputSchema: { type: "object", properties: { node: { type: "string" }, vmid: { type: "number" } }, required: ["node", "vmid"] } },
  { name: "pve_agent_get_time", description: "Get time from inside the VM", inputSchema: { type: "object", properties: { node: { type: "string" }, vmid: { type: "number" } }, required: ["node", "vmid"] } },
  { name: "pve_agent_get_vcpus", description: "Get vCPU info from inside the VM", inputSchema: { type: "object", properties: { node: { type: "string" }, vmid: { type: "number" } }, required: ["node", "vmid"] } },
  { name: "pve_agent_exec", description: "Execute a command inside a VM via QEMU guest agent. Returns PID.", inputSchema: { type: "object", properties: { node: { type: "string" }, vmid: { type: "number" }, command: { type: "string", description: "Command to execute (e.g. /bin/bash)" }, args: { type: "array", items: { type: "string" }, description: "Command arguments (e.g. [\"-c\", \"hostname\"])" }, input_data: { type: "string", description: "Data to pass to stdin" } }, required: ["node", "vmid", "command"] } },
  { name: "pve_agent_exec_status", description: "Get status/output of a previously executed command", inputSchema: { type: "object", properties: { node: { type: "string" }, vmid: { type: "number" }, pid: { type: "number", description: "PID from pve_agent_exec" } }, required: ["node", "vmid", "pid"] } },
  { name: "pve_agent_file_read", description: "Read a file from inside a VM via guest agent", inputSchema: { type: "object", properties: { node: { type: "string" }, vmid: { type: "number" }, file: { type: "string", description: "File path inside VM" } }, required: ["node", "vmid", "file"] } },
  { name: "pve_agent_file_write", description: "Write content to a file inside a VM via guest agent", inputSchema: { type: "object", properties: { node: { type: "string" }, vmid: { type: "number" }, file: { type: "string", description: "File path inside VM" }, content: { type: "string", description: "File content (base64 encoded)" } }, required: ["node", "vmid", "file", "content"] } },
];

export async function handle(client: PveClient, name: string, args: Record<string, unknown>): Promise<string> {
  const n = args.node as string, id = args.vmid as number;
  const base = `/nodes/${n}/qemu/${id}/agent`;
  switch (name) {
    case "pve_agent_ping": return json(await client.post(`${base}/ping`));
    case "pve_agent_get_info": return json(await client.get(`${base}/get-osinfo`));
    case "pve_agent_get_interfaces": return json(await client.get(`${base}/network-get-interfaces`));
    case "pve_agent_get_fsinfo": return json(await client.get(`${base}/get-fsinfo`));
    case "pve_agent_get_memory": return json(await client.get(`${base}/get-memory-blocks`));
    case "pve_agent_get_time": return json(await client.get(`${base}/get-time`));
    case "pve_agent_get_vcpus": return json(await client.get(`${base}/get-vcpus`));
    case "pve_agent_exec": {
      const data: Record<string, unknown> = { command: args.command };
      if (args.args) data["input-data"] = args.input_data;
      if (Array.isArray(args.args)) { const a = args.args as string[]; for (let i = 0; i < a.length; i++) data[`arg${i}`] = a[i]; }
      return json(await client.post(`${base}/exec`, data));
    }
    case "pve_agent_exec_status": return json(await client.get(`${base}/exec-status`, { pid: args.pid }));
    case "pve_agent_file_read": return json(await client.get(`${base}/file-read`, { file: args.file }));
    case "pve_agent_file_write": return json(await client.post(`${base}/file-write`, { file: args.file, content: args.content }));
    default: throw new Error(`Unknown agent tool: ${name}`);
  }
}
