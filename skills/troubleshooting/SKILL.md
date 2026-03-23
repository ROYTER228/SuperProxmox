---
name: troubleshooting
description: Use when a Proxmox VM, container, or host is not working as expected. Covers boot failures, network issues, service crashes, disk problems, and hardware errors (MCE). Enforces root cause investigation before applying fixes.
---

# Troubleshooting

## Iron Law

```
NO FIX WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

No exceptions. No "just restart it." No "it worked before, reboot should fix it."

## Methodology

### Step 1: Gather Symptoms
What exactly is broken? Be specific.

```
pve_get_node_resources(node)     // Host alive?
pve_list_vms(node)               // VM status?
pve_list_containers(node)        // CT status?
pve_get_task_log(node, upid)     // Last operation log?
```

### Step 2: Check Recent Changes
What changed right before the problem?

- New VM/CT created?
- Config changed?
- Update applied?
- Power outage?

```
pve_list_tasks(node, limit=20)   // Recent operations
```

### Step 3: Isolate the Component

| Symptom | Component | Check |
|---------|-----------|-------|
| All VMs down | Host reboot | `uptime`, `last reboot` |
| One VM won't start | VM config | `pve_get_vm_config`, task log |
| VM boots to UEFI Shell | Boot order | Boot config, ISO attached? |
| Container crash loop | LXC features | apparmor, nesting, TUN |
| Network unreachable | Bridge/firewall | `pve_list_networks`, firewall rules |
| Disk full | Storage | `pve_list_storage`, `df -h` |
| High CPU/RAM | Workload | `pve_get_node_resources` |
| Hardware error | MCE/thermal | `journalctl`, `smartctl` |

### Step 4: Diagnose

#### Boot problems
```bash
# Via SSH to Proxmox host:
qm config <vmid>          # Check boot order
qm showcmd <vmid>         # Full QEMU command
journalctl | grep <vmid>  # VM-specific logs
```

Common boot fixes:
- UEFI Shell → wrong boot order, set `boot: order=scsi0`
- "Remove installation medium" → ISO still attached, remove ide2
- GRUB rescue → disk corrupted or wrong BIOS type

#### Container problems
```bash
pct config <vmid>          # Check LXC config
pct exec <vmid> -- systemctl status <service>
journalctl | grep pve-container
```

Common CT fixes:
- Docker "OCI runtime create failed" → need apparmor unconfined
- Tailscale "failed to connect" → need TUN device
- "Failed to start" → check nesting, cgroup permissions

#### Network problems
```bash
# From inside VM/CT:
ping 192.168.3.1           # Gateway reachable?
ping 8.8.8.8               # Internet reachable?
ping google.com             # DNS working?
ip addr                     # IP assigned?
ip route                    # Default route?
```

Fix priority: IP → route → gateway → DNS → internet

#### Hardware problems
```bash
# On Proxmox host:
dmesg | grep -i error
journalctl -b -1 | grep -iE 'mce|hardware|thermal|oom'
smartctl -a /dev/sda        # Disk health
sensors                      # Temperature
last reboot                  # Reboot history (look for "crash")
```

### Step 5: Fix (Minimal Blast Radius)
- Fix ONE thing at a time
- Verify after each change
- If uncertain → snapshot first

### Step 6: Verify
```
pve_get_vm_status(node, vmid)  // Running?
pve_get_node_resources(node)   // Resources normal?
```

### Step 7: Document
Record: what broke, why, what fixed it.

## Common Issues Reference

| Issue | Cause | Fix |
|-------|-------|-----|
| VM boots to UEFI Shell | Wrong boot order or BIOS | SeaBIOS for Linux, fix boot order |
| "Failed unmounting /cdrom" | ISO still attached after install | Remove ISO, press Enter |
| CT Docker "permission denied" | Unprivileged or wrong apparmor | Privileged + apparmor unconfined |
| CT Tailscale won't start | No TUN device | Add lxc.mount.entry for /dev/net/tun |
| All VMs stopped after reboot | onboot not set | `qm set <id> --onboot 1` |
| Host crashed (MCE) | Hardware error: RAM, PSU, thermal | Run memtest86+, check PSU, clean dust |
| Disk SMART warning | Failing disk | Backup NOW, replace disk |
| "Lock file timeout" | Previous operation didn't finish | Wait or `rm /var/lock/qemu-server/lock-*.conf` |

## Rationalization Table

| Excuse | Reality |
|--------|---------|
| "Just restart it" | Masks root cause, problem will recur |
| "It was working yesterday" | Something changed. Find what. |
| "Must be a Proxmox bug" | 99% it's misconfiguration. Check config. |
| "I'll investigate if it happens again" | It will happen again. At 3 AM. Investigate now. |
| "The logs are too long" | `grep -i error` exists. Use it. |
| "Reboot fixed it, we're good" | If `last reboot` shows "crash" — you have a hardware problem |

## Red Flags — STOP

- "Let me just reboot the host" → STOP. Why did it crash? Check logs FIRST.
- "Delete and recreate the VM" → STOP. Diagnose why it broke, or the new one breaks too.
- "I'll skip the logs" → STOP. Logs ARE the diagnosis.
- "It's probably the network, let me change random settings" → STOP. Ping test first.
