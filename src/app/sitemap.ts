import type { MetadataRoute } from "next";
import { DEFAULT_CONTENT, itemSlug } from "@/lib/siteContent";
import { EVENTS, SITE } from "@/data/brief";

const BASE = SITE.url;

const DETAIL_BASE: Record<string, string> = {
  announcement: "/elanlar",
  news: "/xeberler",
  project: "/layiheler",
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages = [
    "",
    "/haqqimizda",
    "/komanda",
    "/tedbirler",
    "/tedbirler/tezis",
    "/tedbirler/arxiv",
    "/layiheler",
    "/jurnal",
    "/elmi-imkanlar",
    "/resurslar",
    "/terefdaslar",
    "/xeberler",
    "/elanlar",
    "/media",
    "/sertifikat",
    "/elaqe",
    "/mexfilik",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const events = EVENTS.map((event) => ({
    url: `${BASE}/tedbirler/${event.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const content = DEFAULT_CONTENT.filter((item) => item.status !== "draft" && DETAIL_BASE[item.sec]).map((item) => ({
    url: `${BASE}${DETAIL_BASE[item.sec]}/${itemSlug(item)}`,
    lastModified: new Date(item.ts || now.getTime()),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...events, ...content];
}
