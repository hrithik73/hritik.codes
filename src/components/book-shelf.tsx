"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  type CSSProperties,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { BookStatus } from "~/config/books";

export type ShelfBook = {
  title: string;
  author: string;
  status: BookStatus;
  note?: string;
  finished?: number;
  href?: string;
  cover: { src: string; width: number; height: number } | null;
  spine: { bg: string; fg: string; band: string; bandFg: string };
};

type Filter = "all" | BookStatus;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "reading", label: "Reading" },
  { id: "want", label: "Up next" },
  { id: "read", label: "Read" },
];

const STATUS_LABEL: Record<BookStatus, string> = {
  reading: "Reading now",
  want: "Up next",
  read: "Read",
};

const FALLBACK_ASPECT = 0.66;
const aspect = (b: ShelfBook) =>
  b.cover ? b.cover.width / b.cover.height : FALLBACK_ASPECT;

// "Fyodor Dostoevsky" → "Dostoevsky"; "C. G. Jung" → "Jung"
const surname = (author: string) =>
  author
    .split(/&|,| and /)[0]
    .trim()
    .split(" ")
    .at(-1) ?? author;

/** Wrap x into [-len/2, len/2) */
const wrap = (x: number, len: number) =>
  ((((x + len / 2) % len) + len) % len) - len / 2;

/** Ease toward a target, frame-rate independent */
const approach = (from: number, to: number, rate: number, dt: number) =>
  from + (to - from) * (1 - Math.exp(-rate * dt));

/**
 * Book height for the space available: as big as fits between the filters
 * and the caption on desktop, near full width on phones.
 */
function heightFor(width: number, viewport: number) {
  const room = (viewport - 380) / 1.3;
  const ideal = width < 640 ? width * 0.7 : width * 0.28;
  return Math.round(Math.max(220, Math.min(ideal, room, 520)));
}

/*
 * A looping shelf of books seen spine-on. Each book is a box with two faces:
 * the spine, facing us, and the front cover on its right-hand side. As a
 * book reaches the middle it turns -90° to show its cover, tips a few
 * degrees, lifts and comes forward; its neighbours slide apart to make room.
 *
 * Position is a continuous number `s` (1 = one book) eased toward a target
 * `T` every frame, so drags track the pointer and everything settles
 * smoothly. Transforms are written straight to the DOM, not through React.
 */
export function BookShelf({ books }: { books: ShelfBook[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [active, setActive] = useState(0);
  const [copies, setCopies] = useState(1);

  const list = useMemo(
    () => (filter === "all" ? books : books.filter((b) => b.status === filter)),
    [books, filter],
  );
  const n = list.length;
  const current = list[active % n];

  const fitRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const tiles = useRef<(HTMLDivElement | null)[]>([]);

  // Everything the animation loop reads and writes, kept out of React
  const st = useRef({
    s: 0,
    T: 0,
    H: 0,
    ws: 0,
    gap: 0,
    // pointer
    mx: 0,
    my: 0,
    over: false,
    hover: -1,
    tiltX: 0,
    tiltY: 0,
    lifts: [] as number[],
    // drag
    down: false,
    dragging: false,
    moved: false,
    sx: 0,
    T0: 0,
    wheelTimer: 0,
    wheeling: false,
    active: 0,
    // Shelf position on screen, re-read only after a scroll or resize
    rect: { left: 0, top: 0, width: 0, height: 0 },
    rectDirty: true,
    /** Wake the animation loop; it sleeps whenever nothing is moving */
    kick: () => {},
  });

  /* ---------- sizing: book height, spine width, and how many copies fill the ring ---------- */
  useLayoutEffect(() => {
    const el = fitRef.current;
    if (!el) return;
    const measure = () => {
      const s = st.current;
      const width = el.clientWidth;
      const H = heightFor(width, window.innerHeight);
      s.H = H;
      s.ws = 0.15 * H;
      s.gap = 0.03 * H;
      el.style.setProperty("--hpx", `${H}px`);
      el.style.setProperty("--ws", `${s.ws}px`);
      // Enough copies of the list that a book wrapping round the ring does
      // so off-screen
      const maxCover = H * Math.max(...list.map(aspect));
      const ring = n * (s.ws + s.gap);
      setCopies(Math.max(1, Math.ceil((width + 3 * maxCover) / ring)));
      s.rectDirty = true;
      s.kick();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [list, n]);

  /* ---------- the animation loop ---------- */
  useEffect(() => {
    const s = st.current;
    const fit = fitRef.current;
    const stage = stageRef.current;
    if (!fit || !stage) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const ring = n * copies;
    let last = 0;
    let raf = 0;
    let first = true;

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // Ease position; snappier while dragging or swiping so it tracks input
      const tracking = s.dragging || s.wheeling;
      s.s = reduced ? s.T : approach(s.s, s.T, tracking ? 18 : 5.2, dt);
      if (Math.abs(s.T - s.s) < 1e-4) s.s = s.T;
      // Keep the numbers small: shift both by whole rings
      if (Math.abs(s.s) > ring * 4) {
        const k = Math.trunc(s.s / ring) * ring;
        s.s -= k;
        s.T -= k;
        s.T0 -= k;
      }

      const { H, ws, gap } = s;
      // Width of the open book, blended as one hands over to the next
      const lo = Math.floor(s.s);
      const f = s.s - lo;
      const wOf = (i: number) => H * aspect(list[((i % n) + n) % n]);
      const open = wOf(lo) * (1 - f) + wOf(lo + 1) * f;

      const idx = ((Math.round(s.s) % n) + n) % n;
      if (idx !== s.active) {
        s.active = idx;
        setActive(idx);
      }

      // Tilt toward the pointer: strongly over the open cover, gently elsewhere
      if (s.rectDirty) {
        s.rect = fit.getBoundingClientRect();
        s.rectDirty = false;
      }
      const r = s.rect;
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const settled = Math.abs(s.T - s.s) < 0.3;
      const onCover =
        s.over &&
        settled &&
        Math.abs(s.mx - cx) < 0.55 * open &&
        Math.abs(s.my - cy) < 0.55 * H;
      const wantY = onCover
        ? ((s.mx - cx) / (0.55 * open)) * 9
        : s.over
          ? ((s.mx - cx) / r.width) * 5
          : 0;
      const wantX = onCover ? (-(s.my - cy) / (H / 2)) * 6 : 0;
      const tiltY = reduced ? 0 : approach(s.tiltY, wantY, 7, dt);
      const tiltX = reduced ? 0 : approach(s.tiltX, wantX, 7, dt);
      let busy =
        tracking ||
        s.s !== s.T ||
        Math.abs(tiltY - wantY) > 0.01 ||
        Math.abs(tiltX - wantX) > 0.01;
      s.tiltY = Math.abs(tiltY - wantY) > 0.01 ? tiltY : wantY;
      s.tiltX = Math.abs(tiltX - wantX) > 0.01 ? tiltX : wantX;
      fit.style.cursor = s.dragging
        ? "grabbing"
        : onCover && list[idx].href
          ? "pointer"
          : "";

      const limit = r.width / 2 + 1.5 * H;
      for (let t = 0; t < ring; t++) {
        const el = tiles.current[t];
        if (!el) continue;
        const c = wrap(t - s.s, ring); // books from the middle, signed
        // Packed spines, plus room for the open cover that grows in smoothly
        const spread =
          Math.abs(c) < 1
            ? (c + Math.sin(Math.PI * c) / Math.PI) / 2
            : Math.sign(c) / 2;
        const x = c * (ws + gap) + (open - ws + 1.6 * gap) * spread;
        if (Math.abs(x) > limit) {
          el.style.visibility = "hidden";
          continue;
        }
        el.style.visibility = "";

        const wantLift = s.hover === t && Math.abs(c) > 0.5 ? 1 : 0;
        let lift = approach(s.lifts[t] ?? 0, wantLift, 12, dt);
        if (Math.abs(lift - wantLift) < 0.002) lift = wantLift;
        else busy = true;
        s.lifts[t] = lift;
        // How "open" this book is, 0–1, smoothstepped
        const o = Math.max(0, 1 - Math.abs(c));
        const d = o * o * (3 - 2 * o);
        el.style.transform =
          `translate3d(${x}px, ${-0.025 * d * H - 0.045 * lift * H}px, ${0.2 * d * H}px) ` +
          `rotateZ(${-4.5 * d}deg) rotateX(${s.tiltX * d}deg) rotateY(${-90 * d + s.tiltY * d}deg)`;
        el.style.zIndex = String(Math.round(100 - 4 * Math.abs(c)));
        el.style.setProperty("--sp-shade", (0.55 * d).toFixed(3));
        el.style.setProperty("--cv-shade", ((1 - d) * 0.5).toFixed(3));
      }

      if (first) {
        stage.classList.add("bk-ready");
        first = false;
      }
      // Sleep once everything has settled; input wakes us via kick()
      raf = busy ? requestAnimationFrame(frame) : 0;
    };
    s.kick = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    s.kick();
    const onScroll = () => {
      s.rectDirty = true;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      s.kick = () => {};
      window.removeEventListener("scroll", onScroll);
    };
  }, [list, n, copies]);

  /* ---------- input ---------- */
  const step = (k: number) => {
    const s = st.current;
    s.T = Math.round(s.T) + k;
    s.kick();
  };

  function choose(id: Filter) {
    const next = id === "all" ? books : books.filter((b) => b.status === id);
    const keep = current ? next.indexOf(current) : -1;
    const s = st.current;
    // Jump, don't sweep, when the set of books changes
    s.s = s.T = keep === -1 ? 0 : keep;
    s.active = s.s;
    s.kick();
    stageRef.current?.classList.remove("bk-ready");
    setFilter(id);
    setActive(s.s);
  }

  useEffect(() => {
    const fit = fitRef.current;
    if (!fit) return;
    const s = st.current;
    const unit = () => s.ws + s.gap;

    const onMove = (e: PointerEvent) => {
      s.mx = e.clientX;
      s.my = e.clientY;
      if (s.over || s.down) s.kick();
      if (!s.down) return;
      const dx = e.clientX - s.sx;
      if (!s.dragging && Math.abs(dx) > 4) {
        s.dragging = true;
        s.moved = true;
      }
      if (s.dragging) s.T = s.T0 - dx / unit();
    };
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      s.down = true;
      s.moved = false;
      s.sx = e.clientX;
      s.T0 = s.T;
    };
    const onUp = () => {
      if (!s.down) return;
      s.down = false;
      if (s.dragging) {
        s.dragging = false;
        s.T = Math.round(s.T);
        s.kick();
      }
    };
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      // Track the swipe 1:1, then settle on the nearest book once it stops
      // (trackpad momentum keeps sending events, so wait for a real pause)
      s.T += e.deltaX / unit();
      s.wheeling = true;
      s.kick();
      clearTimeout(s.wheelTimer);
      s.wheelTimer = window.setTimeout(() => {
        s.wheeling = false;
        s.T = Math.round(s.T);
        s.kick();
      }, 160);
    };
    const onEnter = () => {
      s.over = true;
      s.rectDirty = true;
      s.kick();
    };
    const onLeave = () => {
      s.over = false;
      s.hover = -1;
      s.kick();
    };

    fit.addEventListener("pointerdown", onDown);
    fit.addEventListener("pointerenter", onEnter);
    fit.addEventListener("pointerleave", onLeave);
    fit.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      fit.removeEventListener("pointerdown", onDown);
      fit.removeEventListener("pointerenter", onEnter);
      fit.removeEventListener("pointerleave", onLeave);
      fit.removeEventListener("wheel", onWheel);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      clearTimeout(s.wheelTimer);
    };
  }, []);

  function onTileClick(t: number) {
    const s = st.current;
    if (s.moved) return;
    const c = wrap(t - s.s, n * copies);
    if (Math.abs(c) < 0.5) {
      const b = list[t % n];
      if (b.href) window.open(b.href, "_blank", "noopener,noreferrer");
    } else {
      s.T = Math.round(s.T + c);
      s.kick();
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") step(1);
    else if (e.key === "ArrowLeft") step(-1);
    else return;
    e.preventDefault();
  }

  const ringTiles = Array.from({ length: n * copies }, (_, t) => t);

  return (
    <section aria-label="Bookshelf" className="flex flex-col items-center">
      <FilterPills value={filter} onChange={choose} />

      {/* Screen readers get a plain list; the 3D shelf is decoration */}
      <ul className="sr-only">
        {list.map((b) => (
          <li key={b.title}>
            {b.href ? <a href={b.href}>{b.title}</a> : b.title}, {b.author}.{" "}
            {STATUS_LABEL[b.status]}
            {b.finished ? ` ${b.finished}` : ""}.
          </li>
        ))}
      </ul>

      <section
        ref={fitRef}
        className="bk-fit"
        onKeyDown={onKeyDown}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: arrow keys browse the shelf
        tabIndex={0}
        aria-label="Shelf. Use the left and right arrow keys to browse."
      >
        <div ref={stageRef} className="bk-stage" aria-hidden="true">
          {ringTiles.map((t) => {
            const b = list[t % n];
            const style = {
              "--dd": `calc(var(--hpx) * ${aspect(b)})`,
              "--bg": b.spine.bg,
              "--fg": b.spine.fg,
              "--band": b.spine.band,
              "--band-fg": b.spine.bandFg,
            } as CSSProperties;
            return (
              // biome-ignore lint/a11y/useKeyWithClickEvents lint/a11y/noStaticElementInteractions: mirrored by the arrow keys and buttons
              <div
                key={`${filter}-${t}`}
                ref={(el) => {
                  tiles.current[t] = el;
                }}
                className="bk-book"
                style={style}
                onClick={() => onTileClick(t)}
                onPointerEnter={() => {
                  st.current.hover = t;
                  st.current.kick();
                }}
                onPointerLeave={() => {
                  if (st.current.hover === t) st.current.hover = -1;
                  st.current.kick();
                }}
              >
                <div className="bk-face bk-spine">
                  <i className="bk-band">
                    {String(books.indexOf(b) + 1).padStart(2, "0")}
                  </i>
                  <span className="bk-title">{b.title}</span>
                  <span className="bk-author">{surname(b.author)}</span>
                </div>
                {b.cover ? (
                  <div
                    className="bk-face bk-cover"
                    style={{ backgroundImage: `url("${b.cover.src}")` }}
                  />
                ) : (
                  // Typeset stand-in when no cover could be fetched
                  <div className="bk-face bk-cover bk-typeset">
                    <span className="font-display">{b.title}</span>
                    <span>{b.author}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <div className="flex items-center gap-3">
        <RoundButton label="Previous book" onClick={() => step(-1)}>
          <ArrowLeft className="size-4" aria-hidden="true" />
        </RoundButton>
        <RoundButton label="Next book" onClick={() => step(1)}>
          <ArrowRight className="size-4" aria-hidden="true" />
        </RoundButton>
      </div>

      {current && (
        <div aria-live="polite" className="mt-5 max-w-md text-center">
          <p className="font-display text-lg text-ink text-balance">
            {current.href ? (
              <a
                href={current.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-accent decoration-[1.5px] underline-offset-[3px] hover:decoration-primary"
              >
                {current.title}
              </a>
            ) : (
              current.title
            )}
          </p>
          <p className="mt-0.5 text-sm text-muted">
            {current.author} · {STATUS_LABEL[current.status]}
            {current.finished && (
              <span className="tabular-nums"> {current.finished}</span>
            )}
          </p>
          {current.note && (
            <p className="mt-3 text-[15px] text-ink">{current.note}</p>
          )}
        </div>
      )}
    </section>
  );
}

function RoundButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-line bg-bg text-ink transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
    >
      {children}
    </button>
  );
}

function FilterPills({
  value,
  onChange,
}: {
  value: Filter;
  onChange: (id: Filter) => void;
}) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [ind, setInd] = useState<{ x: number; w: number } | null>(null);

  // Slide the pill under the selected label
  useLayoutEffect(() => {
    const measure = () => {
      const el = refs.current[value];
      if (el) setInd({ x: el.offsetLeft, w: el.offsetWidth });
    };
    measure();
    document.fonts?.ready.then(measure);
  }, [value]);

  return (
    <div
      role="radiogroup"
      aria-label="Filter books"
      className="relative z-10 flex max-w-full overflow-x-auto rounded-full border border-line bg-surface p-1 [scrollbar-width:none]"
    >
      {ind && (
        <span
          aria-hidden="true"
          className="bk-pill"
          style={{ width: ind.w, transform: `translateX(${ind.x - 4}px)` }}
        />
      )}
      {FILTERS.map((f) => {
        const on = f.id === value;
        return (
          // biome-ignore lint/a11y/useSemanticElements: styled segmented control
          <button
            key={f.id}
            ref={(el) => {
              refs.current[f.id] = el;
            }}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(f.id)}
            className={`relative z-1 inline-flex h-9 cursor-pointer items-center whitespace-nowrap rounded-full px-4 text-sm font-semibold transition-colors duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 max-sm:px-3 ${
              on ? "text-bg" : "text-muted hover:text-ink"
            }`}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
