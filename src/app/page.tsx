import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const blogs = [
  {
    title: 'Import Aliases in React Native',
    href: '/blog/import-aliases-in-react-native',
  },
  {
    title: 'How to create a boilerplate',
    href: '/blog/how-to-create-boilerplate-in-react-native',
  },
];

const inlineLink =
  'text-zinc-800 dark:text-zinc-200 underline decoration-amber-400/70 dark:decoration-amber-500/50 underline-offset-2 hover:decoration-amber-500 dark:hover:decoration-amber-400 transition-[text-decoration-color]';

export default function Home() {
  return (
    <div className='mx-auto max-w-2xl px-6 py-14'>
      {/* Intro */}
      <section className='mb-14 anim-1'>
        <div className='flex items-start gap-4 mb-5'>
          <img
            src='https://github.com/hrithik73.png'
            alt='Hritik Singh'
            width={56}
            height={56}
            className='rounded-full shrink-0 shadow-sm shadow-zinc-900/10 dark:shadow-black/40'
          />
          <div className='pt-0.5'>
            <h2 className='text-lg font-semibold text-zinc-900 dark:text-zinc-100 text-pretty tracking-tight'>
              Hritik Singh
            </h2>
            <p className='text-sm text-zinc-500 dark:text-zinc-400 mt-0.5'>
              Mobile App Developer
            </p>
          </div>
        </div>
        <p className='text-[15px] text-zinc-600 dark:text-zinc-400 leading-[1.75] max-w-xl'>
          Mobile app developer with 4+ years crafting React Native apps.
          Currently at{' '}
          <a
            href='https://baazigames.com'
            className={inlineLink}
            target='_blank'
            rel='noopener noreferrer'
          >
            BaaziGames
          </a>
          , previously at{' '}
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
      </section>

      {/* Projects */}
      <section className='mb-12 anim-2'>
        <p className='text-[10px] tracking-[0.14em] uppercase font-semibold text-zinc-400 dark:text-zinc-500 mb-2'>
          Projects
        </p>
        <a
          href='https://github.com/hrithik73'
          target='_blank'
          rel='noopener noreferrer'
          className='group flex items-center justify-between py-2.5 -mx-3 px-3 rounded-lg hover:bg-stone-100 dark:hover:bg-white/[0.04] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400'
        >
          <div className='min-w-0'>
            <span className='text-zinc-900 dark:text-zinc-100 font-medium'>
              RN Starter
            </span>
            <span className='text-sm text-zinc-500 dark:text-zinc-400 ml-2'>
              — Opinionated react-native template
            </span>
          </div>
          <ArrowUpRight
            className='w-4 h-4 text-zinc-400 shrink-0 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-0.5 -translate-y-0 group-hover:-translate-y-0.5 transition-all'
            aria-hidden='true'
          />
        </a>
      </section>

      {/* Writing */}
      <section className='anim-3'>
        <div className='flex items-center justify-between mb-2'>
          <p className='text-[10px] tracking-[0.14em] uppercase font-semibold text-zinc-400 dark:text-zinc-500'>
            Writing
          </p>
          <Link
            href='/blog'
            className='text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 rounded'
          >
            all posts →
          </Link>
        </div>
        <div>
          {blogs.map((blog, i) => (
            <Link
              key={i}
              href={blog.href}
              className='group flex items-center justify-between py-2.5 -mx-3 px-3 rounded-lg hover:bg-stone-100 dark:hover:bg-white/[0.04] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400'
            >
              <span className='text-zinc-900 dark:text-zinc-100'>
                {blog.title}
              </span>
              <ArrowUpRight
                className='w-4 h-4 text-zinc-400 shrink-0 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-0.5 -translate-y-0 group-hover:-translate-y-0.5 transition-all'
                aria-hidden='true'
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
