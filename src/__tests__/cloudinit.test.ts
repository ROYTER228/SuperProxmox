import { describe, it, expect, beforeEach } from 'vitest';
import { handle } from '../tools/cloudinit.js';
import { createMockClient } from './helpers.js';
import type { ApiClient } from '../client.js';

describe('Cloud-Init Tools', () => {
  let client: ApiClient;
  beforeEach(() => { client = createMockClient(); });

  it('should set cloud-init config via VM config endpoint', async () => {
    await handle(client, 'pve_set_cloudinit', {
      node: 'pve1', vmid: 100,
      ciuser: 'ubuntu', cipassword: 'pass123',
      ipconfig0: 'ip=192.168.1.50/24,gw=192.168.1.1',
      nameserver: '8.8.8.8'
    });
    expect(client.put).toHaveBeenCalledWith('/nodes/pve1/qemu/100/config', {
      ciuser: 'ubuntu', cipassword: 'pass123',
      ipconfig0: 'ip=192.168.1.50/24,gw=192.168.1.1',
      nameserver: '8.8.8.8'
    });
  });

  it('should regenerate cloud-init image', async () => {
    await handle(client, 'pve_regenerate_cloudinit', { node: 'pve1', vmid: 100 });
    expect(client.put).toHaveBeenCalledWith('/nodes/pve1/qemu/100/cloudinit');
  });

  it('should dump cloud-init config', async () => {
    await handle(client, 'pve_get_cloudinit_dump', { node: 'pve1', vmid: 100, type: 'user' });
    expect(client.get).toHaveBeenCalledWith('/nodes/pve1/qemu/100/cloudinit/dump', { type: 'user' });
  });
});
