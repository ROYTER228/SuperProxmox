# Proxmox VE API Coverage

Full API endpoint map from live Proxmox VE 9.0.3 instance.
Legend: **DONE** = implemented in SuperProxmox, **TODO** = planned, **—** = not planned

## /access (Users, Auth, ACL)

| Endpoint | Methods | SuperProxmox | Description |
|----------|---------|-------------|-------------|
| `/access/acl` | GET, PUT | TODO | ACL permissions list/set |
| `/access/domains` | GET, POST | — | Auth realms (PAM, LDAP, AD) |
| `/access/groups` | GET, POST | — | User groups |
| `/access/password` | PUT | TODO | Change user password |
| `/access/roles` | GET, POST | TODO | Permission roles |
| `/access/tfa` | GET | — | Two-factor auth |
| `/access/ticket` | GET, POST | **DONE** (auth.ts) | Auth ticket (login) |
| `/access/users` | GET, POST | TODO | User management |
| `/access/users/{userid}` | GET, PUT, DELETE | TODO | Single user CRUD |
| `/access/users/{userid}/token` | GET, POST | TODO | API tokens |

## /cluster (Cluster-wide)

| Endpoint | Methods | SuperProxmox | Description |
|----------|---------|-------------|-------------|
| `/cluster/backup` | GET, POST | TODO | Backup schedules |
| `/cluster/config` | GET, POST | TODO | Cluster config |
| `/cluster/firewall/rules` | GET, POST | TODO | Cluster firewall rules |
| `/cluster/firewall/aliases` | GET, POST | TODO | Firewall IP aliases |
| `/cluster/firewall/groups` | GET, POST | TODO | Firewall security groups |
| `/cluster/firewall/ipset` | GET, POST | TODO | Firewall IP sets |
| `/cluster/firewall/options` | GET, PUT | TODO | Firewall options |
| `/cluster/ha` | GET | TODO | HA cluster |
| `/cluster/ha/resources` | GET, POST | TODO | HA resources |
| `/cluster/ha/status` | GET | TODO | HA status |
| `/cluster/log` | GET | TODO | Cluster log |
| `/cluster/metrics` | GET | TODO | Metrics server config |
| `/cluster/nextid` | GET | TODO | Next free VMID |
| `/cluster/notifications` | GET | TODO | Notifications |
| `/cluster/options` | GET, PUT | TODO | Cluster options |
| `/cluster/replication` | GET, POST | TODO | Replication config |
| `/cluster/resources` | GET | **DONE** | List all resources (VMs, CTs) |
| `/cluster/sdn` | GET, PUT | — | Software Defined Networking |
| `/cluster/status` | GET | **DONE** | Cluster status |
| `/cluster/tasks` | GET | TODO | Cluster-wide tasks |

## /nodes/{node} (Node Management)

| Endpoint | Methods | SuperProxmox | Description |
|----------|---------|-------------|-------------|
| `/nodes/{node}/aplinfo` | GET, POST | TODO | Appliance info (templates) |
| `/nodes/{node}/config` | GET, PUT | TODO | Node config |
| `/nodes/{node}/dns` | GET, PUT | **DONE** | DNS config |
| `/nodes/{node}/hosts` | GET, POST | TODO | /etc/hosts |
| `/nodes/{node}/journal` | GET | TODO | Systemd journal |
| `/nodes/{node}/netstat` | GET | TODO | Network statistics |
| `/nodes/{node}/report` | GET | TODO | System report |
| `/nodes/{node}/rrd` | GET | TODO | RRD graph data |
| `/nodes/{node}/rrddata` | GET | TODO | RRD raw data |
| `/nodes/{node}/status` | GET, POST | **DONE** | Node status + reboot/shutdown |
| `/nodes/{node}/subscription` | GET, PUT, POST, DELETE | TODO | Subscription |
| `/nodes/{node}/syslog` | GET | TODO | Syslog |
| `/nodes/{node}/time` | GET, PUT | TODO | Time/timezone |
| `/nodes/{node}/version` | GET | **DONE** | PVE version |
| `/nodes/{node}/vzdump` | POST | **DONE** | Create backup (vzdump) |

## /nodes/{node}/qemu (Virtual Machines)

| Endpoint | Methods | SuperProxmox | Description |
|----------|---------|-------------|-------------|
| `/nodes/{node}/qemu` | GET, POST | **DONE** | List/Create VMs |
| `/nodes/{node}/qemu/{vmid}/config` | GET, PUT, POST | **DONE** | VM config |
| `/nodes/{node}/qemu/{vmid}/status/current` | GET | **DONE** | VM status |
| `/nodes/{node}/qemu/{vmid}/status/start` | POST | **DONE** | Start VM |
| `/nodes/{node}/qemu/{vmid}/status/stop` | POST | **DONE** | Stop VM |
| `/nodes/{node}/qemu/{vmid}/status/shutdown` | POST | **DONE** | Graceful shutdown |
| `/nodes/{node}/qemu/{vmid}/status/reboot` | POST | **DONE** | Reboot VM |
| `/nodes/{node}/qemu/{vmid}/status/suspend` | POST | **DONE** | Suspend VM |
| `/nodes/{node}/qemu/{vmid}/status/resume` | POST | **DONE** | Resume VM |
| `/nodes/{node}/qemu/{vmid}/clone` | POST | **DONE** | Clone VM |
| `/nodes/{node}/qemu/{vmid}/migrate` | POST | **DONE** | Migrate VM |
| `/nodes/{node}/qemu/{vmid}/resize` | PUT | **DONE** | Resize disk |
| `/nodes/{node}/qemu/{vmid}/snapshot` | GET, POST | **DONE** | Snapshots |
| `/nodes/{node}/qemu/{vmid}/snapshot/{snap}/rollback` | POST | **DONE** | Rollback |
| `/nodes/{node}/qemu/{vmid}` | DELETE | **DONE** | Delete VM |
| `/nodes/{node}/qemu/{vmid}/firewall/rules` | GET, POST | TODO | VM firewall rules |
| `/nodes/{node}/qemu/{vmid}/agent` | POST | TODO | QEMU guest agent |
| `/nodes/{node}/qemu/{vmid}/rrd` | GET | TODO | VM metrics |
| `/nodes/{node}/qemu/{vmid}/cloudinit` | GET, PUT | TODO | Cloud-init config |
| `/nodes/{node}/qemu/{vmid}/pending` | GET | TODO | Pending config changes |
| `/nodes/{node}/qemu/{vmid}/sendkey` | PUT | TODO | Send key to VM |
| `/nodes/{node}/qemu/{vmid}/termproxy` | POST | TODO | Terminal proxy |
| `/nodes/{node}/qemu/{vmid}/vncproxy` | POST | TODO | VNC proxy |

## /nodes/{node}/lxc (Containers)

| Endpoint | Methods | SuperProxmox | Description |
|----------|---------|-------------|-------------|
| `/nodes/{node}/lxc` | GET, POST | **DONE** | List/Create CTs |
| `/nodes/{node}/lxc/{vmid}/config` | GET, PUT | **DONE** | CT config |
| `/nodes/{node}/lxc/{vmid}/status/current` | GET | **DONE** | CT status |
| `/nodes/{node}/lxc/{vmid}/status/start` | POST | **DONE** | Start CT |
| `/nodes/{node}/lxc/{vmid}/status/stop` | POST | **DONE** | Stop CT |
| `/nodes/{node}/lxc/{vmid}/status/reboot` | POST | **DONE** | Reboot CT |
| `/nodes/{node}/lxc/{vmid}/clone` | POST | **DONE** | Clone CT |
| `/nodes/{node}/lxc/{vmid}/resize` | PUT | **DONE** | Resize CT disk |
| `/nodes/{node}/lxc/{vmid}` | DELETE | **DONE** | Delete CT |
| `/nodes/{node}/lxc/{vmid}/snapshot` | GET, POST | TODO | CT snapshots |
| `/nodes/{node}/lxc/{vmid}/firewall/rules` | GET, POST | TODO | CT firewall |
| `/nodes/{node}/lxc/{vmid}/migrate` | POST | TODO | Migrate CT |
| `/nodes/{node}/lxc/{vmid}/pending` | GET | TODO | Pending changes |

## /nodes/{node}/storage (Storage)

| Endpoint | Methods | SuperProxmox | Description |
|----------|---------|-------------|-------------|
| `/nodes/{node}/storage` | GET | **DONE** | List storage |
| `/nodes/{node}/storage/{storage}/content` | GET, POST | **DONE** | Storage content |
| `/nodes/{node}/storage/{storage}/download-url` | POST | **DONE** | Download from URL |
| `/nodes/{node}/storage/{storage}/upload` | POST | TODO | Upload file |
| `/nodes/{node}/storage/{storage}/status` | GET | TODO | Storage status |
| `/storage` | GET, POST | TODO | Cluster storage config |

## /nodes/{node}/network

| Endpoint | Methods | SuperProxmox | Description |
|----------|---------|-------------|-------------|
| `/nodes/{node}/network` | GET, POST | **DONE** (list) / TODO (create) | Network interfaces |
| `/nodes/{node}/network/{iface}` | GET, PUT, DELETE | TODO | Interface CRUD |

## /nodes/{node}/firewall

| Endpoint | Methods | SuperProxmox | Description |
|----------|---------|-------------|-------------|
| `/nodes/{node}/firewall/rules` | GET, POST | TODO | Node firewall rules |
| `/nodes/{node}/firewall/rules/{pos}` | GET, PUT, DELETE | TODO | Single rule |
| `/nodes/{node}/firewall/options` | GET, PUT | TODO | Firewall options |
| `/nodes/{node}/firewall/log` | GET | TODO | Firewall log |

## /nodes/{node}/disks

| Endpoint | Methods | SuperProxmox | Description |
|----------|---------|-------------|-------------|
| `/nodes/{node}/disks/list` | GET | TODO | List physical disks |
| `/nodes/{node}/disks/smart` | GET | TODO | SMART data |
| `/nodes/{node}/disks/lvm` | GET, POST | TODO | LVM management |
| `/nodes/{node}/disks/lvmthin` | GET, POST | TODO | LVM-thin management |
| `/nodes/{node}/disks/zfs` | GET, POST | TODO | ZFS pool management |
| `/nodes/{node}/disks/directory` | GET, POST | TODO | Directory storage |
| `/nodes/{node}/disks/initgpt` | POST | TODO | Init GPT on disk |
| `/nodes/{node}/disks/wipedisk` | PUT | TODO | Wipe disk |

## /nodes/{node}/apt

| Endpoint | Methods | SuperProxmox | Description |
|----------|---------|-------------|-------------|
| `/nodes/{node}/apt/update` | GET, POST | TODO | Available updates |
| `/nodes/{node}/apt/versions` | GET | TODO | Package versions |
| `/nodes/{node}/apt/changelog` | GET | TODO | Package changelog |
| `/nodes/{node}/apt/repositories` | GET, PUT, POST | TODO | APT repositories |

## /nodes/{node}/hardware

| Endpoint | Methods | SuperProxmox | Description |
|----------|---------|-------------|-------------|
| `/nodes/{node}/hardware/pci` | GET | TODO | PCI devices |
| `/nodes/{node}/hardware/usb` | GET | TODO | USB devices |

## /nodes/{node}/tasks

| Endpoint | Methods | SuperProxmox | Description |
|----------|---------|-------------|-------------|
| `/nodes/{node}/tasks` | GET | **DONE** | List tasks |
| `/nodes/{node}/tasks/{upid}/status` | GET | **DONE** | Task status |
| `/nodes/{node}/tasks/{upid}/log` | GET | **DONE** | Task log |

## /pools

| Endpoint | Methods | SuperProxmox | Description |
|----------|---------|-------------|-------------|
| `/pools` | GET, POST | TODO | Resource pools |
| `/pools/{poolid}` | GET, PUT, DELETE | TODO | Pool CRUD |

## /version

| Endpoint | Methods | SuperProxmox | Description |
|----------|---------|-------------|-------------|
| `/version` | GET | **DONE** | API version |

---

## Coverage Summary

| Category | Total Endpoints | Implemented | Coverage |
|----------|----------------|-------------|----------|
| access (auth/users) | 10 | 1 | 10% |
| cluster | 18 | 2 | 11% |
| nodes (management) | 15 | 5 | 33% |
| qemu (VMs) | 22 | 14 | 64% |
| lxc (containers) | 13 | 9 | 69% |
| storage | 6 | 3 | 50% |
| network | 3 | 1 | 33% |
| firewall | 4 | 0 | 0% |
| disks | 8 | 0 | 0% |
| apt | 4 | 0 | 0% |
| hardware | 2 | 0 | 0% |
| tasks | 3 | 3 | 100% |
| pools | 3 | 0 | 0% |
| version | 1 | 1 | 100% |
| **TOTAL** | **~112** | **39** | **~35%** |

Priority for next phase: firewall (0%) → disks (0%) → access/users (10%) → cluster (11%)
