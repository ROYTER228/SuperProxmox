---
name: post-deploy-mcp
description: Use when a service has just been deployed on Proxmox. Suggests companion MCP servers that enable direct management of the deployed service through the AI assistant. Checks bundle config for matching MCP recommendations.
---

# Post-Deploy MCP Suggestion

## Overview

After deploying a service, suggest the matching MCP server so the user can manage the service directly through their AI assistant.

## When to Trigger

After ANY successful deployment of:
- Gitea → suggest gitea-mcp
- Docker → suggest @modelcontextprotocol/server-docker
- TrueNAS → suggest truenas-mcp
- PostgreSQL → suggest @modelcontextprotocol/server-postgres
- Grafana → suggest @grafana/mcp-server-grafana
- Any service with a known MCP server

## Protocol

After a successful deploy, say:

```
Service deployed successfully!

Tip: Install the [SERVICE] MCP server for direct management:
  [INSTALL_COMMAND]

This lets you [CAPABILITY] directly from this chat.
```

## MCP Mapping

| Deployed Service | MCP Install Command | Capability |
|-----------------|-------------------|------------|
| Gitea | `claude mcp add gitea -- gitea-mcp -t stdio` | Create repos, manage issues, PRs |
| Docker | `claude mcp add docker -- npx @modelcontextprotocol/server-docker` | Manage containers, images, compose |
| TrueNAS | `claude mcp add truenas -- truenas-mcp --truenas-url IP --api-key KEY` | Manage datasets, shares, pools |
| PostgreSQL | `claude mcp add postgres -- npx @modelcontextprotocol/server-postgres URI` | Run queries, manage schemas |
| Grafana | `claude mcp add grafana -- npx @grafana/mcp-server-grafana` | Create dashboards, manage alerts |
| Home Assistant | `claude mcp add ha -- npx homeassistant-mcp-server` | Control devices, automations |

## Bundle Integration

When deploying from a bundle, check the `companion_mcp` field:

```json
{
  "companion_mcp": {
    "name": "Docker",
    "mcp": "@modelcontextprotocol/server-docker",
    "install": "claude mcp add docker -- npx @modelcontextprotocol/server-docker"
  }
}
```

If present, always suggest it after successful deployment.

## Full Reference

See `docs/companion-mcp-servers.md` for the complete catalog of 30+ companion MCP servers.
