import { describe, it, expect, afterEach } from 'vitest';
import { getMode, isWriteTool, filterToolsByMode, checkPermission } from '../permissions.js';
import { getAllTools } from '../tools/index.js';

describe('Permission System', () => {
  afterEach(() => { delete process.env.SUPERPROXMOX_MODE; });

  describe('getMode', () => {
    it('should default to full', () => {
      expect(getMode()).toBe('full');
    });
    it('should return safe when set', () => {
      process.env.SUPERPROXMOX_MODE = 'safe';
      expect(getMode()).toBe('safe');
    });
    it('should be case-insensitive', () => {
      process.env.SUPERPROXMOX_MODE = 'SAFE';
      expect(getMode()).toBe('safe');
    });
  });

  describe('isWriteTool', () => {
    it('should identify write tools', () => {
      expect(isWriteTool('pve_create_vm')).toBe(true);
      expect(isWriteTool('pve_delete_vm')).toBe(true);
      expect(isWriteTool('pve_start_vm')).toBe(true);
      expect(isWriteTool('pve_stop_vm')).toBe(true);
      expect(isWriteTool('pbs_delete_snapshot')).toBe(true);
      expect(isWriteTool('pve_node_reboot')).toBe(true);
    });
    it('should identify read tools', () => {
      expect(isWriteTool('pve_list_vms')).toBe(false);
      expect(isWriteTool('pve_get_vm_status')).toBe(false);
      expect(isWriteTool('pve_list_nodes')).toBe(false);
      expect(isWriteTool('pbs_list_datastores')).toBe(false);
    });
  });

  describe('filterToolsByMode', () => {
    const tools = getAllTools();
    it('should return all tools in full mode', () => {
      expect(filterToolsByMode(tools, 'full').length).toBe(tools.length);
    });
    it('should filter write tools in safe mode', () => {
      const safe = filterToolsByMode(tools, 'safe');
      expect(safe.length).toBeLessThan(tools.length);
      expect(safe.length).toBeGreaterThan(30); // still have read tools
      expect(safe.some(t => t.name === 'pve_create_vm')).toBe(false);
      expect(safe.some(t => t.name === 'pve_list_vms')).toBe(true);
    });
  });

  describe('checkPermission', () => {
    it('should allow read tools in safe mode', () => {
      expect(() => checkPermission('pve_list_vms', 'safe')).not.toThrow();
    });
    it('should block write tools in safe mode', () => {
      expect(() => checkPermission('pve_delete_vm', 'safe')).toThrow('blocked in safe mode');
    });
    it('should allow everything in full mode', () => {
      expect(() => checkPermission('pve_delete_vm', 'full')).not.toThrow();
    });
  });
});
