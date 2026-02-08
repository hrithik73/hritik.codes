import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

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

export default function BlogPage() {
  const posts = getPosts();

  return (
    <div className='mx-auto max-w-2xl px-6 py-16'>
      <header className='mb-12'>
        <h1 className='text-xl font-medium text-zinc-900 dark:text-zinc-100'>
          Writing
        </h1>
        <p className='text-zinc-500 dark:text-zinc-400 mt-2'>
          Thoughts on mobile development, React Native, and building apps.
        </p>
      </header>

      <div className='space-y-1'>
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className='group flex items-baseline justify-between py-3'
          >
            <span className='text-zinc-900 dark:text-zinc-100 group-hover:opacity-60 transition-opacity'>
              {post.title}
            </span>
            {post.date && (
              <span className='text-sm text-zinc-400 dark:text-zinc-500 tabular-nums ml-4 shrink-0'>
                {formatDate(post.date)}
              </span>
            )}
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
