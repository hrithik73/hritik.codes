import { loadPostHog } from "~/lib/analytics";

// Runs before hydration, so only schedule the analytics load here: fetching
// the SDK now would compete with the page's own JS. Idle = painted and hydrated.
const start = () => void loadPostHog();

if ("requestIdleCallback" in window) {
  requestIdleCallback(start, { timeout: 4000 });
} else {
  setTimeout(start, 2000);
}
