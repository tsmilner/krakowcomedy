<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Event data

This calendar is public. Wrong events waste people's time and damage trust.

- **Never** add or infer events without a direct `facebook.com/events/{id}` URL (user-supplied or from `npm run sync:facebook`).
- **Never** guess dates from recurring patterns, aggregator sites, or past editions.
- When in doubt, leave it out and ask the user for the link.
