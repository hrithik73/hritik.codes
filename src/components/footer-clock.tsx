"use client";

import { useSyncExternalStore } from "react";

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-GB", { hour12: false });
}

// The wall clock is an external source that changes on its own, so read it
// through useSyncExternalStore instead of mirroring it into state from an Effect.
function subscribe(onTick: () => void) {
  const id = setInterval(onTick, 1000);
  return () => clearInterval(id);
}

const getSnapshot = () => formatTime(new Date());
// The server can't know the visitor's local time; render a placeholder and let
// the client fill it in after hydration.
const getServerSnapshot = () => null;

export function FooterClock() {
  const time = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <time className="inline-block min-w-[8ch] text-right font-mono text-xs text-muted tabular-nums">
      {time ?? " "}
    </time>
  );
}
