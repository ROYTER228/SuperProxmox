import { describe, it, expect, beforeEach } from 'vitest';
import { handle } from '../tools/agent.js';
import { createMockClient } from './helpers.js';
import type { ApiClient } from '../client.js';

describe('Guest Agent Tools', () => {
  let client: ApiClient;
  beforeEach(() => { client = createMockClient(); });

  it('should ping guest agent', async () => {
    await handle(client, 'pve_agent_ping', { node: 'pve1', vmid: 100 });
    expect(client.post).toHaveBeenCalledWith('/nodes/pve1/qemu/100/agent/ping');
  });

  it('should get network interfaces', async () => {
    await handle(client, 'pve_agent_get_interfaces', { node: 'pve1', vmid: 100 });
    expect(client.get).toHaveBeenCalledWith('/nodes/pve1/qemu/100/agent/network-get-interfaces');
  });

  it('should execute command', async () => {
    await handle(client, 'pve_agent_exec', { node: 'pve1', vmid: 100, command: '/bin/bash' });
    expect(client.post).toHaveBeenCalledWith('/nodes/pve1/qemu/100/agent/exec', expect.objectContaining({ command: '/bin/bash' }));
  });

  it('should read file from VM', async () => {
    await handle(client, 'pve_agent_file_read', { node: 'pve1', vmid: 100, file: '/etc/hostname' });
    expect(client.get).toHaveBeenCalledWith('/nodes/pve1/qemu/100/agent/file-read', { file: '/etc/hostname' });
  });

  it('should write file to VM', async () => {
    await handle(client, 'pve_agent_file_write', { node: 'pve1', vmid: 100, file: '/tmp/test', content: 'aGVsbG8=' });
    expect(client.post).toHaveBeenCalledWith('/nodes/pve1/qemu/100/agent/file-write', { file: '/tmp/test', content: 'aGVsbG8=' });
  });
});
