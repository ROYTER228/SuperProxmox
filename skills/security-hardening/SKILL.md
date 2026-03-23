---
name: security-hardening
description: Use when auditing security, after provisioning VMs or containers, before exposing services, or when auditing infrastructure security. Enforces SSH key auth, firewall rules, port restrictions, and strong passwords. Prevents common security oversights in homelab and production Proxmox environments.
---

# Security Hardening

## Iron Law

```
NO DEPLOYMENT WITHOUT SECURITY CHECKLIST COMPLETED
```

No exceptions. No "it's just a homelab." No "I'll secure it later."

## Security Checklist

Run through ALL items. Mark each as PASS/FAIL/NA.

### 1. Network Perimeter
- [ ] **No port forwarding** from WAN router to Proxmox or VMs
- [ ] External access **only via VPN** (Tailscale/WireGuard)
- [ ] Proxmox UI (8006) **not exposed** to internet
- [ ] All services bound to LAN subnet only

### 2. SSH
- [ ] **Key-only auth** — password login disabled
- [ ] Root login via key only (or disabled, use sudo)
- [ ] SSH port: default 22 or custom (not security, but reduces noise)
- [ ] `~/.ssh/authorized_keys` contains only known keys

How to enforce:
```bash
# In /etc/ssh/sshd_config:
PasswordAuthentication no
PermitRootLogin prohibit-password
```

### 3. Proxmox Host
- [ ] Root password is **strong** (not `password`, `admin`, `123456`)
- [ ] Proxmox firewall **enabled** (Datacenter → Firewall → Options)
- [ ] API tokens use **minimal permissions** (not root with full access)
- [ ] Unused ISOs and templates cleaned up

### 4. VMs and Containers
- [ ] Each VM/CT has a **unique strong password**
- [ ] No default credentials left (ubuntu/ubuntu, root/root)
- [ ] Services listen on **LAN IP only**, not 0.0.0.0
- [ ] Unnecessary ports **closed**

### 5. Updates
- [ ] Proxmox host: `apt update && apt upgrade` recent
- [ ] Container packages: up to date
- [ ] No known CVEs in running software

### 6. Backups
- [ ] At least **one backup exists** before production
- [ ] Backup tested — can actually restore from it

## Verification Commands

```bash
# Check SSH config
grep -E "PasswordAuthentication|PermitRootLogin" /etc/ssh/sshd_config

# Check listening ports
ss -tlnp

# Check firewall status (Proxmox)
pve-firewall status

# Check open ports from outside (run from another machine)
nmap -p 1-65535 <target-ip>

# Check for default passwords (attempt SSH with common passwords)
# If it works → FAIL
```

## Applying Fixes

### Fix SSH (on any VM/CT):
```bash
# Generate key on client
ssh-keygen -t ed25519

# Copy to server
ssh-copy-id user@<ip>

# Disable password auth
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart sshd
```

### Fix Proxmox Firewall:
```bash
# Enable firewall
pve-firewall start

# Allow SSH + Proxmox UI from LAN only
# Datacenter → Firewall → Add Rule:
#   Direction: IN, Action: ACCEPT, Source: 192.168.3.0/24, Dest port: 22,8006
```

## Common Mistakes

| Mistake | Impact | Fix |
|---------|--------|-----|
| Proxmox UI on public IP | Full infrastructure compromise | VPN only, no port forwarding |
| Password auth enabled | Brute force attacks | SSH keys only |
| Root password = P@ssw0rd | Dictionary attack in seconds | Use 16+ char random password |
| Firewall disabled | All ports exposed | Enable + whitelist LAN |
| No backups before changes | Can't recover from mistakes | Backup first, always |

## Rationalization Table

| Excuse | Reality |
|--------|---------|
| "It's just a homelab" | Homelabs get hacked too. Botnets scan everything. |
| "I'm behind NAT" | UPnP, misconfigs, and IPv6 bypass NAT |
| "I'll secure it later" | You won't. And "later" = after the breach. |
| "Strong passwords are enough" | Passwords get leaked. Keys don't. |
| "Nobody knows my IP" | Shodan, Censys, and bots scan the entire internet in hours |
| "Firewall slows things down" | Imperceptible latency vs. full compromise |

## Red Flags — STOP

- "Just open port 8006 on the router so I can access Proxmox from outside" → STOP. Use Tailscale.
- "Leave password auth, keys are too complicated" → STOP. Keys take 30 seconds to set up.
- "The firewall blocks my stuff, just disable it" → STOP. Add a rule, don't disable.
- "It's internal only, security doesn't matter" → STOP. Lateral movement is real.
