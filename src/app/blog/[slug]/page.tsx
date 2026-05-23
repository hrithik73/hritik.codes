import { evaluate } from "@mdx-js/mdx";
import fs from "fs";
import matter from "gray-matter";
import type { Metadata } from "next";
import Link from "next/link";
import path from "path";
import * as runtime from "react/jsx-runtime";
import rehypePrettyCode from "rehype-pretty-code";
import { ViewCounter } from "@/components/ViewCounter";
import { useMDXComponents } from "@/mdx-components";

const blogDir = path.join(process.cwd(), "content/blog");

async function getPost(slug: string) {
  const mdPath = path.join(blogDir, `${slug}.md`);
  const mdxPath = path.join(blogDir, `${slug}.mdx`);

  let filePath: string | null = null;
  if (fs.existsSync(mdxPath)) {
    filePath = mdxPath;
  } else if (fs.existsSync(mdPath)) {
    filePath = mdPath;
  }

  if (!filePath) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  const result = await evaluate(content, {
    ...runtime,
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: { light: "github-light", dark: "poimandres" },
          keepBackground: false,
          defaultLang: "plaintext",
        },
      ],
    ],
  });

  const MDXContent = result.default;

  return {
    title: data.title,
    date: data.date,
    description: data.description,
    MDXContent,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Hritik Singh`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: post.title,
      description: post.description,
    },
  };
}

export async function generateStaticParams() {
  if (!fs.existsSync(blogDir)) {
    return [];
  }

  const files = fs.readdirSync(blogDir);
  return files
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
    .map((file) => ({
      slug: file.replace(/\.(md|mdx)$/, ""),
    }));
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Post not found
        </h1>
        <Link
          href="/blog"
          className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          ← back to writing
        </Link>
      </div>
    );
  }

  const { MDXContent } = post;

  return (
    <div className="mx-auto max-w-2xl px-6 py-14 anim-1">
      <article>
        <header className="mb-10">
          <h1 className="font-display text-[clamp(1.6rem,5vw,2.25rem)] text-zinc-900 dark:text-zinc-50 mb-4 text-pretty tracking-tight leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-3">
            {post.date && (
              <time
                dateTime={String(post.date).replace(/\//g, "-")}
                className="text-sm text-zinc-400 dark:text-zinc-500"
              >
                {post.date}
              </time>
            )}
            {post.date && (
              <span className="text-zinc-300 dark:text-zinc-700">·</span>
            )}
            <ViewCounter slug={slug} />
          </div>
        </header>

        <div className="prose prose-zinc dark:prose-invert prose-sm max-w-none">
          <MDXContent components={useMDXComponents()} />
        </div>

        <footer className="mt-14 pt-6 border-t border-zinc-200/70 dark:border-zinc-800/50">
          <Link
            href="/blog"
            className="text-sm text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
          >
            ← all posts
          </Link>
        </footer>
      </article>
    </div>
  );
}
