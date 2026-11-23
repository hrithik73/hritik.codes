import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import sharp from "sharp";
import { BookShelf, type ShelfBook } from "~/components/book-shelf";
import { type Book, bookSlug, books } from "~/config/books";
import { jpegSize } from "~/lib/jpeg-size";
import { wideWidth } from "~/lib/page-width";

export const metadata: Metadata = {
  title: "Books — Hritik Singh",
  description: "What I'm reading, what's next on the pile, and what I've read.",
  alternates: { canonical: "/books" },
};

type RGB = [number, number, number];

const hex = (c: RGB) =>
  `#${c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;

// Relative luminance (sRGB), 0–1
function luminance([r, g, b]: RGB) {
  const lin = (v: number) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

const contrast = (a: RGB, b: RGB) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const INK: RGB = [20, 20, 20];
const PAPER: RGB = [244, 242, 237];
const FALLBACK = {
  bg: "#2b2a2e",
  fg: hex(PAPER),
  band: "#c9a24a",
  bandFg: "#2b2a2e",
};

/**
 * Spine colors from the cover itself: the background is the cover's dominant
 * color, the text is ink or paper (whichever reads), and the band is the most
 * colorful patch of the cover that stands apart from the background.
 */
async function spineColors(file: string) {
  try {
    const img = sharp(file);
    const { dominant } = await img.stats();
    const bg: RGB = [dominant.r, dominant.g, dominant.b];
    // Whichever of ink or paper reads better
    const fg = contrast(bg, INK) > contrast(bg, PAPER) ? INK : PAPER;

    const { data } = await img
      .resize(6, 6, { fit: "fill" })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    let band: RGB = fg;
    let best = 0;
    for (let i = 0; i < data.length; i += 3) {
      const px: RGB = [data[i], data[i + 1], data[i + 2]];
      const dist = Math.hypot(px[0] - bg[0], px[1] - bg[1], px[2] - bg[2]);
      const sat = Math.max(...px) - Math.min(...px);
      const score = dist * (0.5 + sat / 255);
      if (dist > 90 && score > best) {
        best = score;
        band = px;
      }
    }
    // The band's number: the spine color if it reads, else ink or paper
    const bandFg = [bg, INK, PAPER].reduce((x, y) =>
      contrast(band, y) > contrast(band, x) + (x === bg ? 1.5 : 0) ? y : x,
    );
    return { bg: hex(bg), fg: hex(fg), band: hex(band), bandFg: hex(bandFg) };
  } catch {
    return FALLBACK;
  }
}

/** Hand-picked colors from the config win; text colors follow them. */
function withOverride(
  auto: typeof FALLBACK,
  pick: Book["spine"],
): typeof FALLBACK {
  if (!pick) return auto;
  const rgb = (h: string): RGB => {
    const n = Number.parseInt(h.replace("#", ""), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const bg = rgb(pick.bg);
  const band = rgb(pick.band ?? auto.band);
  const fg = contrast(bg, INK) > contrast(bg, PAPER) ? INK : PAPER;
  const bandFg =
    contrast(band, bg) > 3
      ? bg
      : contrast(band, INK) > contrast(band, PAPER)
        ? INK
        : PAPER;
  return { bg: hex(bg), fg: hex(fg), band: hex(band), bandFg: hex(bandFg) };
}

// Static page: this runs once at build, so reading covers off disk is free.
async function toShelfBook(book: Book): Promise<ShelfBook> {
  const src = `/books/${bookSlug(book)}.jpg`;
  const file = join(process.cwd(), "public", src);
  const size = existsSync(file) ? jpegSize(file) : null;
  return {
    title: book.title,
    author: book.author,
    status: book.status,
    note: book.note,
    finished: book.finished,
    href: book.href,
    cover: size ? { src, ...size } : null,
    spine: withOverride(size ? await spineColors(file) : FALLBACK, book.spine),
  };
}

const ORDER: Book["status"][] = ["reading", "want", "read"];

export default async function BooksPage() {
  const sorted = ORDER.flatMap((status) => {
    const group = books.filter((b) => b.status === status);
    // Most recently finished first; undated reads keep their config order
    return status === "read"
      ? group.sort((a, b) => (b.finished ?? 0) - (a.finished ?? 0))
      : group;
  });
  const shelf = await Promise.all(sorted.map(toShelfBook));

  return (
    <div className={`mx-auto ${wideWidth} px-6 pt-10 pb-12 anim-page`}>
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h1 className="font-display text-3xl text-ink">Books</h1>
        <p className="text-[15px] text-muted">
          What I'm reading, what's next, and what I've finished.
        </p>
      </div>
      <BookShelf books={shelf} />
    </div>
  );
}
