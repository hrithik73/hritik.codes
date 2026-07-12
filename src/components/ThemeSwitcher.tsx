"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

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

function playClickSound() {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  try {
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    const bufferSize = Math.floor(ctx.sampleRate * 0.035);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 10);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1400;
    filter.Q.value = 0.7;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.onended = () => ctx.close();
  } catch {}
}

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [iconKey, setIconKey] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = useCallback(() => {
    const current = theme ?? "system";
    const next = CYCLE[current] ?? "light";
    playClickSound();
    setIconKey((k) => k + 1);
    setTheme(next);
  }, [theme, setTheme]);

  if (!mounted) {
    return <div className="w-8 h-8" />;
  }

  const current = theme ?? "system";
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
