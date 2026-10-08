#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const exists = (p) => fs.existsSync(path.join(root, p));
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const requiredRefs = ['contracts.md','repository-integration.md','persistence.md','delivery.md','environment.md'];
const refDir = path.join(root, 'references');
const refs = fs.readdirSync(refDir).filter((f) => f.endsWith('.md')).sort();
if (JSON.stringify(refs) !== JSON.stringify([...requiredRefs].sort())) errors.push(`references must be exactly: ${requiredRefs.join(', ')}`);
if (exists('actions')) errors.push('actions/ must not exist');

const skill = read('SKILL.md');
const lines = skill.trimEnd().split(/\r?\n/).length;
if (lines < 40 || lines > 60) errors.push(`SKILL.md must be 40-60 lines, found ${lines}`);

for (const term of ['FormDefinition','CanonicalLeadSubmission','attribution','consent','idempotency','trusted server boundary','Secrets','first_name','last_name','full_name']) {
  const haystack = skill + '\n' + requiredRefs.map((f) => read(`references/${f}`)).join('\n');
  if (!haystack.toLowerCase().includes(term.toLowerCase())) errors.push(`missing invariant term: ${term}`);
}

const bannedWords = ['Re' + 'act', 'Ne' + 'on', 'n' + '8n', 'saas' + '-kit', 'astro' + '-kit'];
const banned = bannedWords.map((word) => new RegExp(`\\b${word.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}\\b`, 'i'));
const textFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(md|json|ya?ml|mjs)$/.test(entry.name)) textFiles.push(full);
  }
}
walk(root);
for (const file of textFiles) {
  const rel = path.relative(root, file);
  const content = fs.readFileSync(file, 'utf8');
  for (const re of banned) if (re.test(content)) errors.push(`forbidden residual term ${re} in ${rel}`);
}

for (const p of [
  'assets/form-definition.template.json',
  'assets/generic-form-definition.example.json',
  'assets/canonical-lead-submission.template.json',
  'assets/delivery-payload.template.json',
  'assets/environment-manifest.template.json',
  'evals/scenarios.json',
  'scripts/validate-contracts.mjs'
]) if (!exists(p)) errors.push(`missing ${p}`);

let evals;
try { evals = JSON.parse(read('evals/scenarios.json')); }
catch (e) { errors.push(`invalid evals/scenarios.json: ${e.message}`); }
if (evals) {
  if (!Array.isArray(evals) || evals.length < 6) errors.push('evals must contain at least 6 scenarios');
  for (const [i, s] of evals.entries()) {
    if (!s.name || !s.prompt || !Array.isArray(s.must) || !Array.isArray(s.must_not)) errors.push(`eval ${i} must define name, prompt, must, must_not`);
  }
}

if (errors.length) {
  console.error(errors.map((e) => `- ${e}`).join('\n'));
  process.exit(1);
}
console.log(`OK: skill structure valid (${lines} SKILL.md lines, ${refs.length} references, ${evals.length} evals)`);
