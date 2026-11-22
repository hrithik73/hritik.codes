"use client";

import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  Moon,
  Snowflake,
  Sun,
  ThermometerSun,
  Wind,
} from "lucide-react";
import { posthog } from "posthog-js";
import { type CSSProperties, useSyncExternalStore } from "react";
import { mulberry32 } from "~/lib/meadow";
import { parseWeatherOverride, type Weather } from "~/lib/weather";

/* ---------- store: fetched once per page load, shared by every reader ---------- */

let current: Weather | null = null;
let started = false;
const listeners = new Set<() => void>();

function publish(weather: Weather) {
  current = weather;
  for (const l of listeners) l();
}

async function load() {
  const override = parseWeatherOverride(
    new URLSearchParams(window.location.search).get("weather"),
  );
  if (override) return publish(override);
  try {
    const res = await fetch("/api/weather");
    if (res.status === 200) publish(await res.json());
  } catch {
    // No weather is fine: the meadow just stays as it is.
  }
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  if (!started) {
    started = true;
    void load();
  }
  return () => listeners.delete(onChange);
}

export function useWeather() {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );
}

/** Data attributes the meadow CSS keys off. */
export function weatherAttributes(weather: Weather | null) {
  if (!weather) return {};
  return {
    "data-weather": weather.condition,
    "data-windy": weather.windy ? "" : undefined,
    "data-hot": weather.hot ? "" : undefined,
    "data-day": weather.isDay ? "" : undefined,
  };
}

/* ---------- particles, seeded so they're the same on every visit ---------- */

const rand = mulberry32(2611);
const between = (min: number, max: number) =>
  Math.round((min + rand() * (max - min)) * 10) / 10;

const drops = Array.from({ length: 72 }, () => ({
  left: between(-4, 100),
  fall: between(115, 160),
  duration: between(0.55, 0.85),
  delay: between(-2, 0),
  length: between(9, 16),
}));

const flakes = Array.from({ length: 44 }, () => ({
  left: between(-4, 100),
  fall: between(120, 160),
  size: between(2, 4.5),
  duration: between(5, 9),
  delay: between(-9, 0),
}));

const leaves = Array.from({ length: 6 }, () => ({
  top: between(55, 140),
  duration: between(3.5, 6),
  delay: between(-6, 0),
  hue: between(95, 135),
}));

const dropCount = { drizzle: 26, rain: 52, storm: 72 } as const;

type Vars = CSSProperties & Record<`--${string}`, string | number>;

export function WeatherFx({ weather }: { weather: Weather }) {
  const { condition, windy, hot } = weather;
  const wet =
    condition === "drizzle" || condition === "rain" || condition === "storm";
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  return (
    <div
      aria-hidden="true"
      className="wx"
      style={
        {
          "--drift": windy ? "42px" : "6px",
          "--tilt": windy ? "16deg" : "2deg",
        } as Vars
      }
    >
      {wet &&
        drops.slice(0, dropCount[condition]).map((d, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: static, generated once
            key={i}
            className="wx-drop"
            style={
              {
                left: `${d.left}%`,
                height: condition === "drizzle" ? d.length * 0.6 : d.length,
                "--fall": `${d.fall}px`,
                animationDuration: `${condition === "drizzle" ? d.duration * 1.4 : d.duration}s`,
                animationDelay: `${d.delay}s`,
              } as Vars
            }
          />
        ))}

      {condition === "snow" &&
        flakes.map((f, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: static, generated once
            key={i}
            className="wx-flake"
            style={
              {
                left: `${f.left}%`,
                width: f.size,
                height: f.size,
                "--fall": `${f.fall}px`,
                animationDuration: `${windy ? f.duration * 0.6 : f.duration}s`,
                animationDelay: `${f.delay}s`,
              } as Vars
            }
          />
        ))}

      {windy &&
        !wet &&
        condition !== "snow" &&
        leaves.map((l, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: static, generated once
            key={i}
            className="wx-leaf"
            style={
              {
                top: l.top,
                "--hue": l.hue,
                animationDuration: `${l.duration}s`,
                animationDelay: `${l.delay}s`,
              } as Vars
            }
          />
        ))}

      {condition === "fog" &&
        [0, 1, 2].map((i) => <span key={i} className={`wx-fog wx-fog-${i}`} />)}

      {condition === "cloudy" && <span className="wx-shade" />}
      {condition === "storm" && <span className="wx-flash" />}
      {hot && <span className="wx-sun" />}

      {hot && (
        <svg width="0" height="0" className="absolute" aria-hidden="true">
          <filter id="wx-heat">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.09"
              numOctaves="1"
              seed="3"
            >
              {!reduceMotion && (
                <animate
                  attributeName="baseFrequency"
                  dur="7s"
                  values="0.012 0.09;0.014 0.11;0.012 0.09"
                  repeatCount="indefinite"
                />
              )}
            </feTurbulence>
            {/* Sideways ripple only, so the ground's bottom edge stays put */}
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0.5  0 0 1 0 0  0 0 0 1 0"
            />
            <feDisplacementMap
              in="SourceGraphic"
              scale="6"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>
      )}
    </div>
  );
}

/* ---------- the little readout next to the clock ---------- */

function WeatherIcon({ weather }: { weather: Weather }) {
  const props = { className: "size-3.5 shrink-0", "aria-hidden": true };
  if (weather.condition === "storm") return <CloudLightning {...props} />;
  if (weather.condition === "snow") return <Snowflake {...props} />;
  if (weather.condition === "rain") return <CloudRain {...props} />;
  if (weather.condition === "drizzle") return <CloudDrizzle {...props} />;
  if (weather.condition === "fog") return <CloudFog {...props} />;
  if (weather.hot) return <ThermometerSun {...props} />;
  if (weather.windy) return <Wind {...props} />;
  if (weather.condition === "cloudy") return <Cloud {...props} />;
  return weather.isDay ? <Sun {...props} /> : <Moon {...props} />;
}

/** Lives in the sticky header so it's seen; clicking it goes to the meadow. */
export function WeatherChip({ weather }: { weather: Weather }) {
  function goToMeadow() {
    posthog.capture("weather_chip_clicked", { condition: weather.condition });
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    document
      .querySelector(".site-footer")
      ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "end" });
  }

  return (
    <button
      type="button"
      onClick={goToMeadow}
      title={`${weather.summary} in ${weather.place} right now. The meadow at the bottom knows.`}
      aria-label={`${weather.temp}°, ${weather.summary} in ${weather.place}. Go to the meadow.`}
      className="wx-chip inline-flex items-center gap-1.5 text-sm text-muted tabular-nums hover:text-ink transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
    >
      <WeatherIcon weather={weather} />
      {weather.temp}°
      <span className="hidden sm:inline">in {weather.place}</span>
    </button>
  );
}
