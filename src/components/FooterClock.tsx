"use client";

import { useEffect, useState } from "react";

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-GB", { hour12: false });
}

export function FooterClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(formatTime(new Date()));
    const id = setInterval(() => setTime(formatTime(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <time className="inline-block min-w-[8ch] text-right font-display text-xs text-muted tabular-nums"
    >
      {time ?? "\u00a0"}
    </time>
  );
}
