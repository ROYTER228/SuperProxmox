---
name: using-superproxmox
description: Use when starting a session involving Proxmox VE infrastructure management. Bootstraps awareness of available MCP tools, skills, and agents for Proxmox operations. Loaded automatically via session-start hook.
---

# Using SuperProxmox

## Overview

SuperProxmox provides MCP tools, skills, and agents for managing Proxmox VE infrastructure. Before taking any Proxmox action, check what tools and skills are available.

## Available MCP Tools (45+)

### Cluster & Nodes
`pve_get_cluster_status`, `pve_list_nodes`, `pve_get_node_status`, `pve_get_node_resources`, `pve_get_version`

### Virtual Machines
`pve_list_vms`, `pve_get_vm_status`, `pve_get_vm_config`, `pve_create_vm`, `pve_update_vm_config`, `pve_start_vm`, `pve_stop_vm`, `pve_reboot_vm`, `pve_suspend_vm`, `pve_resume_vm`, `pve_clone_vm`, `pve_delete_vm`, `pve_migrate_vm`, `pve_resize_vm_disk`

### Containers (LXC)
`pve_list_containers`, `pve_get_container_status`, `pve_get_container_config`, `pve_create_container`, `pve_update_container_config`, `pve_start_container`, `pve_stop_container`, `pve_reboot_container`, `pve_clone_container`, `pve_delete_container`, `pve_resize_container`

### Storage
`pve_list_storage`, `pve_get_storage_content`, `pve_download_url`

### Network
`pve_list_networks`, `pve_get_dns`, `pve_set_dns`

### Backups & Snapshots
`pve_list_backups`, `pve_create_backup`, `pve_list_snapshots`, `pve_create_snapshot`, `pve_rollback_snapshot`, `pve_delete_snapshot`

### Tasks
`pve_list_tasks`, `pve_get_task_status`, `pve_get_task_log`

## Available Skills

| Skill | When to Use |
|-------|-------------|
| `provisioning-vm` | Creating a new virtual machine |
| `provisioning-container` | Creating a new LXC container (especially Docker-ready) |
| `security-hardening` | After provisioning, before production use |
| `troubleshooting` | Something is broken or behaving unexpectedly |
| `infrastructure-audit` | Reviewing resource usage and infrastructure health |
| `storage-planning` | Deciding where to store data, which storage type |
| `backup-strategy` | Setting up backup schedules and policies |
| `network-diagnostics` | Network connectivity issues |

## Safety Rules (NON-NEGOTIABLE)

The `safety-guard` skill is ALWAYS ACTIVE. Before ANY destructive action (delete, force stop, rollback, wipe):
1. **State** what you want to do and why
2. **Show** exactly what will be destroyed
3. **Check** if backup exists
4. **Ask** for explicit user confirmation
5. **Wait** — do NOT proceed without "yes"

See `safety-guard` skill for full protocol.

## Protocol

1. **Safety first** — `safety-guard` is always active, no destructive action without confirmation
2. **Always check resources first** — run `pve_get_node_resources` before creating anything
3. **Always invoke the relevant skill** — say "I'm using the [skill-name] skill"
4. **Never guess node names** — run `pve_list_nodes` to discover them
5. **Verify after changes** — check status after create/start/stop operations
6. **Security last-pass** — invoke `security-hardening` after provisioning
