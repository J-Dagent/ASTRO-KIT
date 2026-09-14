# Optional design context

If a project-level `DESIGN.md` exists, read it as a visual constraint and design-system context. If it does not exist, use the repository's existing design system, Shadcn/Tailwind tokens, and local component patterns.

Open Design is optional. Do not require its daemon, package, CLI, frontmatter, or design-system package for this skill to work.

Design context must never redefine:
- the form data contract;
- attribution;
- consent;
- persistence;
- n8n/server-side tracking contracts.
