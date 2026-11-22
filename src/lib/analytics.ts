import type { PostHog, Properties } from "posthog-js";

/*
 * PostHog, kept off the critical path. The SDK is ~120 KB gzipped, so it's
 * fetched as its own chunk once the page is idle (see instrumentation-client.ts)
 * or on the first tracked event, whichever comes first — never before hydration.
 */

let client: Promise<PostHog | null> | undefined;

export function loadPostHog() {
  client ??= import("posthog-js").then(({ posthog }) => {
    const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (!token || !host) {
      if (process.env.NODE_ENV === "development") {
        const missingVariable = token
          ? "NEXT_PUBLIC_POSTHOG_HOST"
          : "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN";
        console.error(
          new Error(
            `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
          ),
        );
      }
      return null;
    }

    posthog.init(token, {
      // Routed through the /ingest rewrite in next.config.ts to avoid ad blockers.
      api_host: "/ingest",
      ui_host: host.replace(/\.i\.posthog\.com$/, ".posthog.com"),
      defaults: "2026-08-30",
      capture_exceptions: true,
      debug: process.env.NODE_ENV === "development",
    });
    return posthog;
  });
  return client;
}

export function capture(event: string, properties?: Properties) {
  void loadPostHog().then((posthog) => posthog?.capture(event, properties));
}

export function captureException(error: unknown) {
  void loadPostHog().then((posthog) => posthog?.captureException(error));
}
