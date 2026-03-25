# Competitive Analysis — All Proxmox MCP/AI Solutions

Last updated: 2026-03-25

## All Known Solutions

| # | Project | Lang | Tools | Stars | Unique Feature |
|---|---------|------|-------|-------|----------------|
| 1 | [bsahane/mcp-proxmox](https://github.com/bsahane/mcp-proxmox) | Python | **50+** | ~60 | Multi-cluster, Ansible inventory, async task polling |
| 2 | [gilby125/mcp-proxmox](https://github.com/gilby125/mcp-proxmox) | Node.js | **55** | ~40 | Configurable permission levels (basic/elevated) |
| 3 | [RekklesNA/ProxmoxMCP-Plus](https://github.com/RekklesNA/ProxmoxMCP-Plus) | Python | **40+** | ~30 | OpenAPI/Swagger UI, SSH container exec, multi-transport |
| 4 | [PureGrain/ProxmoxEmCP](https://github.com/PureGrain/ProxmoxEmCP) | Node+Py | **40+** | ~25 | Docker multi-arch, Open WebUI integration |
| 5 | [mjrestivo16/mcp-proxmox](https://github.com/mjrestivo16/mcp-proxmox) | Node.js | **35** | ~50 | Terraform generation |
| 6 | [ry-ops/proxmox-mcp-server](https://github.com/ry-ops/proxmox-mcp-server) | Python | **20+** | ~10 | Agent-to-Agent (A2A) protocol |
| 7 | [canvrno/ProxmoxMCP](https://github.com/canvrno/ProxmoxMCP) | Python | **6** | ~20 | Rich terminal formatting, Cline optimized |
| 8 | [husniadil/proxmox-mcp-server](https://github.com/husniadil/proxmox-mcp-server) | Python | **10** | ~15 | SSH-based, file transfer (upload/download) |
| 9 | [Markermav/ProxmoxMCP-advance](https://github.com/Markermav/ProxmoxMCP-advance) | Python | **7** | ~10 | VM provisioning from ISO |
| 10 | [kspr9/mcp-proxmox-extended](https://github.com/kspr9/mcp-proxmox-extended) | Node.js | ~20 | ~5 | Extended lifecycle controls |
| 11 | [netixc/ProxmoxMCP](https://github.com/netixc/ProxmoxMCP) | Python | ~6 | ~5 | Clean interface |
| 12 | [johnstetter/mcp-proxmox](https://github.com/johnstetter/mcp-proxmox) | ? | ? | ~5 | Basic |
| 13 | [folkvarlabs/Prox-AI](https://github.com/folkvarlabs/Prox-AI) | Python | N/A | ~15 | NOT MCP — Terraform + LLM + Google Forms automation |
| — | **ROYTER228/SuperProxmox** | **TS** | **170** | — | **Skills, Agents, Safety, PBS/PDM, Bundles** |

## Features We DON'T Have (gap analysis)

### HIGH PRIORITY — should add

| Feature | Found In | Description | Effort |
|---------|----------|-------------|--------|
| **Configurable permission levels** | gilby125 | `PROXMOX_ALLOW_ELEVATED=true/false` — basic mode = read-only, elevated = full access | Medium |
| **File transfer to/from CT** | husniadil | Upload/download files to containers via SSH staging | Medium |
| **Ansible inventory generation** | bsahane | `register-vm-as-host` — auto-generate Ansible inventory from running VMs/CTs | Low |
| **Async task polling with wait** | bsahane | `wait-task` with configurable timeout + poll interval — wait for task completion | Low |
| **Backup restore** | bsahane, RekklesNA | `restore-vm` / `restore-backup` — restore from vzdump backup | Medium |
| **Name-based resource resolution** | bsahane | Find VM by name instead of VMID — `proxmox-vm-info --name myvm` | Low |
| **NIC add/remove** | bsahane | `vm-nic-add` / `vm-nic-remove` — manage network interfaces on running VMs | Low |

### MEDIUM PRIORITY — nice to have

| Feature | Found In | Description | Effort |
|---------|----------|-------------|--------|
| **OpenAPI / Swagger endpoint** | RekklesNA | Expose MCP as REST API with docs at `/docs` | High |
| **Multi-transport (SSE/HTTP)** | RekklesNA | Support SSE and HTTP transports in addition to stdio | Medium |
| **Docker multi-arch images** | PureGrain | Publish amd64/arm64 Docker images to GHCR | Medium |
| **Open WebUI integration** | PureGrain | ProxmoxWeaver tool for Open WebUI | Medium |
| **A2A protocol** | ry-ops | Agent-to-Agent discovery via `agent-card.json` | Low |
| **Template VM** | bsahane | Convert running VM to template | Low |
| **ISO upload** | bsahane | Upload ISO file to storage (not just download URL) | Low |
| **Pool member management** | bsahane | Add/remove VMs from resource pools | Low |
| **SSH-based container exec** | RekklesNA, husniadil | Execute commands via SSH (no guest agent needed) | Medium |
| **VM metrics (RRD per-VM)** | bsahane | Per-VM CPU/RAM/IO metrics over time | Low |

### LOW PRIORITY — edge cases

| Feature | Found In | Description |
|---------|----------|-------------|
| **Terraform generation** | mjrestivo16 | Already in original fork, partially in SuperProxmox |
| **Infracost integration** | Prox-AI | Cost estimation before deployment |
| **Google Forms trigger** | Prox-AI | Submit request via form → auto-deploy |
| **Host command execution** | husniadil | Execute commands on PVE host itself (security risk) |

## What SuperProxmox Has That NOBODY Else Has

| Feature | SuperProxmox | Everyone Else |
|---------|:------------:|:-------------:|
| Skills (behavioral AI instructions) | **13** | **0** |
| Agents (specialized roles) | **6** | **0** |
| Safety system (Iron Laws) | **19 guards** | 0-2 |
| Bundles (deploy templates) | **10** | **0** |
| PBS support | **15 tools** | **0** |
| PDM support | **agent** | **0** |
| Ceph/SDN tools | **14** | **0** |
| Cloud-Init tools | **4** | 0-1 |
| Guest Agent tools | **11** | 0-1 |
| Zod validation | **Yes** | **0** |
| Rich formatting | **Yes** | 1 (canvrno) |
| Multi-platform (5) | **Yes** | 1-2 |
| Companion MCP catalog | **30+** | **0** |
| 150+ software catalog | **Yes** | **0** |
| Tests | **209** | 0-10 |
| EN + RU docs | **Yes** | EN only |

## Action Plan — What to Add to SuperProxmox

### v0.4.0 — Adopt best features from competitors

1. **Permission levels** (from gilby125):
   - `SUPERPROXMOX_MODE=safe` → read-only tools only
   - `SUPERPROXMOX_MODE=full` → all tools enabled
   - Default: `safe` for new users

2. **Task wait/polling** (from bsahane):
   - `pve_wait_task(node, upid, timeout=300, poll=5)` — wait for task to complete
   - Returns task result or timeout error

3. **Backup restore** (from bsahane/RekklesNA):
   - `pve_restore_backup(node, storage, backup_volid, vmid, storage_target)`
   - Safety guarded — confirm before restore

4. **Name-based lookup** (from bsahane):
   - `pve_find_vm(name)` — find VM by name across all nodes
   - `pve_find_container(name)` — find CT by name

5. **NIC management** (from bsahane):
   - `pve_add_nic(node, vmid, bridge, model)` — add network interface
   - `pve_remove_nic(node, vmid, netid)` — remove network interface

6. **File transfer** (from husniadil):
   - `pve_upload_to_container(node, vmid, local_path, remote_path)`
   - `pve_download_from_container(node, vmid, remote_path, local_path)`

7. **Template conversion** (from bsahane):
   - `pve_convert_to_template(node, vmid)` — convert VM to template

8. **Ansible inventory** (from bsahane):
   - `pve_generate_ansible_inventory(node)` — generate inventory.yml from running VMs/CTs
