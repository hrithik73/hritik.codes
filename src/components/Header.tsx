"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "./ThemeSwitcher";

const nav = [
  { label: "work", href: "/projects" },
  { label: "writing", href: "/blog" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          aria-label="Home"
          className="font-display text-lg leading-none text-ink hover:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded"
        >
          hritik<span className="text-accent">.</span>
        </Link>
        <nav className="flex items-center gap-5">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded ${
                  active
                    ? "text-ink underline decoration-accent decoration-[1.5px] underline-offset-[6px]"
                    : "text-muted hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <ThemeSwitcher />
        </nav>
      </div>
    </header>
  );
}
