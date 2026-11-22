import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
// next/link only ships a default export.
import Link from "next/link";
import { formatPostDate, getPosts } from "~/lib/posts";
import { redis } from "~/lib/redis";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Writing — Hritik Singh",
  description: "Notes on React Native and mobile development by Hritik Singh.",
};

const getViewCounts = unstable_cache(
  (slugs: string[]) =>
    redis
      .mget<(number | null)[]>(...slugs.map((s) => `views:${s}`))
      .catch(() => slugs.map(() => null)),
  ["blog-views"],
  { revalidate: 60 },
);

export default async function BlogPage() {
  const posts = getPosts();
  const viewCounts = await getViewCounts(posts.map((p) => p.slug));

  return (
    <div className="page-col mx-auto max-w-[55rem] px-6 py-14 anim-page">
      <header className="mb-10">
        <h1 className="font-display text-3xl text-ink">Writing</h1>
      </header>

      <div>
        {posts.map((post, i) => {
          const views = viewCounts[i];
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex items-baseline justify-between py-2.5 -mx-3 px-3 rounded-lg hover:bg-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            >
              <span className="text-ink text-[15px]">{post.title}</span>
              <span className="flex items-baseline gap-3 ml-4 shrink-0">
                {views != null && (
                  <span className="text-sm text-muted tabular-nums">
                    {views.toLocaleString()}
                  </span>
                )}
                {post.date && (
                  <span className="text-sm text-muted tabular-nums">
                    {formatPostDate(post.date)}
                  </span>
                )}
              </span>
            </Link>
          );
        })}

        {posts.length === 0 && (
          <p className="text-muted py-8 text-center">No posts yet.</p>
        )}
      </div>
    </div>
  );
}
