import { describe, it, expect } from 'vitest';
import { table, statusIcon, progressBar, formatBytes, formatUptime, formatNodeResources, formatVmList, formatContainerList, formatStorageList } from '../format.js';

describe('Rich Formatting', () => {
  describe('table', () => {
    it('should create aligned table', () => {
      const result = table(['Name', 'Value'], [['foo', 'bar'], ['longer', 'x']]);
      expect(result).toContain('Name');
      expect(result).toContain('foo');
      expect(result).toContain('longer');
    });
  });

  describe('statusIcon', () => {
    it('should return green for running', () => { expect(statusIcon('running')).toBe('🟢'); });
    it('should return red for stopped', () => { expect(statusIcon('stopped')).toBe('🔴'); });
    it('should return yellow for paused', () => { expect(statusIcon('paused')).toBe('🟡'); });
    it('should return default for unknown', () => { expect(statusIcon('xxx')).toBe('⚪'); });
  });

  describe('progressBar', () => {
    it('should show green under 70%', () => { expect(progressBar(50)).toContain('🟢'); });
    it('should show yellow 70-85%', () => { expect(progressBar(75)).toContain('🟡'); });
    it('should show red over 85%', () => { expect(progressBar(90)).toContain('🔴'); });
    it('should show percentage', () => { expect(progressBar(42.5)).toContain('42.5%'); });
  });

  describe('formatBytes', () => {
    it('should format 0', () => { expect(formatBytes(0)).toBe('0 B'); });
    it('should format GB', () => { expect(formatBytes(1073741824)).toBe('1 GB'); });
    it('should format TB', () => { expect(formatBytes(1099511627776)).toBe('1 TB'); });
  });

  describe('formatNodeResources', () => {
    it('should format node data with progress bars', () => {
      const data = { cpu: 0.25, cpuinfo: { model: 'i5-10600K', cores: 6 }, memory: { used: 4e9, total: 32e9 }, swap: { used: 0, total: 8e9 }, uptime: 86400, loadavg: [0.5, 0.3, 0.1] };
      const result = formatNodeResources(data);
      expect(result).toContain('i5-10600K');
      expect(result).toContain('█');
      expect(result).toContain('Uptime');
    });

    it('should show temperature when available', () => {
      const data = { cpu: 0.1, cpuinfo: { model: 'test', cores: 4, 'cpu-temperature': 65 }, memory: { used: 1e9, total: 8e9 }, swap: { used: 0, total: 0 }, uptime: 3600, loadavg: [] };
      const result = formatNodeResources(data);
      expect(result).toContain('65°C');
      expect(result).toContain('🌡️');
    });
  });

  describe('formatVmList', () => {
    it('should format VM list with icons', () => {
      const vms = [{ vmid: 100, name: 'test', status: 'running', cpus: 2, maxmem: 4e9, uptime: 3600 }];
      const result = formatVmList(vms);
      expect(result).toContain('🟢');
      expect(result).toContain('test');
      expect(result).toContain('100');
    });
    it('should handle empty list', () => { expect(formatVmList([])).toContain('No VMs'); });
  });

  describe('formatContainerList', () => {
    it('should format CT list', () => {
      const cts = [{ vmid: 101, name: 'tailscale', status: 'running', cpus: 1, maxmem: 512e6 }];
      const result = formatContainerList(cts);
      expect(result).toContain('tailscale');
      expect(result).toContain('🟢');
    });
  });

  describe('formatStorageList', () => {
    it('should format storage with usage bars', () => {
      const storage = [{ storage: 'local-lvm', type: 'lvmthin', total: 100e9, used: 50e9, content: 'images' }];
      const result = formatStorageList(storage);
      expect(result).toContain('local-lvm');
      expect(result).toContain('█');
    });
  });
});
