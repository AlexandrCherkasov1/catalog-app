import type { MetadataRoute } from "next";

import { getAbsoluteUrl, SITE_URL } from "@shared/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/cart", "/favorites"],
    },
    sitemap: getAbsoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}