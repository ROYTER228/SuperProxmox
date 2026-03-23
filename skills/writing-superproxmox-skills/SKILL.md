---
name: writing-superproxmox-skills
description: Use when creating a new skill for SuperProxmox. Defines the format, conventions, testing methodology, and quality standards for Proxmox-specific skills.
---

# Writing SuperProxmox Skills

## Iron Law

```
NO SKILL WITHOUT BASELINE TEST FIRST
```

## Skill Format

```yaml
---
name: skill-name-with-hyphens
description: Use when [concrete triggers]. [Specific symptoms]. Max 1024 chars.
---
```

## Structure Template

```markdown
# Skill Name

## Iron Law
NO [ACTION] WITHOUT [PREREQUISITE] FIRST

## Quick Reference
Table or decision matrix.

## Workflow
Numbered steps with MCP tool calls.

## Common Mistakes
Table: Mistake | Consequence | Prevention

## Rationalization Table
Table: Excuse | Reality

## Red Flags — STOP
Bullet list of phrases that signal violation.
```

## Rules

1. **SKILL.md max 500 lines** — heavy reference in separate files
2. **Description**: starts with "Use when...", third person, triggers only
3. **Iron Law**: one bold rule per skill, no exceptions
4. **Rationalization table**: populated from actual AI failures, not hypothetical
5. **MCP tool calls**: use exact tool names (`pve_create_vm`, not "create a VM")
6. **Test before deploy**: run baseline (AI without skill), document failures, write skill targeting them

## Testing Methodology

1. Give AI a task without the skill loaded
2. Document what it does wrong (skips checks, wrong config, etc.)
3. Write skill addressing those specific failures
4. Re-test with skill loaded
5. If new failures appear → add to rationalization table
