# SuperProxmox — MCP + Skills + Agents for Proxmox VE

## Vision

**Not just an MCP server** — a complete AI-powered infrastructure management toolkit.

```
SuperProxmox = MCP Server (100+ tools for Proxmox API)
             + Skills (behavioral instructions for AI agents)
             + Agents (specialized roles: DevOps, Security, etc.)
             + Hooks (session bootstrap, automation)
             + Multi-platform (Claude Code, Gemini CLI, Codex, Cursor)
```

**Goal**: Install SuperProxmox → tell AI "create a Docker-ready container" → AI uses the right skill, asks the right questions, calls MCP tools, verifies security, and delivers a working result.

Inspired by [obra/superpowers](https://github.com/obra/superpowers) architecture.

---

## Target Project Structure

```
SuperProxmox/
├── .claude-plugin/
│   ├── plugin.json              # Claude Code marketplace manifest
│   └── marketplace.json         # Dev marketplace config
├── .codex/
│   └── INSTALL.md               # OpenAI Codex setup guide
├── .cursor-plugin/
│   └── plugin.json              # Cursor integration
├── .opencode/
│   └── INSTALL.md               # OpenCode setup
├── gemini-extension.json        # Gemini CLI extension
├── GEMINI.md                    # Gemini-specific instructions
│
├── src/                          # === MCP SERVER (TypeScript) ===
│   ├── index.ts                  # Entry point, MCP server setup
│   ├── client.ts                 # Proxmox API client (axios wrapper)
│   ├── types.ts                  # TypeScript interfaces
│   ├── utils.ts                  # Helpers (formatBytes, formatUptime)
│   └── tools/                    # Tool modules (auto-discovered)
│       ├── index.ts              # Tool registry
│       ├── cluster.ts            # Cluster & node management
│       ├── vm.ts                 # VM CRUD + lifecycle
│       ├── container.ts          # LXC CRUD + lifecycle
│       ├── storage.ts            # Storage pools, ISOs, templates
│       ├── network.ts            # Bridges, VLANs, DNS
│       ├── firewall.ts           # Firewall rules, IP sets
│       ├── backup.ts             # Backups & snapshots
│       ├── users.ts              # Users, roles, ACL, tokens
│       ├── monitoring.ts         # RRD, syslog, SMART, hardware
│       ├── ha.ts                 # HA cluster, replication
│       └── tasks.ts              # Task management & logs
│
├── skills/                       # === SKILLS (Behavioral Instructions) ===
│   ├── using-superproxmox/
│   │   ├── SKILL.md              # Bootstrap skill (loaded on session start)
│   │   └── references/
│   │       ├── codex-tools.md    # Tool mapping for Codex
│   │       └── gemini-tools.md   # Tool mapping for Gemini
│   │
│   ├── provisioning-vm/
│   │   └── SKILL.md              # VM creation wizard
│   │
│   ├── provisioning-container/
│   │   └── SKILL.md              # LXC creation wizard (Docker-ready, TUN, nesting)
│   │
│   ├── network-diagnostics/
│   │   └── SKILL.md              # Network troubleshooting methodology
│   │
│   ├── storage-planning/
│   │   ├── SKILL.md              # Storage architecture decisions
│   │   └── zfs-reference.md      # ZFS best practices reference
│   │
│   ├── backup-strategy/
│   │   └── SKILL.md              # Backup scheduling, rotation, verification
│   │
│   ├── security-hardening/
│   │   ├── SKILL.md              # Security audit & hardening
│   │   └── checklist.md          # Security checklist reference
│   │
│   ├── migration-planning/
│   │   └── SKILL.md              # Live migration between nodes
│   │
│   ├── cluster-setup/
│   │   └── SKILL.md              # Multi-node cluster configuration
│   │
│   ├── troubleshooting/
│   │   ├── SKILL.md              # Systematic problem diagnosis
│   │   └── common-issues.md      # Known issues reference
│   │
│   ├── infrastructure-audit/
│   │   └── SKILL.md              # Full infrastructure review
│   │
│   └── writing-superproxmox-skills/
│       └── SKILL.md              # Meta-skill: how to create new skills
│
├── agents/                       # === AGENTS (Specialized Roles) ===
│   ├── proxmox-specialist.md     # Deep Proxmox expertise
│   ├── devops-engineer.md        # Infrastructure automation expert
│   ├── security-auditor.md       # Security review & hardening
│   └── capacity-planner.md       # Resource planning & optimization
│
├── hooks/                        # === HOOKS (Automation) ===
│   ├── hooks.json                # Claude Code hook config
│   ├── hooks-cursor.json         # Cursor hook config
│   ├── run-hook.cmd              # Windows hook runner
│   └── session-start             # Bootstrap: injects using-superproxmox
│
├── tests/                        # === TESTS ===
│   ├── skills/                   # Skill behavior tests
│   │   ├── provisioning-vm.test.md
│   │   ├── security-hardening.test.md
│   │   └── troubleshooting.test.md
│   └── tools/                    # MCP tool tests
│       ├── vm.test.ts
│       └── container.test.ts
│
├── docs/                         # === DOCUMENTATION ===
│   ├── architecture.md           # System design overview
│   ├── adding-tools.md           # How to add new MCP tools
│   ├── adding-skills.md          # How to create new skills
│   └── proxmox-api-coverage.md   # API coverage matrix
│
├── package.json
├── tsconfig.json
├── README.md
├── PLAN.md                       # This file
├── CHANGELOG.md
└── LICENSE                       # MIT
```

---

## MCP Tools Roadmap (100+ tools)

### Phase 1 — Core (DONE, 45 tools)
Decomposed from mcp-proxmox monolith into modular architecture.

| Module | Tools | Status |
|--------|-------|--------|
| cluster.ts | 5 (status, nodes, resources, version) | DONE |
| vm.ts | 14 (CRUD, lifecycle, create, update, resize) | DONE |
| container.ts | 10 (CRUD, lifecycle, create, update, resize) | DONE |
| storage.ts | 3 (list, content, download) | DONE |
| network.ts | 3 (list, DNS get/set) | DONE |
| backup.ts | 6 (backups + snapshots) | DONE |
| tasks.ts | 3 (list, status, log) | DONE |

### Phase 2 — Storage Extended (+8 tools)
- `pve_create_storage` — add storage pool (LVM, ZFS, NFS, CIFS, dir)
- `pve_update_storage` — update storage config
- `pve_delete_storage` — remove storage
- `pve_upload_iso` — upload ISO file
- `pve_list_templates` — list available CT templates (pveam)
- `pve_download_template` — download CT template
- `pve_get_disk_list` — list physical disks
- `pve_get_smart` — SMART data for disks

### Phase 3 — Firewall (+7 tools)
- `pve_get_firewall_rules` — list rules (cluster/node/VM level)
- `pve_add_firewall_rule` — add rule
- `pve_delete_firewall_rule` — delete rule
- `pve_get_firewall_options` — get options
- `pve_set_firewall_options` — enable/disable
- `pve_list_firewall_aliases` — IP aliases
- `pve_list_firewall_ipsets` — IP sets

### Phase 4 — Network Extended (+5 tools)
- `pve_create_network` — create bridge/bond/vlan
- `pve_update_network` — update interface
- `pve_delete_network` — delete interface
- `pve_apply_network` — apply pending changes
- `pve_get_hosts` — /etc/hosts management

### Phase 5 — Users & Permissions (+8 tools)
- `pve_list_users` / `pve_create_user` / `pve_delete_user`
- `pve_list_roles` / `pve_create_role`
- `pve_list_acl` / `pve_set_acl`
- `pve_create_api_token` / `pve_list_api_tokens`

### Phase 6 — Monitoring (+8 tools)
- `pve_get_rrd_data` — RRD monitoring data
- `pve_get_syslog` — system log
- `pve_get_journal` — journal entries
- `pve_get_vm_log` — VM QEMU log
- `pve_get_hardware` — PCI/USB devices
- `pve_get_ceph_status` — Ceph status
- `pve_get_apt_updates` — available updates
- `pve_apply_apt_updates` — apply updates

### Phase 7 — HA & Cluster (+6 tools)
- `pve_get_ha_status` / `pve_add_ha_resource` / `pve_remove_ha_resource`
- `pve_get_cluster_config` / `pve_join_cluster`
- `pve_get_replication`

**Total target: ~100 tools**

---

## Skills Design

### Skill Format (following Superpowers conventions)

```yaml
---
name: skill-name
description: Use when [triggering conditions]. [Concrete symptoms]. [When NOT to use].
---
```

Rules:
- `description` max 1024 chars, starts with "Use when..."
- Written in third person
- Describes triggers, NOT workflow
- SKILL.md max 500 lines
- Heavy reference → separate .md files

### Skill List

#### Bootstrap
| Skill | Type | Iron Law |
|-------|------|----------|
| `using-superproxmox` | Bootstrap | Always check available tools before acting |

**Description**: Use when starting a session involving Proxmox infrastructure management. Loaded automatically via session-start hook. Lists available MCP tools, skills, and agents.

#### VM & Container Provisioning
| Skill | Type | Iron Law |
|-------|------|----------|
| `provisioning-vm` | Process | NO VM CREATION WITHOUT RESOURCE CHECK FIRST |
| `provisioning-container` | Process | NO CONTAINER WITHOUT VERIFYING TEMPLATE AND FEATURES |

**provisioning-vm** — Use when user wants to create a VM. Wizard flow:
1. Check available resources (CPU, RAM, storage)
2. Choose OS (ISO available? cloud-init?)
3. Choose BIOS (SeaBIOS for Linux, OVMF for Windows/UEFI)
4. Allocate resources (don't overcommit >80%)
5. Configure network (bridge, VLAN, static IP)
6. Create VM via MCP tool
7. Verify boot

**Rationalization table**:
| Excuse | Reality |
|--------|---------|
| "I'll just use defaults" | Defaults waste resources or miss features (e.g. wrong BIOS) |
| "I'll fix the network later" | VM without network = useless, configure now |
| "OVMF is always better" | SeaBIOS is simpler for Linux, OVMF needed only for UEFI/Windows |

**provisioning-container** — Use when user wants to create an LXC container. Wizard flow:
1. Check templates (download if missing)
2. Privileged vs unprivileged (Docker needs privileged + nesting + apparmor)
3. Allocate resources
4. Configure network (static IP)
5. Create CT
6. Post-setup (TUN device for VPN, apparmor for Docker)

**Rationalization table**:
| Excuse | Reality |
|--------|---------|
| "Unprivileged is always safer" | Docker requires privileged + nesting + apparmor unconfined |
| "I'll add TUN later" | Tailscale/VPN won't start without TUN, add at creation |
| "512MB is enough" | Docker needs at least 1-2GB, don't starve containers |

#### Infrastructure Operations
| Skill | Type | Iron Law |
|-------|------|----------|
| `storage-planning` | Process | NO DISK ALLOCATION WITHOUT CHECKING FREE SPACE |
| `backup-strategy` | Process | NO PRODUCTION WITHOUT BACKUP PLAN |
| `network-diagnostics` | Technique | NO NETWORK FIX WITHOUT PING + TRACEROUTE FIRST |
| `migration-planning` | Process | NO MIGRATION WITHOUT SNAPSHOT FIRST |

#### Security & Hardening
| Skill | Type | Iron Law |
|-------|------|----------|
| `security-hardening` | Discipline | NO DEPLOYMENT WITHOUT SECURITY CHECKLIST |

**Security checklist**:
- [ ] No port forwarding to WAN
- [ ] SSH key-only auth (disable password)
- [ ] Firewall enabled on Proxmox
- [ ] Services bound to LAN only
- [ ] Strong passwords (no defaults)
- [ ] Automatic updates enabled
- [ ] Backup exists before changes

#### Diagnostics
| Skill | Type | Iron Law |
|-------|------|----------|
| `troubleshooting` | Discipline | NO FIX WITHOUT ROOT CAUSE INVESTIGATION |
| `infrastructure-audit` | Process | CHECK ALL RESOURCES BEFORE RECOMMENDING CHANGES |

**troubleshooting** — Use when something is broken. Methodology:
1. Gather symptoms (status, logs, errors)
2. Check recent changes (what changed?)
3. Isolate (which component? network? disk? CPU?)
4. Diagnose (logs, SMART, dmesg, journalctl)
5. Fix with minimal blast radius
6. Verify fix works
7. Document what happened

**Rationalization table**:
| Excuse | Reality |
|--------|---------|
| "Just restart it" | Masks root cause, will recur |
| "Works on reboot, skip investigation" | MCE errors don't fix themselves |
| "I'll check logs later" | Check logs NOW, they rotate |

#### Meta
| Skill | Type | Iron Law |
|-------|------|----------|
| `writing-superproxmox-skills` | Meta | NO SKILL WITHOUT BASELINE TEST FIRST |

---

## Agents Design

### proxmox-specialist.md
**Role**: Deep Proxmox VE expert
**Expertise**: VM/CT lifecycle, storage, networking, clustering
**When dispatched**: Complex provisioning tasks, architecture decisions
**Tools**: All SuperProxmox MCP tools

### devops-engineer.md
**Role**: Infrastructure automation expert
**Expertise**: Docker, CI/CD, monitoring, IaC
**When dispatched**: Setting up Docker in LXC, configuring services, automation
**Tools**: SuperProxmox + SSH access

### security-auditor.md
**Role**: Security review specialist
**Expertise**: Firewalls, SSH hardening, port scanning, vulnerability assessment
**When dispatched**: After provisioning, before production, periodic audits
**Tools**: SuperProxmox firewall tools + network diagnostics

### capacity-planner.md
**Role**: Resource optimization specialist
**Expertise**: CPU/RAM/storage allocation, overcommit ratios, growth planning
**When dispatched**: Before creating new VMs, when resources are tight
**Tools**: SuperProxmox monitoring + cluster tools

---

## Hooks Design

### session-start
Bash script that runs on session start. Reads `skills/using-superproxmox/SKILL.md`, escapes it, injects as `additionalContext`. Makes AI aware of SuperProxmox capabilities from the first message.

### hooks.json (Claude Code)
```json
{
  "hooks": {
    "SessionStart": [{
      "hooks": [{
        "type": "command",
        "command": "./hooks/session-start"
      }]
    }]
  }
}
```

---

## Multi-Platform Support

| Platform | Integration | Skill Invocation |
|----------|-------------|------------------|
| Claude Code | `.claude-plugin/plugin.json` + hooks | `Skill` tool |
| Cursor | `.cursor-plugin/plugin.json` + hooks | `Skill` tool |
| Gemini CLI | `gemini-extension.json` + `GEMINI.md` | `activate_skill` |
| Codex | `.codex/INSTALL.md` + tool mapping | `spawn_agent` |
| OpenCode | `.opencode/plugins/` | native `skill` tool |

---

## Implementation Phases

### Phase 1 — MCP Refactor (DONE)
- [x] Decompose monolith into 7 modules
- [x] Add create/update tools for VM and CT
- [x] PveClient class with get/post/put/del
- [x] 45 tools working

### Phase 2 — Skills Foundation (DONE)
- [x] Write `using-superproxmox` bootstrap skill
- [x] Write `provisioning-vm` skill with rationalization table
- [x] Write `provisioning-container` skill (Docker-ready focus)
- [x] Write `security-hardening` skill with checklist
- [x] Write `troubleshooting` skill with methodology
- [x] Create session-start hook
- [x] Write `safety-guard` skill (destructive ops protection)
- [x] Write `infrastructure-audit`, `storage-planning`, `backup-strategy`, `network-diagnostics`
- [x] Write `migration-planning` skill
- [x] Write `writing-superproxmox-skills` meta skill
- [x] 12 skills total (exceeded target of 6)

### Phase 3 — Agents (DONE)
- [x] Write `proxmox-specialist` agent
- [x] Write `devops-engineer` agent
- [x] Write `security-auditor` agent
- [x] Write `capacity-planner` agent
- [x] Write `pbs-specialist` agent
- [x] Write `pdm-specialist` agent
- [x] 6 agents total (exceeded target of 4)

### Phase 4 — MCP Tools Phase 2-3 (DONE)
- [x] Add firewall tools (9)
- [x] Add extended storage tools (10)
- [x] Add extended network tools (9)
- [x] Add cloud-init tools (4)
- [x] Add QEMU guest agent tools (11)
- [x] Add Ceph tools (6)
- [x] Add SDN tools (8)
- [x] Add PBS tools (15)
- [x] 170 tools total (exceeded target of 65)

### Phase 5 — Multi-Platform (DONE)
- [x] Claude Code plugin manifest (.claude-plugin/)
- [x] Gemini extension (gemini-extension.json + GEMINI.md)
- [x] Codex install guide (.codex/INSTALL.md + tool mapping)
- [x] Cursor plugin (.cursor-plugin/)
- [x] Tool mapping references for Codex and Gemini

### Phase 6 — MCP Tools Phase 4-7 (DONE)
- [x] Users & permissions (12 tools)
- [x] Monitoring (19 tools)
- [x] HA & cluster (16 tools)
- [x] Disks management (12 tools)
- [x] 170 tools total (exceeded target of 100)

### Phase 7 — Testing & Polish (DONE)
- [x] Safety tests (4 tests)
- [x] Tool registry tests (5 tests)
- [x] Client tests (5 tests)
- [x] Bundle validation tests (31 tests)
- [x] 45 tests total, all passing
- [x] README EN + RU with badges, examples, disclaimers
- [x] GitHub release (https://github.com/ROYTER228/SuperProxmox)
- [x] ~~npm publish~~ — skipped (npm requires 2FA for publishing)
- [x] ~~Claude Code marketplace~~ — skipped

### Phase 8 — Bundles (BONUS — not in original plan)
- [x] 10 ready-to-deploy templates
- [x] tailscale-gateway, docker-host, dokploy-paas, gitea-server
- [x] truenas-nas, ubuntu-cloud, adguard-dns, nginx-proxy
- [x] minecraft-server, monitoring-stack

### Phase 9 — Polish (from canvrno/ProxmoxMCP analysis)
- [ ] Rich formatted output — human-readable tables/colors instead of raw JSON
- [ ] CPU temperature in node resources (thermal monitoring)
- [ ] Zod/Pydantic-style input validation schemas for all tools
- [ ] Companion MCP auto-suggestion after bundle deploy
- [ ] CI/CD — GitHub Actions: build + test on every push

---

## Key Principles

1. **Skills change AI behavior** — they're not docs, they're behavioral instructions
2. **Iron Laws are non-negotiable** — NO X WITHOUT Y FIRST, no exceptions
3. **Rationalization resistance** — every excuse mapped to a reality check
4. **TDD for skills** — test AI without skill, document failures, write skill targeting those failures
5. **Progressive disclosure** — SKILL.md is compact, heavy reference in separate files
6. **Multi-platform** — same skills work on Claude Code, Gemini, Codex, Cursor
7. **CSO (Claude Search Optimization)** — descriptions use trigger words AI will search for
