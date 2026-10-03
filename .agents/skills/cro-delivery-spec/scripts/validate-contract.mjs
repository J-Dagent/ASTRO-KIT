#!/usr/bin/env node
import fs from 'node:fs';

const file = process.argv[2];
if (!file) { console.error('Usage: node scripts/validate-contract.mjs <contract.json>'); process.exit(2); }
let c;
try { c = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { console.error(e.message); process.exit(1); }
const errors = [];
const required = ['schema_version','status','identity','context','approved_experience','design','measurement','implementation','acceptance_criteria','evidence','blockers'];
for (const k of required) if (!(k in c)) errors.push(`Missing ${k}`);
const statuses = ['READY','NEEDS_EVIDENCE','UNKNOWN','BLOCKED'];
if (!statuses.includes(c.status)) errors.push('Invalid status');
for (const k of ['acceptance_criteria','evidence','blockers']) if (!Array.isArray(c[k])) errors.push(`${k} must be an array`);
if (!c.implementation || typeof c.implementation !== 'object') errors.push('implementation must be an object');
else {
  if (!Array.isArray(c.implementation.change_surfaces)) errors.push('implementation.change_surfaces must be an array');
  if (!['low','medium','high'].includes(c.implementation.risk)) errors.push('implementation.risk must be low|medium|high');
  if (c.implementation.risk === 'high' && !c.implementation.rollback) errors.push('High-risk contract requires rollback');
}
if (c.status === 'READY' && c.blockers?.length) errors.push('READY contract cannot contain blockers');
if (!c.acceptance_criteria?.length || c.acceptance_criteria.some(x => typeof x !== 'string' || !x.trim())) errors.push('At least one non-empty acceptance criterion is required');
if (c.form_requirements) {
  const f = c.form_requirements;
  for (const k of ['pattern','route_or_surface','form_key','form_version','page_key','page_version','conversion_event','contact','consent','destination','success','evidence','unresolved']) if (!(k in f)) errors.push(`Missing form_requirements.${k}`);
  if (!Array.isArray(f.evidence)) errors.push('form_requirements.evidence must be an array');
  if (!Array.isArray(f.unresolved)) errors.push('form_requirements.unresolved must be an array');
  if (c.status === 'READY' && f.unresolved?.length) errors.push('READY contract cannot contain unresolved form requirements');
}
const serialized = JSON.stringify(c);
if (/<[^>]+>/.test(serialized)) errors.push('Contract contains unresolved placeholder tokens');
if (errors.length) { console.error(errors.map(x => `- ${x}`).join('\n')); process.exit(1); }
console.log('OK: conversion implementation contract is valid');
