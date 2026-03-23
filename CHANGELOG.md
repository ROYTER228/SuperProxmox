# Changelog

## [0.2.0] — 2026-03-23

### Added
- **141 MCP tools** covering full Proxmox VE API
- **Multi-service support**: PVE + PBS + PDM in one MCP server
- **13 tool modules**: cluster, vm, container, storage, network, firewall, backup, users, monitoring, disks, ha, tasks, pbs
- **11 skills**: provisioning-vm, provisioning-container, security-hardening, troubleshooting, infrastructure-audit, storage-planning, backup-strategy, network-diagnostics, safety-guard, writing-superproxmox-skills, using-superproxmox
- **6 agents**: proxmox-specialist, devops-engineer, security-auditor, capacity-planner, pbs-specialist, pdm-specialist
- **Safety system**: 17 destructive operations require explicit user confirmation
- **Session hooks**: auto-bootstrap on session start
- API coverage documentation (112 PVE endpoints mapped)
- MIT License
- npm/npx support via `bin` field

## [0.1.0] — 2026-03-23

### Added
- Initial fork from mcp-proxmox (35 tools)
- Decomposed monolith into modular architecture
- Added VM and container creation tools
- PveClient class with get/post/put/del
- 45 tools across 7 modules
