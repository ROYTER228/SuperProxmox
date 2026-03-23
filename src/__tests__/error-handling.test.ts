import { describe, it, expect } from 'vitest';
import { ApiError, ValidationError, validateParams, validateNode, validateVmid } from '../client.js';

describe('Error Handling', () => {
  describe('ApiError', () => {
    it('should format error message with status and endpoint', () => {
      const err = new ApiError(404, 'GET /nodes/pve1/qemu/999', 'VM not found');
      expect(err.message).toContain('404');
      expect(err.message).toContain('GET /nodes/pve1/qemu/999');
      expect(err.message).toContain('VM not found');
      expect(err.status).toBe(404);
      expect(err.endpoint).toBe('GET /nodes/pve1/qemu/999');
      expect(err.name).toBe('ApiError');
    });

    it('should handle object details', () => {
      const err = new ApiError(400, 'POST /nodes/pve1/qemu', { errors: { vmid: 'already exists' } });
      expect(err.message).toContain('400');
      expect(err.message).toContain('already exists');
    });
  });

  describe('ValidationError', () => {
    it('should format tool and param info', () => {
      const err = new ValidationError('pve_create_vm', 'node', 'is required');
      expect(err.message).toContain('pve_create_vm');
      expect(err.message).toContain('node');
      expect(err.message).toContain('is required');
      expect(err.name).toBe('ValidationError');
    });
  });

  describe('validateParams', () => {
    it('should pass with all required params present', () => {
      expect(() => validateParams('test', { node: 'pve1', vmid: 100 }, ['node', 'vmid'])).not.toThrow();
    });

    it('should throw on missing required param', () => {
      expect(() => validateParams('test', { node: 'pve1' }, ['node', 'vmid'])).toThrow(ValidationError);
    });

    it('should throw on empty string param', () => {
      expect(() => validateParams('test', { node: '' }, ['node'])).toThrow(ValidationError);
    });

    it('should throw on null param', () => {
      expect(() => validateParams('test', { node: null }, ['node'])).toThrow(ValidationError);
    });
  });

  describe('validateNode', () => {
    it('should pass valid node names', () => {
      expect(() => validateNode('test', 'pve1')).not.toThrow();
      expect(() => validateNode('test', 'node-2')).not.toThrow();
      expect(() => validateNode('test', 'my.node')).not.toThrow();
    });

    it('should reject empty string', () => {
      expect(() => validateNode('test', '')).toThrow(ValidationError);
    });

    it('should reject non-string', () => {
      expect(() => validateNode('test', 123)).toThrow(ValidationError);
      expect(() => validateNode('test', undefined)).toThrow(ValidationError);
    });

    it('should reject special characters', () => {
      expect(() => validateNode('test', 'node;rm -rf')).toThrow(ValidationError);
      expect(() => validateNode('test', '../etc')).toThrow(ValidationError);
    });
  });

  describe('validateVmid', () => {
    it('should pass valid VMIDs', () => {
      expect(() => validateVmid('test', 100)).not.toThrow();
      expect(() => validateVmid('test', 999)).not.toThrow();
      expect(() => validateVmid('test', 100000)).not.toThrow();
    });

    it('should reject VMID < 100', () => {
      expect(() => validateVmid('test', 99)).toThrow(ValidationError);
      expect(() => validateVmid('test', 0)).toThrow(ValidationError);
      expect(() => validateVmid('test', -1)).toThrow(ValidationError);
    });

    it('should reject non-integer', () => {
      expect(() => validateVmid('test', 100.5)).toThrow(ValidationError);
      expect(() => validateVmid('test', '100' as any)).toThrow(ValidationError);
    });
  });
});
