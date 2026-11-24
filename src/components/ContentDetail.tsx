"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarDays, Loader2, Megaphone, Newspaper, Sparkles, type LucideIcon } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionLink from "@/components/SectionLink";
import { detailHref } from "@/components/ContentCarousel";
import {
  DEFAULT_CONTENT,
  FALLBACK_IMAGE,
  SECTION_LABELS,
  SiteItem,
  SiteSection,
  fetchSiteContent,
  formatDate,
  groupContent,
} from "@/lib/siteContent";

export type DetailSection = Extract<SiteSection, "announcement" | "news" | "project" | "about">;

const META: Record<
  DetailSection,
  { anchor: string; back: string; icon: LucideIcon }
> = {
  announcement: { anchor: "elanlar", back: "Bütün elanlar", icon: Megaphone },
  news: { anchor: "xeberler", back: "Bütün xəbərlər", icon: Newspaper },
  project: { anchor: "layiheler", back: "Bütün layihələr", icon: Sparkles },
  about: { anchor: "haqqimizda", back: "Ana səhifə", icon: Sparkles },
};

interface ContentDetailProps {
  section: DetailSection;
  id?: string;
}

export default function ContentDetail({ section, id }: ContentDetailProps) {
  const router = useRouter();
  const [items, setItems] = useState<SiteItem[]>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchSiteContent()
      .then((res) => {
        if (!cancelled) setItems(res.items);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const group = useMemo(() => groupContent(items)[section], [items, section]);

  const item = useMemo(() => {
    if (section === "about") return group[0];
    return group.find((entry) => entry.id === id);
  }, [group, id, section]);

  const meta = META[section];
  const Icon = meta.icon;

  const paragraphs = useMemo(() => {
    if (!item) return [] as string[];
    const source = (item.body || "").trim() || item.text || "";
    return source
      .split(/\n+/)
      .map((line) => line.replace(/^[-•]\s*/, "").trim())
      .filter(Boolean);
  }, [item]);

  const related = useMemo(
    () => group.filter((entry) => entry.id !== item?.id).slice(0, 3),
    [group, item]
  );

  return (
    <div className="min-h-screen bg-white text-ink">
      <Navbar />

      <main>
        <section className="hero-mesh relative overflow-hidden">
          <div className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-brand-300/25 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 -top-10 h-72 w-72 rounded-full bg-[#9C8AF8]/20 blur-3xl" />

          <div className="relative mx-auto w-full max-w-[1100px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <SectionLink
              href={`#${meta.anchor}`}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-brand-700 transition-colors hover:text-brand-800"
            >
              <ArrowLeft size={13} /> {meta.back}
            </SectionLink>

            {loading ? (
              <div className="flex items-center gap-2 py-24 text-[13px] font-semibold text-[#6E6788]">
                <Loader2 size={16} className="animate-spin" /> Yüklənir…
              </div>
            ) : !item ? (
              <div className="mt-8 rounded-[24px] border border-[#EAE7F7] bg-white/90 p-8">
                <h1 className="text-[24px] font-extrabold tracking-[-0.02em] text-ink">Məzmun tapılmadı</h1>
                <p className="mt-2 text-[13px] leading-relaxed text-[#5A5270]">
                  Bu {SECTION_LABELS[section].toLowerCase()} silinmiş və ya hələ dərc olunmamış ola bilər.
                </p>
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-brand-600 px-5 text-[12px] font-bold text-white transition-colors hover:bg-brand-700"
                >
                  Ana səhifəyə qayıt <ArrowUpRight size={14} />
                </button>
              </div>
            ) : (
              <div className="mt-5 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12">
                <article>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700 backdrop-blur">
                    <Icon size={12} /> {item.subtitle || SECTION_LABELS[section]}
                  </span>

                  <h1 className="mt-4 text-[28px] font-extrabold leading-[1.1] tracking-[-0.035em] text-ink sm:text-[38px]">
                    {item.title}
                  </h1>

                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-semibold text-[#6E6788]">
                    {item.date && (
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={13} className="text-brand-600" /> {formatDate(item.date)}
                      </span>
                    )}
                    {item.meta && <span className="text-[#8A83A0]">{item.meta}</span>}
                  </div>

                  <div className="relative mt-7 aspect-[16/9] w-full overflow-hidden rounded-[24px] bg-[#EFECFA] shadow-[0_30px_60px_-42px_rgba(32,26,63,0.5)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image || FALLBACK_IMAGE}
                      alt={item.title}
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        const node = event.currentTarget as HTMLImageElement;
                        if (!node.src.endsWith(FALLBACK_IMAGE)) node.src = FALLBACK_IMAGE;
                      }}
                    />
                  </div>

                  <div className="mt-8 space-y-4">
                    {paragraphs.length ? (
                      paragraphs.map((paragraph, index) => (
                        <p key={`${index}-${paragraph.slice(0, 12)}`} className="text-[13.5px] leading-[1.9] text-[#4E4768]">
                          {paragraph}
                        </p>
                      ))
                    ) : (
                      <p className="text-[13.5px] leading-[1.9] text-[#8A83A0]">Ətraflı məlumat tezliklə əlavə olunacaq.</p>
                    )}
                  </div>
                </article>

                <aside className="lg:pt-14">
                  {related.length > 0 && (
                    <div className="rounded-[22px] border border-[#EAE7F7] bg-[#FAF9FF] p-5">
                      <p className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-brand-600">
                        Digər {SECTION_LABELS[section].toLowerCase()}
                      </p>
                      <ul className="mt-4 space-y-3">
                        {related.map((entry) => (
                          <li key={entry.id}>
                            <a
                              href={detailHref(entry)}
                              className="group block text-[12.5px] font-semibold leading-snug text-ink transition-colors hover:text-brand-600"
                            >
                              {entry.title}
                              <span className="mt-1 block text-[10.5px] font-medium text-[#8A83A0]">
                                {entry.date ? formatDate(entry.date) : entry.subtitle || SECTION_LABELS[section]}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-4 rounded-[22px] border border-[#EAE7F7] bg-white p-5">
                    <p className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-brand-600">Üzvlük</p>
                    <p className="mt-2 text-[12.5px] font-semibold leading-relaxed text-ink">
                      Komandaya qoşulmaq üçün müraciət formunu doldurun.
                    </p>
                    <SectionLink
                      href="#uzvluk"
                      className="mt-3 inline-flex items-center gap-1.5 text-[11.5px] font-bold text-brand-600 hover:text-brand-700"
                    >
                      Müraciət et <ArrowUpRight size={13} />
                    </SectionLink>
                  </div>
                </aside>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
