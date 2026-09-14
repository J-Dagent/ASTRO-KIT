#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const mode = process.argv[2] || 'all';

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
}

function requireText(rel, fragments) {
  const text = read(rel);
  for (const fragment of fragments) {
    if (!text.includes(fragment)) fail(`${rel} missing required contract text: ${fragment}`);
  }
}

const legacyFiles = [
  'references/default-stack.md',
  'references/technical-patterns.md'
];
for (const rel of legacyFiles) {
  if (fs.existsSync(path.join(root, rel))) fail(`legacy stack-specific file still exists: ${rel}`);
}

const coreFiles = [
  'SKILL.md',
  'actions/01-resolve-context.md',
  'actions/02-shape-requirements.md',
  'actions/03-write-prd.md',
  'actions/04-validate-prd.md',
  'references/context-resolution.md',
  'references/prd-contract.md',
  'assets/prd-template.md'
];

const forbiddenDefaults = [
  'Astro',
  'Drizzle ORM',
  'Better Auth',
  'Cloudflare Workers',
  'Neon PostgreSQL',
  'Hono'
];
for (const rel of coreFiles) {
  const text = read(rel);
  for (const term of forbiddenDefaults) {
    if (text.includes(term)) fail(`${rel} hardcodes project-stack technology: ${term}`);
  }
}

if (mode === 'all' || mode === 'resolve-context') {
  requireText('actions/01-resolve-context.md', [
    'current technologies and requested replacements distinct',
    'missing technology as unknown',
    'every technical fact'
  ]);
  requireText('references/context-resolution.md', [
    'Explicit user target-state instruction',
    'Repository instructions and durable architecture decisions',
    'Unknown: leave it unresolved rather than inventing a technology'
  ]);
}

if (mode === 'all' || mode === 'shape-requirements') {
  requireText('actions/02-shape-requirements.md', [
    'Pair each material requirement with an acceptance criterion',
    'Gate data, API, UI, identity, async, observability, deployment and migration detail',
    'Existing, Requested, Proposed and Unknown'
  ]);
}

if (mode === 'all' || mode === 'write-prd') {
  requireText('actions/03-write-prd.md', [
    'Omit empty conditional subsections',
    'no unresolved `{{...}}` token'
  ]);
  requireText('assets/prd-template.md', [
    '## Requirements',
    '{{conditional_product_or_technical_sections}}',
    '{{technical_context_section}}'
  ]);
}

if (mode === 'all' || mode === 'validate-prd') {
  requireText('actions/04-validate-prd.md', [
    'technology appears as an existing/current fact without evidence',
    'current-state facts and target-state changes are not conflated',
    'Fix the PRD in place until all checks pass'
  ]);
}

const fixture = JSON.parse(read('evals/fixtures/astro-kit-snapshot.json'));
if (!fixture.purpose.includes('test data only')) fail('ASTRO-KIT fixture must be explicitly marked test-only');
if (read('SKILL.md').includes('astro-kit-snapshot')) fail('runtime skill must not depend on the ASTRO-KIT fixture');

if (!process.exitCode) console.log(`PASS: create-prd portability contract (${mode})`);
