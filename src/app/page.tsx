import fs from 'fs';
import matter from 'gray-matter';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import path from 'path';
import { PrintPhoto } from '@/components/PrintPhoto';
import { StackIcon } from '@/components/StackIcon';
import { experience } from '@/config/experience';
import { stack } from '@/config/stack';
import { siteUrl, socialLinks } from '~/config/site';

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Hritik Singh',
  url: siteUrl,
  jobTitle: 'Product-minded Developer',
  image: `${siteUrl}/avatar-v2.jpg`,
  sameAs: socialLinks.map((link) => link.href),
};

// One row per company — repeat stints live on /projects
const recentWork = experience
  .filter(
    (item, i) => experience.findIndex((e) => e.company === item.company) === i,
  )
  .slice(0, 3);

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
    <div className='flex items-baseline justify-between mb-2'>
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
    <div className='mx-auto max-w-2xl px-6 pt-12 pb-16'>
      <script
        type='application/ld+json'
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD, no user input
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      {/* Hero */}
      <section className='mb-14 anim-1'>
        <div className='flex flex-col-reverse gap-8 sm:flex-row sm:items-start sm:justify-between sm:gap-10'>
          <div className='min-w-0 max-w-[65ch]'>
            <h1 className='font-display text-[clamp(2rem,8vw,2.75rem)] leading-[1.1] text-ink'>
              Hritik Singh
            </h1>
            <Squiggle />

            <p className='mt-6 text-base text-muted leading-[1.75] text-pretty'>
              Hey <span aria-hidden='true'>👋</span>, I am Hritik, an output-oriented developer with a product mindset.
              5+ years of building good products used by thousands to millions of
              people, currently at{' '}
              <strong className='font-medium text-ink'>BaaziGames</strong>.
              Previously at{' '}
              <strong className='font-medium text-ink'>BharatPe</strong> and{' '}
              <strong className='font-medium text-ink'>CARS24</strong>.
            </p>
          </div>

          <PrintPhoto />
        </div>
      </section>

      {/* Work */}
      <section className='mb-14 anim-2'>
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
          {recentWork.map((item) => (
            <a
              key={`${item.company}-${item.period}`}
              href={item.href}
              target='_blank'
              rel='noopener noreferrer'
              className='group block py-3.5 -mx-3 px-3 rounded-lg hover:bg-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60'
            >
              <div className='flex items-center justify-between gap-4'>
                <div className='flex items-center gap-2.5 min-w-0'>
                  <img
                    src={`/logos/${item.domain}.png`}
                    alt=''
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
                </div>
                <span className='text-sm text-muted tabular-nums shrink-0'>
                  {item.period}
                </span>
              </div>
              <p className='mt-1.5 pl-7 text-sm text-muted leading-relaxed max-w-[60ch]'>
                {item.note}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* Stack */}
      <section className='mb-14 anim-3'>
        <SectionHeading title='Stack' />
        <dl className='divide-y divide-line'>
          {stack.map((group) => (
            <div
              key={group.label}
              className='grid gap-1 py-3 sm:grid-cols-[8.5rem_1fr] sm:gap-4'
            >
              <dt className='text-sm text-muted'>{group.label}</dt>
              <dd>
                <ul className='flex flex-wrap gap-x-4 gap-y-1.5'>
                  {group.items.map((item) => (
                    <li
                      key={item.name}
                      className='inline-flex items-center gap-1.5 text-[15px] text-ink'
                    >
                      <StackIcon icon={item.icon} />
                      {item.name}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Writing */}
      <section className='anim-4'>
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
    </div>
  );
}
