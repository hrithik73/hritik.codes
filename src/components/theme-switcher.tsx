"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { capture } from "~/lib/analytics";
import { useIsClient } from "~/lib/use-is-client";

const CYCLE: Record<string, string> = {
  system: "light",
  light: "dark",
  dark: "system",
};

const LABELS: Record<string, string> = {
  system: "Switch to light mode",
  light: "Switch to dark mode",
  dark: "Switch to system theme",
};

const CLICK_DURATION = 0.035;

// One shared context: creating a new AudioContext per click means the audio
// device has to spin up every time, and that startup latency often swallows
// the entire 35ms click — which is why the sound was intermittent.
let audio: { ctx: AudioContext; buffer: AudioBuffer } | null = null;

function getAudio() {
  if (!audio) {
    const ctx = new AudioContext();
    const size = Math.floor(ctx.sampleRate * CLICK_DURATION);
    const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < size; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / size) ** 10;
    }
    audio = { ctx, buffer };
  }
  return audio;
}

function scheduleClick(ctx: AudioContext, buffer: AudioBuffer) {
  // Small lead time so the start isn't already in the past when rendered.
  const start = ctx.currentTime + 0.005;

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1400;
  filter.Q.value = 0.7;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.35, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + CLICK_DURATION);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(start);
  noise.onended = () => {
    noise.disconnect();
    filter.disconnect();
    gain.disconnect();
  };
}

function playClickSound() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  try {
    const { ctx, buffer } = getAudio();
    if (ctx.state !== "running") {
      // Safari can create contexts suspended / mark them "interrupted".
      ctx
        .resume()
        .then(() => scheduleClick(ctx, buffer))
        .catch(() => {});
    } else {
      scheduleClick(ctx, buffer);
    }
  } catch {}
}

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  // The stored theme is only known on the client; render a same-size
  // placeholder until hydration so server and client markup match.
  const isClient = useIsClient();
  const [iconKey, setIconKey] = useState(0);

  if (!isClient) {
    return <div className="w-8 h-8" />;
  }

  const current = theme ?? "system";

  function handleClick() {
    const next = CYCLE[current] ?? "light";
    playClickSound();
    setIconKey((k) => k + 1);
    setTheme(next);
    capture("theme_preference_changed", { theme: next });
  }

  const Icon = current === "dark" ? Moon : current === "light" ? Sun : Monitor;

  return (
    <button
      type="button"
      onClick={handleClick}
      className="p-3.5 -m-2 cursor-pointer text-muted hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded"
      aria-label={LABELS[current]}
      title={LABELS[current]}
    >
      <span key={iconKey} className="block theme-icon-turn">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
    </button>
  );
}
