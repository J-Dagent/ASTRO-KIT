#!/usr/bin/env node
import fs from 'node:fs';
const file=process.argv[2]; if(!file){console.error('Usage: node scripts/validate-audit.mjs <audit.md>');process.exit(2)}
const s=fs.readFileSync(file,'utf8'); const errors=[];
for(const h of ['# CRO_AUDIT','## Diagnosis','## Message Match','## Next Experiments','## Handoff']) if(!s.includes(h)) errors.push(`Missing ${h}`);
const m=s.match(/^Status:\s*(\S+)/m); if(!m||!['READY','NEEDS_EVIDENCE','UNKNOWN','BLOCKED'].includes(m[1])) errors.push('Invalid or missing Status');
const section=(s.split('## Next Experiments')[1]||'').split('## Handoff')[0]||'';
const rows=section.split('\n').filter(x=>x.trim().startsWith('|')&&!/^\|\s*#\s*\|/.test(x)&&!/^[|\s:-]+$/.test(x));
if(rows.length>3) errors.push('More than 3 experiments');
if(errors.length){console.error(errors.map(x=>`- ${x}`).join('\n'));process.exit(1)} console.log('OK: CRO audit structure valid');
