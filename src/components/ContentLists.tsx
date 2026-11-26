"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { AnnouncementCard, NewsCard, ProjectCard } from "@/components/ContentCarousel";
import {
  DEFAULT_CONTENT,
  SiteItem,
  fetchSiteContent,
  groupContent,
  isExpired,
} from "@/lib/siteContent";

function useGroup(section: "news" | "announcement" | "project") {
  const [items, setItems] = useState<SiteItem[]>(() => groupContent(DEFAULT_CONTENT)[section]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchSiteContent()
      .then((res) => {
        if (!cancelled) setItems(groupContent(res.items)[section]);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [section]);

  return { items, loading };
}

function Loading() {
  return (
    <div className="flex items-center gap-2 py-16 text-[13px] font-semibold text-[#6E6788]">
      <Loader2 size={16} className="animate-spin" /> Məzmun yüklənir…
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-[22px] border border-dashed border-[#DCD7EF] bg-white px-6 py-14 text-center">
      <p className="text-[13.5px] font-bold text-ink">Hələ məzmun yoxdur</p>
      <p className="mt-1 text-[12px] text-[#6E6788]">{text}</p>
    </div>
  );
}

export function NewsList() {
  const { items, loading } = useGroup("news");
  if (loading) return <Loading />;
  if (!items.length) return <Empty text="Yeni xəbərlər dərc olunduqda burada görünəcək." />;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
      {items.map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export function AnnouncementList() {
  const { items, loading } = useGroup("announcement");
  if (loading) return <Loading />;
  if (!items.length) return <Empty text="Yeni elanlar dərc olunduqda burada görünəcək." />;

  const active = items.filter((item) => !isExpired(item));
  const expired = items.filter((item) => isExpired(item));

  return (
    <div className="space-y-10">
      <div>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <h2 className="text-[18px] font-extrabold tracking-[-0.02em] text-ink">Aktiv elanlar</h2>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
            {active.length}
          </span>
        </div>
        {active.length ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
            {active.map((item) => (
              <AnnouncementCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <Empty text="Hazırda aktiv elan yoxdur. Yeni imkanlar üçün tədbirlər bölməsinə baxın." />
        )}
      </div>

      {expired.length > 0 && (
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <h2 className="text-[18px] font-extrabold tracking-[-0.02em] text-ink">Keçmiş elanlar</h2>
            <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
              {expired.length}
            </span>
            <span className="text-[11px] text-[#8A83A0]">Son tarixi keçmiş elanlar avtomatik “Bitib” nişanı alır.</span>
          </div>
          <div className="grid grid-cols-1 gap-4 opacity-80 lg:grid-cols-2 lg:gap-5">
            {expired.map((item) => (
              <AnnouncementCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      <p className="text-[11.5px] text-[#8A83A0]">
        Bütün elanlar{" "}
        <Link href="/tedbirler" className="font-bold text-brand-600 hover:text-brand-700">
          Tədbirlər
        </Link>{" "}
        təqvimi ilə birlikdə yenilənir.
      </p>
    </div>
  );
}

export function ProjectList() {
  const { items, loading } = useGroup("project");
  if (loading) return <Loading />;
  if (!items.length) return <Empty text="Yeni layihələr əlavə olunduqda burada görünəcək." />;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ProjectCard key={item.id} item={item} />
      ))}
    </div>
  );
}
