#!/usr/bin/env node
import fs from 'node:fs'; import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..'); const errors=[];
if(fs.existsSync(path.join(root,'actions'))) errors.push('actions/ must not exist');
const refs=fs.readdirSync(path.join(root,'references')).filter(x=>x.endsWith('.md')).sort(); const expected=['qa.md','verdicts.md']; if(JSON.stringify(refs)!==JSON.stringify(expected)) errors.push(`Unexpected references: ${refs.join(', ')}`);
let all=''; for(const f of ['SKILL.md',...refs.map(x=>'references/'+x),'evals/scenarios.json']) all += fs.readFileSync(path.join(root,f),'utf8');
for(const term of ['Neon'+' persistence','n8n'+' delivery','n8n'+' status handling']) if(all.includes(term)) errors.push(`Residual coupled term: ${term}`);
const evals=JSON.parse(fs.readFileSync(path.join(root,'evals/scenarios.json'),'utf8')); if(!Array.isArray(evals)||evals.length<6) errors.push('Need at least 6 eval scenarios');
if(errors.length){console.error(errors.map(x=>`- ${x}`).join('\n'));process.exit(1)} console.log('OK: cro-web-validate structure valid');
