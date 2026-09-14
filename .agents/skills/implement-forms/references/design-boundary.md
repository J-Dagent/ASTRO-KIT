# Design boundary

The form skill standardizes function and data, not visual identity.

If `DESIGN.md` exists, read and respect it for visual/component constraints. If absent, use the repository's existing components/tokens and the approved implementation contract.

Open Design is optional. The skill must work with plain repository files and must not require an Open Design daemon, package or metadata.

The agent may choose or improve:
- React component composition;
- Shadcn component usage;
- layout and responsive implementation;
- where to extract shared field/rendering components;
- exact Astro file organization.

It may not change the strict backend/data invariants in the other references merely to simplify UI code.
