import { describe, it, expect } from 'vitest';
import { getAllTools } from '../tools/index.js';

describe('Tool Registry', () => {
  const tools = getAllTools();

  it('should have at least 160 tools', () => {
    expect(tools.length).toBeGreaterThanOrEqual(160);
  });

  it('should have no duplicate tool names', () => {
    const names = tools.map(t => t.name);
    const unique = new Set(names);
    expect(unique.size, `Duplicates: ${names.filter((n, i) => names.indexOf(n) !== i)}`).toBe(names.length);
  });

  it('every tool should have a name and description', () => {
    for (const tool of tools) {
      expect(tool.name, 'tool must have name').toBeTruthy();
      expect(tool.description, `${tool.name} must have description`).toBeTruthy();
      expect(tool.name.length, `${tool.name} name too short`).toBeGreaterThan(3);
      expect(tool.description.length, `${tool.name} description too short`).toBeGreaterThanOrEqual(10);
    }
  });

  it('every tool should have valid inputSchema', () => {
    for (const tool of tools) {
      expect(tool.inputSchema.type, `${tool.name} schema type must be "object"`).toBe('object');
      expect(tool.inputSchema.properties, `${tool.name} must have properties`).toBeDefined();
    }
  });

  it('should have tools from all expected modules', () => {
    const prefixes = ['pve_get_cluster_status', 'pve_list_vms', 'pve_list_containers',
      'pve_list_storage', 'pve_list_networks', 'pve_get_firewall_rules',
      'pve_list_backups', 'pve_list_users', 'pve_get_rrddata',
      'pve_list_disks', 'pve_get_ha_status', 'pve_list_tasks',
      'pbs_list_datastores', 'pve_get_cloudinit', 'pve_agent_ping',
      'pve_get_ceph_status', 'pve_list_sdn_zones'];
    for (const prefix of prefixes) {
      const found = tools.some(t => t.name === prefix);
      expect(found, `Missing tool: ${prefix}`).toBe(true);
    }
  });
});
