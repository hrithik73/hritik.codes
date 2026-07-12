import { ArrowUpRight } from 'lucide-react';
import type { Metadata } from 'next';
import { experience, sideProjects } from '@/config/experience';

export const metadata: Metadata = {
  title: 'Work — Hritik Singh',
  description: "Places I've worked and things I've built.",
};

/* Wavy hand-drawn divider between the two halves of the page */
function WavyRule() {
  return (
    <svg
      viewBox='0 0 200 8'
      className='w-32 h-2 text-line mt-14 mb-10'
      fill='none'
      aria-hidden='true'
    >
      <path
        d='M2 4 C 20 1, 36 7, 56 4 S 92 1, 112 5 S 156 2, 176 5 S 194 4, 198 4'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
      />
    </svg>
  );
}

export default function ProjectsPage() {
  return (
    <div className='mx-auto max-w-2xl px-6 py-14 anim-page'>
      {/* Header */}
      <div className='mb-12'>
        <h1 className='font-display text-3xl text-ink mb-2'>Work</h1>
        <p className='text-[15px] text-muted'>
          Places I've been, things I've built.
        </p>
      </div>

      {/* Work timeline */}
      <section>
        {experience.map((item, i) => (
          <div
            key={`${item.company}-${item.period}`}
            className={`py-5 ${i < experience.length - 1 ? 'border-b border-line' : ''}`}
          >
            <div className='flex items-baseline justify-between gap-4 mb-1.5'>
              <div className='flex items-center gap-2.5 min-w-0'>
                <img
                  src={`https://www.google.com/s2/favicons?domain=${item.domain}&sz=64`}
                  alt=''
                  width={15}
                  height={15}
                  className='rounded-full shrink-0 bg-white ring-[0.5px] ring-inset ring-black/[0.04] dark:ring-white/[0.04]'
                />
                <a
                  href={item.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-[15px] font-medium text-ink hover:text-primary transition-colors shrink-0'
                >
                  {item.company}
                </a>
                <span className='text-sm text-muted truncate'>
                  {item.role}
                  {item.location ? ` · ${item.location}` : ''}
                </span>
              </div>
              <span className='text-sm text-muted tabular-nums shrink-0'>
                {item.period}
              </span>
            </div>
            <p className='text-sm text-muted leading-relaxed pl-[23px] max-w-[60ch]'>
              {item.note}
            </p>
          </div>
        ))}
      </section>

      {/* Side projects */}
      <section>
        <WavyRule />
        <h2 className='font-display text-xl text-ink mb-4'>Side projects</h2>

        <div>
          {sideProjects.map((p) => (
            <a
              key={p.title}
              href={p.href}
              target='_blank'
              rel='noopener noreferrer'
              className='group flex items-start justify-between py-3.5 -mx-3 px-3 rounded-lg hover:bg-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60'
            >
              <div className='min-w-0 pr-4'>
                <span className='text-[15px] font-medium text-ink group-hover:text-primary transition-colors'>
                  {p.title}
                </span>
                <p className='text-sm text-muted leading-snug mt-0.5 max-w-[60ch]'>
                  {p.note}
                </p>
              </div>
              <ArrowUpRight className='w-4 h-4 text-muted/50 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-0.5' />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
