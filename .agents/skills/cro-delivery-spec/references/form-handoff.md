# Form Requirements handoff

When the implementation involves a form, emit a `form_requirements` object for `implement-forms`.

Required fields:
- `pattern`: `guide | quiz | programme`;
- `path_family`: `/guide | /quiz | /formation/<slug> | existing-route`;
- `form_key`, `form_version`, `page_key`, `page_version`;
- `conversion_event` from the approved Measurement Contract or existing production contract;
- `contact.name_mode`: `full_name | first_last`;
- required/optional contact fields;
- dynamic business fields with purpose, type, required state and allowed values when known;
- quiz definition if relevant, with arbitrary question IDs and outputs;
- consent requirements;
- destination requirements;
- success/thank-you behavior;
- evidence and unresolved decisions.

Do not define SQL/Convex implementation here. `implement-forms` owns the canonical data and persistence contract.
