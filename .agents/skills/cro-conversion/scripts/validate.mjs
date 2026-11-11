#!/usr/bin/env node
// Usage: node scripts/validate.mjs <contract|report> <file.json>
import fs from 'node:fs';

const [, , kind, file] = process.argv;
if (!['contract', 'report'].includes(kind) || !file) {
  console.error('Usage: node scripts/validate.mjs <contract|report> <file.json>');
  process.exit(2);
}

let d;
try { d = JSON.parse(fs.readFileSync(file, 'utf8')); }
catch (e) { console.error(e.message); process.exit(1); }

const errors = [];
const arrays = (obj, keys, prefix = '') => {
  for (const k of keys) if (!Array.isArray(obj?.[k])) errors.push(`${prefix}${k} must be an array`);
};

if (kind === 'contract') {
  const required = ['schema_version', 'status', 'identity', 'context', 'approved_experience', 'design', 'measurement', 'implementation', 'acceptance_criteria', 'evidence', 'blockers'];
  for (const k of required) if (!(k in d)) errors.push(`Missing ${k}`);
  if (!['READY', 'NEEDS_EVIDENCE', 'UNKNOWN', 'BLOCKED'].includes(d.status)) errors.push('status must be READY|NEEDS_EVIDENCE|UNKNOWN|BLOCKED');
  arrays(d, ['acceptance_criteria', 'evidence', 'blockers']);

  const impl = d.implementation;
  if (!impl || typeof impl !== 'object') errors.push('implementation must be an object');
  else {
    arrays(impl, ['change_surfaces'], 'implementation.');
    if (!['low', 'medium', 'high'].includes(impl.risk)) errors.push('implementation.risk must be low|medium|high');
    if (impl.risk === 'high' && !impl.rollback) errors.push('High-risk contract requires implementation.rollback');
  }

  if (d.status === 'READY' && d.blockers?.length) errors.push('READY contract cannot contain blockers');
  if (!d.acceptance_criteria?.length || d.acceptance_criteria.some((x) => typeof x !== 'string' || !x.trim())) {
    errors.push('At least one non-empty acceptance criterion is required');
  }

  // form_requirements is a draft FormDefinition for implement-forms, plus destination and unresolved.
  const f = d.form_requirements;
  if (f) {
    const keys = ['key', 'version', 'pattern', 'path', 'location', 'page', 'conversion_event', 'contact', 'fields', 'quiz', 'consent', 'attribution', 'success', 'destination', 'unresolved'];
    for (const k of keys) if (!(k in f)) errors.push(`Missing form_requirements.${k}`);
    if (!Array.isArray(f.unresolved)) errors.push('form_requirements.unresolved must be an array');
    if (d.status === 'READY' && f.unresolved?.length) errors.push('READY contract cannot contain unresolved form requirements');
  }

  if (/<[^>]+>/.test(JSON.stringify(d))) errors.push('Contract contains unresolved placeholder tokens');
}

if (kind === 'report') {
  const verdicts = ['PASS_TO_STAGING', 'PASS_WITH_EXTERNAL_VERIFICATION', 'NEEDS_FIX', 'NEEDS_EVIDENCE', 'BLOCKED'];
  if (!verdicts.includes(d.verdict)) errors.push(`verdict must be ${verdicts.join('|')}`);
  arrays(d, ['scope', 'checks', 'failures', 'external_verification_gaps', 'blockers']);

  const failures = d.failures ?? [];
  const gaps = d.external_verification_gaps ?? [];
  const blockers = d.blockers ?? [];
  for (const [i, f] of failures.entries()) {
    for (const k of ['expected', 'actual', 'evidence', 'severity', 'owner', 'retest_condition']) {
      if (f?.[k] == null || f[k] === '') errors.push(`failures[${i}].${k} required`);
    }
  }
  if (d.verdict === 'PASS_TO_STAGING' && (failures.length || gaps.length || blockers.length)) errors.push('PASS_TO_STAGING cannot contain failures, external gaps or blockers');
  if (d.verdict === 'PASS_WITH_EXTERNAL_VERIFICATION' && !gaps.length) errors.push('PASS_WITH_EXTERNAL_VERIFICATION requires external_verification_gaps');
  if (d.verdict === 'NEEDS_FIX' && !failures.length) errors.push('NEEDS_FIX requires failures');
  if (d.verdict === 'BLOCKED' && !blockers.length) errors.push('BLOCKED requires blockers');
}

if (errors.length) {
  console.error(errors.map((e) => `- ${e}`).join('\n'));
  process.exit(1);
}
console.log(`OK: ${kind} is valid`);
