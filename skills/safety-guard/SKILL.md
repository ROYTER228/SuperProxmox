---
name: safety-guard
description: ALWAYS ACTIVE. Enforces mandatory confirmation before any destructive operation on Proxmox infrastructure. Covers VM/CT deletion, disk wipe, snapshot rollback, firewall changes, and any action that cannot be easily undone. Prevents accidental infrastructure destruction.
---

# Safety Guard

## THIS SKILL IS NON-NEGOTIABLE. IT CANNOT BE DISABLED OR BYPASSED.

## Iron Law

```
NO DESTRUCTIVE ACTION WITHOUT EXPLICIT USER CONFIRMATION
```

Zero exceptions. Zero shortcuts. Zero "the user probably meant yes."

## What is a Destructive Action?

### CRITICAL (requires confirmation + explanation + backup check)

| Action | Tool | Risk |
|--------|------|------|
| Delete VM | `pve_delete_vm` | Permanent data loss |
| Delete Container | `pve_delete_container` | Permanent data loss |
| Delete Snapshot | `pve_delete_snapshot` | Lose recovery point |
| Rollback Snapshot | `pve_rollback_snapshot` | Overwrites current state |
| Stop VM (force) | `pve_stop_vm(force=true)` | Data corruption possible |
| Resize disk (shrink) | `pve_resize_vm_disk` | Data loss if shrinking |
| Wipe disk | future: `pve_wipe_disk` | Permanent data loss |
| Delete storage | future: `pve_delete_storage` | Lose all content |
| Delete firewall rule | future: `pve_delete_firewall_rule` | May expose services |
| Delete user | future: `pve_delete_user` | Lose access config |
| Delete backup | future: `pve_delete_backup` | Lose recovery option |

### WARNING (requires confirmation)

| Action | Tool | Risk |
|--------|------|------|
| Stop VM (graceful) | `pve_stop_vm` | Service downtime |
| Stop Container | `pve_stop_container` | Service downtime |
| Reboot VM/CT | `pve_reboot_vm/container` | Brief downtime |
| Migrate VM | `pve_migrate_vm` | Downtime during migration |
| Update config | `pve_update_vm/container_config` | May break running service |
| Change DNS | `pve_set_dns` | May break name resolution |
| Change firewall | future: firewall tools | May break connectivity |

### SAFE (no confirmation needed)

| Action | Tool |
|--------|------|
| List/Get anything | All `pve_list_*`, `pve_get_*` |
| Create VM/CT | `pve_create_vm/container` |
| Start VM/CT | `pve_start_vm/container` |
| Create snapshot | `pve_create_snapshot` |
| Create backup | `pve_create_backup` |
| Resume VM | `pve_resume_vm` |

## Confirmation Protocol

### For CRITICAL actions:

Before executing, the AI MUST:

1. **STATE what** it wants to do:
   ```
   I want to DELETE VM 102 (truenas) on node stend.
   ```

2. **STATE why**:
   ```
   Reason: User requested removal of TrueNAS because migrating to new storage.
   ```

3. **STATE consequences**:
   ```
   This will PERMANENTLY destroy:
   - VM 102 boot disk (32GB on local-lvm)
   - VM 102 data disk (512GB on HDD1)
   - All data on TrueNAS including SMB shares
   - This action CANNOT be undone.
   ```

4. **CHECK backup exists**:
   ```
   Checking backups... [pve_list_backups]
   ⚠ No backup found for VM 102!
   STRONGLY RECOMMEND creating a backup first.
   ```

5. **ASK for explicit confirmation**:
   ```
   Type "yes, delete VM 102" to confirm, or "no" to cancel.
   ```

6. **WAIT for user response**. Do NOT proceed without explicit "yes."

### For WARNING actions:

1. **STATE what and why** (brief)
2. **ASK**: "Shall I proceed?"
3. **WAIT** for confirmation

## Implementation in Code

Every tool handler for destructive operations MUST include this in its description:

```typescript
{
  name: "pve_delete_vm",
  description: "Delete a VM. ⚠ DESTRUCTIVE: permanently destroys VM and all its disks. " +
    "REQUIRES user confirmation. Before calling: state what will be deleted, why, " +
    "consequences, and check if backup exists. Wait for explicit 'yes' from user.",
}
```

## Behavior Contract

The AI using SuperProxmox agrees to:

1. **NEVER** execute a CRITICAL action without showing the confirmation prompt
2. **NEVER** interpret vague statements as confirmation ("sure", "ok", "go ahead" are NOT valid for CRITICAL actions — must include the specific action)
3. **NEVER** batch multiple destructive actions without confirming each one
4. **ALWAYS** check for backups before deletion
5. **ALWAYS** suggest creating a backup if none exists
6. **ALWAYS** show exactly what will be destroyed (names, IDs, sizes, data)

## Rationalization Table

| Excuse | Reality |
|--------|---------|
| "The user already said to delete everything" | Confirm EACH deletion separately |
| "It's just a test VM" | Test VMs can contain work-in-progress. Confirm. |
| "I'll recreate it after" | Recreating ≠ restoring. Data is gone forever. |
| "The user seems to know what they're doing" | Even experts make mistakes. Confirm. |
| "It would be faster to just do it" | 5 seconds to confirm vs hours to recover lost data |
| "They said 'clean up unused VMs'" | List them first, confirm which ones, delete one by one |
| "The snapshot is old, probably not needed" | User decides if it's needed, not you |

## Red Flags — HARD STOP

If you catch yourself thinking ANY of these, STOP IMMEDIATELY:

- "I'll just delete it quickly and tell the user after"
- "They probably won't need this snapshot"
- "Force stop is fine, the VM is just hanging"
- "I'll rollback the snapshot to fix the problem" (rollback DESTROYS current state)
- "Let me delete all old backups to free space"
- "I'll wipe the disk so we can start fresh"
- "The user said 'fix it' so I'll recreate the VM" (recreate = delete + create = data loss)

## Example: Correct Safety Flow

```
User: Delete the old test VM

AI: I found these VMs on node stend:
    - VM 102 (truenas) — running, 8GB RAM
    - CT 103 (docker-dev) — running, 8GB RAM
    - CT 104 (gitea) — running, 1GB RAM

    Which VM do you want to delete?

User: 102

AI: I want to DELETE VM 102 (truenas) on node stend.

    This will PERMANENTLY destroy:
    ├── Boot disk: 32GB (local-lvm)
    ├── Data disk: 512GB (HDD1) — contains ZFS pool "data"
    │   ├── SMB share: Documents
    │   ├── SMB share: Media
    │   ├── SMB share: Backups
    │   └── SMB share: Projects
    └── TrueNAS OS and all configuration

    ⚠ Checking backups... No backups found for VM 102.

    ⚠ STRONGLY RECOMMEND creating a backup first:
       pve_create_backup(stend, 102, "local", "snapshot")

    Type "yes, delete VM 102" to confirm, or "no" to cancel.

User: no, backup first

AI: Creating backup of VM 102... [pve_create_backup]
    Backup completed. Now safe to delete if needed.
```
