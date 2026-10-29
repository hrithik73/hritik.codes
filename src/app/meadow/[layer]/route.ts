import { meadowLayers } from "~/lib/meadow";

// Footer meadow art, generated once at build and cached like any static file.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(meadowLayers).map((layer) => ({ layer }));
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ layer: string }> },
) {
  const { layer } = await params;
  return new Response(meadowLayers[layer], {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400, s-maxage=31536000",
    },
  });
}
