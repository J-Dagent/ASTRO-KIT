#!/usr/bin/env node
import fs from 'node:fs';

const [,, kind, file] = process.argv;
if (!kind || !file || !['form','lead','n8n','env'].includes(kind)) {
  console.error('Usage: node scripts/validate-contracts.mjs <form|lead|n8n|env> <json-file>');
  process.exit(2);
}
let data;
try { data = JSON.parse(fs.readFileSync(file, 'utf8')); }
catch (err) { console.error(`Invalid JSON: ${err.message}`); process.exit(1); }

const errors = [];
const req = (obj, key, path=key) => {
  if (obj == null || !(key in obj) || obj[key] === '' || obj[key] === undefined) errors.push(`Missing ${path}`);
};
const requireKeys = (obj, keys, path) => keys.forEach(k => req(obj, k, `${path}.${k}`));

const validateAttribution = (a, path='attribution') => {
  if (!a || typeof a !== 'object') { errors.push(`Missing ${path}`); return; }
  requireKeys(a, ['schema_version','captured_at','capture_model','channel','entry','utm','google','meta','tiktok','analytics'], path);
  if (a.entry) requireKeys(a.entry, ['landing_page_url','referrer'], `${path}.entry`);
  if (a.utm) requireKeys(a.utm, ['source','medium','campaign','content','term','id','offer','persona','stage','angle','hook','format','country'], `${path}.utm`);
  if (a.google) requireKeys(a.google, ['gclid','gbraid','wbraid','campaign_id','ad_group_id','ad_id','keyword','match_type','device','network'], `${path}.google`);
  if (a.meta) requireKeys(a.meta, ['fbclid','fbc','fbp','campaign_id','ad_set_id','ad_id','placement','device'], `${path}.meta`);
  if (a.tiktok) requireKeys(a.tiktok, ['ttclid','ttp','campaign_id','ad_group_id','ad_id','placement','device'], `${path}.tiktok`);
  if (a.analytics) requireKeys(a.analytics, ['posthog_distinct_id','posthog_session_id','ga_client_id','ga_session_id'], `${path}.analytics`);
};

const validateConsent = (c, path='consent') => {
  if (!c || typeof c !== 'object') { errors.push(`Missing ${path}`); return; }
  requireKeys(c, ['source','necessary','preferences','analytics','marketing','method','version','captured_at','region','stamp','parse_error'], path);
};

if (kind === 'form') {
  for (const k of ['key','version','pattern','page','conversion_event','contact','fields','consent','attribution','success']) req(data,k);
  if (data.pattern && !['guide','quiz','programme'].includes(data.pattern)) errors.push('pattern must be guide|quiz|programme');
  if (data.page) { req(data.page,'key','page.key'); req(data.page,'version','page.version'); }
  if (data.contact && !['full_name','first_last'].includes(data.contact.name_mode)) errors.push('contact.name_mode must be full_name|first_last');
  if (!Array.isArray(data.fields)) errors.push('fields must be an array');
  if (data.pattern === 'quiz' && (!data.quiz || typeof data.quiz !== 'object')) errors.push('quiz pattern requires quiz object');
  if (data.pattern !== 'quiz' && data.quiz != null && typeof data.quiz !== 'object') errors.push('quiz must be null or an object');
}

if (kind === 'lead') {
  const required = ['schema_version','event_id','created_at','form_key','form_version','page_key','page_version','conversion_event','payload_json'];
  required.forEach(k => req(data,k));
  const p = data.payload_json;
  if (!p || typeof p !== 'object') errors.push('Missing payload_json');
  else {
    requireKeys(p, ['form','attribution','consent','technical','experiments'], 'payload_json');
    if (p.form) requireKeys(p.form, ['location','fields','quiz'], 'payload_json.form');
    validateAttribution(p.attribution, 'payload_json.attribution');
    validateConsent(p.consent, 'payload_json.consent');
    if (p.technical) requireKeys(p.technical, ['user_agent','ip_hash','locale'], 'payload_json.technical');

    const a = p.attribution;
    if (a) {
      const projection = [
        ['channel', a?.channel],
        ['utm_source', a?.utm?.source], ['utm_medium',a?.utm?.medium], ['utm_campaign',a?.utm?.campaign],
        ['utm_content',a?.utm?.content], ['utm_term',a?.utm?.term], ['utm_id',a?.utm?.id],
        ['gclid',a?.google?.gclid], ['gbraid',a?.google?.gbraid], ['wbraid',a?.google?.wbraid],
        ['fbclid',a?.meta?.fbclid], ['fbc',a?.meta?.fbc], ['fbp',a?.meta?.fbp],
        ['ttclid',a?.tiktok?.ttclid], ['ttp',a?.tiktok?.ttp],
        ['landing_page_url',a?.entry?.landing_page_url], ['referrer',a?.entry?.referrer],
        ['posthog_distinct_id',a?.analytics?.posthog_distinct_id]
      ];
      for (const [column,value] of projection) {
        if ((data[column] ?? null) !== (value ?? null)) errors.push(`Projection mismatch: ${column}`);
      }
    }
    if ((data.consent_marketing ?? null) !== (p?.consent?.marketing ?? null)) errors.push('Projection mismatch: consent_marketing');
    if ((data.consent_analytics ?? null) !== (p?.consent?.analytics ?? null)) errors.push('Projection mismatch: consent_analytics');
  }
}

if (kind === 'env') {
  requireKeys(data, ['backend_mode','trusted_intake','delivery_owner','required_configuration','new_configuration','n8n_webhook','form_specific_n8n_webhook_required','notes'], 'env');
  if (!['<neon|convex>','neon','convex'].includes(data.backend_mode)) errors.push('backend_mode must be neon|convex');
  if (!Array.isArray(data.required_configuration)) errors.push('required_configuration must be an array');
  if (!Array.isArray(data.new_configuration)) errors.push('new_configuration must be an array');
  if (!data.n8n_webhook || typeof data.n8n_webhook !== 'object') errors.push('n8n_webhook must be an object');
  else requireKeys(data.n8n_webhook, ['resolved_secret_name','status','write_requires_approval'], 'n8n_webhook');
  for (const [listName, list] of [['required_configuration', data.required_configuration], ['new_configuration', data.new_configuration]]) {
    if (!Array.isArray(list)) continue;
    list.forEach((item, i) => {
      if (!item || typeof item !== 'object') { errors.push(`${listName}[${i}] must be an object`); return; }
      requireKeys(item, ['name','classification','location','reason'], `${listName}[${i}]`);
      if (item.classification && !['<public|private|secret>','public','private','secret'].includes(item.classification)) errors.push(`${listName}[${i}].classification must be public|private|secret`);
    });
  }
}

if (kind === 'n8n') {
  for (const k of ['schema_version','lead','contact','form','attribution','consent','technical']) req(data,k);
  if (data.lead) requireKeys(data.lead, ['id','event_id','submitted_at','form_key','form_version','page_key','page_version','conversion_event'], 'lead');
  if (data.contact) requireKeys(data.contact, ['full_name','first_name','last_name','email','phone'], 'contact');
  if (data.form) requireKeys(data.form, ['location','fields','quiz'], 'form');
  validateAttribution(data.attribution, 'attribution');
  validateConsent(data.consent, 'consent');
  if (data.technical) requireKeys(data.technical, ['user_agent','ip_hash','locale'], 'technical');
}

if (errors.length) {
  console.error(errors.map(e => `- ${e}`).join('\n'));
  process.exit(1);
}
console.log(`OK: ${kind} contract is structurally valid`);
