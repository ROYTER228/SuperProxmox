import { describe, it, expect, beforeEach } from 'vitest';
import { handle } from '../tools/ha.js';
import { createMockClient } from './helpers.js';
import type { ApiClient } from '../client.js';

describe('HA & Cluster Tools', () => {
  let client: ApiClient;
  beforeEach(() => { client = createMockClient(); });

  it('should add HA resource', async () => {
    await handle(client, 'pve_add_ha_resource', { sid: 'vm:100', state: 'started', max_restart: 3 });
    expect(client.post).toHaveBeenCalledWith('/cluster/ha/resources', { sid: 'vm:100', state: 'started', max_restart: 3 });
  });

  it('should get cluster next ID', async () => {
    await handle(client, 'pve_get_cluster_nextid', {});
    expect(client.get).toHaveBeenCalledWith('/cluster/nextid');
  });

  it('should create pool', async () => {
    await handle(client, 'pve_create_pool', { poolid: 'production', comment: 'Production VMs' });
    expect(client.post).toHaveBeenCalledWith('/pools', { poolid: 'production', comment: 'Production VMs' });
  });

  it('should reboot node', async () => {
    await handle(client, 'pve_node_reboot', { node: 'pve1' });
    expect(client.post).toHaveBeenCalledWith('/nodes/pve1/status', { command: 'reboot' });
  });

  it('should filter cluster resources by type', async () => {
    await handle(client, 'pve_get_cluster_resources', { type: 'vm' });
    expect(client.get).toHaveBeenCalledWith('/cluster/resources', { type: 'vm' });
  });
});
