---
name: provisioning-container
description: Use when creating a new LXC container on Proxmox. Covers template selection, privileged vs unprivileged, Docker-ready configuration with nesting and apparmor, TUN device for VPN, and resource allocation. Prevents containers that fail to run Docker or Tailscale.
---

# Provisioning Container

## Iron Law

```
NO CONTAINER WITHOUT VERIFYING TEMPLATE EXISTS AND FEATURES CONFIGURED
```

No exceptions. Check template first. Configure features at creation — not after.

## Quick Reference: Container Profiles

| Profile | Privileged | Nesting | AppArmor | TUN | Use Case |
|---------|-----------|---------|----------|-----|----------|
| Basic service | No (unprivileged) | Yes | default | No | DNS, web, git |
| Docker host | **Yes** | Yes | **unconfined** | No | Docker containers |
| VPN (Tailscale) | **Yes** | Yes | default | **Yes** | VPN subnet router |
| Docker + VPN | **Yes** | Yes | **unconfined** | **Yes** | Docker + Tailscale |

## Workflow

### Step 1: Check Template
```
pve_get_storage_content(node, "local", "vztmpl")
```
If no template → download one:
```
# Via SSH on Proxmox host:
pveam update && pveam download local debian-12-standard_12.12-1_amd64.tar.zst
```

### Step 2: Determine Profile

Ask the user: **"What will this container run?"**

- "Docker" → Docker host profile
- "Tailscale/VPN" → VPN profile
- "Gitea/web server/database" → Basic service profile
- "Docker + Tailscale" → Docker + VPN profile

**Do NOT ask** "privileged or unprivileged?" — determine from the profile.

### Step 3: Resource Sizing

| Purpose | CPU | RAM | Disk |
|---------|-----|-----|------|
| Tailscale VPN | 1 | 256-512MB | 2-4GB |
| DNS/AdGuard | 1 | 256MB | 2GB |
| Gitea | 1 | 1GB | 20-50GB |
| Docker host | 2-4 | 4-8GB | 20-64GB |
| Database | 2 | 2-4GB | 20GB+ |
| Web app | 1-2 | 512MB-2GB | 8-20GB |

### Step 4: Create Container
```
pve_create_container(node, vmid, {
  ostemplate: "local:vztmpl/debian-12-standard_12.12-1_amd64.tar.zst",
  hostname, memory, cores, storage, rootfsSize,
  ip: "192.168.3.XX/24", gateway: "192.168.3.1",
  unprivileged: false,  // true for basic, false for Docker/VPN
  nesting: true,
  password, start: true
})
```

### Step 5: Post-Create Configuration

#### For Docker host — add to LXC config:
```
# Via SSH on Proxmox host:
pct stop <vmid>
cat >> /etc/pve/lxc/<vmid>.conf << 'EOF'
lxc.apparmor.profile: unconfined
lxc.cgroup2.devices.allow: a
lxc.cap.drop:
lxc.mount.auto: proc:rw sys:rw
EOF
pct start <vmid>
```
Then install Docker inside:
```
pct exec <vmid> -- bash -c 'curl -fsSL https://get.docker.com | sh'
```

#### For VPN (Tailscale) — add TUN device:
```
pct stop <vmid>
cat >> /etc/pve/lxc/<vmid>.conf << 'EOF'
lxc.cgroup2.devices.allow: c 10:200 rwm
lxc.mount.entry: /dev/net/tun dev/net/tun none bind,create=file
EOF
pct start <vmid>
```

### Step 6: Verify
```
pve_get_container_status(node, vmid)  // status: "running"
```
For Docker: `pct exec <vmid> -- docker run --rm hello-world`
For Tailscale: `pct exec <vmid> -- tailscale status`

## Common Mistakes

| Mistake | Consequence | Prevention |
|---------|-------------|------------|
| Unprivileged + Docker | Docker fails with permission errors | Use privileged for Docker |
| No nesting | Docker can't create namespaces | Always enable nesting |
| Default apparmor + Docker | `OCI runtime create failed` | Set apparmor unconfined |
| No TUN device + Tailscale | `tailscaled` crashes on start | Add TUN device to config |
| Template not downloaded | `pct create` fails with "no such file" | Check/download template first |
| Forgot to stop before config edit | Changes in PENDING, not applied | Stop CT → edit → start |
| Tiny disk for Docker | Runs out of space pulling images | 20GB minimum for Docker |

## Rationalization Table

| Excuse | Reality |
|--------|---------|
| "Unprivileged is always more secure" | Docker literally cannot work unprivileged in LXC |
| "I'll add apparmor config later" | Docker won't start at all without it — configure now |
| "512MB is enough for Docker" | One `docker pull` and you're in OOM |
| "I'll figure out TUN when I need VPN" | Tailscale crashes without TUN, you'll have to stop CT anyway |
| "LXC is like a lightweight VM, everything just works" | LXC needs explicit feature configuration unlike VMs |

## Red Flags — STOP

- "Let me just create a quick container with defaults" → STOP. What profile?
- "Docker works in unprivileged containers" → STOP. Not in LXC on Proxmox.
- "I'll configure features after creation" → STOP. Some features require CT stop + config edit.
