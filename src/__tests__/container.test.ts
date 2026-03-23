import { describe, it, expect, beforeEach } from 'vitest';
import { handle } from '../tools/container.js';
import { createMockClient, mockGetReturn } from './helpers.js';
import type { ApiClient } from '../client.js';

describe('Container Tools', () => {
  let client: ApiClient;
  beforeEach(() => { client = createMockClient(); });

  describe('pve_create_container', () => {
    it('should create with all defaults', async () => {
      await handle(client, 'pve_create_container', {
        node: 'pve1', vmid: 101, ostemplate: 'local:vztmpl/debian-12.tar.zst',
        hostname: 'test', memory: 512, cores: 1, password: 'secret',
        ip: '192.168.1.50/24', gateway: '192.168.1.1'
      });
      expect(client.post).toHaveBeenCalledWith('/nodes/pve1/lxc', expect.objectContaining({
        vmid: 101,
        ostemplate: 'local:vztmpl/debian-12.tar.zst',
        hostname: 'test',
        memory: 512,
        cores: 1,
        unprivileged: 1,
        password: 'secret',
        net0: 'name=eth0,bridge=vmbr0,ip=192.168.1.50/24,gw=192.168.1.1',
      }));
    });

    it('should set unprivileged=0 when explicitly false', async () => {
      await handle(client, 'pve_create_container', {
        node: 'pve1', vmid: 101, ostemplate: 'local:vztmpl/debian.tar.zst',
        unprivileged: false
      });
      expect(client.post).toHaveBeenCalledWith('/nodes/pve1/lxc', expect.objectContaining({
        unprivileged: 0,
      }));
    });

    it('should use default storage and rootfs size', async () => {
      await handle(client, 'pve_create_container', {
        node: 'pve1', vmid: 101, ostemplate: 'local:vztmpl/debian.tar.zst'
      });
      expect(client.post).toHaveBeenCalledWith('/nodes/pve1/lxc', expect.objectContaining({
        rootfs: 'local-lvm:8',
      }));
    });
  });

  describe('pve_list_containers', () => {
    it('should list on specific node', async () => {
      mockGetReturn(client, [{ vmid: 101 }]);
      await handle(client, 'pve_list_containers', { node: 'pve1' });
      expect(client.get).toHaveBeenCalledWith('/nodes/pve1/lxc');
    });

    it('should list cluster-wide', async () => {
      mockGetReturn(client, []);
      await handle(client, 'pve_list_containers', {});
      expect(client.get).toHaveBeenCalledWith('/cluster/resources', { type: 'lxc' });
    });
  });

  describe('pve_resize_container', () => {
    it('should resize rootfs by default', async () => {
      await handle(client, 'pve_resize_container', { node: 'pve1', vmid: 101, size: '+5G' });
      expect(client.put).toHaveBeenCalledWith('/nodes/pve1/lxc/101/resize', { disk: 'rootfs', size: '+5G' });
    });
  });

  describe('pve_clone_container', () => {
    it('should clone with full option', async () => {
      await handle(client, 'pve_clone_container', { node: 'pve1', vmid: 101, newid: 201, hostname: 'clone', full: true });
      expect(client.post).toHaveBeenCalledWith('/nodes/pve1/lxc/101/clone', { newid: 201, hostname: 'clone', full: 1 });
    });
  });
});
