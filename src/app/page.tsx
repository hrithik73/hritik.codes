import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const experience = [
  {
    company: 'BaaziGames',
    role: 'SDE-2',
    period: 'Jan 2026 – present',
    href: 'https://baazigames.com',
    domain: 'baazigames.com',
  },
  {
    company: 'BharatPe',
    role: 'SDE-2',
    period: 'Sep 2025 – Jan 2026',
    href: 'https://bharatpe.com',
    domain: 'bharatpe.com',
  },
  {
    company: 'CARS24',
    role: 'SDE-2',
    period: 'Apr 2024 – Mar 2025',
    href: 'https://cars24.com',
    domain: 'cars24.com',
  },
  {
    company: 'IndiaNIC',
    role: 'Software Engineer',
    period: 'Jun 2022 – Feb 2024',
    href: 'https://indianic.com',
    domain: 'indianic.com',
  },
];

const stack = [
  'React Native',
  'TypeScript',
  'Reanimated',
  'Firebase',
  'Redux',
  'REST APIs',
];

const inlineLink =
  'text-zinc-800 dark:text-zinc-200 underline decoration-amber-400/70 dark:decoration-amber-500/50 underline-offset-2 hover:decoration-amber-500 dark:hover:decoration-amber-400 transition-[text-decoration-color]';

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

function SectionHeader({
  label,
  action,
}: {
  label: string;
  action?: React.ReactNode;
}) {
  return (
    <div className='flex items-center gap-3 mb-5'>
      <span className='text-[10px] tracking-[0.18em] uppercase font-bold text-zinc-400 dark:text-zinc-500 shrink-0'>
        {label}
      </span>
      <div className='flex-1 h-px bg-zinc-200/80 dark:bg-zinc-800/80' />
      {action}
    </div>
  );
}

export default function Home() {
  const posts = getPosts();

  return (
    <div className='mx-auto max-w-2xl px-6 py-16'>
      {/* Hero */}
      <section className='mb-14 anim-1'>
        {/* Name + avatar */}
        <div className='flex items-end gap-4 mb-3'>
          <img
            src='https://github.com/hrithik73.png'
            alt='Hritik Singh'
            width={50}
            height={50}
            className='rounded-full shrink-0 mb-[3px] shadow-sm ring-1 ring-zinc-900/8 dark:ring-white/10'
          />
          <h1 className='font-display text-[clamp(2.4rem,8.5vw,3.85rem)] leading-none tracking-tight text-zinc-900 dark:text-zinc-50'>
            Hritik Singh
          </h1>
        </div>

        {/* Amber rule */}
        <div className='h-px bg-amber-400/60 dark:bg-amber-500/40 mb-3 amber-rule' />

        {/* Role */}
        <p className='text-[11px] tracking-[0.22em] uppercase font-semibold text-amber-700/60 dark:text-amber-500/55 mb-7'>
          Mobile App Developer
        </p>

        {/* Bio */}
        <p className='text-[15px] text-zinc-600 dark:text-zinc-400 leading-[1.85] max-w-lg'>
          4+ years crafting React Native apps. Worked at{' '}
          <a
            href='https://bharatpe.com'
            className={inlineLink}
            target='_blank'
            rel='noopener noreferrer'
          >
            BharatPe
          </a>
          ,{' '}
          <a
            href='https://cars24.com'
            className={inlineLink}
            target='_blank'
            rel='noopener noreferrer'
          >
            CARS24
          </a>
          , and{' '}
          <a
            href='https://indianic.com'
            className={inlineLink}
            target='_blank'
            rel='noopener noreferrer'
          >
            Indianic
          </a>
          . Building pixel-perfect, smooth mobile experiences.
        </p>

        {/* Now */}
        <div className='mt-7 pt-6 border-t border-zinc-200/50 dark:border-zinc-800/50'>
          <p className='text-[10px] tracking-[0.18em] uppercase font-bold text-zinc-400 dark:text-zinc-500 mb-2'>
            Now
          </p>
          <p className='text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed'>
            Building smooth games at{' '}
            <a
              href='https://baazigames.com'
              className={inlineLink}
              target='_blank'
              rel='noopener noreferrer'
            >
              BaaziGames
            </a>{' '}
            — w/ React Native & Reanimated.
          </p>
        </div>
      </section>

      {/* Work */}
      <section className='mb-12 anim-2'>
        <SectionHeader label='Work' />
        <div>
          {experience.map((item) => (
            <a
              key={item.company}
              href={item.href}
              target='_blank'
              rel='noopener noreferrer'
              className='group flex items-center justify-between py-2.5 -mx-3 px-3 rounded-lg hover:bg-stone-100 dark:hover:bg-white/[0.04] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400'
            >
              <div className='flex items-center gap-2.5 min-w-0'>
                <img
                  src={`https://www.google.com/s2/favicons?domain=${item.domain}&sz=64`}
                  alt={item.company}
                  width={18}
                  height={18}
                  className='rounded-sm shrink-0 bg-white'
                />
                <span className='text-zinc-900 dark:text-zinc-100 font-medium text-sm'>
                  {item.company}
                </span>
                <span className='text-zinc-400 dark:text-zinc-500 text-xs truncate'>
                  {item.role}
                </span>
              </div>
              <span className='text-xs text-zinc-400 dark:text-zinc-500 tabular-nums shrink-0 ml-4'>
                {item.period}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Stack */}
      <section className='mb-12 anim-3'>
        <SectionHeader label='Stack' />
        <div className='flex flex-wrap gap-2'>
          {stack.map((s) => (
            <span
              key={s}
              className='text-xs px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-700/60 text-zinc-600 dark:text-zinc-400 font-medium'
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className='mb-12 anim-4'>
        <SectionHeader label='Projects' />
        <a
          href='https://github.com/hrithik73'
          target='_blank'
          rel='noopener noreferrer'
          className='group flex items-center justify-between py-3 -mx-3 px-3 rounded-lg hover:bg-stone-100 dark:hover:bg-white/[0.04] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400'
        >
          <div className='min-w-0'>
            <span className='text-zinc-900 dark:text-zinc-100 font-medium text-sm'>
              RN Starter
            </span>
            <span className='text-sm text-zinc-400 dark:text-zinc-500 ml-2'>
              — Opinionated react-native template
            </span>
          </div>
          <ArrowUpRight
            className='w-4 h-4 text-amber-500/80 shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all'
            aria-hidden='true'
          />
        </a>
      </section>

      {/* Writing */}
      <section className='mb-12 anim-5'>
        <SectionHeader
          label='Writing'
          action={
            <Link
              href='/blog'
              className='text-[11px] text-zinc-400 dark:text-zinc-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors focus-visible:outline-none shrink-0'
            >
              all posts →
            </Link>
          }
        />
        <div>
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className='group flex items-center justify-between py-3 -mx-3 px-3 rounded-lg hover:bg-stone-100 dark:hover:bg-white/[0.04] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400'
            >
              <span className='text-zinc-900 dark:text-zinc-100 text-sm'>
                {post.title}
              </span>
              <div className='flex items-center gap-3 shrink-0 ml-4'>
                {post.date && (
                  <span className='text-xs text-zinc-400 dark:text-zinc-500 tabular-nums'>
                    {formatDate(post.date)}
                  </span>
                )}
                <ArrowUpRight
                  className='w-4 h-4 text-amber-500/80 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all'
                  aria-hidden='true'
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className='anim-6'>
        <SectionHeader label='Contact' />
        <p className='text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4'>
          Open to new roles, side projects, or just a good conversation.
        </p>
        <a
          href='mailto:shrithik404@gmail.com'
          className='group inline-flex items-center gap-1.5 text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:text-amber-600 dark:hover:text-amber-400 transition-colors'
        >
          shrithik404@gmail.com
          <ArrowUpRight className='w-3.5 h-3.5 text-zinc-400 group-hover:text-amber-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all' />
        </a>
      </section>
    </div>
  );
}
