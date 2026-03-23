# SuperProxmox for OpenAI Codex

## Setup

```bash
npm install -g super-proxmox
```

## Configuration

Set environment variables:
```bash
export PVE_URL=https://YOUR-IP:8006
export PVE_USER=root@pam
export PVE_PASSWORD=your-password
```

## Tool Mapping

| Codex Tool | SuperProxmox Equivalent |
|-----------|------------------------|
| `spawn_agent` | Launch agent from agents/ directory |
| `update_plan` | Track task progress |
| MCP tools | All `pve_*`, `pbs_*` tools |

## Skills

Skills are in `skills/` directory. Each has a `SKILL.md` with behavioral instructions.

Key skills:
- `provisioning-vm` — VM creation wizard
- `provisioning-container` — LXC creation wizard
- `security-hardening` — Security checklist
- `troubleshooting` — Problem diagnosis
- `safety-guard` — Destructive operation protection
