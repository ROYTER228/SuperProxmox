import type { ApiClient } from "./client.js";

export type PveClient = ApiClient;

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export interface ToolModule {
  tools: ToolDefinition[];
  handle(client: ApiClient, name: string, args: Record<string, unknown>): Promise<string>;
}
