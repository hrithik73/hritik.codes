import type { ReactNode } from "react";

export function SectionHeading({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between mb-2">
      <h2 className="font-display text-xl text-ink">{title}</h2>
      {action}
    </div>
  );
}
