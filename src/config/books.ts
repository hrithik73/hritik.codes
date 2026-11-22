// Everything on /books. Add a book here, then run `bun run covers` to pull its
// cover from Open Library into public/books/<slug>.jpg. Books without a cover
// file get a typeset placeholder, so nothing breaks if a cover can't be found.

export type BookStatus = "reading" | "want" | "read";

export type Book = {
  title: string;
  author: string;
  status: BookStatus;
  /** Short personal note — shown on books I'm reading now. */
  note?: string;
  /** Year finished, for status "read". */
  finished?: number;
  /** Pins the exact edition when the title search picks the wrong cover. */
  isbn?: string;
  href?: string;
};

/** File name for a book's cover: public/books/<slug>.jpg */
export function bookSlug(book: Pick<Book, "title">) {
  return book.title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-");
}

export const books: Book[] = [
  // Reading now
  { title: "Mythos", author: "Stephen Fry", status: "reading" },
  { title: "Principles", author: "Ray Dalio", status: "reading" },
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    status: "reading",
  },

  // Up next
  {
    title: "Crime and Punishment",
    author: "Fyodor Dostoevsky",
    status: "want",
  },
  {
    title: "The Trial",
    author: "Franz Kafka",
    status: "want",
    isbn: "9780805209990", // Schocken edition; the search finds a plain cloth binding
  },
  {
    title: "The Archetypes and the Collective Unconscious",
    author: "C. G. Jung",
    status: "want",
  },

  // Read
  { title: "Atomic Habits", author: "James Clear", status: "read" },
  { title: "Sapiens", author: "Yuval Noah Harari", status: "read" },
  {
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    status: "read",
    isbn: "9780553380163", // Bantam 10th anniversary; the search finds a French edition
  },
];
