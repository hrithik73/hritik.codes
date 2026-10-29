const TILE_W = 420;
const TILE_H = 100;

// Seeded so every build renders the same meadow.
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
const pick = <T>(items: T[]) => items[Math.floor(rand() * items.length)];
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

// Generation order is part of the seed: keep it unchanged.
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

export const fireflies = Array.from({ length: 16 }, () => ({
  left: r1(between(2, 97)),
  top: r1(between(-10, 65)),
  duration: r1(between(3.5, 6.5)),
  delay: r1(between(-6, 0)),
}));

const circle = (cx: number, cy: number, r: number, fill: string) =>
  `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(r)}" fill="${fill}"/>`;

const petals = (angles: number[], dist: number, r: number, color: string) =>
  angles
    .map((a) => {
      const rad = (a * Math.PI) / 180;
      return circle(Math.cos(rad) * dist, Math.sin(rad) * dist, r, color);
    })
    .join("");

const blades = (layer: ReturnType<typeof grassLayer>) =>
  layer
    .map(
      (b) =>
        `<path d="${b.d}" transform="translate(${r1(b.x)} 0)" fill="${b.color}"/>`,
    )
    .join("");

const clover = ({ x, y, r, rot, color }: (typeof clovers)[number]) =>
  `<g transform="translate(${r1(x)} ${r1(y)}) rotate(${r1(rot)})">${petals([-90, 30, 150], r * 0.75, r * 0.62, color)}</g>`;

const flower = ({ x, y, r, color }: (typeof flowers)[number]) =>
  `<g transform="translate(${r1(x)} ${r1(y)})">${petals([0, 72, 144, 216, 288], r, r * 0.7, color)}${circle(0, 0, r * 0.45, "#f2d35b")}</g>`;

// The tile is drawn at -1, 0 and +1 offsets so the repeat seams line up.
const tile = (content: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE_W}" height="${TILE_H}" viewBox="0 0 ${TILE_W} ${TILE_H}"><defs><g id="t">${content}</g></defs><use href="#t" x="${-TILE_W}"/><use href="#t"/><use href="#t" x="${TILE_W}"/></svg>`;

export const meadowLayers: Record<string, string> = {
  back: tile(
    `<rect y="${TILE_H - 14}" width="${TILE_W}" height="14" fill="#2d5a1e"/>${blades(backGrass)}${bushes.map((l) => circle(l.x, l.y, l.r, l.color)).join("")}`,
  ),
  mid: tile(blades(midGrass) + clovers.map(clover).join("")),
  front: tile(flowers.map(flower).join("") + blades(frontGrass)),
};
