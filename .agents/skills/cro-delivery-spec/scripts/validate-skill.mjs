#!/usr/bin/env node
import fs from 'node:fs'; import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..'); const errors=[];
if (fs.existsSync(path.join(root,'actions'))) errors.push('actions/ must not exist');
for (const f of ['references/contract.md','references/forms.md','assets/conversion-implementation-contract.template.json','evals/scenarios.json']) if (!fs.existsSync(path.join(root,f))) errors.push(`Missing ${f}`);
const skill=fs.readFileSync(path.join(root,'SKILL.md'),'utf8');
for (const term of ['Astro'+' Kit','SaaS'+' Kit','saas'+'-kit','astro'+'-kit']) if (skill.includes(term)) errors.push(`Residual stack term: ${term}`);
const evals=JSON.parse(fs.readFileSync(path.join(root,'evals/scenarios.json'),'utf8')); if (!Array.isArray(evals)||evals.length<5) errors.push('Need at least 5 eval scenarios');
if (errors.length){console.error(errors.map(x=>`- ${x}`).join('\n'));process.exit(1)} console.log('OK: cro-delivery-spec structure valid');
