// Downloads a cover for every book in src/config/books.ts that doesn't have one
// yet, from Open Library (free, no API key). Runs automatically before
// `dev` and `build`, so adding a book to the config is all it takes.
// Wrong cover? Add an `isbn` to the book and delete its file in public/books.
// Never fails the build: a book without a cover gets a typeset placeholder.

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { type Book, bookSlug, books } from "../src/config/books";

const dir = join(import.meta.dirname, "..", "public", "books");
mkdirSync(dir, { recursive: true });

const get = (url: string) =>
  fetch(url, { signal: AbortSignal.timeout(10_000) });

async function coverUrl(book: Book): Promise<string | null> {
  // default=false makes Open Library 404 instead of serving a blank pixel
  if (book.isbn)
    return `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg?default=false`;

  // First-named author searches best ("A & B" rarely matches). If the first
  // name is spelled differently there ("Don" vs "Donald A."), retry by surname.
  const author = book.author.split(/&|,| and /)[0].trim();
  const surname = author.split(" ").at(-1) ?? author;
  const id =
    (await search(book.title, author)) ?? (await search(book.title, surname));
  return id
    ? `https://covers.openlibrary.org/b/id/${id}-L.jpg?default=false`
    : null;
}

// Compare main titles only: "Sapiens" should match "Sapiens: A Brief History…"
const norm = (s: string) =>
  s
    .split(":")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

async function search(title: string, author: string) {
  const params = new URLSearchParams({
    title,
    author,
    fields: "title,cover_i",
    limit: "10",
  });
  const res = await get(`https://openlibrary.org/search.json?${params}`);
  if (!res.ok) return undefined;
  const { docs } = (await res.json()) as {
    docs: { title: string; cover_i?: number }[];
  };
  // Title search is fuzzy: only trust a result whose title actually matches
  return docs.find((d) => d.cover_i && norm(d.title) === norm(title))?.cover_i;
}

async function fetchCover(book: Book) {
  const file = join(dir, `${bookSlug(book)}.jpg`);
  if (existsSync(file)) return true;
  try {
    const url = await coverUrl(book);
    const res = url ? await get(url) : null;
    if (!res?.ok) {
      console.log(`  ✗ ${book.title}: no cover found (add an isbn to pin one)`);
      return false;
    }
    writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    console.log(`  ✓ ${book.title} → public/books/${bookSlug(book)}.jpg`);
    return true;
  } catch (err) {
    console.log(`  ✗ ${book.title}: ${(err as Error).message}`);
    return false;
  }
}

const results = await Promise.all(books.map(fetchCover));
const missing = results.filter((ok) => !ok).length;
console.log(
  missing
    ? `covers: ${missing} missing, using placeholders`
    : "covers: all present",
);
