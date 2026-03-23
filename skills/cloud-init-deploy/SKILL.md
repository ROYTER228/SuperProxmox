---
name: cloud-init-deploy
description: Use when creating a VM that should boot ready-to-use without manual OS installation. Covers cloud image download, cloud-init configuration (user, SSH keys, network), and automated VM provisioning. Eliminates console-based OS installation entirely.
---

# Cloud-Init Deploy

## Iron Law

```
NO CLOUD-INIT VM WITHOUT VERIFYING CLOUD IMAGE AND SSH KEY FIRST
```

## Why Cloud-Init?

| Method | Time | Console needed | Automated |
|--------|------|---------------|-----------|
| Manual ISO install | 15-30 min | Yes | No |
| Cloud-Init | 2 min | No | Yes |

Cloud-Init = download cloud image → create VM → set user/SSH/IP → boot → done.

## Workflow

### Step 1: Download Cloud Image

Cloud images are pre-installed OS images (qcow2 format). Download via SSH on Proxmox host:

**Ubuntu:**
```bash
wget https://cloud-images.ubuntu.com/noble/current/noble-server-cloudimg-amd64.img
```

**Debian:**
```bash
wget https://cloud.debian.org/images/cloud/bookworm/latest/debian-12-generic-amd64.qcow2
```

**AlmaLinux:**
```bash
wget https://repo.almalinux.org/almalinux/9/cloud/x86_64/images/AlmaLinux-9-GenericCloud-latest.x86_64.qcow2
```

### Step 2: Create VM and Import Disk

```bash
# On Proxmox host:
qm create VMID --name myvm --memory 4096 --cores 2 --net0 virtio,bridge=vmbr0 --scsihw virtio-scsi-single
qm importdisk VMID noble-server-cloudimg-amd64.img local-lvm
qm set VMID --scsi0 local-lvm:vm-VMID-disk-0
qm set VMID --ide2 local-lvm:cloudinit
qm set VMID --boot order=scsi0
```

### Step 3: Configure Cloud-Init via MCP

```
pve_set_cloudinit(node, vmid, {
  ciuser: "ubuntu",
  cipassword: "changeme",
  sshkeys: "ssh-ed25519 AAAA... user@host",
  ipconfig0: "ip=192.168.3.50/24,gw=192.168.3.1",
  nameserver: "8.8.8.8"
})

pve_regenerate_cloudinit(node, vmid)
```

### Step 4: Start and Verify

```
pve_start_vm(node, vmid)
# Wait 30-60 seconds for boot
pve_agent_ping(node, vmid)  # Guest agent responds?
pve_agent_get_interfaces(node, vmid)  # Got the right IP?
```

### Step 5: SSH In

```bash
ssh ubuntu@192.168.3.50  # Using the SSH key, no password needed
```

## Cloud Image Sources

| OS | URL | Size |
|----|-----|------|
| Ubuntu 24.04 | `cloud-images.ubuntu.com/noble/current/` | ~600MB |
| Ubuntu 22.04 | `cloud-images.ubuntu.com/jammy/current/` | ~600MB |
| Debian 12 | `cloud.debian.org/images/cloud/bookworm/latest/` | ~350MB |
| AlmaLinux 9 | `repo.almalinux.org/almalinux/9/cloud/x86_64/images/` | ~600MB |
| Rocky Linux 9 | `dl.rockylinux.org/pub/rocky/9/images/x86_64/` | ~600MB |
| Fedora | `download.fedoraproject.org/pub/fedora/linux/releases/` | ~300MB |

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| No cloud-init drive added | `qm set VMID --ide2 local-lvm:cloudinit` |
| SSH keys not URL-encoded | Encode `+` as `%2B`, spaces as `%20` |
| Used ISO instead of cloud image | Cloud images are qcow2, not ISO |
| Forgot to regenerate after config change | `pve_regenerate_cloudinit` after every change |
| No guest agent in image | Install `qemu-guest-agent` after first boot |
| Boot order wrong | Set `boot order=scsi0`, not cloudinit drive |

## Rationalization Table

| Excuse | Reality |
|--------|---------|
| "I'll just install from ISO" | 30 min manual install vs 2 min cloud-init |
| "Cloud-init is complicated" | 4 commands and it's done forever |
| "I don't have SSH keys" | `ssh-keygen -t ed25519` — 3 seconds |
| "I'll set the IP later" | Set it now in cloud-init, VM boots with correct IP |
