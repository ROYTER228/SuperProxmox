import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

describe('Bundles', () => {
  const bundlesDir = join(import.meta.dirname, '../../bundles');
  const bundleFiles = readdirSync(bundlesDir).filter(f => f.endsWith('.json'));

  it('should have at least 8 bundles', () => {
    expect(bundleFiles.length).toBeGreaterThanOrEqual(8);
  });

  for (const file of bundleFiles) {
    describe(file, () => {
      const content = JSON.parse(readFileSync(join(bundlesDir, file), 'utf-8'));

      it('should have required fields', () => {
        expect(content.name).toBeTruthy();
        expect(content.description).toBeTruthy();
        expect(content.type).toMatch(/^(lxc|vm)$/);
        expect(content.config).toBeDefined();
      });

      it('should have valid config', () => {
        if (content.type === 'lxc') {
          expect(content.config.hostname).toBeTruthy();
          expect(content.config.ostemplate).toBeTruthy();
          expect(content.config.memory).toBeGreaterThan(0);
          expect(content.config.cores).toBeGreaterThan(0);
        }
        if (content.type === 'vm') {
          expect(content.config.name).toBeTruthy();
          expect(content.config.memory).toBeGreaterThan(0);
          expect(content.config.cores).toBeGreaterThan(0);
        }
      });

      it('should have post_create instructions', () => {
        expect(content.post_create || content.cloud_init).toBeDefined();
      });
    });
  }
});
