import { describe, it, expect, beforeEach } from 'vitest';
import { handle } from '../tools/users.js';
import { createMockClient } from './helpers.js';
import type { ApiClient } from '../client.js';

describe('Users Tools', () => {
  let client: ApiClient;
  beforeEach(() => { client = createMockClient(); });

  it('should create user with all fields', async () => {
    await handle(client, 'pve_create_user', {
      userid: 'test@pam', password: 'pass', email: 'test@test.com', comment: 'Test user'
    });
    expect(client.post).toHaveBeenCalledWith('/access/users', {
      userid: 'test@pam', password: 'pass', email: 'test@test.com', comment: 'Test user'
    });
  });

  it('should set ACL with propagate default', async () => {
    await handle(client, 'pve_set_acl', { path: '/vms/100', roles: 'PVEVMUser', users: 'test@pam' });
    expect(client.put).toHaveBeenCalledWith('/access/acl', {
      path: '/vms/100', roles: 'PVEVMUser', users: 'test@pam', propagate: 1
    });
  });

  it('should create API token', async () => {
    await handle(client, 'pve_create_api_token', { userid: 'root@pam', tokenid: 'mcp', privsep: 0 });
    expect(client.post).toHaveBeenCalledWith('/access/users/root@pam/token/mcp', expect.objectContaining({ privsep: 0 }));
  });

  it('should change password', async () => {
    await handle(client, 'pve_change_password', { userid: 'test@pam', password: 'newpass' });
    expect(client.put).toHaveBeenCalledWith('/access/password', { userid: 'test@pam', password: 'newpass' });
  });
});
