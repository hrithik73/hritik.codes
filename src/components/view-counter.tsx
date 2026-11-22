"use client";

import { useEffect, useState } from "react";

type ViewState = { slug: string; views: number };

export function ViewCounter({ slug }: { slug: string }) {
  const [state, setState] = useState<ViewState | null>(null);

  // Counting a view is a side effect of the post being *displayed*, not of any
  // user event, and the page is statically rendered — so this is one of the
  // cases where an Effect is the right tool.
  useEffect(() => {
    let ignore = false;
    fetch(`/api/views/${slug}`, { method: "POST" })
      .then((res) => res.json())
      .then((data: { views: number }) => {
        if (!ignore) setState({ slug, views: data.views });
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, [slug]);

  // Derived during render: a count fetched for a previous slug is never shown.
  const views = state?.slug === slug ? state.views : null;

  if (views === null) return <span className="w-16 h-3 inline-block" />;

  return (
    <span className="text-sm text-muted tabular-nums">
      {views.toLocaleString()} {views === 1 ? "view" : "views"}
    </span>
  );
}
