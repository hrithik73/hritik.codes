const socialLinks = [
  { name: 'twitter', href: 'https://x.com/hrithik73_' },
  { name: 'github', href: 'https://github.com/hrithik73' },
  { name: 'linkedin', href: 'https://linkedin.com/in/hrithik73' },
  { name: 'email', href: 'mailto:shrithik404@gmail.com' },
];

export function Footer() {
  return (
    <footer className='border-t border-zinc-200/70 dark:border-zinc-800/50'>
      <div className='mx-auto max-w-2xl px-6 py-5 flex items-center justify-between'>
        <nav
          aria-label='Social links'
          className='flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-400 dark:text-zinc-500'
        >
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target={link.href.startsWith('mailto:') ? undefined : '_blank'}
              rel={
                link.href.startsWith('mailto:')
                  ? undefined
                  : 'noopener noreferrer'
              }
              className='hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 rounded'
            >
              {link.name}
            </a>
          ))}
        </nav>
        <span className='text-xs text-zinc-300 dark:text-zinc-600 tabular-nums'>
          {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
}
