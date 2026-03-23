---
name: infrastructure-audit
description: Use when reviewing Proxmox infrastructure health, resource utilization, or planning capacity. Checks all nodes, VMs, containers, storage, and network for issues, waste, and optimization opportunities.
---

# Infrastructure Audit

## Overview

Systematic review of all infrastructure components. Run periodically or before major changes.

## Audit Procedure

### 1. Cluster & Node Health
```
pve_get_cluster_status()
pve_list_nodes()
pve_get_node_resources(node)
```

Check:
- [ ] All nodes online
- [ ] CPU usage < 80%
- [ ] RAM usage < 80% (leave buffer for ballooning)
- [ ] Load average reasonable (< core count)
- [ ] Uptime — any unexpected reboots?

### 2. VM & Container Inventory
```
pve_list_vms(node)
pve_list_containers(node)
```

For each VM/CT:
- [ ] Status: running or stopped (any zombies?)
- [ ] Purpose still relevant? (delete unused)
- [ ] Resources appropriate? (oversized = waste, undersized = problems)
- [ ] Autostart enabled for critical services?

### 3. Storage Utilization
```
pve_list_storage(node)
pve_get_storage_content(node, storage)
```

Check:
- [ ] No storage > 80% full
- [ ] Old ISOs cleaned up
- [ ] Old backups rotated
- [ ] Thin provisioning not overcommitted

### 4. Network
```
pve_list_networks(node)
pve_get_dns(node)
```

Check:
- [ ] Bridge configured correctly
- [ ] DNS resolving
- [ ] No orphaned network interfaces

### 5. Security (invoke security-hardening skill)
Cross-reference with `security-hardening` checklist.

## Output Format

Present audit results as:

```
INFRASTRUCTURE AUDIT — [date]
═══════════════════════════════
Node: [name]
  CPU: [usage]% ([cores] cores) — [OK/WARNING/CRITICAL]
  RAM: [used]/[total] ([pct]%) — [OK/WARNING/CRITICAL]
  Storage:
    [name]: [used]/[total] ([pct]%) — [OK/WARNING]

VMs/CTs: [running]/[total]
  [list with status and resource usage]

Issues Found:
  [CRITICAL] ...
  [WARNING] ...

Recommendations:
  1. ...
  2. ...
```

## Thresholds

| Metric | OK | WARNING | CRITICAL |
|--------|-----|---------|----------|
| CPU | < 70% | 70-85% | > 85% |
| RAM | < 70% | 70-85% | > 85% |
| Storage | < 70% | 70-85% | > 85% |
| Overcommit (RAM) | < 1.5x | 1.5-2x | > 2x |
| Overcommit (CPU) | < 4x | 4-8x | > 8x |
