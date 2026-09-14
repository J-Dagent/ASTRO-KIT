# Cloudflare Runtime Examples

These Durable Object and Workflow files are reference implementations for template consumers. They are outside active runtime source, are not registered as bindings by default, and are not deployed automatically.

To activate an example, add the appropriate Durable Object migration or Workflow binding to `apps/data-service/wrangler.jsonc`, export/register the entrypoint required by Cloudflare, and regenerate Worker declarations with the workspace `cf-typegen` command. Review Cloudflare's current runtime documentation before activation.
