import { describe, it, expect, beforeEach } from 'vitest';
import { handle } from '../tools/monitoring.js';
import { createMockClient } from './helpers.js';
import type { ApiClient } from '../client.js';

describe('Monitoring Tools', () => {
  let client: ApiClient;
  beforeEach(() => { client = createMockClient(); });

  it('should get RRD data with default timeframe', async () => {
    await handle(client, 'pve_get_rrddata', { node: 'pve1' });
    expect(client.get).toHaveBeenCalledWith('/nodes/pve1/rrddata', { timeframe: 'hour' });
  });

  it('should get syslog with limit', async () => {
    await handle(client, 'pve_get_syslog', { node: 'pve1', limit: 100 });
    expect(client.get).toHaveBeenCalledWith('/nodes/pve1/syslog', expect.objectContaining({ limit: 100 }));
  });

  it('should set timezone', async () => {
    await handle(client, 'pve_set_time', { node: 'pve1', timezone: 'Europe/Moscow' });
    expect(client.put).toHaveBeenCalledWith('/nodes/pve1/time', { timezone: 'Europe/Moscow' });
  });

  it('should restart service', async () => {
    await handle(client, 'pve_service_action', { node: 'pve1', service: 'pvedaemon', action: 'restart' });
    expect(client.post).toHaveBeenCalledWith('/nodes/pve1/services/pvedaemon/restart');
  });

  it('should list PCI devices', async () => {
    await handle(client, 'pve_list_pci', { node: 'pve1' });
    expect(client.get).toHaveBeenCalledWith('/nodes/pve1/hardware/pci');
  });

  it('should update hosts file', async () => {
    await handle(client, 'pve_set_hosts', { node: 'pve1', data: '127.0.0.1 localhost' });
    expect(client.post).toHaveBeenCalledWith('/nodes/pve1/hosts', { data: '127.0.0.1 localhost' });
  });
});
