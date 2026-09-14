#!/usr/bin/env node
import fs from 'node:fs';
const file = process.argv[2];
if (!file) { console.error('Usage: node scripts/validate-contract.mjs <contract.json>'); process.exit(2); }
let c;
try { c = JSON.parse(fs.readFileSync(file,'utf8')); } catch (e) { console.error(e.message); process.exit(1); }
const errors=[];
for (const k of ['schema_version','status','identity','context','approved_experience','design','measurement','implementation','acceptance_criteria','evidence','blockers']) if (!(k in c)) errors.push(`Missing ${k}`);
if (!['READY','NEEDS_EVIDENCE','UNKNOWN','BLOCKED'].includes(c.status)) errors.push('Invalid status');
if (c.status === 'READY' && c.blockers?.length) errors.push('READY contract cannot contain blockers');
if (c.form_requirements) {
  for (const k of ['pattern','path_family','form_key','form_version','page_key','page_version','conversion_event']) if (!(k in c.form_requirements)) errors.push(`Missing form_requirements.${k}`);
}
if (!Array.isArray(c.acceptance_criteria) || !c.acceptance_criteria.length) errors.push('At least one acceptance criterion is required');
if (errors.length) { console.error(errors.map(x=>`- ${x}`).join('\n')); process.exit(1); }
console.log('OK: conversion implementation contract is structurally valid');
