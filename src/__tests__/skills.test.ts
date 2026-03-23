import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

describe('Skills', () => {
  const skillsDir = join(import.meta.dirname, '../../skills');
  const skillDirs = readdirSync(skillsDir).filter(d => existsSync(join(skillsDir, d, 'SKILL.md')));

  it('should have at least 10 skills', () => {
    expect(skillDirs.length).toBeGreaterThanOrEqual(10);
  });

  for (const dir of skillDirs) {
    describe(dir, () => {
      const content = readFileSync(join(skillsDir, dir, 'SKILL.md'), 'utf-8');

      it('should have valid frontmatter with name and description', () => {
        expect(content).toMatch(/^---\n/);
        expect(content).toMatch(/name:\s*.+/);
        expect(content).toMatch(/description:\s*.+/);
      });

      it('should have description starting with "Use when" or "ALWAYS"', () => {
        const descMatch = content.match(/description:\s*(.+)/);
        expect(descMatch).toBeTruthy();
        const desc = descMatch![1].trim();
        expect(desc.startsWith('Use when') || desc.startsWith('ALWAYS'), `${dir}: description should start with "Use when" or "ALWAYS"`).toBe(true);
      });

      it('should be under 500 lines', () => {
        const lines = content.split('\n').length;
        expect(lines, `${dir}: SKILL.md should be under 500 lines (got ${lines})`).toBeLessThan(500);
      });

      it('should have a heading', () => {
        expect(content).toMatch(/^# .+/m);
      });
    });
  }
});
