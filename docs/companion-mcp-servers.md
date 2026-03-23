# Companion MCP Servers

When you deploy a service via SuperProxmox, install the matching MCP server to manage it directly through your AI assistant.

> After deploying a service, SuperProxmox will suggest the relevant MCP server.
> Install it to get full control over the service without leaving your AI assistant.

---

## How It Works

```
1. You: "Deploy Gitea on my Proxmox"
2. SuperProxmox: Creates CT, installs Gitea ✓
3. SuperProxmox: "Gitea is running! Install Gitea MCP for full control:"
   → npx skills add gitea/gitea-mcp
4. Now you can: "Create a repo called my-project" — directly via MCP
```

---

## MCP Server Catalog

### Git & DevOps

| Service | MCP Server | Install | Source |
|---------|-----------|---------|--------|
| **Gitea** | gitea-mcp | `claude mcp add gitea -- gitea-mcp -t stdio` | [gitea/gitea-mcp](https://gitea.com/gitea/gitea-mcp) |
| **GitHub** | github-mcp | `claude mcp add github -- npx @modelcontextprotocol/server-github` | [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) |
| **GitLab** | gitlab-mcp | `claude mcp add gitlab -- npx @modelcontextprotocol/server-gitlab` | [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) |

### Storage & NAS

| Service | MCP Server | Install | Source |
|---------|-----------|---------|--------|
| **TrueNAS** | truenas-mcp | `claude mcp add truenas -- truenas-mcp --truenas-url IP --api-key KEY` | [truenas/truenas-mcp](https://github.com/truenas/truenas-mcp) |
| **MinIO (S3)** | s3-mcp | `claude mcp add s3 -- npx @anthropic/mcp-server-s3` | [anthropic/mcp-servers](https://github.com/anthropics/mcp-servers) |

### Databases

| Service | MCP Server | Install | Source |
|---------|-----------|---------|--------|
| **PostgreSQL** | postgres-mcp | `claude mcp add postgres -- npx @modelcontextprotocol/server-postgres postgresql://...` | [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) |
| **MySQL/MariaDB** | mysql-mcp | `claude mcp add mysql -- npx @benborla29/mcp-server-mysql` | [benborla29/mcp-server-mysql](https://github.com/benborla29/mcp-server-mysql) |
| **MongoDB** | mongo-mcp | `claude mcp add mongo -- npx mcp-mongo-server mongodb://...` | [kiliczsh/mcp-mongo-server](https://github.com/kiliczsh/mcp-mongo-server) |
| **Redis** | redis-mcp | `claude mcp add redis -- npx redis-mcp-server` | npm: redis-mcp-server |
| **SQLite** | sqlite-mcp | `claude mcp add sqlite -- npx @modelcontextprotocol/server-sqlite /path/to/db` | [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) |
| **InfluxDB** | influxdb-mcp | `claude mcp add influxdb -- npx influxdb-mcp-server` | npm: influxdb-mcp-server |

### Containers & Orchestration

| Service | MCP Server | Install | Source |
|---------|-----------|---------|--------|
| **Docker** | docker-mcp | `claude mcp add docker -- npx @modelcontextprotocol/server-docker` | [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) |
| **Kubernetes** | k8s-mcp | `claude mcp add k8s -- npx kubernetes-mcp-server` | npm: kubernetes-mcp-server |

### Monitoring & Observability

| Service | MCP Server | Install | Source |
|---------|-----------|---------|--------|
| **Grafana** | grafana-mcp | `claude mcp add grafana -- npx @grafana/mcp-server-grafana` | [grafana/mcp-server-grafana](https://github.com/grafana/mcp-server-grafana) |
| **Prometheus** | prometheus-mcp | `claude mcp add prometheus -- npx prometheus-mcp-server` | npm: prometheus-mcp-server |
| **Sentry** | sentry-mcp | `claude mcp add sentry -- npx @sentry/mcp-server` | [getsentry/sentry-mcp](https://github.com/getsentry/sentry-mcp) |

### Cloud & Infrastructure

| Service | MCP Server | Install | Source |
|---------|-----------|---------|--------|
| **Proxmox VE** | super-proxmox | You're already using it! | [ROYTER228/SuperProxmox](https://github.com/ROYTER228/SuperProxmox) |
| **Cloudflare** | cloudflare-mcp | `claude mcp add cloudflare -- npx @cloudflare/mcp-server-cloudflare` | [cloudflare/mcp-server-cloudflare](https://github.com/cloudflare/mcp-server-cloudflare) |
| **Terraform** | terraform-mcp | `claude mcp add terraform -- npx terraform-mcp-server` | npm: terraform-mcp-server |
| **Ansible** | ansible-mcp | `claude mcp add ansible -- npx ansible-mcp-server` | npm: ansible-mcp-server |

### Communication

| Service | MCP Server | Install | Source |
|---------|-----------|---------|--------|
| **Slack** | slack-mcp | `claude mcp add slack -- npx @modelcontextprotocol/server-slack` | [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) |
| **Telegram** | telegram-mcp | `claude mcp add telegram -- npx telegram-mcp-server` | npm: telegram-mcp-server |

### Smart Home

| Service | MCP Server | Install | Source |
|---------|-----------|---------|--------|
| **Home Assistant** | ha-mcp | `claude mcp add homeassistant -- npx homeassistant-mcp-server` | npm: homeassistant-mcp-server |

### AI & LLM

| Service | MCP Server | Install | Source |
|---------|-----------|---------|--------|
| **Ollama** | ollama-mcp | `claude mcp add ollama -- npx ollama-mcp-server` | npm: ollama-mcp-server |

### Utilities

| Service | MCP Server | Install | Source |
|---------|-----------|---------|--------|
| **File System** | filesystem-mcp | `claude mcp add fs -- npx @modelcontextprotocol/server-filesystem /path` | [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) |
| **Git** | git-mcp | `claude mcp add git -- npx @modelcontextprotocol/server-git` | [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) |
| **Fetch (HTTP)** | fetch-mcp | `claude mcp add fetch -- npx @modelcontextprotocol/server-fetch` | [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) |
| **Puppeteer** | puppeteer-mcp | `claude mcp add puppeteer -- npx @modelcontextprotocol/server-puppeteer` | [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) |

---

## Bundle → MCP Mapping

When SuperProxmox deploys a bundle, it suggests the matching MCP:

| Bundle | Deployed Service | Suggested MCP |
|--------|-----------------|---------------|
| `tailscale-gateway` | Tailscale VPN | — (managed via Tailscale admin) |
| `docker-host` | Docker CE | `@modelcontextprotocol/server-docker` |
| `dokploy-paas` | Dokploy + Docker | `@modelcontextprotocol/server-docker` |
| `gitea-server` | Gitea | `gitea-mcp` |
| `truenas-nas` | TrueNAS SCALE | `truenas-mcp` |
| `ubuntu-cloud` | Ubuntu Server | `@modelcontextprotocol/server-filesystem` |
| `adguard-dns` | AdGuard Home | — (web UI only) |
| `nginx-proxy` | Nginx Proxy Manager | — (web UI only) |
| `minecraft-server` | Minecraft | — (RCON) |
| `monitoring-stack` | Prometheus + Grafana | `@grafana/mcp-server-grafana` |

---

## Example: Full Stack with MCPs

```json
{
  "mcpServers": {
    "superproxmox": {
      "command": "node",
      "args": ["./SuperProxmox/dist/index.js"],
      "env": { "PVE_URL": "https://10.0.0.1:8006", "PVE_PASSWORD": "pass" }
    },
    "truenas": {
      "command": "truenas-mcp",
      "args": ["--truenas-url", "10.0.0.2", "--api-key", "KEY"]
    },
    "gitea": {
      "command": "gitea-mcp",
      "args": ["-t", "stdio"],
      "env": { "GITEA_HOST": "http://10.0.0.3:3000", "GITEA_ACCESS_TOKEN": "TOKEN" }
    },
    "docker": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-docker"]
    },
    "grafana": {
      "command": "npx",
      "args": ["@grafana/mcp-server-grafana"],
      "env": { "GRAFANA_URL": "http://10.0.0.4:3000", "GRAFANA_API_KEY": "KEY" }
    }
  }
}
```

Now your AI assistant can:
- Create VMs/containers (SuperProxmox)
- Manage NAS storage (TrueNAS MCP)
- Create Git repos and manage code (Gitea MCP)
- Deploy Docker containers (Docker MCP)
- Build monitoring dashboards (Grafana MCP)

All from one conversation.
