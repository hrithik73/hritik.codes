'use client';

import { useEffect, useState } from 'react';

export function ViewCounter({ slug }: { slug: string }) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/views/${slug}`, { method: 'POST' })
      .then((res) => res.json())
      .then((data) => setViews(data.views))
      .catch(() => {});
  }, [slug]);

  if (views === null) return <span className='w-16 h-3 inline-block' />;

  return (
    <span className='text-xs text-zinc-400 dark:text-zinc-500 tabular-nums'>
      {views.toLocaleString()} {views === 1 ? 'view' : 'views'}
    </span>
  );
}
