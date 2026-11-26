import type { MetadataRoute } from "next";
import { SITE } from "@/data/brief";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/menecer", "/kabinet", "/api/", "/login"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
