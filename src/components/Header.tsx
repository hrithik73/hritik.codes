import Link from 'next/link';
import { ThemeSwitcher } from './ThemeSwitcher';

function Logo() {
  return (
    <svg
      width='26'
      height='26'
      viewBox='0 0 100 100'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden='true'
    >
      {/* Wave-particle duality — two sine waves in opposite phase creating interference */}
      <path
        d='M5,50 C20,15 35,15 50,50 C65,85 80,85 95,50'
        stroke='currentColor'
        strokeWidth='3.5'
        strokeLinecap='round'
      />
      <path
        d='M5,50 C20,85 35,85 50,50 C65,15 80,15 95,50'
        stroke='currentColor'
        strokeWidth='3.5'
        strokeLinecap='round'
      />
      {/* Interference node */}
      <circle cx='50' cy='50' r='4' fill='currentColor' />
    </svg>
  );
}

export function Header() {
  return (
    <header className='sticky top-0 z-40 border-b border-zinc-200/70 dark:border-zinc-800/50 bg-[var(--background)]/85 backdrop-blur-md'>
      <div className='mx-auto flex max-w-2xl items-center justify-between px-6 py-4'>
        <Link
          href='/'
          aria-label='Home'
          className='text-zinc-900 dark:text-zinc-100 hover:opacity-60 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 rounded'
        >
          <Logo />
        </Link>
        <div className='flex items-center gap-5'>
          <Link
            href='/blog'
            className='text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 rounded'
          >
            blog
          </Link>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
