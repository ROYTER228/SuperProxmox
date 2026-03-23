# Awesome Homelab & Self-Hosted Software

150+ free and open-source applications you can deploy on Proxmox VE.
Each entry includes what it does, typical resources, and deployment type (VM/LXC/Docker).

> Use SuperProxmox bundles or skills to deploy these. Ask your AI assistant:
> *"Deploy Nextcloud on my Proxmox server"* — it will use the right tools.

---

## Table of Contents

- [Operating Systems & NAS](#operating-systems--nas)
- [Containers & Orchestration](#containers--orchestration)
- [Git & DevOps](#git--devops)
- [Reverse Proxy & Networking](#reverse-proxy--networking)
- [DNS & Ad Blocking](#dns--ad-blocking)
- [VPN & Remote Access](#vpn--remote-access)
- [Monitoring & Observability](#monitoring--observability)
- [Backup & Disaster Recovery](#backup--disaster-recovery)
- [Media & Entertainment](#media--entertainment)
- [Cloud & File Storage](#cloud--file-storage)
- [Smart Home & IoT](#smart-home--iot)
- [Databases](#databases)
- [Web Servers & CMS](#web-servers--cms)
- [Communication & Collaboration](#communication--collaboration)
- [Security](#security)
- [AI & Machine Learning](#ai--machine-learning)
- [Development Tools](#development-tools)
- [Dashboard & Management](#dashboard--management)
- [Download & Automation](#download--automation)
- [Misc / Utilities](#misc--utilities)

---

## Operating Systems & NAS

| Name | Description | Deploy | Resources |
|------|-------------|--------|-----------|
| [TrueNAS SCALE](https://www.truenas.com/) | ZFS-based NAS with SMB/NFS, Docker apps | VM | 2 CPU, 8GB+ |
| [TrueNAS CORE](https://www.truenas.com/) | FreeBSD ZFS NAS (legacy, stable) | VM | 2 CPU, 8GB+ |
| [OpenMediaVault](https://www.openmediavault.org/) | Debian-based NAS, simpler than TrueNAS | VM/LXC | 1 CPU, 1GB |
| [Unraid](https://unraid.net/) | Flexible NAS/hypervisor (paid, but popular) | VM | 2 CPU, 4GB |
| [CasaOS](https://casaos.io/) | Elegant personal cloud OS | LXC | 1 CPU, 1GB |
| [Cosmos Cloud](https://cosmos-cloud.io/) | Self-hosted cloud platform | Docker | 1 CPU, 1GB |
| [Debian](https://www.debian.org/) | Universal server OS | VM/LXC | 1 CPU, 512MB |
| [Ubuntu Server](https://ubuntu.com/server) | Popular server OS | VM/LXC | 1 CPU, 1GB |
| [Alpine Linux](https://alpinelinux.org/) | Ultra-lightweight Linux (5MB) | LXC | 1 CPU, 128MB |
| [Rocky Linux](https://rockylinux.org/) | RHEL-compatible enterprise Linux | VM | 1 CPU, 1GB |

## Containers & Orchestration

| Name | Description | Deploy | Resources |
|------|-------------|--------|-----------|
| [Docker](https://www.docker.com/) | Container runtime | LXC/VM | 1 CPU, 1GB |
| [Portainer](https://www.portainer.io/) | Docker/K8s web management UI | Docker | 1 CPU, 512MB |
| [Dokploy](https://dokploy.com/) | Self-hosted PaaS (Vercel alternative) | Docker | 2 CPU, 4GB |
| [Coolify](https://coolify.io/) | Self-hosted Heroku/Netlify alternative | Docker | 2 CPU, 2GB |
| [CapRover](https://caprover.com/) | PaaS with one-click apps | Docker | 1 CPU, 1GB |
| [Kubernetes (K3s)](https://k3s.io/) | Lightweight Kubernetes | VM | 2 CPU, 2GB |
| [Rancher](https://rancher.com/) | Kubernetes management platform | Docker | 2 CPU, 4GB |
| [Yacht](https://yacht.sh/) | Simple Docker web UI | Docker | 1 CPU, 256MB |
| [Dockge](https://github.com/louislam/dockge) | Docker Compose manager UI | Docker | 1 CPU, 256MB |

## Git & DevOps

| Name | Description | Deploy | Resources |
|------|-------------|--------|-----------|
| [Gitea](https://gitea.com/) | Lightweight Git server (Go) | LXC/Docker | 1 CPU, 512MB |
| [Forgejo](https://forgejo.org/) | Gitea fork, community-driven | LXC/Docker | 1 CPU, 512MB |
| [GitLab CE](https://about.gitlab.com/) | Full DevOps platform | VM | 4 CPU, 8GB |
| [OneDev](https://onedev.io/) | All-in-one DevOps platform | Docker | 2 CPU, 2GB |
| [Drone CI](https://www.drone.io/) | Container-native CI/CD | Docker | 1 CPU, 512MB |
| [Woodpecker CI](https://woodpecker-ci.org/) | Simple CI engine (Drone fork) | Docker | 1 CPU, 256MB |
| [Jenkins](https://www.jenkins.io/) | Automation server (CI/CD) | Docker/VM | 2 CPU, 2GB |
| [Gitea Actions](https://docs.gitea.com/usage/actions/overview) | GitHub Actions compatible CI | Docker | 1 CPU, 512MB |
| [n8n](https://n8n.io/) | Workflow automation (Zapier alternative) | Docker | 1 CPU, 512MB |
| [Ansible Semaphore](https://semaphoreui.com/) | Ansible UI/runner | Docker | 1 CPU, 256MB |

## Reverse Proxy & Networking

| Name | Description | Deploy | Resources |
|------|-------------|--------|-----------|
| [Nginx Proxy Manager](https://nginxproxymanager.com/) | Reverse proxy with UI and auto-SSL | Docker | 1 CPU, 256MB |
| [Traefik](https://traefik.io/) | Cloud-native reverse proxy | Docker | 1 CPU, 128MB |
| [Caddy](https://caddyserver.com/) | Auto-HTTPS web server | Docker/LXC | 1 CPU, 128MB |
| [HAProxy](https://www.haproxy.org/) | High-performance load balancer | LXC | 1 CPU, 128MB |
| [Nginx](https://nginx.org/) | Web server / reverse proxy | LXC/Docker | 1 CPU, 128MB |
| [Cloudflare Tunnels](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/) | Zero-trust tunnel (no port forwarding) | Docker | 1 CPU, 128MB |
| [frp](https://github.com/fatedier/frp) | Fast reverse proxy for NAT traversal | Docker | 1 CPU, 64MB |

## DNS & Ad Blocking

| Name | Description | Deploy | Resources |
|------|-------------|--------|-----------|
| [AdGuard Home](https://adguard.com/adguard-home.html) | DNS + ad blocker with web UI | LXC/Docker | 1 CPU, 128MB |
| [Pi-hole](https://pi-hole.net/) | Network-wide ad blocker | LXC/Docker | 1 CPU, 128MB |
| [Blocky](https://github.com/0xERR0R/blocky) | Fast DNS proxy and ad blocker | Docker | 1 CPU, 64MB |
| [Technitium DNS](https://technitium.com/dns/) | Full DNS server with web UI | Docker | 1 CPU, 256MB |
| [CoreDNS](https://coredns.io/) | Flexible DNS server (K8s default) | Docker | 1 CPU, 64MB |

## VPN & Remote Access

| Name | Description | Deploy | Resources |
|------|-------------|--------|-----------|
| [Tailscale](https://tailscale.com/) | Mesh VPN (WireGuard-based) | LXC | 1 CPU, 256MB |
| [WireGuard](https://www.wireguard.com/) | Modern, fast VPN | LXC | 1 CPU, 128MB |
| [Headscale](https://github.com/juanfont/headscale) | Self-hosted Tailscale control server | Docker | 1 CPU, 128MB |
| [wg-easy](https://github.com/wg-easy/wg-easy) | WireGuard with web UI | Docker | 1 CPU, 128MB |
| [OpenVPN](https://openvpn.net/) | Battle-tested VPN | LXC/VM | 1 CPU, 256MB |
| [Firezone](https://www.firezone.dev/) | WireGuard VPN with web UI | Docker | 1 CPU, 512MB |
| [Netbird](https://netbird.io/) | P2P VPN with SSO | Docker | 1 CPU, 256MB |
| [Guacamole](https://guacamole.apache.org/) | Clientless remote desktop (RDP/VNC/SSH in browser) | Docker | 1 CPU, 512MB |
| [RustDesk](https://rustdesk.com/) | Self-hosted TeamViewer alternative | Docker | 1 CPU, 256MB |
| [MeshCentral](https://meshcentral.com/) | Remote device management | Docker | 1 CPU, 512MB |

## Monitoring & Observability

| Name | Description | Deploy | Resources |
|------|-------------|--------|-----------|
| [Grafana](https://grafana.com/) | Dashboards and visualization | Docker | 1 CPU, 512MB |
| [Prometheus](https://prometheus.io/) | Metrics collection and alerting | Docker | 1 CPU, 512MB |
| [Uptime Kuma](https://github.com/louislam/uptime-kuma) | Uptime monitoring with notifications | Docker | 1 CPU, 256MB |
| [Netdata](https://www.netdata.cloud/) | Real-time performance monitoring | LXC/Docker | 1 CPU, 256MB |
| [Zabbix](https://www.zabbix.com/) | Enterprise monitoring | Docker/VM | 2 CPU, 2GB |
| [Gatus](https://gatus.io/) | Health dashboard | Docker | 1 CPU, 64MB |
| [Beszel](https://github.com/henrygd/beszel) | Lightweight server monitoring | Docker | 1 CPU, 128MB |
| [Dozzle](https://dozzle.dev/) | Real-time Docker log viewer | Docker | 1 CPU, 64MB |
| [Loki](https://grafana.com/oss/loki/) | Log aggregation (Grafana stack) | Docker | 1 CPU, 256MB |
| [Checkmk](https://checkmk.com/) | IT monitoring | Docker | 2 CPU, 2GB |

## Backup & Disaster Recovery

| Name | Description | Deploy | Resources |
|------|-------------|--------|-----------|
| [Proxmox Backup Server](https://www.proxmox.com/en/proxmox-backup-server) | Incremental backup with dedup | VM | 2 CPU, 2GB |
| [Restic](https://restic.net/) | Fast, encrypted backup | LXC/Docker | 1 CPU, 256MB |
| [BorgBackup](https://www.borgbackup.org/) | Deduplicating backup | LXC | 1 CPU, 256MB |
| [Duplicati](https://www.duplicati.com/) | Backup to cloud with encryption | Docker | 1 CPU, 256MB |
| [Kopia](https://kopia.io/) | Fast backup with web UI | Docker | 1 CPU, 256MB |
| [Syncthing](https://syncthing.net/) | P2P file sync | Docker/LXC | 1 CPU, 128MB |
| [Rsync](https://rsync.samba.org/) | File sync utility | LXC | 1 CPU, 64MB |

## Media & Entertainment

| Name | Description | Deploy | Resources |
|------|-------------|--------|-----------|
| [Jellyfin](https://jellyfin.org/) | Free media server (Plex alternative) | Docker/LXC | 2 CPU, 2GB |
| [Plex](https://www.plex.tv/) | Media server (freemium) | Docker | 2 CPU, 2GB |
| [Emby](https://emby.media/) | Media server | Docker | 2 CPU, 2GB |
| [Navidrome](https://www.navidrome.org/) | Music streaming server | Docker | 1 CPU, 256MB |
| [Audiobookshelf](https://www.audiobookshelf.org/) | Audiobook/podcast server | Docker | 1 CPU, 256MB |
| [Kavita](https://www.kavitareader.com/) | eBook/manga reader | Docker | 1 CPU, 256MB |
| [Calibre-Web](https://github.com/janeczku/calibre-web) | eBook library with web UI | Docker | 1 CPU, 256MB |
| [Immich](https://immich.app/) | Google Photos alternative | Docker | 2 CPU, 4GB |
| [PhotoPrism](https://www.photoprism.app/) | AI-powered photo management | Docker | 2 CPU, 4GB |
| [Stash](https://stashapp.cc/) | Media organizer with scraping | Docker | 2 CPU, 2GB |
| [Sonarr](https://sonarr.tv/) | TV show automation | Docker | 1 CPU, 256MB |
| [Radarr](https://radarr.video/) | Movie automation | Docker | 1 CPU, 256MB |
| [Prowlarr](https://prowlarr.com/) | Indexer manager (Sonarr/Radarr) | Docker | 1 CPU, 128MB |
| [qBittorrent](https://www.qbittorrent.org/) | BitTorrent client with web UI | Docker | 1 CPU, 256MB |
| [Transmission](https://transmissionbt.com/) | Lightweight torrent client | Docker | 1 CPU, 128MB |

## Cloud & File Storage

| Name | Description | Deploy | Resources |
|------|-------------|--------|-----------|
| [Nextcloud](https://nextcloud.com/) | Personal cloud (files, calendar, contacts) | Docker/VM | 2 CPU, 2GB |
| [Seafile](https://www.seafile.com/) | Fast file sync & share | Docker | 1 CPU, 1GB |
| [MinIO](https://min.io/) | S3-compatible object storage | Docker | 1 CPU, 1GB |
| [FileRun](https://filerun.com/) | File manager with web UI | Docker | 1 CPU, 512MB |
| [Filebrowser](https://filebrowser.org/) | Simple file manager web UI | Docker | 1 CPU, 64MB |
| [ownCloud](https://owncloud.com/) | File hosting platform | Docker | 2 CPU, 2GB |
| [Paperless-ngx](https://docs.paperless-ngx.com/) | Document management with OCR | Docker | 1 CPU, 1GB |
| [SFTPGo](https://sftpgo.com/) | SFTP/FTP/WebDAV server | Docker | 1 CPU, 128MB |

## Smart Home & IoT

| Name | Description | Deploy | Resources |
|------|-------------|--------|-----------|
| [Home Assistant](https://www.home-assistant.io/) | Home automation hub | VM/Docker | 2 CPU, 2GB |
| [Zigbee2MQTT](https://www.zigbee2mqtt.io/) | Zigbee to MQTT bridge | Docker | 1 CPU, 128MB |
| [Mosquitto](https://mosquitto.org/) | MQTT message broker | Docker | 1 CPU, 64MB |
| [Node-RED](https://nodered.org/) | Visual automation flows | Docker | 1 CPU, 256MB |
| [ESPHome](https://esphome.io/) | ESP32/ESP8266 firmware builder | Docker | 1 CPU, 256MB |
| [Scrypted](https://www.scrypted.app/) | Smart home camera hub | Docker | 2 CPU, 2GB |
| [Frigate](https://frigate.video/) | NVR with AI object detection | Docker | 2 CPU, 4GB |

## Databases

| Name | Description | Deploy | Resources |
|------|-------------|--------|-----------|
| [PostgreSQL](https://www.postgresql.org/) | Advanced relational database | Docker/LXC | 1 CPU, 512MB |
| [MySQL/MariaDB](https://mariadb.org/) | Popular relational database | Docker/LXC | 1 CPU, 512MB |
| [MongoDB](https://www.mongodb.com/) | NoSQL document database | Docker | 1 CPU, 1GB |
| [Redis](https://redis.io/) | In-memory key-value store | Docker | 1 CPU, 128MB |
| [InfluxDB](https://www.influxdata.com/) | Time-series database | Docker | 1 CPU, 512MB |
| [SQLite](https://www.sqlite.org/) | Embedded database | any | 0 |
| [Valkey](https://valkey.io/) | Redis fork (open-source) | Docker | 1 CPU, 128MB |

## Web Servers & CMS

| Name | Description | Deploy | Resources |
|------|-------------|--------|-----------|
| [WordPress](https://wordpress.org/) | World's most popular CMS | Docker | 1 CPU, 512MB |
| [Ghost](https://ghost.org/) | Modern publishing platform | Docker | 1 CPU, 512MB |
| [Hugo](https://gohugo.io/) | Static site generator | Docker | 1 CPU, 128MB |
| [Wiki.js](https://js.wiki/) | Modern wiki with Git sync | Docker | 1 CPU, 512MB |
| [BookStack](https://www.bookstackapp.com/) | Knowledge base / wiki | Docker | 1 CPU, 512MB |
| [Outline](https://www.getoutline.com/) | Team knowledge base (Notion-like) | Docker | 1 CPU, 1GB |
| [Docmost](https://docmost.com/) | Wiki & docs (Notion alternative) | Docker | 1 CPU, 512MB |
| [Plausible](https://plausible.io/) | Privacy-friendly analytics | Docker | 1 CPU, 512MB |
| [Umami](https://umami.is/) | Simple web analytics | Docker | 1 CPU, 256MB |

## Communication & Collaboration

| Name | Description | Deploy | Resources |
|------|-------------|--------|-----------|
| [Matrix (Synapse)](https://matrix.org/) | Decentralized chat (Slack/Discord alt) | Docker | 1 CPU, 1GB |
| [Element](https://element.io/) | Matrix web client | Docker | 1 CPU, 256MB |
| [Rocket.Chat](https://www.rocket.chat/) | Team communication platform | Docker | 2 CPU, 2GB |
| [Mattermost](https://mattermost.com/) | Slack alternative | Docker | 2 CPU, 2GB |
| [Jitsi Meet](https://jitsi.org/) | Video conferencing | Docker | 2 CPU, 2GB |
| [Vaultwarden](https://github.com/dani-garcia/vaultwarden) | Bitwarden-compatible password vault | Docker | 1 CPU, 128MB |
| [Authentik](https://goauthentik.io/) | Identity provider (SSO/OAuth) | Docker | 1 CPU, 1GB |
| [Keycloak](https://www.keycloak.org/) | Enterprise IAM / SSO | Docker | 2 CPU, 1GB |
| [Mailu](https://mailu.io/) | Full mail server | Docker | 1 CPU, 1GB |
| [Stalwart Mail](https://stalw.art/) | Modern all-in-one mail server | Docker | 1 CPU, 512MB |

## Security

| Name | Description | Deploy | Resources |
|------|-------------|--------|-----------|
| [Wazuh](https://wazuh.com/) | Security monitoring / SIEM | Docker/VM | 4 CPU, 8GB |
| [CrowdSec](https://www.crowdsec.net/) | Collaborative intrusion prevention | Docker | 1 CPU, 128MB |
| [Fail2ban](https://www.fail2ban.org/) | Brute-force protection | LXC | 1 CPU, 64MB |
| [pfSense](https://www.pfsense.org/) | Firewall/router | VM | 1 CPU, 1GB |
| [OPNsense](https://opnsense.org/) | Firewall/router (pfSense fork) | VM | 1 CPU, 1GB |
| [OpenWrt](https://openwrt.org/) | Router OS | VM | 1 CPU, 256MB |
| [Nessus Essentials](https://www.tenable.com/products/nessus/nessus-essentials) | Vulnerability scanner (free 16 IPs) | VM | 2 CPU, 2GB |
| [Greenbone/OpenVAS](https://www.greenbone.net/) | Vulnerability scanner | Docker | 2 CPU, 4GB |

## AI & Machine Learning

| Name | Description | Deploy | Resources |
|------|-------------|--------|-----------|
| [Ollama](https://ollama.ai/) | Run LLMs locally (Llama, Gemma, etc) | Docker/LXC | 4 CPU, 8GB+ |
| [Open WebUI](https://openwebui.com/) | ChatGPT-like UI for local LLMs | Docker | 1 CPU, 1GB |
| [LocalAI](https://localai.io/) | OpenAI-compatible local API | Docker | 4 CPU, 8GB |
| [Stable Diffusion (Auto1111)](https://github.com/AUTOMATIC1111/stable-diffusion-webui) | AI image generation | VM (GPU) | 4 CPU, 12GB |
| [ComfyUI](https://github.com/comfyanonymous/ComfyUI) | Node-based AI image gen | VM (GPU) | 4 CPU, 12GB |
| [Whisper](https://github.com/openai/whisper) | Speech-to-text | Docker | 2 CPU, 4GB |

## Development Tools

| Name | Description | Deploy | Resources |
|------|-------------|--------|-----------|
| [VS Code Server](https://github.com/coder/code-server) | VS Code in browser | Docker | 2 CPU, 2GB |
| [Coder](https://coder.com/) | Remote development environments | Docker | 2 CPU, 4GB |
| [Sentry](https://sentry.io/) | Error tracking | Docker | 2 CPU, 4GB |
| [Sonarqube](https://www.sonarqube.org/) | Code quality analysis | Docker | 2 CPU, 4GB |
| [Verdaccio](https://verdaccio.org/) | Private npm registry | Docker | 1 CPU, 256MB |
| [Nexus](https://www.sonatype.com/products/repository-oss) | Artifact repository | Docker | 2 CPU, 2GB |
| [Hoppscotch](https://hoppscotch.io/) | API development platform (Postman alt) | Docker | 1 CPU, 256MB |
| [Minio Console](https://min.io/) | S3 API testing & management | Docker | 1 CPU, 256MB |

## Dashboard & Management

| Name | Description | Deploy | Resources |
|------|-------------|--------|-----------|
| [Homarr](https://homarr.dev/) | Homelab dashboard | Docker | 1 CPU, 256MB |
| [Homepage](https://gethomepage.dev/) | Application dashboard | Docker | 1 CPU, 128MB |
| [Dashy](https://dashy.to/) | Customizable dashboard | Docker | 1 CPU, 128MB |
| [Heimdall](https://heimdall.site/) | Application launcher | Docker | 1 CPU, 128MB |
| [Flame](https://github.com/pawelmalak/flame) | Startpage with bookmarks | Docker | 1 CPU, 64MB |
| [Organizr](https://organizr.app/) | Tab-based dashboard | Docker | 1 CPU, 128MB |
| [Glances](https://nicolargo.github.io/glances/) | System monitoring tool | Docker | 1 CPU, 64MB |

## Download & Automation

| Name | Description | Deploy | Resources |
|------|-------------|--------|-----------|
| [Overseerr](https://overseerr.dev/) | Media request management | Docker | 1 CPU, 256MB |
| [Requestrr](https://github.com/thomst08/requestrr) | Chatbot for media requests | Docker | 1 CPU, 128MB |
| [Bazarr](https://www.bazarr.media/) | Subtitle management | Docker | 1 CPU, 128MB |
| [Lidarr](https://lidarr.audio/) | Music collection manager | Docker | 1 CPU, 256MB |
| [Readarr](https://readarr.com/) | eBook collection manager | Docker | 1 CPU, 256MB |
| [SABnzbd](https://sabnzbd.org/) | Usenet downloader | Docker | 1 CPU, 256MB |
| [youtube-dl / yt-dlp](https://github.com/yt-dlp/yt-dlp) | Video downloader | Docker | 1 CPU, 128MB |
| [MeTube](https://github.com/alexta69/metube) | YouTube downloader with web UI | Docker | 1 CPU, 128MB |

## Misc / Utilities

| Name | Description | Deploy | Resources |
|------|-------------|--------|-----------|
| [Linkwarden](https://linkwarden.app/) | Bookmark manager | Docker | 1 CPU, 256MB |
| [Wallabag](https://wallabag.org/) | Read-it-later (Pocket alt) | Docker | 1 CPU, 256MB |
| [Stirling PDF](https://stirlingpdf.io/) | PDF tools (merge, split, OCR) | Docker | 1 CPU, 256MB |
| [IT Tools](https://it-tools.tech/) | Developer utilities web app | Docker | 1 CPU, 64MB |
| [ChangeDetection](https://changedetection.io/) | Website change monitoring | Docker | 1 CPU, 128MB |
| [Pastebin (PrivateBin)](https://privatebin.info/) | Self-hosted paste service | Docker | 1 CPU, 64MB |
| [Excalidraw](https://excalidraw.com/) | Whiteboard / diagram tool | Docker | 1 CPU, 128MB |
| [Penpot](https://penpot.app/) | Design platform (Figma alt) | Docker | 2 CPU, 2GB |
| [Planka](https://planka.app/) | Kanban board (Trello alt) | Docker | 1 CPU, 256MB |
| [Vikunja](https://vikunja.io/) | Task management (Todoist alt) | Docker | 1 CPU, 256MB |
| [Mealie](https://mealie.io/) | Recipe manager | Docker | 1 CPU, 256MB |
| [Actual Budget](https://actualbudget.org/) | Personal finance | Docker | 1 CPU, 128MB |
| [Monica](https://www.monicahq.com/) | Personal CRM | Docker | 1 CPU, 256MB |
| [LibreTranslate](https://libretranslate.com/) | Self-hosted translation | Docker | 2 CPU, 2GB |
| [Ntfy](https://ntfy.sh/) | Push notifications server | Docker | 1 CPU, 64MB |
| [Gotify](https://gotify.net/) | Push notification server | Docker | 1 CPU, 64MB |
| [Speedtest Tracker](https://github.com/alexjustesen/speedtest-tracker) | Internet speed logging | Docker | 1 CPU, 128MB |

---

## Quick Deploy with SuperProxmox

Tell your AI assistant any of these:

```
"Deploy Jellyfin media server on my Proxmox"
"Set up Nextcloud with 50GB storage"
"Create a WireGuard VPN container"
"Install Uptime Kuma for monitoring"
"Deploy the monitoring-stack bundle (Prometheus + Grafana)"
```

The AI will use SuperProxmox tools and skills to:
1. Check available resources
2. Create the right CT/VM
3. Install and configure the software
4. Verify it's running
5. Run security checklist

---

## Resources

- [awesome-selfhosted](https://github.com/awesome-selfhosted/awesome-selfhosted) — comprehensive list
- [awesome-homelab](https://github.com/miantiao-me/awesome-homelab) — curated homelab apps
- [Proxmox Helper Scripts](https://tteck.github.io/Proxmox/) — one-click install scripts
- [LinuxServer.io](https://www.linuxserver.io/) — standardized Docker images
