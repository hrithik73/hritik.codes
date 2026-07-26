import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { getPostHogClient } from "@/lib/posthog-server";

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

  const posthog = getPostHogClient();
  if (posthog) {
    posthog.capture({
      distinctId: `anonymous_view_${slug}`,
      event: "blog_post_viewed",
      properties: { slug, views },
    });
    await posthog.flush();
  }

  return NextResponse.json({ views });
}
