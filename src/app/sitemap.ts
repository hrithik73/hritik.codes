import type { MetadataRoute } from "next";
import { siteUrl } from "~/config/site";
import { getPostSlugs } from "~/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPostSlugs().map((slug) => `/blog/${slug}`);

  return ["", "/projects", "/blog", "/uses", ...posts].map((route) => ({
    url: `${siteUrl}${route}`,
  }));
}
