"use client";

import { Bug, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  DARK_PALETTE_KEY,
  DARK_PALETTES,
  DEBUG_ENABLED_KEY,
  DEFAULT_DARK_PALETTE,
  DEFAULT_SHELF,
  SHELF_KEY,
  SHELF_STYLES,
} from "~/lib/debug";

/*
 * A small floating menu for previewing design variations.
 * Always on in `next dev`; in production, visit with ?debug to turn it on
 * for this browser and ?debug=0 to turn it off (and reset any previews).
 */

/* ---------- enabled: decided once per page load ---------- */

let enabled: boolean | undefined;

function readEnabled() {
  if (enabled !== undefined) return enabled;
  const param = new URLSearchParams(window.location.search).get("debug");
  const dev = process.env.NODE_ENV === "development";
  try {
    if (param === "0" || param === "off") {
      localStorage.removeItem(DEBUG_ENABLED_KEY);
      applyPalette(DEFAULT_DARK_PALETTE);
      applyShelf(DEFAULT_SHELF);
    } else if (param !== null) {
      localStorage.setItem(DEBUG_ENABLED_KEY, "1");
    }
    enabled = dev || localStorage.getItem(DEBUG_ENABLED_KEY) === "1";
  } catch {
    enabled = dev || (param !== null && param !== "0" && param !== "off");
  }
  return enabled;
}

const noopSubscribe = () => () => {};

/* ---------- dark palette: the <html> attribute is the source of truth ---------- */

const listeners = new Set<() => void>();

function applyPalette(id: string) {
  const root = document.documentElement;
  if (id === DEFAULT_DARK_PALETTE) root.removeAttribute("data-dark-palette");
  else root.setAttribute("data-dark-palette", id);
  try {
    if (id === DEFAULT_DARK_PALETTE) localStorage.removeItem(DARK_PALETTE_KEY);
    else localStorage.setItem(DARK_PALETTE_KEY, id);
  } catch {}
  for (const l of listeners) l();
}

function subscribePalette(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

const readPalette = () =>
  document.documentElement.getAttribute("data-dark-palette") ??
  DEFAULT_DARK_PALETTE;

/* ---------- shelf style (/books): same pattern, <html data-shelf> ---------- */

function applyShelf(id: string) {
  const root = document.documentElement;
  if (id === DEFAULT_SHELF) root.removeAttribute("data-shelf");
  else root.setAttribute("data-shelf", id);
  try {
    if (id === DEFAULT_SHELF) localStorage.removeItem(SHELF_KEY);
    else localStorage.setItem(SHELF_KEY, id);
  } catch {}
  for (const l of listeners) l();
}

const readShelf = () =>
  document.documentElement.getAttribute("data-shelf") ?? DEFAULT_SHELF;

/* ---------- UI ---------- */

const rowClass = (active: boolean) =>
  `-mx-1.5 flex cursor-pointer items-center gap-2.5 rounded-md px-1.5 py-1.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
    active ? "bg-surface text-ink" : "text-muted hover:text-ink"
  }`;

export function DebugMenu() {
  const isEnabled = useSyncExternalStore(
    noopSubscribe,
    readEnabled,
    () => false,
  );
  if (!isEnabled) return null;
  return <DebugPanel />;
}

function DebugPanel() {
  const [open, setOpen] = useState(false);
  const palette = useSyncExternalStore(
    subscribePalette,
    readPalette,
    () => DEFAULT_DARK_PALETTE,
  );
  const shelf = useSyncExternalStore(
    subscribePalette,
    readShelf,
    () => DEFAULT_SHELF,
  );
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function choose(id: string) {
    applyPalette(id);
    // Palettes only change dark mode, so jump there to show the preview
    if (resolvedTheme !== "dark") setTheme("dark");
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-2 text-sm">
      {open && (
        <div
          id="debug-panel"
          className="w-64 rounded-lg border border-line bg-bg/95 p-3 shadow-lg backdrop-blur-sm"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs text-muted">debug</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close debug menu"
              className="-m-1 cursor-pointer rounded p-1 text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          </div>

          <p id="debug-palette-label" className="mb-1.5 text-xs text-muted">
            Dark palette
          </p>
          <div
            role="radiogroup"
            aria-labelledby="debug-palette-label"
            className="flex flex-col"
          >
            {DARK_PALETTES.map((p) => {
              const active = p.id === palette;
              return (
                // biome-ignore lint/a11y/useSemanticElements: a styled button row reads better than a native radio here
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => choose(p.id)}
                  className={rowClass(active)}
                >
                  <span
                    className="flex h-5 w-8 shrink-0 items-center justify-center gap-0.5 rounded border border-line"
                    style={{ background: p.swatch[0] }}
                    aria-hidden="true"
                  >
                    <span
                      className="size-1.5 rounded-full"
                      style={{ background: p.swatch[1] }}
                    />
                    <span
                      className="size-1.5 rounded-full"
                      style={{ background: p.swatch[2] }}
                    />
                  </span>
                  <span className="flex-1">{p.label}</span>
                  <span className="text-xs text-muted">{p.note}</span>
                </button>
              );
            })}
          </div>

          <p id="debug-shelf-label" className="mt-3 mb-1.5 text-xs text-muted">
            Shelf <span className="font-mono">/books</span>
          </p>
          <div
            role="radiogroup"
            aria-labelledby="debug-shelf-label"
            className="flex flex-col"
          >
            {SHELF_STYLES.map((st) => {
              const active = st.id === shelf;
              return (
                // biome-ignore lint/a11y/useSemanticElements: matches the palette rows above
                <button
                  key={st.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => applyShelf(st.id)}
                  className={rowClass(active)}
                >
                  <span className="flex-1">{st.label}</span>
                  <span className="text-xs text-muted">{st.note}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="debug-panel"
        aria-label={open ? "Close debug menu" : "Open debug menu"}
        className="cursor-pointer rounded-full border border-line bg-bg/90 p-2 text-muted opacity-60 shadow-sm backdrop-blur-sm transition hover:text-ink hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <Bug className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
