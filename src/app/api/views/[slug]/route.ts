import { SeverityNumber } from "@opentelemetry/api-logs";
import { after, NextResponse } from "next/server";
import { isLocalRequest } from "~/lib/is-local-request";
import { posthogLogger, posthogLoggerProvider } from "~/lib/posthog-logger";
import { redis } from "~/lib/redis";

type Context = { params: Promise<{ slug: string }> };

async function getViews(slug: string) {
  return (await redis.get<number>(`views:${slug}`)) ?? 0;
}

export async function GET(_req: Request, { params }: Context) {
  const { slug } = await params;
  return NextResponse.json({ views: await getViews(slug) });
}

export async function POST(req: Request, { params }: Context) {
  const { slug } = await params;

  // Local dev and `next start` share the production Redis, so don't let our
  // own visits inflate the counts. Spoofing Host only skips a view.
  if (isLocalRequest(req)) {
    return NextResponse.json({ views: await getViews(slug) });
  }

  const views = await redis.incr(`views:${slug}`);

  posthogLogger?.emit({
    body: "Blog view count incremented",
    severityNumber: SeverityNumber.INFO,
    attributes: {
      event: "blog_view_count_incremented",
      route: "/api/views/[slug]",
      method: "POST",
      total_views: views,
    },
  });

  after(() => posthogLoggerProvider?.forceFlush().catch(() => {}));

  return NextResponse.json({ views });
}
