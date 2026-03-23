import type { PveClient } from "../client.js";
import type { ToolDefinition } from "../types.js";
import { json } from "../utils.js";

export const tools: ToolDefinition[] = [
  { name: "pve_list_tasks", description: "List recent tasks", inputSchema: { type: "object", properties: { node: { type: "string" }, limit: { type: "number" } }, required: ["node"] } },
  { name: "pve_get_task_status", description: "Get task status", inputSchema: { type: "object", properties: { node: { type: "string" }, upid: { type: "string" } }, required: ["node", "upid"] } },
  { name: "pve_get_task_log", description: "Get task log output", inputSchema: { type: "object", properties: { node: { type: "string" }, upid: { type: "string" }, limit: { type: "number" } }, required: ["node", "upid"] } },
];

export async function handle(client: PveClient, name: string, args: Record<string, unknown>): Promise<string> {
  switch (name) {
    case "pve_list_tasks":
      return json(await client.get(`/nodes/${args.node}/tasks`, args.limit ? { limit: args.limit } : undefined));
    case "pve_get_task_status":
      return json(await client.get(`/nodes/${args.node}/tasks/${args.upid}/status`));
    case "pve_get_task_log":
      return json(await client.get(`/nodes/${args.node}/tasks/${args.upid}/log`, args.limit ? { limit: args.limit } : undefined));
    default:
      throw new Error(`Unknown task tool: ${name}`);
  }
}
