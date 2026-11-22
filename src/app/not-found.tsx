// next/link only ships a default export.
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-col mx-auto max-w-[55rem] px-6 py-16">
      <h1 className="font-display text-xl text-ink mb-4">Page not found</h1>
      <Link
        href="/"
        className="text-sm text-muted hover:text-ink transition-colors"
      >
        ← back home
      </Link>
    </div>
  );
}
