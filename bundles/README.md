# Bundles — Ready-to-Deploy Infrastructure Templates

Pre-configured templates for common setups. Each bundle includes all parameters needed to create a fully functional VM or container in one step.

## Usage

Tell your AI assistant:
> "Deploy the docker-host bundle on node pve1"

The AI will read the bundle JSON and call the appropriate MCP tools.

## Available Bundles

| Bundle | Type | Description | Resources |
|--------|------|-------------|-----------|
| `tailscale-gateway` | LXC | Tailscale VPN subnet router | 1 CPU, 512MB, 4GB |
| `docker-host` | LXC | Docker + Compose ready | 4 CPU, 8GB, 32GB |
| `dokploy-paas` | LXC | Dokploy self-hosted PaaS | 4 CPU, 8GB, 32GB |
| `gitea-server` | LXC | Gitea Git server | 1 CPU, 1GB, 20GB |
| `truenas-nas` | VM | TrueNAS SCALE NAS | 2 CPU, 8GB, 32GB+data |
| `ubuntu-cloud` | VM | Ubuntu Server with cloud-init | 2 CPU, 4GB, 32GB |
| `nginx-proxy` | LXC | Nginx Proxy Manager | 1 CPU, 512MB, 4GB |
| `adguard-dns` | LXC | AdGuard Home DNS + ad blocker | 1 CPU, 256MB, 2GB |
| `minecraft-server` | LXC | Minecraft Java server | 2 CPU, 4GB, 20GB |
| `monitoring-stack` | LXC | Prometheus + Grafana | 2 CPU, 2GB, 20GB |
