'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className='w-8 h-8' />;
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className='p-1.5 text-zinc-500 dark:text-zinc-400 hover:opacity-60 transition-opacity'
      aria-label='Toggle theme'
    >
      {resolvedTheme === 'dark' ? (
        <Sun className='h-4 w-4' />
      ) : (
        <Moon className='h-4 w-4' />
      )}
    </button>
  );
}
