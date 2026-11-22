import { SeverityNumber } from "@opentelemetry/api-logs";
import { after, NextResponse } from "next/server";
import { posthogLogger, posthogLoggerProvider } from "~/lib/posthog-logger";
import { redis } from "~/lib/redis";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const views = (await redis.get<number>(`views:${slug}`)) ?? 0;
  return NextResponse.json({ views });
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
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
