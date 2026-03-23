---
name: network-diagnostics
description: Use when a VM or container has network connectivity issues — cannot reach gateway, no internet, DNS not resolving, or services unreachable. Systematic approach from Layer 1 to Layer 7.
---

# Network Diagnostics

## Iron Law

```
NO NETWORK FIX WITHOUT SYSTEMATIC DIAGNOSIS FIRST
```

Follow the layers. Do NOT skip ahead.

## Diagnostic Ladder

### Layer 1-2: Link
```bash
ip link show           # Interface UP?
ip addr show           # IP assigned?
```
Fix: check bridge config in Proxmox, verify net0 in VM/CT config.

### Layer 3: Network
```bash
ping 192.168.3.1       # Gateway reachable?
ip route               # Default route exists?
```
Fix: set gateway, check bridge connection.

### Layer 4: Internet
```bash
ping 8.8.8.8           # Internet reachable?
```
Fix: check NAT on router, check firewall rules.

### Layer 5-7: DNS & Services
```bash
ping google.com        # DNS resolving?
nslookup google.com    # Which DNS server?
curl http://example.com # HTTP working?
```
Fix: set nameserver in resolv.conf or CT config.

## Common Proxmox Network Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| No IP in VM | DHCP not running or no static config | Set IP in cloud-init or VM config |
| No IP in CT | net0 not configured | `pct set <id> --net0 name=eth0,bridge=vmbr0,ip=.../24,gw=...` |
| Can't reach gateway | Wrong bridge | Check vmbr0 exists and has physical port |
| Internet but no DNS | Missing nameserver | Add `nameserver 8.8.8.8` to resolv.conf |
| VM-to-VM can't connect | Firewall blocking | Check Proxmox firewall rules |
