#!/usr/bin/env node
import fs from 'node:fs'; const file=process.argv[2]; if(!file){console.error('Usage: node scripts/validate-report.mjs <report.json>');process.exit(2)}
let r; try{r=JSON.parse(fs.readFileSync(file,'utf8'))}catch(e){console.error(e.message);process.exit(1)} const errors=[];
const verdicts=['PASS_TO_STAGING','PASS_WITH_EXTERNAL_VERIFICATION','NEEDS_FIX','NEEDS_EVIDENCE','BLOCKED']; if(!verdicts.includes(r.verdict)) errors.push('Invalid verdict');
for(const k of ['scope','checks','failures','external_verification_gaps','blockers']) if(!Array.isArray(r[k])) errors.push(`${k} must be an array`);
for(const [i,f] of (r.failures||[]).entries()) for(const k of ['expected','actual','evidence','severity','owner','retest_condition']) if(!(k in f)||f[k]===null||f[k]==='') errors.push(`failures[${i}].${k} required`);
if(r.verdict==='PASS_TO_STAGING' && ((r.failures||[]).length || (r.external_verification_gaps||[]).length || (r.blockers||[]).length)) errors.push('PASS_TO_STAGING cannot contain failures, external gaps, or blockers');
if(r.verdict==='PASS_WITH_EXTERNAL_VERIFICATION' && !(r.external_verification_gaps||[]).length) errors.push('PASS_WITH_EXTERNAL_VERIFICATION requires external_verification_gaps');
if(r.verdict==='NEEDS_FIX' && !(r.failures||[]).length) errors.push('NEEDS_FIX requires failures');
if(r.verdict==='BLOCKED' && !(r.blockers||[]).length) errors.push('BLOCKED requires blockers');
if(errors.length){console.error(errors.map(x=>`- ${x}`).join('\n'));process.exit(1)} console.log('OK: CRO validation report valid');
