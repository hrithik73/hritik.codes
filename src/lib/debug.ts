/**
 * Debug menu config. Kept out of the "use client" component so the server
 * layout can import the inline script as a real string.
 */

export const DEBUG_ENABLED_KEY = "debug:enabled";
export const DARK_PALETTE_KEY = "debug:dark-palette";
export const SHELF_KEY = "debug:shelf";

/** The plain `.dark` tokens; selecting it removes the attribute. */
export const DEFAULT_DARK_PALETTE = "midnight";

export type DarkPalette = {
  id: string;
  label: string;
  note: string;
  /** bg, ink, accent: for the swatch in the menu only */
  swatch: [string, string, string];
};

// Tokens for each live in globals.css under .dark[data-dark-palette="…"]
export const DARK_PALETTES: DarkPalette[] = [
  {
    id: "midnight",
    label: "Midnight",
    note: "default",
    swatch: [
      "oklch(0.15 0.012 250)",
      "oklch(0.9 0.015 245)",
      "oklch(0.76 0.13 65)",
    ],
  },
  {
    id: "neutral",
    label: "Neutral",
    note: "grey, lime",
    swatch: ["oklch(0.16 0 0)", "oklch(0.94 0 0)", "oklch(0.87 0.19 128)"],
  },
  {
    id: "warm",
    label: "Warm paper",
    note: "sunilpai.dev",
    swatch: ["#1c1d1c", "#d5d1c8", "#8fb4d8"],
  },
  {
    id: "oled",
    label: "OLED",
    note: "true black",
    swatch: ["oklch(0 0 0)", "oklch(0.93 0 0)", "oklch(0.87 0.19 128)"],
  },
];

/** The plain `.shelf` look in globals.css; selecting it removes the attribute. */
export const DEFAULT_SHELF = "cubby";

export type ShelfStyle = { id: string; label: string; note: string };

// Styles for each live in globals.css under [data-shelf="…"] .shelf
export const SHELF_STYLES: ShelfStyle[] = [
  { id: "cubby", label: "Cubby", note: "default" },
  { id: "ledge", label: "Ledge", note: "surface band" },
  { id: "hairline", label: "Hairline", note: "1px rule" },
  { id: "accent", label: "Accent", note: "accent lip" },
  { id: "plank", label: "Plank", note: "3D" },
];

/** Runs in <head> before first paint so saved previews don't flash. */
export const debugPrePaintScript = `try{var r=document.documentElement,p=localStorage.getItem(${JSON.stringify(DARK_PALETTE_KEY)}),s=localStorage.getItem(${JSON.stringify(SHELF_KEY)});if(p)r.setAttribute("data-dark-palette",p);if(s)r.setAttribute("data-shelf",s)}catch(e){}`;
