import { describe, it, expect, beforeEach } from 'vitest';
import { handle } from '../tools/firewall.js';
import { createMockClient } from './helpers.js';
import type { ApiClient } from '../client.js';

describe('Firewall Tools', () => {
  let client: ApiClient;
  beforeEach(() => { client = createMockClient(); });

  it('should get node-level firewall rules', async () => {
    await handle(client, 'pve_get_firewall_rules', { node: 'pve1' });
    expect(client.get).toHaveBeenCalledWith('/nodes/pve1/firewall/rules');
  });

  it('should get VM-level firewall rules', async () => {
    await handle(client, 'pve_get_firewall_rules', { node: 'pve1', vmid: 100, vmtype: 'qemu' });
    expect(client.get).toHaveBeenCalledWith('/nodes/pve1/qemu/100/firewall/rules');
  });

  it('should add firewall rule with all params', async () => {
    await handle(client, 'pve_add_firewall_rule', {
      node: 'pve1', action: 'ACCEPT', type: 'in',
      source: '192.168.3.0/24', dport: '22', proto: 'tcp', comment: 'SSH'
    });
    expect(client.post).toHaveBeenCalledWith('/nodes/pve1/firewall/rules', expect.objectContaining({
      action: 'ACCEPT', type: 'in', source: '192.168.3.0/24',
      dport: '22', proto: 'tcp', comment: 'SSH', enable: 1,
    }));
  });

  it('should delete firewall rule by position', async () => {
    await handle(client, 'pve_delete_firewall_rule', { node: 'pve1', pos: 3 });
    expect(client.del).toHaveBeenCalledWith('/nodes/pve1/firewall/rules/3');
  });

  it('should set firewall options', async () => {
    await handle(client, 'pve_set_firewall_options', { node: 'pve1', enable: 1, policy_in: 'DROP' });
    expect(client.put).toHaveBeenCalledWith('/nodes/pve1/firewall/options', { enable: 1, policy_in: 'DROP' });
  });
});
