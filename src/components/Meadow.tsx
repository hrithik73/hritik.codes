const TILE_W = 420;
const TILE_H = 100;
const MEADOW_H = 96;

// Seeded so server and client render identical markup.
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(73);
const between = (min: number, max: number) => min + rand() * (max - min);
const pick = <T,>(items: T[]) => items[Math.floor(rand() * items.length)];
const r1 = (n: number) => Math.round(n * 10) / 10;

function blade(height: number, width: number, lean: number) {
  return [
    `M${r1(-width)} ${TILE_H}`,
    `Q${r1(lean * 0.3)} ${r1(TILE_H - height * 0.55)} ${r1(lean)} ${r1(TILE_H - height)}`,
    `Q${r1(lean * 0.45)} ${r1(TILE_H - height * 0.45)} ${r1(width)} ${TILE_H}Z`,
  ].join("");
}

function grassLayer(
  count: number,
  minH: number,
  maxH: number,
  colors: string[],
) {
  return Array.from({ length: count }, () => ({
    x: between(0, TILE_W),
    d: blade(between(minH, maxH), between(1.4, 3), between(-9, 9)),
    color: pick(colors),
  }));
}

const backGrass = grassLayer(170, 36, 76, ["#2d5a1e", "#356a22", "#28501b"]);

const bushes = Array.from({ length: 4 }, (_, i) => {
  const cx = (i + between(0.2, 0.8)) * (TILE_W / 4);
  const halfW = between(30, 60);
  const height = between(26, 48);
  return Array.from({ length: 34 }, () => {
    const t = between(-1, 1);
    const top = TILE_H - height * Math.sqrt(1 - t * t);
    return {
      x: cx + t * halfW,
      y: between(top + 4, TILE_H),
      r: between(3.5, 7.5),
      color: pick(["#2f5f20", "#3b7326", "#46842c", "#356a22"]),
    };
  });
}).flat();

const midGrass = grassLayer(170, 24, 54, ["#4a8a2a", "#3f7a25", "#579a30"]);
const frontGrass = grassLayer(130, 14, 36, ["#74b83c", "#86c64a", "#68a835"]);

const clovers = Array.from({ length: 40 }, () => ({
  x: between(0, TILE_W),
  y: between(58, 96),
  r: between(3.2, 5.4),
  rot: between(0, 120),
  color: pick(["#5fa83a", "#6cb543", "#4f9632", "#7cc24c"]),
}));

const flowers = Array.from({ length: 11 }, () => ({
  x: between(0, TILE_W),
  y: between(50, 90),
  r: between(2, 3.2),
  color: pick(["#9d8fdc", "#b3a6ea", "#8a7bcf", "#f3f1ec", "#ffffff"]),
}));

// Each element is drawn at -1, 0 and +1 tile offsets so the pattern seams line up.
const OFFSETS = [-TILE_W, 0, TILE_W];

function Clover({ x, y, r, rot, color }: (typeof clovers)[number]) {
  return (
    <g transform={`translate(${r1(x)} ${r1(y)}) rotate(${r1(rot)})`}>
      {[0, 120, 240].map((a) => (
        <circle
          key={a}
          cx={r1(Math.cos(((a - 90) * Math.PI) / 180) * r * 0.75)}
          cy={r1(Math.sin(((a - 90) * Math.PI) / 180) * r * 0.75)}
          r={r1(r * 0.62)}
          fill={color}
        />
      ))}
    </g>
  );
}

function Flower({ x, y, r, color }: (typeof flowers)[number]) {
  return (
    <g transform={`translate(${r1(x)} ${r1(y)})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <circle
          key={a}
          cx={r1(Math.cos((a * Math.PI) / 180) * r)}
          cy={r1(Math.sin((a * Math.PI) / 180) * r)}
          r={r1(r * 0.7)}
          fill={color}
        />
      ))}
      <circle r={r1(r * 0.45)} fill="#f2d35b" />
    </g>
  );
}

function Blades({ blades }: { blades: ReturnType<typeof grassLayer> }) {
  return blades.map((b, i) => (
    <path
      // biome-ignore lint/suspicious/noArrayIndexKey: static, generated once
      key={i}
      d={b.d}
      transform={`translate(${r1(b.x)} 0)`}
      fill={b.color}
    />
  ));
}

function BackLayer() {
  return (
    <>
      <rect y={TILE_H - 14} width={TILE_W} height={14} fill="#2d5a1e" />
      <Blades blades={backGrass} />
      {bushes.map((leaf, i) => (
        <circle
          // biome-ignore lint/suspicious/noArrayIndexKey: static, generated once
          key={`l${i}`}
          cx={r1(leaf.x)}
          cy={r1(leaf.y)}
          r={r1(leaf.r)}
          fill={leaf.color}
        />
      ))}
    </>
  );
}

function MidLayer() {
  return (
    <>
      <Blades blades={midGrass} />
      {clovers.map((c, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static, generated once
        <Clover key={i} {...c} />
      ))}
    </>
  );
}

function FrontLayer() {
  return (
    <>
      {flowers.map((f, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static, generated once
        <Flower key={i} {...f} />
      ))}
      <Blades blades={frontGrass} />
    </>
  );
}

const fireflies = Array.from({ length: 16 }, () => ({
  left: r1(between(2, 97)),
  top: r1(between(-10, 65)),
  duration: r1(between(3.5, 6.5)),
  delay: r1(between(-6, 0)),
}));

const layers = [
  { id: "back", Content: BackLayer },
  { id: "mid", Content: MidLayer },
  { id: "front", Content: FrontLayer },
];

export function Meadow({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative w-full overflow-x-clip ${className}`}
      style={{ height: MEADOW_H }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {layers.map(({ id, Content }) => (
          <svg
            key={id}
            className={`meadow-layer meadow-layer-${id} absolute inset-y-0 -inset-x-6 h-full w-[calc(100%+3rem)]`}
            xmlns="http://www.w3.org/2000/svg"
            role="presentation"
          >
            <defs>
              <pattern
                id={`meadow-${id}`}
                width={TILE_W}
                height={TILE_H}
                patternUnits="userSpaceOnUse"
                patternTransform={`scale(${MEADOW_H / TILE_H})`}
              >
                {OFFSETS.map((offset) => (
                  <g key={offset} transform={`translate(${offset} 0)`}>
                    <Content />
                  </g>
                ))}
              </pattern>
            </defs>
            <rect width="100%" height={MEADOW_H} fill={`url(#meadow-${id})`} />
          </svg>
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
