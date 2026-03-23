<p align="center">
  <img src="https://www.proxmox.com/images/proxmox/Proxmox-logo-860.png" alt="Proxmox" width="300" />
</p>

<h1 align="center">SuperProxmox</h1>

<p align="center">
  <strong>MCP Server + Skills + Agents for Proxmox VE / PBS / PDM</strong>
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> |
  <a href="#features">Features</a> |
  <a href="#tools-141">141 Tools</a> |
  <a href="#skills-11">11 Skills</a> |
  <a href="#agents-6">6 Agents</a> |
  <a href="./README.ru.md">Русский</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/tools-141-blue?style=flat-square" alt="141 tools" />
  <img src="https://img.shields.io/badge/skills-11-green?style=flat-square" alt="11 skills" />
  <img src="https://img.shields.io/badge/agents-6-purple?style=flat-square" alt="6 agents" />
  <img src="https://img.shields.io/badge/license-MIT-yellow?style=flat-square" alt="MIT" />
  <img src="https://img.shields.io/badge/PVE-9.x-orange?style=flat-square" alt="PVE 9" />
  <img src="https://img.shields.io/badge/PBS-4.x-orange?style=flat-square" alt="PBS 4" />
  <img src="https://img.shields.io/badge/PDM-1.x-orange?style=flat-square" alt="PDM 1" />
</p>

---

> **Disclaimer**: This project was built with AI assistance (Claude Code / Opus 4.6). While every tool maps to the official Proxmox API and the code has been reviewed, **always verify commands before executing them on production infrastructure**. The safety system helps, but it's not a substitute for understanding what you're doing. Think before you press Enter.

---

Not just an API wrapper — a **behavioral toolkit** that teaches AI assistants how to manage Proxmox infrastructure correctly:

- Create VMs with the right BIOS (SeaBIOS vs OVMF)
- Configure Docker-ready LXC containers with proper nesting & apparmor
- Enforce security checks before every deployment
- Diagnose problems systematically (no "just restart it")
- Guard destructive operations with mandatory confirmation

Works with **Claude Code** | **Gemini CLI** | **OpenAI Codex** | **Cursor**

Inspired by [obra/superpowers](https://github.com/obra/superpowers) architecture.

---

## Features

```
SuperProxmox
├── MCP Server ───── 141 tools across 13 modules
│   ├── PVE ──────── VMs, Containers, Storage, Network, Firewall, Users, HA
│   ├── PBS ──────── Datastores, Backups, GC, Verification, Sync
│   └── PDM ──────── Multi-site, Cross-cluster (agent-based)
├── Skills ───────── 11 behavioral instructions for AI
│   ├── provisioning-vm / provisioning-container
│   ├── security-hardening / troubleshooting
│   ├── safety-guard (destructive ops protection)
│   └── backup-strategy / storage-planning / network-diagnostics
├── Agents ───────── 6 specialized roles
│   ├── proxmox-specialist / devops-engineer
│   ├── security-auditor / capacity-planner
│   └── pbs-specialist / pdm-specialist
└── Safety ───────── 17 destructive ops require confirmation
```

### Comparison

| | mcp-proxmox | **SuperProxmox** |
|--|:-----------:|:----------------:|
| MCP Tools | 35 | **141** |
| Services | PVE | **PVE + PBS + PDM** |
| Skills | 0 | **11** |
| Agents | 0 | **6** |
| Safety guards | 0 | **17** |
| Create VM/CT | No | **Yes** |
| Firewall | No | **Yes** |
| Disk mgmt (ZFS/LVM/SMART) | No | **Yes** |
| User mgmt (ACL/tokens) | No | **Yes** |
| Monitoring (RRD/logs) | No | **Yes** |
| HA / Cluster | No | **Yes** |
| Install | Clone + build | **`npx super-proxmox`** |

---

## Quick Start

### 1. Add to your project

Create or edit `.mcp.json`:

```json
{
  "mcpServers": {
    "superproxmox": {
      "command": "npx",
      "args": ["super-proxmox"],
      "env": {
        "PVE_URL": "https://YOUR-PVE-IP:8006",
        "PVE_USER": "root@pam",
        "PVE_PASSWORD": "your-password"
      }
    }
  }
}
```

### 2. Restart your AI assistant

That's it. 141 tools are now available.

### Full stack (PVE + PBS + PDM)

```json
{
  "mcpServers": {
    "superproxmox": {
      "command": "npx",
      "args": ["super-proxmox"],
      "env": {
        "PVE_URL": "https://10.0.0.1:8006",
        "PVE_USER": "root@pam",
        "PVE_TOKEN_ID": "mcp",
        "PVE_TOKEN_SECRET": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",

        "PBS_URL": "https://10.0.0.2:8007",
        "PBS_USER": "root@pam",
        "PBS_TOKEN_ID": "mcp",
        "PBS_TOKEN_SECRET": "yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy",

        "PDM_URL": "https://10.0.0.3:443",
        "PDM_USER": "admin@pdm",
        "PDM_TOKEN_ID": "mcp",
        "PDM_TOKEN_SECRET": "zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz"
      }
    }
  }
}
```

### CLI setup

```bash
claude mcp add superproxmox -- npx super-proxmox
```

---

## Environment Variables

### Proxmox VE (required)

| Variable | Default | Description |
|----------|---------|-------------|
| `PVE_URL` | — | `https://IP:8006` |
| `PVE_USER` | `root@pam` | Username |
| `PVE_PASSWORD` | — | Password auth |
| `PVE_TOKEN_ID` | — | API token ID |
| `PVE_TOKEN_SECRET` | — | API token secret |

### Proxmox Backup Server (optional)

| Variable | Default | Description |
|----------|---------|-------------|
| `PBS_URL` | — | `https://IP:8007` |
| `PBS_USER` | `root@pam` | Username |
| `PBS_PASSWORD` / `PBS_TOKEN_ID` + `PBS_TOKEN_SECRET` | — | Auth |

### Proxmox Datacenter Manager (optional)

| Variable | Default | Description |
|----------|---------|-------------|
| `PDM_URL` | — | `https://IP:443` |
| `PDM_USER` | `root@pam` | Username |
| `PDM_PASSWORD` / `PDM_TOKEN_ID` + `PDM_TOKEN_SECRET` | — | Auth |

> Backward compatible: `PROXMOX_URL`, `PROXMOX_USER`, `PROXMOX_PASSWORD` work for PVE.

---

## Tools (141)

<details>
<summary><strong>Cluster & Nodes</strong> — 5 tools</summary>

`pve_get_cluster_status` `pve_list_nodes` `pve_get_node_status` `pve_get_node_resources` `pve_get_version`
</details>

<details>
<summary><strong>Virtual Machines</strong> — 14 tools</summary>

`pve_list_vms` `pve_get_vm_status` `pve_get_vm_config` `pve_create_vm` `pve_update_vm_config` `pve_start_vm` `pve_stop_vm` `pve_reboot_vm` `pve_suspend_vm` `pve_resume_vm` `pve_clone_vm` `pve_delete_vm` `pve_migrate_vm` `pve_resize_vm_disk`
</details>

<details>
<summary><strong>Containers (LXC)</strong> — 11 tools</summary>

`pve_list_containers` `pve_get_container_status` `pve_get_container_config` `pve_create_container` `pve_update_container_config` `pve_start_container` `pve_stop_container` `pve_reboot_container` `pve_clone_container` `pve_delete_container` `pve_resize_container`
</details>

<details>
<summary><strong>Storage</strong> — 10 tools</summary>

`pve_list_storage` `pve_get_storage_content` `pve_get_storage_status` `pve_download_url` `pve_list_cluster_storage` `pve_create_storage` `pve_update_storage` `pve_delete_storage` `pve_delete_volume` `pve_list_aplinfo`
</details>

<details>
<summary><strong>Network</strong> — 9 tools</summary>

`pve_list_networks` `pve_get_network` `pve_create_network` `pve_update_network` `pve_delete_network` `pve_apply_network` `pve_revert_network` `pve_get_dns` `pve_set_dns`
</details>

<details>
<summary><strong>Firewall</strong> — 9 tools</summary>

`pve_get_firewall_rules` `pve_add_firewall_rule` `pve_delete_firewall_rule` `pve_get_firewall_options` `pve_set_firewall_options` `pve_get_firewall_log` `pve_get_cluster_firewall_aliases` `pve_add_cluster_firewall_alias` `pve_get_cluster_firewall_ipsets`
</details>

<details>
<summary><strong>Backups & Snapshots</strong> — 6 tools</summary>

`pve_list_backups` `pve_create_backup` `pve_list_snapshots` `pve_create_snapshot` `pve_rollback_snapshot` `pve_delete_snapshot`
</details>

<details>
<summary><strong>Users & Permissions</strong> — 12 tools</summary>

`pve_list_users` `pve_get_user` `pve_create_user` `pve_update_user` `pve_delete_user` `pve_change_password` `pve_list_roles` `pve_list_acl` `pve_set_acl` `pve_list_api_tokens` `pve_create_api_token` `pve_delete_api_token`
</details>

<details>
<summary><strong>Monitoring</strong> — 19 tools</summary>

`pve_get_rrddata` `pve_get_vm_rrddata` `pve_get_syslog` `pve_get_journal` `pve_get_report` `pve_list_pci` `pve_list_usb` `pve_get_netstat` `pve_get_apt_updates` `pve_apply_apt_update` `pve_get_apt_versions` `pve_get_subscription` `pve_get_time` `pve_set_time` `pve_get_hosts` `pve_set_hosts` `pve_list_services` `pve_get_service_state` `pve_service_action`
</details>

<details>
<summary><strong>Disks</strong> — 12 tools</summary>

`pve_list_disks` `pve_get_smart` `pve_list_zfs` `pve_create_zfs` `pve_list_lvm` `pve_create_lvm` `pve_list_lvmthin` `pve_create_lvmthin` `pve_init_gpt` `pve_wipe_disk` `pve_list_directories` `pve_create_directory`
</details>

<details>
<summary><strong>HA & Cluster</strong> — 16 tools</summary>

`pve_get_ha_status` `pve_list_ha_resources` `pve_add_ha_resource` `pve_delete_ha_resource` `pve_list_replication` `pve_get_cluster_config` `pve_get_cluster_log` `pve_get_cluster_resources` `pve_get_cluster_nextid` `pve_get_cluster_options` `pve_list_cluster_backup_schedule` `pve_list_pools` `pve_create_pool` `pve_delete_pool` `pve_node_reboot` `pve_node_shutdown`
</details>

<details>
<summary><strong>Tasks</strong> — 3 tools</summary>

`pve_list_tasks` `pve_get_task_status` `pve_get_task_log`
</details>

<details>
<summary><strong>Proxmox Backup Server</strong> — 15 tools</summary>

`pbs_list_datastores` `pbs_get_datastore_status` `pbs_list_snapshots` `pbs_list_backup_jobs` `pbs_get_backup_job` `pbs_get_prune_jobs` `pbs_get_gc_status` `pbs_run_gc` `pbs_list_verify_jobs` `pbs_run_verify` `pbs_list_sync_jobs` `pbs_list_tasks` `pbs_get_status` `pbs_delete_snapshot` `pbs_prune_datastore`
</details>

---

## Skills (11)

| Skill | Type | Iron Law |
|-------|------|----------|
| `using-superproxmox` | Bootstrap | Check available tools before acting |
| `provisioning-vm` | Process | NO VM WITHOUT RESOURCE CHECK |
| `provisioning-container` | Process | NO CT WITHOUT VERIFYING TEMPLATE AND FEATURES |
| `security-hardening` | Discipline | NO DEPLOYMENT WITHOUT SECURITY CHECKLIST |
| `troubleshooting` | Discipline | NO FIX WITHOUT ROOT CAUSE |
| `safety-guard` | Discipline | NO DESTRUCTIVE ACTION WITHOUT CONFIRMATION |
| `infrastructure-audit` | Process | Check all resources before recommending |
| `storage-planning` | Process | NO DISK ALLOCATION WITHOUT CHECKING FREE SPACE |
| `backup-strategy` | Process | NO PRODUCTION WITHOUT BACKUP |
| `network-diagnostics` | Technique | NO NETWORK FIX WITHOUT DIAGNOSIS |
| `writing-superproxmox-skills` | Meta | NO SKILL WITHOUT BASELINE TEST |

---

## Agents (6)

| Agent | Expertise |
|-------|-----------|
| `proxmox-specialist` | Deep PVE: VMs, containers, storage, clustering |
| `devops-engineer` | Docker in LXC, CI/CD, deployments |
| `security-auditor` | Firewalls, SSH hardening, port scanning |
| `capacity-planner` | Resource allocation, overcommit ratios |
| `pbs-specialist` | PBS: datastores, dedup, retention, tape |
| `pdm-specialist` | PDM: multi-site, cross-cluster, custom views |

---

## Safety System

**17 destructive operations** are guarded with mandatory confirmation:

```
⚠ pve_delete_vm          ⚠ pve_delete_container    ⚠ pve_delete_storage
⚠ pve_delete_volume      ⚠ pve_delete_network      ⚠ pve_delete_firewall_rule
⚠ pve_rollback_snapshot   ⚠ pve_delete_snapshot      ⚠ pve_delete_user
⚠ pve_delete_api_token   ⚠ pve_delete_pool          ⚠ pve_init_gpt
⚠ pve_wipe_disk          ⚠ pve_node_reboot          ⚠ pve_node_shutdown
⚠ pbs_delete_snapshot    ⚠ pbs_prune_datastore
```

Before executing any of these, the AI must:
1. State what it wants to do and why
2. Show exactly what will be destroyed
3. Check if a backup exists
4. Wait for explicit user confirmation

---

## Architecture

```
src/
├── index.ts           # MCP server — routes tools to correct service
├── client.ts          # Multi-service client (PVE + PBS + PDM)
├── types.ts           # TypeScript interfaces
├── utils.ts           # Helpers
└── tools/             # 13 tool modules (auto-discovered)
    ├── cluster.ts     (5)    ├── firewall.ts   (9)
    ├── vm.ts          (14)   ├── users.ts      (12)
    ├── container.ts   (11)   ├── monitoring.ts  (19)
    ├── storage.ts     (10)   ├── disks.ts      (12)
    ├── network.ts     (9)    ├── ha.ts         (16)
    ├── backup.ts      (6)    ├── tasks.ts      (3)
    └── pbs.ts         (15)

skills/                # 11 behavioral instructions
agents/                # 6 specialized roles
hooks/                 # Session bootstrap
docs/                  # API coverage matrix
```

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/new-tool`)
3. Add tools to the appropriate module in `src/tools/`
4. Run `npm run build` to verify
5. Submit a Pull Request

### Adding a new tool

1. Add tool definition to the relevant module's `tools` array
2. Add handler in the module's `handle` function
3. Mark destructive tools with `⚠ DESTRUCTIVE:` in description
4. Build: `npm run build`

---

## License

[MIT](./LICENSE) — fork it, extend it, make it yours.

---

<p align="center">
  <sub>Built with frustration from managing Proxmox via SSH at 3 AM</sub>
</p>
