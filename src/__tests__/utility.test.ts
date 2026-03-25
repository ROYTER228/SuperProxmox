import { describe, it, expect, beforeEach } from 'vitest';
import { handle } from '../tools/utility.js';
import { createMockClient, mockGetReturn } from './helpers.js';
import type { ApiClient } from '../client.js';

describe('Utility Tools', () => {
  let client: ApiClient;
  beforeEach(() => { client = createMockClient(); });

  describe('pve_find_vm', () => {
    it('should find VM by name', async () => {
      mockGetReturn(client, [
        { vmid: 100, name: 'webserver', node: 'pve1', status: 'running' },
        { vmid: 101, name: 'database', node: 'pve1', status: 'stopped' },
      ]);
      const result = await handle(client, 'pve_find_vm', { name: 'web' });
      expect(result).toContain('webserver');
      expect(result).toContain('100');
      expect(result).not.toContain('database');
    });

    it('should return message when not found', async () => {
      mockGetReturn(client, []);
      const result = await handle(client, 'pve_find_vm', { name: 'nonexistent' });
      expect(result).toContain('No VM found');
    });
  });

  describe('pve_find_container', () => {
    it('should find CT by name', async () => {
      mockGetReturn(client, [
        { vmid: 101, name: 'tailscale', node: 'pve1', status: 'running' },
      ]);
      const result = await handle(client, 'pve_find_container', { name: 'tail' });
      expect(result).toContain('tailscale');
    });
  });

  describe('pve_convert_to_template', () => {
    it('should call template endpoint', async () => {
      await handle(client, 'pve_convert_to_template', { node: 'pve1', vmid: 100 });
      expect(client.post).toHaveBeenCalledWith('/nodes/pve1/qemu/100/template');
    });
  });

  describe('pve_add_nic', () => {
    it('should add NIC with defaults', async () => {
      await handle(client, 'pve_add_nic', { node: 'pve1', vmid: 100, netid: 'net1' });
      expect(client.put).toHaveBeenCalledWith('/nodes/pve1/qemu/100/config', { net1: 'virtio,bridge=vmbr0' });
    });

    it('should add NIC with VLAN tag', async () => {
      await handle(client, 'pve_add_nic', { node: 'pve1', vmid: 100, netid: 'net1', bridge: 'vmbr1', tag: 100 });
      expect(client.put).toHaveBeenCalledWith('/nodes/pve1/qemu/100/config', { net1: 'virtio,bridge=vmbr1,tag=100' });
    });
  });

  describe('pve_remove_nic', () => {
    it('should delete NIC', async () => {
      await handle(client, 'pve_remove_nic', { node: 'pve1', vmid: 100, netid: 'net1' });
      expect(client.put).toHaveBeenCalledWith('/nodes/pve1/qemu/100/config', { delete: 'net1' });
    });
  });

  describe('pve_restore_backup', () => {
    it('should send restore with force', async () => {
      await handle(client, 'pve_restore_backup', { node: 'pve1', storage: 'local', volid: 'local:backup/vzdump-qemu-100.vma.zst', vmid: 100, force: true });
      expect(client.post).toHaveBeenCalledWith('/nodes/pve1/qemu', expect.objectContaining({ archive: 'local:backup/vzdump-qemu-100.vma.zst', vmid: 100, force: 1 }));
    });
  });

  describe('pve_generate_ansible_inventory', () => {
    it('should generate YAML inventory', async () => {
      mockGetReturn(client, [{ vmid: 100, name: 'web', node: 'pve1', status: 'running' }]);
      mockGetReturn(client, [{ vmid: 101, name: 'tailscale', node: 'pve1', status: 'running' }]);
      const result = await handle(client, 'pve_generate_ansible_inventory', { group: 'homelab' });
      expect(result).toContain('homelab:');
      expect(result).toContain('web:');
      expect(result).toContain('ansible_host');
    });
  });
});
