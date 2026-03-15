import { redis } from '@/lib/redis';
import { NextResponse } from 'next/server';

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
  return NextResponse.json({ views });
}
