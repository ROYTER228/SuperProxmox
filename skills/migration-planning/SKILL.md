---
name: migration-planning
description: Use when migrating VMs or containers between Proxmox nodes, clusters, or from other hypervisors. Covers pre-migration checks, snapshot creation, live vs offline migration, and rollback planning.
---

# Migration Planning

## Iron Law

```
NO MIGRATION WITHOUT SNAPSHOT AND ROLLBACK PLAN FIRST
```

## Pre-Migration Checklist

1. **Snapshot source VM/CT** — `pve_create_snapshot`
2. **Check target node resources** — `pve_get_node_resources(target)`
3. **Verify storage compatibility** — same storage type on both nodes
4. **Verify network** — same bridge/VLAN available on target
5. **Check VM status** — running VMs need live migration support

## Migration Types

| Type | Downtime | Requirements |
|------|----------|-------------|
| Live (online) | None/minimal | Shared storage or local-to-local with enough RAM |
| Offline | Full (minutes) | VM must be stopped |
| Cross-cluster | Full | PDM or manual export/import |

## Workflow

### Same cluster:
```
pve_create_snapshot(node, vmid, "pre-migration")
pve_migrate_vm(node, vmid, target, online=true)
pve_get_vm_status(target, vmid)  // verify running on target
```

### If migration fails:
```
pve_rollback_snapshot(node, vmid, "pre-migration")  // rollback on source
```

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| No snapshot before migration | Always snapshot first |
| Target node out of RAM | Check resources before migrating |
| Different bridge name on target | Verify network config matches |
| Migrating with local ISO attached | Detach ISO first |
| Live migration with local disk | Use shared storage or offline migrate |

## Rationalization Table

| Excuse | Reality |
|--------|---------|
| "It's just a quick migration" | Quick migrations fail too. Snapshot first. |
| "Live migration is always safe" | Not with local storage or insufficient RAM |
| "I'll snapshot after if it fails" | You can't snapshot a corrupted VM. Before, not after. |
