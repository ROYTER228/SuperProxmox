---
name: backup-strategy
description: Use when setting up backup schedules, choosing backup modes, or planning disaster recovery for Proxmox VMs and containers. Covers vzdump modes, retention policies, and backup verification.
---

# Backup Strategy

## Iron Law

```
NO PRODUCTION SERVICE WITHOUT AT LEAST ONE TESTED BACKUP
```

## Backup Modes

| Mode | Downtime | Consistency | Use When |
|------|----------|-------------|----------|
| Snapshot | None | Application-level | Default for most VMs |
| Suspend | Brief (seconds) | Memory state saved | When snapshot not supported |
| Stop | Full (minutes) | Disk-level perfect | Critical data, scheduled maintenance |

## Retention Policy (3-2-1 Rule)

- **3** copies of data
- **2** different storage types
- **1** offsite (or separate physical disk)

Recommended schedule:
```
Daily:   keep last 7
Weekly:  keep last 4
Monthly: keep last 3
```

## Workflow

1. `pve_list_storage(node)` — find storage with `backup` content type
2. `pve_create_backup(node, vmid, storage, mode="snapshot", compress="zstd")`
3. Verify backup exists: `pve_list_backups(node, storage, vmid)`
4. Test restore periodically (at least once after setup)

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| No backups at all | Set up vzdump schedule NOW |
| Backups on same disk as data | Use separate storage pool |
| Never tested restore | Test restore to temp VM quarterly |
| No compression | Use zstd — fast + good ratio |
| Keep all backups forever | Set retention policy, disk fills up |
