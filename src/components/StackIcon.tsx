import type { StackItem } from "@/config/stack";

// Relative luminance of a "RRGGBB" hex, 0 (black) – 1 (white).
function luminance(hex: string) {
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Brand marks render in their brand colour. Near-black brands (Next.js, Vercel,
// Apple…), near-white ones (Unity) and Lucide fallbacks use ink instead, so they
// stay visible and flip with the theme.
export function StackIcon({ icon }: { icon: StackItem["icon"] }) {
  const className = "w-3.5 h-3.5 shrink-0 text-ink";

  // Official logo file. invert + hue-rotate keeps the hue but flips lightness,
  // so navy marks turn light blue on the dark theme.
  if ("src" in icon) {
    return (
      // biome-ignore lint/performance/noImgElement: tiny static logo, next/image adds nothing at 14px
      <img
        src={icon.src}
        alt=""
        aria-hidden="true"
        className={`h-3.5 w-auto max-w-6 shrink-0 object-contain ${
          icon.invertInDark ? "dark:invert dark:hue-rotate-180" : ""
        }`}
      />
    );
  }

  if ("path" in icon) {
    const l = luminance(icon.hex);
    const useInk = l < 0.08 || l > 0.85;
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        style={useInk ? undefined : { color: `#${icon.hex}` }}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d={icon.path} />
      </svg>
    );
  }

  const Icon = icon;
  return <Icon className={className} strokeWidth={2} aria-hidden="true" />;
}
