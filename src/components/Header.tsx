import Link from "next/link";
import { ThemeSwitcher } from "./ThemeSwitcher";

function Logo() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* H — left leg */}
      <line
        x1="24"
        y1="13"
        x2="20"
        y2="87"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
      />
      {/* H — right leg */}
      <line
        x1="76"
        y1="13"
        x2="80"
        y2="87"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
      />
      {/* Crossbar as an animation easing curve — nod to Reanimated timing functions */}
      <path
        d="M 21 67 C 40 67 60 33 79 33"
        stroke="#f59e0b"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/70 dark:border-zinc-800/50 bg-[var(--background)]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          aria-label="Home"
          className="text-zinc-900 dark:text-zinc-100 hover:opacity-60 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 rounded"
        >
          <Logo />
        </Link>
        <div className="flex items-center gap-5">
          <Link
            href="/projects"
            className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 rounded"
          >
            projects
          </Link>
          <Link
            href="/blog"
            className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 rounded"
          >
            blog
          </Link>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
