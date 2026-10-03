# Repository integration

Inspect before assuming.

Identify:
- repository instructions and package/workspace boundaries;
- framework and rendering model;
- route/layout conventions;
- component/template and styling conventions;
- design tokens or design-system packages;
- client/server boundaries and integrations;
- existing experiment and measurement wiring;
- repo-native test, typecheck, lint, build, preview, and browser commands.

Examples such as Astro, Next.js, React Router/Remix, TanStack Start, SvelteKit, Nuxt, server-rendered templates, or custom SSR are detection cases, not defaults.

Extend the smallest existing seam that satisfies the contract. Add an abstraction only when the repository shows repeated behavior or the contract requires a new reusable seam. Never migrate the framework or backend as a side effect of a CRO change.
