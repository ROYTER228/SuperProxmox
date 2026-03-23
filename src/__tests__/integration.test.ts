import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { SuperProxmoxClient } from '../client.js';
import { getAllTools, handleTool } from '../tools/index.js';

// Integration tests — only run when PVE_URL is set
// Run: PVE_URL=https://your-pve:8006 PVE_PASSWORD=pass npx vitest run src/__tests__/integration.test.ts

const hasPve = !!process.env.PVE_URL;

describe.skipIf(!hasPve)('Integration Tests (real PVE API)', () => {
  let client: SuperProxmoxClient;

  beforeAll(async () => {
    client = SuperProxmoxClient.fromEnv();
    await client.init();
  });

  describe('Read-only operations', () => {
    it('should list nodes', async () => {
      const result = await handleTool(client.pve!, 'pve_list_nodes', {});
      const data = JSON.parse(result);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      expect(data[0]).toHaveProperty('node');
      expect(data[0]).toHaveProperty('status');
    });

    it('should get cluster status', async () => {
      const result = await handleTool(client.pve!, 'pve_get_cluster_status', {});
      const data = JSON.parse(result);
      expect(Array.isArray(data)).toBe(true);
    });

    it('should get node resources', async () => {
      const nodesResult = await handleTool(client.pve!, 'pve_list_nodes', {});
      const nodes = JSON.parse(nodesResult);
      const nodeName = nodes[0].node;

      const result = await handleTool(client.pve!, 'pve_get_node_resources', { node: nodeName });
      const data = JSON.parse(result);
      expect(data).toHaveProperty('cpu');
      expect(data).toHaveProperty('memory');
      expect(data.cpu).toHaveProperty('cores');
      expect(data.memory).toHaveProperty('total');
    });

    it('should list VMs', async () => {
      const nodesResult = await handleTool(client.pve!, 'pve_list_nodes', {});
      const nodes = JSON.parse(nodesResult);
      const result = await handleTool(client.pve!, 'pve_list_vms', { node: nodes[0].node });
      const data = JSON.parse(result);
      expect(Array.isArray(data)).toBe(true);
    });

    it('should list containers', async () => {
      const nodesResult = await handleTool(client.pve!, 'pve_list_nodes', {});
      const nodes = JSON.parse(nodesResult);
      const result = await handleTool(client.pve!, 'pve_list_containers', { node: nodes[0].node });
      const data = JSON.parse(result);
      expect(Array.isArray(data)).toBe(true);
    });

    it('should list storage', async () => {
      const nodesResult = await handleTool(client.pve!, 'pve_list_nodes', {});
      const nodes = JSON.parse(nodesResult);
      const result = await handleTool(client.pve!, 'pve_list_storage', { node: nodes[0].node });
      const data = JSON.parse(result);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    });

    it('should list networks', async () => {
      const nodesResult = await handleTool(client.pve!, 'pve_list_nodes', {});
      const nodes = JSON.parse(nodesResult);
      const result = await handleTool(client.pve!, 'pve_list_networks', { node: nodes[0].node });
      const data = JSON.parse(result);
      expect(Array.isArray(data)).toBe(true);
    });

    it('should get DNS config', async () => {
      const nodesResult = await handleTool(client.pve!, 'pve_list_nodes', {});
      const nodes = JSON.parse(nodesResult);
      const result = await handleTool(client.pve!, 'pve_get_dns', { node: nodes[0].node });
      const data = JSON.parse(result);
      expect(data).toHaveProperty('dns1');
    });

    it('should list tasks', async () => {
      const nodesResult = await handleTool(client.pve!, 'pve_list_nodes', {});
      const nodes = JSON.parse(nodesResult);
      const result = await handleTool(client.pve!, 'pve_list_tasks', { node: nodes[0].node, limit: 5 });
      const data = JSON.parse(result);
      expect(Array.isArray(data)).toBe(true);
    });

    it('should get version', async () => {
      const result = await handleTool(client.pve!, 'pve_get_version', {});
      const data = JSON.parse(result);
      expect(data).toHaveProperty('version');
    });

    it('should list users', async () => {
      const result = await handleTool(client.pve!, 'pve_list_users', {});
      const data = JSON.parse(result);
      expect(Array.isArray(data)).toBe(true);
      expect(data.some((u: any) => u.userid === 'root@pam')).toBe(true);
    });

    it('should list roles', async () => {
      const result = await handleTool(client.pve!, 'pve_list_roles', {});
      const data = JSON.parse(result);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    });

    it('should get cluster next free ID', async () => {
      const result = await handleTool(client.pve!, 'pve_get_cluster_nextid', {});
      const id = JSON.parse(result);
      expect(typeof id === 'number' || typeof id === 'string').toBe(true);
    });
  });
});
