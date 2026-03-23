#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { SuperProxmoxClient } from "./client.js";
import { getAllTools, handleTool } from "./tools/index.js";

const client = SuperProxmoxClient.fromEnv();

const server = new Server(
  { name: "super-proxmox", version: "0.2.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: getAllTools(),
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {
    // Route to correct client based on tool prefix
    const toolClient = name.startsWith("pbs_") ? client.pbs
      : name.startsWith("pdm_") ? client.pdm
      : client.pve;

    if (!toolClient) {
      const service = name.startsWith("pbs_") ? "PBS (set PBS_URL)"
        : name.startsWith("pdm_") ? "PDM (set PDM_URL)"
        : "PVE (set PVE_URL)";
      throw new Error(`${service} is not configured. Add env vars to connect.`);
    }

    const result = await handleTool(toolClient, name, args as Record<string, unknown>);
    return { content: [{ type: "text", text: result }] };
  } catch (error: any) {
    const msg = error.response
      ? `API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`
      : error.message;
    return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
  }
});

async function main() {
  const connected = await client.init();
  console.error(`SuperProxmox MCP v0.2.0 — ${getAllTools().length} tools | Connected: ${connected.join(", ")}`);
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((e) => { console.error("Fatal:", e.message); process.exit(1); });
