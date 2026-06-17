import fs from "fs";
import matter from "gray-matter";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import path from "path";

const experience = [
  {
    company: "BharatPe",
    role: "SDE-2",
    period: "Sep 2025 – Jan 2026",
    href: "https://bharatpe.com",
    domain: "bharatpe.com",
  },
  {
    company: "Baazi Games",
    role: "SDE-2",
    period: "Mar 2025 – Sep 2025",
    href: "https://baazigames.com",
    domain: "baazigames.com",
  },
  {
    company: "CARS24",
    role: "SDE-2",
    period: "Apr 2024 – Mar 2025",
    href: "https://cars24.com",
    domain: "cars24.com",
  },
];

const inlineLink =
  "text-zinc-800 dark:text-zinc-200 underline decoration-amber-400/70 dark:decoration-amber-500/50 underline-offset-2 hover:decoration-amber-500 dark:hover:decoration-amber-400 transition-[text-decoration-color]";

function getPosts() {
  const blogDir = path.join(process.cwd(), "content/blog");
  if (!fs.existsSync(blogDir)) return [];

  return fs
    .readdirSync(blogDir)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((file) => {
      const { data } = matter(
        fs.readFileSync(path.join(blogDir, file), "utf8"),
      );
      return {
        slug: file.replace(/\.(md|mdx)$/, ""),
        title: data.title as string,
        date: data.date as string | undefined,
      };
    })
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))
    .slice(0, 3);
}

function formatDate(dateString: string) {
  const date = new Date(dateString.replace(/\//g, "-"));
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function SectionHeader({
  label,
  action,
}: {
  label: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-5">
      <span className="text-[10px] tracking-[0.18em] uppercase font-bold text-zinc-400 dark:text-zinc-500 shrink-0">
        {label}
      </span>
      {action}
    </div>
  );
}

export default function Home() {
  const posts = getPosts();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      {/* Hero */}
      <section className="mb-14 anim-1">
        <div className="flex items-end gap-4 mb-3">
          <img
            src="https://github.com/hrithik73.png"
            alt="Hritik Singh"
            width={50}
            height={50}
            className="rounded-full shrink-0 mb-[3px] shadow-sm ring-1 ring-zinc-900/8 dark:ring-white/10"
          />
          <h1 className="font-display text-[clamp(2.4rem,8.5vw,3.85rem)] leading-none tracking-tight text-zinc-900 dark:text-zinc-50">
            Hritik Singh
          </h1>
        </div>

        <div className="h-px bg-amber-400/60 dark:bg-amber-500/40 mb-3 amber-rule" />

        <p className="text-[11px] tracking-[0.22em] uppercase font-semibold text-amber-700/60 dark:text-amber-500/55 mb-7">
          Software Engineer (Mobile)
        </p>

        <p className="text-[15px] text-zinc-600 dark:text-zinc-400 leading-[1.85] max-w-lg">
          Digital craftsman with 5+ years building and scaling mobile apps— currently
          at{" "}
          <a
            href="https://baazigames.com"
            className={inlineLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            BaaziGames
          </a>
          . Previously at{" "}
          <a
            href="https://bharatpe.com"
            className={inlineLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            BharatPe
          </a>{" "}
          and{" "}
          <a
            href="https://cars24.com"
            className={inlineLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            CARS24
          </a>
          .
        </p>

        {/* <p className="text-[15px] text-zinc-600 dark:text-zinc-400 leading-[1.85] max-w-lg mt-4">
          Right now I'm building a live poker table. It's hard to get right and
          that's kind of why I like it.
        </p> */}
      </section>

      {/* Work */}
      <section className="mb-12 anim-2">
        <SectionHeader
          label="Work"
          action={
            <Link
              href="/projects"
              className="text-[11px] text-zinc-400 dark:text-zinc-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors focus-visible:outline-none shrink-0"
            >
              full history →
            </Link>
          }
        />
        <div>
          {experience.map((item) => (
            <a
              key={item.company}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between py-2.5 -mx-3 px-3 rounded-lg hover:bg-stone-100 dark:hover:bg-white/[0.04] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${item.domain}&sz=64`}
                  alt={item.company}
                  width={18}
                  height={18}
                  className="rounded-sm shrink-0 bg-white"
                />
                <span className="text-zinc-900 dark:text-zinc-100 font-medium text-sm">
                  {item.company}
                </span>
                <span className="text-zinc-400 dark:text-zinc-500 text-xs truncate">
                  {item.role}
                </span>
              </div>
              <span className="text-xs text-zinc-400 dark:text-zinc-500 tabular-nums shrink-0 ml-4">
                {item.period}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Writing */}
      <section className="mb-12 anim-3">
        <SectionHeader
          label="Writing"
          action={
            <Link
              href="/blog"
              className="text-[11px] text-zinc-400 dark:text-zinc-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors focus-visible:outline-none shrink-0"
            >
              all posts →
            </Link>
          }
        />
        <div>
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex items-center justify-between py-3 -mx-3 px-3 rounded-lg hover:bg-stone-100 dark:hover:bg-white/[0.04] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
              >
                <span className="text-zinc-900 dark:text-zinc-100 text-sm">
                  {post.title}
                </span>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  {post.date && (
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 tabular-nums">
                      {formatDate(post.date)}
                    </span>
                  )}
                  <ArrowUpRight
                    className="w-4 h-4 text-amber-500/80 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            ))
          ) : (
            <p className="text-[14px] text-zinc-400 dark:text-zinc-500">
              Nothing published yet.
            </p>
          )}
        </div>
      </section>

      {/* Contact */}
      <section className="anim-4">
        <SectionHeader label="Contact" />
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <a
            href="mailto:shrithik404@gmail.com"
            className="group inline-flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            shrithik404@gmail.com
            <ArrowUpRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </a>
          <a
            href="https://x.com/hrithik73_"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            twitter
            <ArrowUpRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </a>
          <a
            href="https://github.com/hrithik73"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            github
            <ArrowUpRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </a>
        </div>
      </section>
    </div>
  );
}
