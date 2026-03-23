---
name: provisioning-vm
description: Use when creating a new virtual machine on Proxmox. Guides through OS selection, BIOS type, resource allocation, storage placement, and network configuration. Prevents common mistakes like wrong BIOS, overcommitted resources, or missing boot order.
---

# Provisioning VM

## Iron Law

```
NO VM CREATION WITHOUT CHECKING AVAILABLE RESOURCES FIRST
```

No exceptions. No "I'll check later." No "it's a small VM."

## Quick Reference

| OS | BIOS | Notes |
|----|------|-------|
| Linux (any) | SeaBIOS | Simpler, always works |
| Windows 10/11 | OVMF (UEFI) | Requires EFI disk |
| TrueNAS SCALE | OVMF (UEFI) | Needs EFI disk + q35 |
| FreeBSD/pfSense | SeaBIOS | OVMF optional |

## Workflow

### Step 1: Check Resources
```
pve_get_node_resources(node)
```
Verify: CPU cores available > requested, free RAM > requested + 2GB buffer, storage has space.

**STOP if**: RAM usage > 80%, storage < 20% free, CPU overcommit > 4:1.

### Step 2: Gather Requirements
Ask the user:
1. **What OS?** → determines BIOS, ISO, ostype
2. **Purpose?** → determines resource sizing
3. **Network?** → static IP or DHCP, which bridge

If user says "just create a VM" — ask these questions. Do NOT guess.

### Step 3: Choose Configuration

| Purpose | CPU | RAM | Disk |
|---------|-----|-----|------|
| Light service (DNS, VPN) | 1 | 512MB-1GB | 4-8GB |
| NAS (TrueNAS) | 2 | 8GB min | 32GB boot + data disk |
| Dev/Docker | 2-4 | 4-8GB | 32-64GB |
| Windows Desktop | 4 | 8GB+ | 64GB+ |
| Database | 2-4 | 4-16GB | 32GB+ SSD |

### Step 4: Select Storage
- **Boot disk** → SSD/NVMe storage (local-lvm) for fast boot
- **Data disk** → HDD storage for bulk data
- **ISO** → must be on `local` or storage with `iso` content type

### Step 5: Create VM
```
pve_create_vm(node, vmid, {
  name, memory, cores, ostype,
  bios: "seabios" | "ovmf",
  storage, diskSize, iso, bridge
})
```

### Step 6: Verify
```
pve_get_vm_status(node, vmid)  // should be "running"
```

If UEFI Shell appears instead of OS installer → wrong boot order. Fix:
- Check ISO is attached to ide2
- Set boot order: `ide2` first, then `scsi0`

### Step 7: Post-Install
After OS installation:
1. Remove ISO from VM config
2. Set boot order to disk only
3. Enable `onboot` if needed
4. Invoke `security-hardening` skill

## Common Mistakes

| Mistake | Consequence | Prevention |
|---------|-------------|------------|
| OVMF for Linux | UEFI Shell boot loop | Use SeaBIOS for Linux |
| No EFI disk with OVMF | Won't boot | Always add efidisk0 with OVMF |
| Boot order wrong after install | Boots back into installer | Remove ISO, set boot=scsi0 |
| Forgot to remove ISO | Re-installs on reboot | Remove ISO after install |
| Overcommit RAM >90% | OOM killer, host crash | Keep 20% RAM buffer |
| Data disk on SSD | Wastes fast storage | Use HDD for bulk data |

## Rationalization Table

| Excuse | Reality |
|--------|---------|
| "I'll use defaults" | Defaults = 2GB RAM, no disk, no network. Useless. |
| "OVMF is more modern" | SeaBIOS works perfectly for Linux, OVMF adds complexity |
| "I don't need to check resources" | You'll overcommit and crash the host |
| "I'll configure network later" | VM without network = can't SSH, can't install packages |
| "One more VM won't hurt" | It will if you're at 85% RAM usage |
