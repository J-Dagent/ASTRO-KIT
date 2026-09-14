# Canonical Form Definition

`FormDefinition` is the configuration seam. It tells the implementation what the form needs without prescribing React component internals.

Required concepts:
- `key`, `version`;
- `pattern`: `guide | quiz | programme`;
- route/page identity;
- conversion event from existing/approved measurement taxonomy;
- contact requirements;
- dynamic fields;
- optional quiz definition;
- consent requirements;
- attribution profile;
- success behavior.

## Contact modes

### `full_name`
The user provides `full_name`. The trusted server preserves it as source of truth and may derive `first_name` and `last_name` using a documented parser.

### `first_last`
The user provides `first_name` and `last_name`. The server derives `full_name`.

Never use a field named `prenom` to carry a full name.

## Dynamic field types
Support at least:
- `text`;
- `textarea`;
- `number`;
- `date`;
- `select`;
- `radio`;
- `checkbox`;
- `multi_select`.

Each dynamic field defines:
- `key` (stable machine name);
- `type`;
- `required`;
- `purpose`;
- validation constraints;
- options when applicable;
- optional `destination_hints` for downstream mapping.

Dynamic business fields never become canonical database columns automatically.

## Field roles
Distinguish:
1. visible canonical contact fields;
2. visible dynamic business fields;
3. quiz answers/outputs;
4. hidden/config context (`form_key`, versions, page key, conversion event, experiment variant);
5. system-collected attribution/analytics/consent;
6. server-derived technical/normalized values.

Hidden DOM inputs may exist for compatibility or inspection, but they are never the authority for system tracking context.
