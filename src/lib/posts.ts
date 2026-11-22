import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
// gray-matter is CommonJS and only ships a default export.
import matter from "gray-matter";
import { cache } from "react";

const blogDir = join(process.cwd(), "content/blog");
const postExtension = /\.mdx?$/;

export type PostMeta = {
  slug: string;
  title: string;
  /** ISO date (YYYY-MM-DD). Frontmatter uses YYYY/MM/DD. */
  date?: string;
  description?: string;
};

function readPostFiles() {
  if (!existsSync(blogDir)) return [];
  return readdirSync(blogDir).filter((file) => postExtension.test(file));
}

function readPostFile(file: string) {
  const { data, content } = matter(readFileSync(join(blogDir, file), "utf8"));
  const meta: PostMeta = {
    slug: file.replace(postExtension, ""),
    title: data.title,
    date: data.date ? String(data.date).replace(/\//g, "-") : undefined,
    description: data.description,
  };
  return { meta, content };
}

export function getPostSlugs() {
  return readPostFiles().map((file) => file.replace(postExtension, ""));
}

/** All posts, newest first. Memoised per request. */
export const getPosts = cache((): PostMeta[] =>
  readPostFiles()
    .map((file) => readPostFile(file).meta)
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? "")),
);

/**
 * A single post's frontmatter and raw markdown, or null if no such post.
 * Looked up from the directory listing, so a slug can never reach outside
 * content/blog.
 */
export const getPost = cache((slug: string) => {
  const file = readPostFiles()
    // .mdx wins over .md when both exist
    .sort()
    .reverse()
    .find((f) => f.replace(postExtension, "") === slug);
  return file ? readPostFile(file) : null;
});

export function formatPostDate(
  isoDate: string,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  },
) {
  return new Date(isoDate).toLocaleDateString("en-US", options);
}
