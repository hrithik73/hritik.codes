# PostHog Data Warehouse Setup

Created 0 of 2 detected sources in PostHog. The browser credential forms did not produce stored credential references for the MCP session, so both sources still need browser setup.

## Changes made

- Inspected PostHog's required connection fields for the detected `Upstash` and `Vercel` source types.
- Generated secure PostHog browser handoffs for both sources.
- Did not change application code or environment files.

## Files modified or created

- Created `posthog-warehouse-report.md`.

## Manual steps

1. Connect Upstash: [Open the Upstash source setup](https://us.i.posthog.com/project/744352/data-warehouse/new-source?kind=Upstash&utm_source=wizard&utm_campaign=warehouse-source). Use a native Upstash account email and a Management API key from **Account > Management API**.
2. Connect Vercel: [Open the Vercel source setup](https://us.i.posthog.com/project/744352/data-warehouse/new-source?kind=Vercel&utm_source=wizard&utm_campaign=warehouse-source). Use a read-only Vercel access token and optionally provide the Team ID for team-owned resources.
3. Rotate the credential values previously entered into the wizard prompts, then use the replacement values only in the linked PostHog forms.

No source was skipped by choice; source creation could not proceed because no consumable stored credential ID became available after either browser handoff.
