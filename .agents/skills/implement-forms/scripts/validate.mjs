#!/usr/bin/env node
// Usage: node scripts/validate.mjs <form|submission|delivery|env> <file.json>
// Required keys are read from the templates in ../assets, which stay the single source of truth.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const assets = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'assets');
const load = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const template = (name) => load(path.join(assets, name));

const [, , kind, file] = process.argv;
const KINDS = { form: 'form-definition.json', submission: 'submission.json', delivery: 'delivery-payload.json', env: 'environment.json' };
if (!KINDS[kind] || !file) {
  console.error('Usage: node scripts/validate.mjs <form|submission|delivery|env> <json-file>');
  process.exit(2);
}

let data;
try { data = load(file); }
catch (err) { console.error(`Invalid JSON: ${err.message}`); process.exit(1); }

const errors = [];
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const missing = (obj, key) => !isObj(obj) || !(key in obj) || obj[key] === undefined || obj[key] === '';
const get = (obj, dotted) => dotted.split('.').reduce((o, k) => (isObj(o) ? o[k] : undefined), obj);

// Every key of the template must exist in the data (null allowed), recursing through objects.
// Paths in `open` are dynamic or free-form: their presence is checked, not their content.
function shape(tpl, obj, at, open) {
  for (const key of Object.keys(tpl)) {
    const p = at ? `${at}.${key}` : key;
    if (missing(obj, key)) { errors.push(`Missing ${p}`); continue; }
    if (isObj(tpl[key]) && !open.has(p) && obj[key] !== null) {
      if (!isObj(obj[key])) errors.push(`${p} must be an object`);
      else shape(tpl[key], obj[key], p, open);
    }
  }
}

if (kind === 'form') {
  shape(template(KINDS.form), data, '', new Set(['contact', 'consent', 'attribution', 'success']));
  const c = data.contact;
  if (isObj(c)) {
    if (!['first_last', 'full_name'].includes(c.name_mode)) errors.push('contact.name_mode must be first_last|full_name');
    const need = c.name_mode === 'full_name' ? ['full_name', 'email'] : ['first_name', 'last_name', 'email'];
    for (const k of need) if (missing(c, k)) errors.push(`Missing contact.${k}`);
  }
  if (!Array.isArray(data.fields)) errors.push('fields must be an array');
  if (data.quiz != null && !isObj(data.quiz)) errors.push('quiz must be null or an object');
  if (data.pattern === 'quiz' && !isObj(data.quiz)) errors.push('quiz pattern requires a quiz object');
}

if (kind === 'submission') {
  const tpl = template(KINDS.submission);
  const IDENTITY = ['schema_version', 'event_id', 'created_at', 'form_key', 'form_version', 'page_key', 'page_version', 'conversion_event'];
  const CONTACT = ['first_name', 'last_name', 'email', 'full_name', 'phone'];
  // Top-level projection -> canonical value inside payload_json.
  const PROJECTIONS = {
    channel: 'attribution.channel',
    utm_source: 'attribution.utm.source', utm_medium: 'attribution.utm.medium', utm_campaign: 'attribution.utm.campaign',
    utm_content: 'attribution.utm.content', utm_term: 'attribution.utm.term', utm_id: 'attribution.utm.id',
    gclid: 'attribution.google.gclid', gbraid: 'attribution.google.gbraid', wbraid: 'attribution.google.wbraid',
    fbclid: 'attribution.meta.fbclid', fbc: 'attribution.meta.fbc', fbp: 'attribution.meta.fbp',
    ttclid: 'attribution.tiktok.ttclid', ttp: 'attribution.tiktok.ttp',
    landing_page_url: 'attribution.entry.landing_page_url', referrer: 'attribution.entry.referrer',
    posthog_distinct_id: 'attribution.analytics.posthog_distinct_id',
    consent_marketing: 'consent.marketing', consent_analytics: 'consent.analytics',
  };
  for (const k of Object.keys(tpl)) {
    if (![...IDENTITY, ...CONTACT, 'payload_json'].includes(k) && !(k in PROJECTIONS)) errors.push(`Template key ${k} has no projection rule in validate.mjs`);
  }
  for (const k of [...IDENTITY, 'payload_json']) if (missing(data, k)) errors.push(`Missing ${k}`);
  if (isObj(data.payload_json)) {
    shape(tpl.payload_json, data.payload_json, 'payload_json', new Set(['payload_json.form.fields', 'payload_json.form.quiz', 'payload_json.experiments']));
    for (const [column, nested] of Object.entries(PROJECTIONS)) {
      if ((data[column] ?? null) !== (get(data.payload_json, nested) ?? null)) errors.push(`Projection mismatch: ${column} != payload_json.${nested}`);
    }
  } else if ('payload_json' in data) errors.push('payload_json must be an object');
}

if (kind === 'delivery') {
  shape(template(KINDS.delivery), data, '', new Set(['form.fields', 'form.quiz']));
}

if (kind === 'env') {
  shape(template(KINDS.env), data, '', new Set());
  if (!['<postgres|convex>', 'postgres', 'convex'].includes(data.backend_mode)) errors.push('backend_mode must be postgres|convex');
  for (const list of ['required_configuration', 'new_configuration']) {
    if (!Array.isArray(data[list])) { errors.push(`${list} must be an array`); continue; }
    data[list].forEach((item, i) => {
      for (const k of ['name', 'classification', 'location', 'reason']) if (missing(item, k)) errors.push(`Missing ${list}[${i}].${k}`);
      if (isObj(item) && !['<public|private|secret>', 'public', 'private', 'secret'].includes(item.classification)) {
        errors.push(`${list}[${i}].classification must be public|private|secret`);
      }
    });
  }
}

if (errors.length) {
  console.error(errors.map((e) => `- ${e}`).join('\n'));
  process.exit(1);
}
console.log(`OK: ${kind} contract is structurally valid`);
