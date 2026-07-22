import fs from 'fs';
import matter from 'gray-matter';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import path from 'path';
import { experience } from '@/config/experience';

const recentWork = experience.slice(0, 4);

const inlineLink =
  'text-ink underline decoration-accent decoration-[1.5px] underline-offset-[3px] hover:decoration-primary transition-[text-decoration-color]';

function getPosts() {
  const blogDir = path.join(process.cwd(), 'content/blog');
  if (!fs.existsSync(blogDir)) return [];

  return fs
    .readdirSync(blogDir)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((file) => {
      const { data } = matter(
        fs.readFileSync(path.join(blogDir, file), 'utf8'),
      );
      return {
        slug: file.replace(/\.(md|mdx)$/, ''),
        title: data.title as string,
        date: data.date as string | undefined,
      };
    })
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
    .slice(0, 3);
}

function formatDate(dateString: string) {
  const date = new Date(dateString.replace(/\//g, '-'));
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function SectionHeading({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className='flex items-baseline justify-between mb-4'>
      <h2 className='font-display text-xl text-ink'>{title}</h2>
      {action}
    </div>
  );
}

/* A short accent rule under the name — the one graphic gesture on this page */
function Squiggle() {
  return (
    <svg
      viewBox='0 0 56 4'
      className='w-14 h-1 text-accent mt-3'
      fill='none'
      aria-hidden='true'
    >
      <path
        d='M2 2 L 54 2'
        stroke='currentColor'
        strokeWidth='3'
        strokeLinecap='round'
        pathLength={128}
        className='squiggle-draw'
      />
    </svg>
  );
}

export default function Home() {
  const posts = getPosts();

  return (
    <div className='mx-auto max-w-2xl px-6 py-10'>
      {/* Hero */}
      <section className='mb-10 anim-1'>
        <div className='flex items-end gap-4'>
          <img
            src='https://github.com/hrithik73.png'
            alt='Hritik Singh'
            width={52}
            height={52}
            className='rounded-full shrink-0 mb-1 shadow-sm ring-1 ring-line'
          />
          <h1 className='font-display text-[clamp(2.2rem,7.5vw,3.25rem)] leading-none text-ink'>
            Hritik Singh
          </h1>
        </div>
        <Squiggle />

        <p className='mt-6 text-base text-ink/90 leading-[1.75] max-w-lg'>
          I build mobile apps — 5+ years of making things feel fast and smooth,
          currently at{' '}
          <a
            href='https://baazigames.com'
            className={inlineLink}
            target='_blank'
            rel='noopener noreferrer'
          >
            BaaziGames
          </a>
          . Previously at{' '}
          <a
            href='https://bharatpe.com'
            className={inlineLink}
            target='_blank'
            rel='noopener noreferrer'
          >
            BharatPe
          </a>{' '}
          and{' '}
          <a
            href='https://cars24.com'
            className={inlineLink}
            target='_blank'
            rel='noopener noreferrer'
          >
            CARS24
          </a>
          .
        </p>
      </section>

      {/* Work */}
      <section className='mb-8 anim-2'>
        <SectionHeading
          title='Work'
          action={
            <Link
              href='/projects'
              className='text-sm text-accent hover:text-ink transition-colors shrink-0'
            >
              full history →
            </Link>
          }
        />
        <div>
          {recentWork.map((item) => {
            const current = item.period.endsWith('Present');
            return (
              <a
                key={`${item.company}-${item.period}`}
                href={item.href}
                target='_blank'
                rel='noopener noreferrer'
                className={`group flex items-center justify-between py-2.5 -mx-3 px-3 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
                  current
                    ? 'bg-surface ring-1 ring-line hover:ring-accent/40'
                    : 'hover:bg-surface'
                }`}
              >
                <div className='flex items-center gap-2.5 min-w-0'>
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${item.domain}&sz=64`}
                    alt={item.company}
                    width={18}
                    height={18}
                    className='rounded-full shrink-0 bg-white ring-[0.5px] ring-inset ring-black/[0.04] grayscale group-hover:grayscale-0 transition-[filter]'
                  />
                  <span className='text-ink font-medium text-[15px]'>
                    {item.company}
                  </span>
                  <span className='text-muted text-sm truncate'>
                    {item.role}
                  </span>
                  {current && (
                    <span className='text-[11px] font-medium text-accent border border-accent/40 rounded-full px-1.5 py-0.5 leading-none shrink-0'>
                      current
                    </span>
                  )}
                </div>
                <span className='text-sm text-muted tabular-nums shrink-0 ml-4'>
                  {item.period}
                </span>
              </a>
            );
          })}
        </div>
      </section>

      {/* Writing */}
      <section className='mb-8 anim-3'>
        <SectionHeading
          title='Writing'
          action={
            <Link
              href='/blog'
              className='text-sm text-accent hover:text-ink transition-colors shrink-0'
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
                className='group flex items-center justify-between py-3 -mx-3 px-3 rounded-lg hover:bg-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60'
              >
                <span className='text-ink text-[15px]'>{post.title}</span>
                <div className='flex items-center gap-3 shrink-0 ml-4'>
                  {post.date && (
                    <span className='text-sm text-muted tabular-nums'>
                      {formatDate(post.date)}
                    </span>
                  )}
                  <ArrowUpRight
                    className='w-4 h-4 text-accent opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all'
                    aria-hidden='true'
                  />
                </div>
              </Link>
            ))
          ) : (
            <p className='text-[15px] text-muted'>Nothing published yet.</p>
          )}
        </div>
      </section>

      {/* Contact */}
      <section className='anim-4'>
        <SectionHeading title='Say hello' />
        <div className='flex flex-wrap items-center gap-x-5 gap-y-2'>
          <a href='mailto:shrithik404@gmail.com' className={inlineLink}>
            shrithik404@gmail.com
          </a>
          <a
            href='https://x.com/hrithik73_'
            target='_blank'
            rel='noopener noreferrer'
            className='group inline-flex items-center gap-1 text-[15px] text-muted hover:text-ink transition-colors'
          >
            x
            <ArrowUpRight className='w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all' />
          </a>
          <a
            href='https://linkedin.com/in/hrithik73'
            target='_blank'
            rel='noopener noreferrer'
            className='group inline-flex items-center gap-1 text-[15px] text-muted hover:text-ink transition-colors'
          >
            linkedin
            <ArrowUpRight className='w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all' />
          </a>
        </div>
      </section>
    </div>
  );
}
