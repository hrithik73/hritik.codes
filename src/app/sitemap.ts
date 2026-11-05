import fs from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { siteUrl } from "~/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = fs
    .readdirSync(path.join(process.cwd(), "content/blog"))
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => `/blog/${file.replace(/\.mdx?$/, "")}`);

  return ["", "/projects", "/blog", ...posts].map((route) => ({
    url: `${siteUrl}${route}`,
  }));
}
