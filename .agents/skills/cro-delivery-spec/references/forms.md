# Form requirements handoff

When a form is in scope, pass only business and behavior requirements to `implement-forms`.

Include:
- form/page identity and version when already owned;
- pattern or interaction shape, including `custom` when no preset fits;
- route or surface where the form appears;
- approved conversion event or measurement reference;
- contact fields and name mode when decided;
- dynamic business fields, allowed values, required state, and purpose when known;
- quiz/question definitions and outputs when relevant;
- consent requirements;
- destination/delivery requirements without dictating implementation;
- success/thank-you behavior;
- evidence and unresolved decisions.

Do not define SQL tables, Convex functions, ORM choices, attribution helpers, or delivery code here. Those belong to `implement-forms` and the existing repository architecture.
