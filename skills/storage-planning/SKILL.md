---
name: storage-planning
description: Use when deciding where to store VM disks, which storage type to use (LVM vs ZFS vs NFS), or planning disk allocation across multiple storage pools. Prevents putting boot disks on slow HDD or data disks on precious SSD space.
---

# Storage Planning

## Iron Law

```
NO DISK ALLOCATION WITHOUT CHECKING FREE SPACE AND STORAGE TYPE
```

## Decision Matrix

| Workload | Storage Type | Why |
|----------|-------------|-----|
| VM/CT boot disk | SSD (local-lvm) | Fast boot, fast IO |
| Database | SSD/NVMe | IOPS critical |
| NAS/file data | HDD | Bulk capacity, sequential IO OK |
| Docker images | SSD | Random IO from layers |
| Backups | HDD (separate pool) | Capacity over speed |
| ISO/templates | local (dir) | Only needs read speed |

## Workflow

1. `pve_list_storage(node)` — see all pools with free space
2. Map workload to storage type (matrix above)
3. Verify free space > requested + 20% buffer
4. Create disk on appropriate storage
5. For data disks: consider separate pool from boot disk (IO isolation)

## Anti-patterns

| Bad | Why | Good |
|-----|-----|------|
| Boot disk on HDD | 30-60s boot vs 5s on SSD | Boot on SSD, data on HDD |
| All disks on one pool | IO contention, single point of failure | Spread across pools |
| 90% storage utilization | No room for snapshots, logs, growth | Keep 20% free minimum |
| ZFS without enough RAM | ARC cache starved, worse than ext4 | 1GB RAM per TB + 4GB base |
