import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { redis } from '@/lib/redis';

const blogDir = path.join(process.cwd(), 'content/blog');

function formatDate(dateString: string) {
  const date = new Date(dateString.replace(/\//g, '-'));
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getPosts() {
  if (!fs.existsSync(blogDir)) {
    return [];
  }

  const files = fs.readdirSync(blogDir);

  return files
    .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
    .map((file) => {
      const filePath = path.join(blogDir, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug: file.replace(/\.(md|mdx)$/, ''),
        title: data.title,
        date: data.date,
        description: data.description,
      };
    })
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

export default async function BlogPage() {
  const posts = getPosts();

  const viewCounts = await Promise.all(
    posts.map((post) =>
      redis.get<number>(`views:${post.slug}`).catch(() => null),
    ),
  );

  return (
    <div className='mx-auto max-w-2xl px-6 py-14 anim-1'>
      <header className='mb-10'>
        <h1 className='text-lg font-semibold text-zinc-900 dark:text-zinc-100 text-pretty tracking-tight'>
          Writing
        </h1>
        <p className='text-[15px] text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed'>
          Thoughts on mobile development, React Native, and building apps.
        </p>
      </header>

      <div>
        {posts.map((post, i) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className='group flex items-baseline justify-between py-2.5 -mx-3 px-3 rounded-lg hover:bg-stone-100 dark:hover:bg-white/[0.04] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400'
          >
            <span className='text-zinc-900 dark:text-zinc-100'>
              {post.title}
            </span>
            <span className='flex items-baseline gap-3 ml-4 shrink-0'>
              {viewCounts[i] != null && (
                <span className='text-xs text-zinc-300 dark:text-zinc-600 tabular-nums'>
                  {(viewCounts[i] as number).toLocaleString()}
                </span>
              )}
              {post.date && (
                <span className='text-xs text-zinc-400 dark:text-zinc-500 tabular-nums'>
                  {formatDate(post.date)}
                </span>
              )}
            </span>
          </Link>
        ))}

        {posts.length === 0 && (
          <p className='text-zinc-500 dark:text-zinc-400 py-8 text-center'>
            No posts yet.
          </p>
        )}
      </div>
    </div>
  );
}
