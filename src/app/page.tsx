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

export default function Home() {
  return (
    <div className='mx-auto max-w-2xl px-6 py-12'>
      {/* Intro */}
      <section className='mb-10'>
        <h2 className='text-xl font-medium text-zinc-900 dark:text-zinc-100 mb-3'>
          Hritik Singh
        </h2>
        <p className='text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl'>
          Mobile app developer with 4+ years crafting React Native apps.
          Currently at{' '}
          <a
            href='https://baazigames.com'
            className='underline decoration-zinc-300 dark:decoration-zinc-600 underline-offset-2 hover:opacity-60 transition-opacity'
            target='_blank'
            rel='noopener noreferrer'
          >
            BaaziGames
          </a>
          , previously at{' '}
          <a
            href='https://bharatpe.com'
            className='underline decoration-zinc-300 dark:decoration-zinc-600 underline-offset-2 hover:opacity-60 transition-opacity'
            target='_blank'
            rel='noopener noreferrer'
          >
            BharatPe
          </a>
          ,{' '}
          <a
            href='https://cars24.com'
            className='underline decoration-zinc-300 dark:decoration-zinc-600 underline-offset-2 hover:opacity-60 transition-opacity'
            target='_blank'
            rel='noopener noreferrer'
          >
            CARS24
          </a>
          , and{' '}
          <a
            href='https://indianic.com'
            className='underline decoration-zinc-300 dark:decoration-zinc-600 underline-offset-2 hover:opacity-60 transition-opacity'
            target='_blank'
            rel='noopener noreferrer'
          >
            Indianic
          </a>
          . Building pixel-perfect, smooth mobile experiences.
        </p>
      </section>

      {/* Projects */}
      <section className='mb-10'>
        <h3 className='text-sm text-zinc-400 dark:text-zinc-500 mb-4'>
          Projects
        </h3>
        <a
          href='https://github.com/hrithik73'
          target='_blank'
          rel='noopener noreferrer'
          className='group flex items-center justify-between py-2'
        >
          <div>
            <span className='text-zinc-900 dark:text-zinc-100 group-hover:opacity-60 transition-opacity'>
              RN Starter
            </span>
            <span className='text-sm text-zinc-500 dark:text-zinc-400 ml-2'>
              — Opinionated react-native template
            </span>
          </div>
          <ArrowUpRight className='w-4 h-4 text-zinc-400 shrink-0 group-hover:opacity-60 transition-opacity' />
        </a>
      </section>

      {/* Writing */}
      <section>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-sm text-zinc-400 dark:text-zinc-500'>Writing</h3>
          <Link
            href='/blog'
            className='text-sm text-zinc-400 dark:text-zinc-500 underline decoration-zinc-300 dark:decoration-zinc-600 underline-offset-2 hover:opacity-60 transition-opacity'
          >
            all posts
          </Link>
        </div>
        <div className='space-y-3'>
          {blogs.map((blog, i) => (
            <Link
              key={i}
              href={blog.href}
              className='group flex items-center justify-between py-2'
            >
              <span className='text-zinc-900 dark:text-zinc-100 group-hover:opacity-60 transition-opacity'>
                {blog.title}
              </span>
              <ArrowUpRight className='w-4 h-4 text-zinc-400 shrink-0 group-hover:opacity-60 transition-opacity' />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
