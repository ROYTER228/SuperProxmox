import type { PveClient } from "../client.js";
import type { ToolDefinition } from "../types.js";
import { json } from "../utils.js";

export const tools: ToolDefinition[] = [
  { name: "pve_list_users", description: "List all users", inputSchema: { type: "object", properties: { full: { type: "boolean", description: "Include detailed info" } } } },
  { name: "pve_get_user", description: "Get user details", inputSchema: { type: "object", properties: { userid: { type: "string", description: "User ID (e.g. user@pam)" } }, required: ["userid"] } },
  { name: "pve_create_user", description: "Create a new user", inputSchema: { type: "object", properties: { userid: { type: "string", description: "User ID (e.g. user@pam)" }, password: { type: "string" }, comment: { type: "string" }, email: { type: "string" }, firstname: { type: "string" }, lastname: { type: "string" }, groups: { type: "string", description: "Comma-separated group list" }, enable: { type: "number", enum: [0, 1] } }, required: ["userid"] } },
  { name: "pve_update_user", description: "Update user settings", inputSchema: { type: "object", properties: { userid: { type: "string" }, comment: { type: "string" }, email: { type: "string" }, firstname: { type: "string" }, lastname: { type: "string" }, groups: { type: "string" }, enable: { type: "number", enum: [0, 1] } }, required: ["userid"] } },
  { name: "pve_delete_user", description: "⚠ DESTRUCTIVE: Delete a user. Confirm with user.", inputSchema: { type: "object", properties: { userid: { type: "string" } }, required: ["userid"] } },
  { name: "pve_change_password", description: "Change user password", inputSchema: { type: "object", properties: { userid: { type: "string" }, password: { type: "string" } }, required: ["userid", "password"] } },
  { name: "pve_list_roles", description: "List all permission roles", inputSchema: { type: "object", properties: {} } },
  { name: "pve_list_acl", description: "List access control entries", inputSchema: { type: "object", properties: {} } },
  { name: "pve_set_acl", description: "Set access control entry", inputSchema: { type: "object", properties: { path: { type: "string", description: "ACL path (e.g. /vms/100)" }, roles: { type: "string", description: "Role name" }, users: { type: "string", description: "User ID" }, groups: { type: "string", description: "Group name" }, propagate: { type: "number", enum: [0, 1] } }, required: ["path", "roles"] } },
  { name: "pve_list_api_tokens", description: "List API tokens for a user", inputSchema: { type: "object", properties: { userid: { type: "string" } }, required: ["userid"] } },
  { name: "pve_create_api_token", description: "Create API token for a user", inputSchema: { type: "object", properties: { userid: { type: "string" }, tokenid: { type: "string", description: "Token name" }, comment: { type: "string" }, privsep: { type: "number", enum: [0, 1], description: "Privilege separation (0=full access)" }, expire: { type: "number", description: "Expiry timestamp (0=never)" } }, required: ["userid", "tokenid"] } },
  { name: "pve_delete_api_token", description: "⚠ DESTRUCTIVE: Delete API token. May break integrations. Confirm.", inputSchema: { type: "object", properties: { userid: { type: "string" }, tokenid: { type: "string" } }, required: ["userid", "tokenid"] } },
];

export async function handle(client: PveClient, name: string, args: Record<string, unknown>): Promise<string> {
  switch (name) {
    case "pve_list_users": return json(await client.get("/access/users", args.full ? { full: 1 } : undefined));
    case "pve_get_user": return json(await client.get(`/access/users/${args.userid}`));
    case "pve_create_user": {
      const data: Record<string, unknown> = { userid: args.userid };
      for (const k of ["password", "comment", "email", "firstname", "lastname", "groups", "enable"]) if (args[k] !== undefined) data[k] = args[k];
      await client.post("/access/users", data);
      return `User ${args.userid} created.`;
    }
    case "pve_update_user": {
      const data: Record<string, unknown> = {};
      for (const k of ["comment", "email", "firstname", "lastname", "groups", "enable"]) if (args[k] !== undefined) data[k] = args[k];
      await client.put(`/access/users/${args.userid}`, data);
      return `User ${args.userid} updated.`;
    }
    case "pve_delete_user": await client.del(`/access/users/${args.userid}`); return `User ${args.userid} deleted.`;
    case "pve_change_password": await client.put("/access/password", { userid: args.userid, password: args.password }); return "Password changed.";
    case "pve_list_roles": return json(await client.get("/access/roles"));
    case "pve_list_acl": return json(await client.get("/access/acl"));
    case "pve_set_acl": {
      const data: Record<string, unknown> = { path: args.path, roles: args.roles };
      if (args.users) data.users = args.users;
      if (args.groups) data.groups = args.groups;
      data.propagate = args.propagate ?? 1;
      await client.put("/access/acl", data);
      return "ACL updated.";
    }
    case "pve_list_api_tokens": return json(await client.get(`/access/users/${args.userid}/token`));
    case "pve_create_api_token": {
      const data: Record<string, unknown> = {};
      if (args.comment) data.comment = args.comment;
      data.privsep = args.privsep ?? 1;
      if (args.expire) data.expire = args.expire;
      const result = await client.post(`/access/users/${args.userid}/token/${args.tokenid}`, data);
      return `Token created. ${json(result)}`;
    }
    case "pve_delete_api_token": await client.del(`/access/users/${args.userid}/token/${args.tokenid}`); return `Token ${args.tokenid} deleted.`;
    default: throw new Error(`Unknown users tool: ${name}`);
  }
}
