import { describe, it, expect, beforeEach } from 'vitest';
import { handle } from '../tools/vm.js';
import { createMockClient, mockGetReturn } from './helpers.js';
import type { ApiClient } from '../client.js';

describe('VM Tools', () => {
  let client: ApiClient;
  beforeEach(() => { client = createMockClient(); });

  describe('pve_list_vms', () => {
    it('should list VMs on a specific node', async () => {
      mockGetReturn(client, [{ vmid: 100, name: 'test', status: 'running' }]);
      const result = await handle(client, 'pve_list_vms', { node: 'pve1' });
      expect(client.get).toHaveBeenCalledWith('/nodes/pve1/qemu');
      expect(result).toContain('test');
    });

    it('should list all VMs cluster-wide when no node specified', async () => {
      mockGetReturn(client, []);
      await handle(client, 'pve_list_vms', {});
      expect(client.get).toHaveBeenCalledWith('/cluster/resources', { type: 'vm' });
    });
  });

  describe('pve_create_vm', () => {
    it('should create VM with all params', async () => {
      await handle(client, 'pve_create_vm', {
        node: 'pve1', vmid: 100, name: 'myvm', memory: 4096, cores: 2,
        ostype: 'l26', bios: 'seabios', storage: 'local-lvm', diskSize: 32,
        iso: 'local:iso/ubuntu.iso', bridge: 'vmbr0'
      });
      expect(client.post).toHaveBeenCalledWith('/nodes/pve1/qemu', expect.objectContaining({
        vmid: 100, name: 'myvm', memory: 4096, cores: 2,
        ostype: 'l26', bios: 'seabios',
        scsi0: 'local-lvm:32',
        ide2: 'local:iso/ubuntu.iso,media=cdrom',
        net0: 'virtio,bridge=vmbr0',
        scsihw: 'virtio-scsi-single',
      }));
    });

    it('should use default bridge vmbr0 when not specified', async () => {
      await handle(client, 'pve_create_vm', { node: 'pve1', vmid: 100 });
      expect(client.post).toHaveBeenCalledWith('/nodes/pve1/qemu', expect.objectContaining({
        net0: 'virtio,bridge=vmbr0',
      }));
    });

    it('should start VM after creation when start=true', async () => {
      await handle(client, 'pve_create_vm', { node: 'pve1', vmid: 100, start: true });
      expect(client.post).toHaveBeenCalledTimes(2);
      expect(client.post).toHaveBeenCalledWith('/nodes/pve1/qemu/100/status/start');
    });
  });

  describe('pve_stop_vm', () => {
    it('should graceful shutdown by default', async () => {
      await handle(client, 'pve_stop_vm', { node: 'pve1', vmid: 100 });
      expect(client.post).toHaveBeenCalledWith('/nodes/pve1/qemu/100/status/shutdown');
    });

    it('should force stop when force=true', async () => {
      await handle(client, 'pve_stop_vm', { node: 'pve1', vmid: 100, force: true });
      expect(client.post).toHaveBeenCalledWith('/nodes/pve1/qemu/100/status/stop');
    });
  });

  describe('pve_update_vm_config', () => {
    it('should update only provided fields', async () => {
      await handle(client, 'pve_update_vm_config', { node: 'pve1', vmid: 100, memory: 8192, cores: 4 });
      expect(client.put).toHaveBeenCalledWith('/nodes/pve1/qemu/100/config', { memory: 8192, cores: 4 });
    });

    it('should convert onboot boolean to 0/1', async () => {
      await handle(client, 'pve_update_vm_config', { node: 'pve1', vmid: 100, onboot: true });
      expect(client.put).toHaveBeenCalledWith('/nodes/pve1/qemu/100/config', { onboot: 1 });
    });
  });

  describe('pve_clone_vm', () => {
    it('should send clone params', async () => {
      await handle(client, 'pve_clone_vm', { node: 'pve1', vmid: 100, newid: 200, name: 'clone', full: true });
      expect(client.post).toHaveBeenCalledWith('/nodes/pve1/qemu/100/clone', { newid: 200, name: 'clone', full: 1 });
    });
  });

  describe('pve_resize_vm_disk', () => {
    it('should resize disk', async () => {
      await handle(client, 'pve_resize_vm_disk', { node: 'pve1', vmid: 100, disk: 'scsi0', size: '+10G' });
      expect(client.put).toHaveBeenCalledWith('/nodes/pve1/qemu/100/resize', { disk: 'scsi0', size: '+10G' });
    });
  });

  describe('pve_delete_vm', () => {
    it('should delete with purge', async () => {
      await handle(client, 'pve_delete_vm', { node: 'pve1', vmid: 100, purge: true });
      expect(client.del).toHaveBeenCalledWith('/nodes/pve1/qemu/100', { purge: 1 });
    });
  });

  it('should throw on unknown tool', async () => {
    await expect(handle(client, 'pve_unknown', {})).rejects.toThrow('Unknown VM tool');
  });
});
