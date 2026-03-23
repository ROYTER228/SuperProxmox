# SuperProxmox for Gemini CLI

## Setup

1. Install MCP server:
```bash
npm install -g super-proxmox
```

2. Configure environment:
```bash
export PVE_URL=https://YOUR-IP:8006
export PVE_USER=root@pam
export PVE_PASSWORD=your-password
```

3. Start MCP server:
```bash
super-proxmox
```

## Skill Invocation

Use `activate_skill` to load skills:
```
activate_skill("provisioning-vm")
activate_skill("security-hardening")
```

## Tool Mapping

| Gemini | SuperProxmox |
|--------|-------------|
| `activate_skill` | Load a skill from skills/ directory |
| MCP tools | All `pve_*`, `pbs_*` tools via MCP protocol |
