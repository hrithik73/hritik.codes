import { fireflies } from "~/lib/meadow";

const MEADOW_H = 96;

// Each layer is a tiled background from /meadow/[layer], see globals.css.
const layers = ["back", "mid", "front"];

export function Meadow({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative w-full overflow-x-clip ${className}`}
      style={{ height: MEADOW_H }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {layers.map((id) => (
          <div
            key={id}
            className={`meadow-layer meadow-layer-${id} absolute inset-y-0 -inset-x-6`}
          />
        ))}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-bg via-bg/60 to-transparent" />
      </div>
      {fireflies.map((f, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: static, generated once
          key={i}
          className="firefly"
          style={{
            left: `${f.left}%`,
            top: `${f.top}%`,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
