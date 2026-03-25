// Permission levels: safe (read-only) or full (all tools)
// Set via SUPERPROXMOX_MODE=safe|full (default: full)

import type { ToolDefinition } from "./types.js";

export type PermissionMode = "safe" | "full";

const WRITE_PREFIXES = [
  "pve_create_", "pve_update_", "pve_delete_", "pve_start_", "pve_stop_",
  "pve_reboot_", "pve_suspend_", "pve_resume_", "pve_clone_", "pve_migrate_",
  "pve_resize_", "pve_rollback_", "pve_set_", "pve_add_", "pve_apply_",
  "pve_revert_", "pve_wipe_", "pve_init_", "pve_change_", "pve_node_reboot",
  "pve_node_shutdown", "pve_service_action", "pve_agent_exec", "pve_agent_file_write",
  "pbs_run_", "pbs_delete_", "pbs_prune_",
];

export function getMode(): PermissionMode {
  const mode = process.env.SUPERPROXMOX_MODE?.toLowerCase();
  if (mode === "safe") return "safe";
  return "full";
}

export function isWriteTool(name: string): boolean {
  return WRITE_PREFIXES.some(p => name.startsWith(p));
}

export function filterToolsByMode(tools: ToolDefinition[], mode: PermissionMode): ToolDefinition[] {
  if (mode === "full") return tools;
  return tools.filter(t => !isWriteTool(t.name));
}

export function checkPermission(toolName: string, mode: PermissionMode): void {
  if (mode === "safe" && isWriteTool(toolName)) {
    throw new Error(
      `Tool '${toolName}' is blocked in safe mode. ` +
      `Set SUPERPROXMOX_MODE=full to enable write operations. ` +
      `Current mode: safe (read-only).`
    );
  }
}
