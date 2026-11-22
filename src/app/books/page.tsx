import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
// next/image only ships a default export.
import Image from "next/image";
import { type Book, bookSlug, books } from "~/config/books";
import { jpegSize } from "~/lib/jpeg-size";
import { wideWidth } from "~/lib/page-width";

export const metadata: Metadata = {
  title: "Books — Hritik Singh",
  description: "What I'm reading, what's next on the pile, and what I've read.",
  alternates: { canonical: "/books" },
};

// Static page: this runs once at build, so reading covers off disk is free.
function cover(book: Book) {
  const src = `/books/${bookSlug(book)}.jpg`;
  const file = join(process.cwd(), "public", src);
  const size = existsSync(file) ? jpegSize(file) : null;
  return size ? { src, ...size } : null;
}

function ShelfBook({ book }: { book: Book }) {
  const c = cover(book);
  const art = c ? (
    <Image
      src={c.src}
      alt={`Cover of ${book.title}`}
      width={c.width}
      height={c.height}
      sizes="(min-width: 1024px) 140px, (min-width: 640px) 120px, 100px"
      className="block h-full w-auto"
    />
  ) : (
    // Typeset stand-in when no cover could be fetched
    <span className="flex h-full aspect-[2/3] flex-col justify-between bg-surface p-2.5">
      <span className="font-display text-[12px] leading-snug text-ink">
        {book.title}
      </span>
      <span className="text-[10px] leading-snug text-muted">{book.author}</span>
    </span>
  );

  const body = (
    <>
      <span className="shelf-book">{art}</span>
      {/* Library-style tag under the plank. w-0 min-w-full: exactly as wide
          as the book, so long titles wrap instead of pushing books apart. */}
      <span className="shelf-label block w-0 min-w-full">
        <span className="text-[13px] font-medium leading-snug text-ink line-clamp-2 group-hover:text-primary transition-colors">
          {book.title}
        </span>
        <span className="text-xs leading-snug text-muted line-clamp-1">
          {book.author}
          {book.finished && (
            <span className="tabular-nums"> · {book.finished}</span>
          )}
        </span>
      </span>
    </>
  );

  return book.href ? (
    <a
      href={book.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group shelf-slot rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
    >
      {body}
    </a>
  ) : (
    <div className="group shelf-slot">{body}</div>
  );
}

function Shelf({ title, items }: { title: string; items: Book[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-label={title}>
      <h2 className="font-display text-xl text-ink flex items-baseline gap-2">
        {title}
        <span className="text-sm text-muted tabular-nums">{items.length}</span>
      </h2>
      <ul className="shelf">
        {items.map((book) => (
          <li key={`${book.title}-${book.author}`}>
            <ShelfBook book={book} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function BooksPage() {
  const byStatus = (s: Book["status"]) => books.filter((b) => b.status === s);
  const read = byStatus("read")
    // Most recently finished first; undated reads keep their config order
    .sort((a, b) => (b.finished ?? 0) - (a.finished ?? 0));

  return (
    <div className={`mx-auto ${wideWidth} px-6 py-14 anim-page`}>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink mb-2">Books</h1>
        <p className="text-[15px] text-muted">
          What I'm reading, what's next on the pile, and what I've finished.
        </p>
      </div>

      <div className="space-y-12">
        <Shelf title="Reading now" items={byStatus("reading")} />
        <Shelf title="Up next" items={byStatus("want")} />
        <Shelf title="Read" items={read} />
      </div>
    </div>
  );
}
