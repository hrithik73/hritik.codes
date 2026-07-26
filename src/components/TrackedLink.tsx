"use client";

import Link from "next/link";
import posthog from "posthog-js";

interface TrackedLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  event: string;
  properties?: Record<string, unknown>;
  href: string;
  children: React.ReactNode;
}

export function TrackedLink({
  event,
  properties,
  href,
  onClick,
  children,
  ...rest
}: TrackedLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    posthog.capture(event, properties);
    onClick?.(e);
  };

  const isInternal = href.startsWith("/");
  if (isInternal) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (
      <Link href={href} onClick={handleClick} {...(rest as any)}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
