#!/usr/bin/env node
import fs from 'node:fs'; import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..'); const errors=[];
if(fs.existsSync(path.join(root,'actions'))) errors.push('actions/ must not exist');
const refs=fs.readdirSync(path.join(root,'references')).filter(x=>x.endsWith('.md')).sort();
const expected=['experiments.md','heuristics.md','principles.md','rubric.md']; if(JSON.stringify(refs)!==JSON.stringify(expected)) errors.push(`Unexpected references: ${refs.join(', ')}`);
const evals=JSON.parse(fs.readFileSync(path.join(root,'evals/scenarios.json'),'utf8')); if(!Array.isArray(evals)||evals.length<5) errors.push('Need at least 5 eval scenarios');
if(errors.length){console.error(errors.map(x=>`- ${x}`).join('\n'));process.exit(1)} console.log('OK: cro-experience-audit structure valid');
