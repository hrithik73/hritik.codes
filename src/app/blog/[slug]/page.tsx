import { evaluate } from "@mdx-js/mdx";
import type { Metadata } from "next";
// next/link only ships a default export.
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { rehypePrettyCode } from "rehype-pretty-code";
import { ViewCounter } from "~/components/view-counter";
import { siteUrl } from "~/config/site";
import { formatPostDate, getPost, getPostSlugs } from "~/lib/posts";
import { mdxComponents } from "~/mdx-components";

type Props = { params: Promise<{ slug: string }> };

// Posts live in the repo, so every slug is known at build time.
export const dynamicParams = false;

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const { title, description, date } = post.meta;
  return {
    title: `${title} — Hritik Singh`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: date,
      authors: [siteUrl],
      url: "./",
      images: "/opengraph-image",
    },
    // twitter card/creator come from the layout; title, description, image fill in from openGraph
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { meta, content } = post;
  const { default: MDXContent } = await evaluate(content, {
    Fragment,
    jsx,
    jsxs,
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

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    url: `${siteUrl}/blog/${slug}`,
    image: `${siteUrl}/opengraph-image`,
    author: { "@type": "Person", name: "Hritik Singh", url: siteUrl },
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-14 anim-page">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD from our own frontmatter
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <article>
        <header className="mb-10">
          <h1 className="font-display text-[clamp(1.6rem,5vw,2.25rem)] text-ink mb-4 text-pretty leading-tight">
            {meta.title}
          </h1>
          <div className="flex items-center gap-3">
            {meta.date && (
              <>
                <time dateTime={meta.date} className="text-sm text-muted">
                  {formatPostDate(meta.date)}
                </time>
                <span className="text-muted/50">·</span>
              </>
            )}
            <ViewCounter slug={slug} />
          </div>
        </header>

        <div className="max-w-none">
          <MDXContent components={mdxComponents} />
        </div>

        <footer className="mt-14 pt-6 border-t border-line">
          <Link
            href="/blog"
            className="text-sm text-muted hover:text-ink transition-colors"
          >
            ← all posts
          </Link>
        </footer>
      </article>
    </div>
  );
}
