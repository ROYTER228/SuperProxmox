import { describe, it, expect, beforeEach } from 'vitest';
import { handle } from '../tools/network.js';
import { createMockClient } from './helpers.js';
import type { ApiClient } from '../client.js';

describe('Network Tools', () => {
  let client: ApiClient;
  beforeEach(() => { client = createMockClient(); });

  it('should create bridge with autostart', async () => {
    await handle(client, 'pve_create_network', {
      node: 'pve1', iface: 'vmbr1', type: 'bridge',
      cidr: '10.0.0.1/24', bridge_ports: 'eno2'
    });
    expect(client.post).toHaveBeenCalledWith('/nodes/pve1/network', expect.objectContaining({
      iface: 'vmbr1', type: 'bridge', cidr: '10.0.0.1/24',
      bridge_ports: 'eno2', autostart: 1,
    }));
  });

  it('should return apply reminder after create', async () => {
    const result = await handle(client, 'pve_create_network', { node: 'pve1', iface: 'vmbr1', type: 'bridge' });
    expect(result).toContain('pve_apply_network');
  });

  it('should set DNS', async () => {
    await handle(client, 'pve_set_dns', { node: 'pve1', dns1: '8.8.8.8', dns2: '1.1.1.1' });
    expect(client.put).toHaveBeenCalledWith('/nodes/pve1/dns', { dns1: '8.8.8.8', dns2: '1.1.1.1' });
  });

  it('should apply network changes', async () => {
    await handle(client, 'pve_apply_network', { node: 'pve1' });
    expect(client.put).toHaveBeenCalledWith('/nodes/pve1/network');
  });

  it('should revert pending changes', async () => {
    await handle(client, 'pve_revert_network', { node: 'pve1' });
    expect(client.del).toHaveBeenCalledWith('/nodes/pve1/network');
  });
});
