const socialLinks = [
  { name: 'twitter', href: 'https://x.com/hrithik73_' },
  { name: 'github', href: 'https://github.com/hrithik73' },
  { name: 'linkedin', href: 'https://linkedin.com/in/hrithik73' },
  { name: 'email', href: 'mailto:shrithik404@gmail.com' },
];

export function Footer() {
  return (
    <footer className='border-t border-zinc-100 dark:border-zinc-800/50'>
      <div className='mx-auto max-w-2xl px-6 py-6'>
        <nav className='flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-400 dark:text-zinc-500'>
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
              className='hover:opacity-60 transition-opacity'
            >
              {link.name}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
