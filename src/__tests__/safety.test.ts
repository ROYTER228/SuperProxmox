import { describe, it, expect } from 'vitest';
import { getAllTools } from '../tools/index.js';

describe('Safety System', () => {
  const tools = getAllTools();

  const destructiveTools = [
    'pve_delete_vm', 'pve_delete_container', 'pve_delete_storage',
    'pve_delete_volume', 'pve_delete_network', 'pve_delete_firewall_rule',
    'pve_rollback_snapshot', 'pve_delete_snapshot', 'pve_delete_user',
    'pve_delete_api_token', 'pve_delete_pool', 'pve_init_gpt',
    'pve_wipe_disk', 'pve_node_reboot', 'pve_node_shutdown',
    'pbs_delete_snapshot', 'pbs_prune_datastore',
    'pve_delete_sdn_zone', 'pve_delete_sdn_vnet',
  ];

  it('should have all destructive tools marked with DESTRUCTIVE warning', () => {
    for (const name of destructiveTools) {
      const tool = tools.find(t => t.name === name);
      if (tool) {
        expect(tool.description, `${name} must have DESTRUCTIVE warning`).toContain('DESTRUCTIVE');
      }
    }
  });

  it('should have all destructive tools requiring confirmation in description', () => {
    const guarded = tools.filter(t => t.description.includes('DESTRUCTIVE'));
    for (const tool of guarded) {
      const desc = tool.description.toLowerCase();
      expect(
        desc.includes('confirm') || desc.includes('explicit') || desc.includes('requires'),
        `${tool.name} must mention confirmation requirement`
      ).toBe(true);
    }
  });

  it('should NOT mark safe tools as destructive', () => {
    const safeTools = ['pve_list_vms', 'pve_get_vm_status', 'pve_create_vm',
      'pve_start_vm', 'pve_create_snapshot', 'pve_create_backup',
      'pve_list_nodes', 'pve_get_node_resources'];
    for (const name of safeTools) {
      const tool = tools.find(t => t.name === name);
      if (tool) {
        expect(tool.description, `${name} should NOT be marked destructive`).not.toContain('DESTRUCTIVE');
      }
    }
  });

  it('should have at least 15 destructive tools guarded', () => {
    const guarded = tools.filter(t => t.description.includes('DESTRUCTIVE'));
    expect(guarded.length).toBeGreaterThanOrEqual(15);
  });
});
