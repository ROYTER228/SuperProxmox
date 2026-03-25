import { describe, it, expect } from 'vitest';
import { validate, createVmSchema, createContainerSchema, firewallRuleSchema, cloudInitSchema, createUserSchema, nodeSchema, vmidSchema } from '../schemas.js';

describe('Zod Validation Schemas', () => {
  describe('nodeSchema', () => {
    it('should accept valid node names', () => {
      expect(nodeSchema.parse('pve1')).toBe('pve1');
      expect(nodeSchema.parse('node-2')).toBe('node-2');
    });
    it('should reject invalid names', () => {
      expect(() => nodeSchema.parse('')).toThrow();
      expect(() => nodeSchema.parse('no de')).toThrow();
      expect(() => nodeSchema.parse('node;rm')).toThrow();
    });
  });

  describe('vmidSchema', () => {
    it('should accept valid VMIDs', () => { expect(vmidSchema.parse(100)).toBe(100); });
    it('should reject < 100', () => { expect(() => vmidSchema.parse(99)).toThrow(); });
    it('should reject float', () => { expect(() => vmidSchema.parse(100.5)).toThrow(); });
  });

  describe('createVmSchema', () => {
    it('should validate minimal VM config', () => {
      const result = validate(createVmSchema, { node: 'pve1', vmid: 100 }, 'test');
      expect(result.node).toBe('pve1');
      expect(result.vmid).toBe(100);
    });

    it('should validate full VM config', () => {
      const result = validate(createVmSchema, {
        node: 'pve1', vmid: 100, name: 'myvm', memory: 4096,
        cores: 2, bios: 'seabios', ostype: 'l26'
      }, 'test');
      expect(result.bios).toBe('seabios');
    });

    it('should reject invalid bios', () => {
      expect(() => validate(createVmSchema, { node: 'pve1', vmid: 100, bios: 'invalid' }, 'test')).toThrow();
    });

    it('should reject memory < 16', () => {
      expect(() => validate(createVmSchema, { node: 'pve1', vmid: 100, memory: 1 }, 'test')).toThrow();
    });
  });

  describe('createContainerSchema', () => {
    it('should validate minimal CT config', () => {
      const result = validate(createContainerSchema, {
        node: 'pve1', vmid: 101, ostemplate: 'local:vztmpl/debian-12.tar.zst'
      }, 'test');
      expect(result.ostemplate).toContain('debian');
    });

    it('should reject invalid hostname', () => {
      expect(() => validate(createContainerSchema, {
        node: 'pve1', vmid: 101, ostemplate: 'x', hostname: 'bad host name!'
      }, 'test')).toThrow();
    });
  });

  describe('firewallRuleSchema', () => {
    it('should validate firewall rule', () => {
      const result = validate(firewallRuleSchema, {
        node: 'pve1', action: 'ACCEPT', type: 'in', proto: 'tcp', dport: '22'
      }, 'test');
      expect(result.action).toBe('ACCEPT');
    });

    it('should reject invalid action', () => {
      expect(() => validate(firewallRuleSchema, { node: 'pve1', action: 'ALLOW', type: 'in' }, 'test')).toThrow();
    });
  });

  describe('cloudInitSchema', () => {
    it('should validate cloud-init config', () => {
      const result = validate(cloudInitSchema, {
        node: 'pve1', vmid: 100, ciuser: 'ubuntu', ipconfig0: 'ip=dhcp'
      }, 'test');
      expect(result.ciuser).toBe('ubuntu');
    });
  });

  describe('createUserSchema', () => {
    it('should validate user with realm', () => {
      const result = validate(createUserSchema, { userid: 'test@pam' }, 'test');
      expect(result.userid).toBe('test@pam');
    });

    it('should reject user without realm', () => {
      expect(() => validate(createUserSchema, { userid: 'test' }, 'test')).toThrow();
    });

    it('should reject too short password', () => {
      expect(() => validate(createUserSchema, { userid: 'test@pam', password: '123' }, 'test')).toThrow();
    });
  });

  describe('validate helper', () => {
    it('should include tool name in error', () => {
      try {
        validate(createVmSchema, { node: '', vmid: 1 }, 'pve_create_vm');
      } catch (e: any) {
        expect(e.message).toContain('pve_create_vm');
      }
    });
  });
});
