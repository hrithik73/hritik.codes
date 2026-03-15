import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { evaluate } from '@mdx-js/mdx';
import rehypePrettyCode from 'rehype-pretty-code';
import Link from 'next/link';
import * as runtime from 'react/jsx-runtime';
import { useMDXComponents } from '@/mdx-components';
import { ViewCounter } from '@/components/ViewCounter';

const blogDir = path.join(process.cwd(), 'content/blog');

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

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  const result = await evaluate(content, {
    ...runtime,
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: { light: 'github-light', dark: 'poimandres' },
          keepBackground: false,
          defaultLang: 'plaintext',
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

export async function generateStaticParams() {
  if (!fs.existsSync(blogDir)) {
    return [];
  }

  const files = fs.readdirSync(blogDir);
  return files
    .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
    .map((file) => ({
      slug: file.replace(/\.(md|mdx)$/, ''),
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
      <div className='mx-auto max-w-2xl px-6 py-16'>
        <h1 className='text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4'>
          Post not found
        </h1>
        <Link
          href='/blog'
          className='text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors'
        >
          ← back to writing
        </Link>
      </div>
    );
  }

  const { MDXContent } = post;

  return (
    <div className='mx-auto max-w-2xl px-6 py-14 anim-1'>
      <Link
        href='/blog'
        className='inline-block text-sm text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors mb-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 rounded'
      >
        ← writing
      </Link>

      <article>
        <header className='mb-10'>
          <h1 className='text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3 text-pretty tracking-tight leading-snug'>
            {post.title}
          </h1>
          <div className='flex items-center gap-3'>
            {post.date && (
              <time
                dateTime={String(post.date).replace(/\//g, '-')}
                className='text-sm text-zinc-400 dark:text-zinc-500'
              >
                {post.date}
              </time>
            )}
            {post.date && (
              <span className='text-zinc-300 dark:text-zinc-700'>·</span>
            )}
            <ViewCounter slug={slug} />
          </div>
        </header>

        <div className='prose prose-zinc dark:prose-invert prose-sm max-w-none'>
          <MDXContent components={useMDXComponents()} />
        </div>

        <footer className='mt-14 pt-6 border-t border-zinc-200/70 dark:border-zinc-800/50'>
          <div className='flex items-center gap-3'>
            <img
              src='https://github.com/hrithik73.png'
              alt='Hritik Singh'
              width={36}
              height={36}
              loading='lazy'
              className='rounded-full shadow-sm shadow-zinc-900/10 dark:shadow-black/40'
            />
            <div>
              <p className='text-sm font-medium text-zinc-900 dark:text-zinc-100'>
                Hritik Singh
              </p>
              <p className='text-xs text-zinc-500 dark:text-zinc-400'>
                Mobile App Developer
              </p>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}
