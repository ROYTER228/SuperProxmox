import type { PveClient } from "../client.js";
import type { ToolDefinition } from "../types.js";

import * as cluster from "./cluster.js";
import * as vm from "./vm.js";
import * as container from "./container.js";
import * as storage from "./storage.js";
import * as network from "./network.js";
import * as firewall from "./firewall.js";
import * as backup from "./backup.js";
import * as users from "./users.js";
import * as monitoring from "./monitoring.js";
import * as disks from "./disks.js";
import * as ha from "./ha.js";
import * as tasks from "./tasks.js";
import * as pbs from "./pbs.js";
import * as cloudinit from "./cloudinit.js";
import * as agent from "./agent.js";
import * as ceph from "./ceph.js";
import * as sdn from "./sdn.js";
import * as utility from "./utility.js";

const modules = [cluster, vm, container, storage, network, firewall, backup, users, monitoring, disks, ha, tasks, pbs, cloudinit, agent, ceph, sdn, utility];

export function getAllTools(): ToolDefinition[] {
  return modules.flatMap((m) => m.tools);
}

export async function handleTool(client: PveClient, name: string, args: Record<string, unknown>): Promise<string> {
  for (const mod of modules) {
    if (mod.tools.some((t) => t.name === name)) {
      return mod.handle(client, name, args);
    }
  }
  throw new Error(`Unknown tool: ${name}`);
}
