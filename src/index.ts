#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { SuperProxmoxClient } from "./client.js";
import { getAllTools, handleTool } from "./tools/index.js";
import { getMode, filterToolsByMode, checkPermission } from "./permissions.js";

const client = SuperProxmoxClient.fromEnv();
const mode = getMode();

const server = new Server(
  { name: "super-proxmox", version: "0.4.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: filterToolsByMode(getAllTools(), mode),
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {
    checkPermission(name, mode);
    const toolClient = name.startsWith("pbs_") ? client.pbs
      : name.startsWith("pdm_") ? client.pdm
      : client.pve;
    if (!toolClient) {
      const svc = name.startsWith("pbs_") ? "PBS (set PBS_URL)"
        : name.startsWith("pdm_") ? "PDM (set PDM_URL)" : "PVE (set PVE_URL)";
      throw new Error(`${svc} is not configured.`);
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
  const all = getAllTools(), visible = filterToolsByMode(all, mode);
  console.error(`SuperProxmox v0.4.0 — ${visible.length}/${all.length} tools (mode: ${mode}) | ${connected.join(", ")}`);
  await server.connect(new StdioServerTransport());
}

main().catch((e) => { console.error("Fatal:", e.message); process.exit(1); });
