"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Megaphone,
  Quote,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionLink from "@/components/SectionLink";
import ContentCarousel from "@/components/ContentCarousel";
import Reveal from "@/components/ui/Reveal";
import {
  DEFAULT_CONTENT,
  FALLBACK_IMAGE,
  SiteItem,
  fetchSiteContent,
  formatDate,
  groupContent,
} from "@/lib/siteContent";
import { ACTIVITIES, CTA, HERO, OUTCOMES, ROTATION } from "@/data/program";

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[10px] font-bold uppercase leading-none tracking-[0.18em] text-brand-600 lg:text-[11px] ${className}`}
    >
      <span className="h-1 w-1 rounded-full bg-brand-600" />
      {children}
    </span>
  );
}

function MediaImage({ src, alt, className = "" }: { src?: string; alt: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src || FALLBACK_IMAGE}
      alt={alt}
      loading="lazy"
      className={`h-full w-full object-cover ${className}`}
      onError={(e) => {
        const node = e.currentTarget as HTMLImageElement;
        if (!node.src.endsWith(FALLBACK_IMAGE)) node.src = FALLBACK_IMAGE;
      }}
    />
  );
}

function SectionHeading({
  label,
  title,
  text,
  align = "left",
  tone = "light",
}: {
  label: string;
  title: React.ReactNode;
  text?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <Label className={tone === "dark" ? "!text-[#B9ABEE]" : ""}>{label}</Label>
      <h2
        className={`mt-4 text-[28px] font-extrabold leading-[1.08] tracking-[-0.035em] sm:text-[36px] lg:text-[44px] ${
          tone === "dark" ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {text && (
        <p
          className={`mt-4 text-[13px] leading-[1.8] sm:text-[14px] ${
            tone === "dark" ? "text-[#CFC6EC]" : "text-[#5A5270]"
          }`}
        >
          {text}
        </p>
      )}
    </div>
  );
}

export default function HomePage() {
  const [content, setContent] = useState<SiteItem[]>(DEFAULT_CONTENT);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchSiteContent().then((res) => {
      if (cancelled) return;
      setContent(res.items);
      setConnected(res.connected);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const groups = useMemo(() => groupContent(content), [content]);

  const about = groups.about[0] || DEFAULT_CONTENT[0];
  const aboutPoints = (about.body || "")
    .split("\n")
    .map((line) => line.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);

  const heroAnnouncement = groups.announcement[0];
  const stats = [
    { value: String(groups.project.length), label: "Böyük layihə" },
    { value: String(groups.plan.length), label: "Aylıq fəaliyyət planı" },
    { value: String(groups.news.length), label: "Yayımlanmış xəbər" },
    { value: String(groups.membership.length), label: "Üzvlük addımı" },
  ];

  return (
    <div className="min-h-screen bg-white text-ink">
      <Navbar />

      {/* ───────────────────────── HERO ───────────────────────── */}
      <section className="hero-mesh relative overflow-hidden">
        <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-brand-300/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 top-0 h-80 w-80 rounded-full bg-[#9C8AF8]/25 blur-3xl" />

        <div className="relative mx-auto w-full max-w-[1320px] px-4 pb-10 pt-8 sm:px-6 sm:pt-12 lg:px-8 lg:pb-14 lg:pt-16">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:gap-14">
            <div className="max-w-[580px]">
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700 shadow-[0_6px_20px_-14px_rgba(32,26,63,0.5)] backdrop-blur">
                  <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-brand-600" />
                  {HERO.badge}
                </span>
              </Reveal>

              <Reveal delay={80}>
                <h1 className="mt-6 text-[38px] font-extrabold leading-[1.04] tracking-[-0.04em] text-ink sm:text-[50px] lg:text-[62px]">
                  {HERO.title[0]}
                  <br />
                  <span className="text-gradient">{HERO.title[1]}</span>
                </h1>
              </Reveal>

              <Reveal delay={140}>
                <p className="mt-6 max-w-[470px] text-[13.5px] leading-[1.8] text-[#4E4768] sm:text-[15px]">
                  {HERO.text}
                </p>
              </Reveal>

              <Reveal delay={200}>
                <div className="mt-8 flex flex-wrap items-center gap-2.5 sm:gap-3">
                  <SectionLink
                    href={HERO.primary.href}
                    className="group inline-flex h-12 items-center gap-2 rounded-full bg-brand-600 px-6 text-[12.5px] font-bold text-white shadow-[0_18px_34px_-20px_rgba(101,82,245,0.9)] transition-all hover:bg-brand-700 hover:shadow-[0_22px_40px_-20px_rgba(101,82,245,0.95)]"
                  >
                    {HERO.primary.label}
                    <ArrowUpRight size={16} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </SectionLink>
                  <SectionLink
                    href={HERO.secondary.href}
                    className="group inline-flex h-12 items-center gap-2 rounded-full border border-white/80 bg-white/85 px-6 text-[12.5px] font-bold text-ink backdrop-blur transition-colors hover:border-brand-200 hover:text-brand-700"
                  >
                    {HERO.secondary.label}
                    <ArrowRight size={16} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5" />
                  </SectionLink>
                </div>
              </Reveal>

              <Reveal delay={260}>
                <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[#7A7391]">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={13} className="text-brand-600" />
                    {HERO.period}
                  </span>
                  <span className="hidden h-3 w-px bg-[#D9D4EC] sm:block" />
                  <span>{HERO.motto}</span>
                </div>
              </Reveal>
            </div>

            <Reveal delay={120} className="relative">
              <div className="relative overflow-hidden rounded-[26px] bg-[#E9E6F5] shadow-[0_40px_80px_-46px_rgba(32,26,63,0.6)] ring-1 ring-white/60 lg:rounded-[32px]">
                <div className="relative aspect-[608/571] w-full">
                  <Image
                    src="/assets/pages/hero-card.jpg"
                    alt="Elm və innovasiya proqramının simvolu"
                    fill
                    sizes="(max-width: 1024px) 100vw, 560px"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1B1533]/55 via-transparent to-transparent" />
                </div>

                <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-ink backdrop-blur sm:left-4 sm:top-4 sm:px-4 sm:py-2">
                  <span>{HERO.cardBadge[0]}</span>
                  <span className="text-brand-600/40">/</span>
                  <span className="text-brand-600">{HERO.cardBadge[1]}</span>
                </div>

                {heroAnnouncement && (
                  <div className="absolute inset-x-3 bottom-3 rounded-2xl border border-white/40 bg-white/85 p-3.5 backdrop-blur-md sm:inset-x-4 sm:bottom-4 sm:p-4">
                    <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-brand-700">
                      <Megaphone size={11} /> Son elan
                    </p>
                    <p className="mt-1.5 line-clamp-2 text-[12.5px] font-bold leading-snug tracking-[-0.01em] text-ink sm:text-[14px]">
                      {heroAnnouncement.title}
                    </p>
                    {heroAnnouncement.date && (
                      <p className="mt-1 text-[10px] font-medium text-[#6E6788]">{formatDate(heroAnnouncement.date)}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="absolute -bottom-5 -left-3 hidden animate-float-soft rounded-2xl border border-[#EAE7F7] bg-white px-4 py-3 shadow-[0_22px_44px_-26px_rgba(32,26,63,0.45)] sm:block">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#8A83A0]">Aktiv proqram</p>
                <p className="mt-0.5 text-[13px] font-extrabold text-ink">{groups.project.length} layihə · {groups.plan.length} ay</p>
              </div>
            </Reveal>
          </div>

          <div className="mt-10 lg:mt-14">
            <div className="hairline h-px w-full" />
            <div className="mt-4 flex flex-col gap-2 text-[9.5px] font-bold uppercase tracking-[0.14em] text-[#4E4768] sm:flex-row sm:items-center sm:justify-between lg:text-[10px]">
              <span className="inline-flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-emerald-500" : "bg-brand-600"}`} />
                {connected ? "Məzmun canlı yenilənir" : "Statik məzmun · oflayn fallback"}
              </span>
              <span className="hidden sm:block">{HERO.motto}</span>
              <SectionLink href="#haqqimizda" className="inline-flex items-center gap-1.5 transition-colors hover:text-brand-600">
                {HERO.scroll}
                <ArrowDown size={13} strokeWidth={2.5} />
              </SectionLink>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── STATS ───────────────────────── */}
      <section className="border-b border-[#F1EFF8] bg-white">
        <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-x-5 gap-y-8 py-9 sm:grid-cols-4 lg:grid-cols-5 lg:gap-x-0 lg:py-11">
            <Reveal className="col-span-2 sm:col-span-4 lg:col-span-1">
              <p className="text-[9.5px] font-bold uppercase leading-[1.9] tracking-[0.14em] text-[#4E4768] lg:text-[10px]">
                Bir proqram.
                <br />
                Yeni imkanlar.
              </p>
            </Reveal>
            {stats.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 70} className="lg:border-l lg:border-[#EDEAF7] lg:pl-7">
                <div className="text-[30px] font-extrabold leading-none tracking-[-0.035em] text-ink lg:text-[38px]">
                  {stat.value}
                </div>
                <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.12em] text-[#7A7391] lg:text-[10px]">
                  {stat.label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── ABOUT ───────────────────────── */}
      <section id="haqqimizda" className="scroll-mt-24 bg-white py-16 lg:py-24">
        <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] lg:gap-16">
            <Reveal className="relative">
              <div className="relative aspect-[2348/1620] w-full overflow-hidden rounded-[24px] bg-[#E9EDF2] shadow-[0_34px_70px_-44px_rgba(32,26,63,0.55)] lg:rounded-[28px]">
                <MediaImage src={about.image || "/assets/pages/about-lab.jpg"} alt="Laboratoriyada elmi tədqiqat" />
              </div>
            </Reveal>

            <Reveal delay={80}>
              <SectionHeading label={about.subtitle || "01 / Proqram haqqında"} title={about.title} text={about.text} />

              <ul className="mt-7 space-y-3">
                {(aboutPoints.length ? aboutPoints : ["Elmi əməkdaşlıq", "Mentorluq", "İnstitusional dəstək"])
                  .slice(0, 6)
                  .map((point, index) => (
                    <li key={point} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-[#E4E0F2] bg-[#FBFAFF] text-[9px] font-bold text-brand-600">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[12.5px] font-medium leading-relaxed text-ink lg:text-[13.5px]">{point}</span>
                    </li>
                  ))}
              </ul>
              <Link
                href="/haqqimizda"
                className="mt-6 inline-flex items-center gap-1.5 text-[12px] font-bold text-brand-600 transition-colors hover:text-brand-700"
              >
                Ətraflı oxu <ArrowUpRight size={14} />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────────────────── ANNOUNCEMENTS ───────────────────────── */}
      <section id="elanlar" className="scroll-mt-24 bg-[#FAF9FF] py-16 lg:py-24">
        <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              label="02 / Elanlar"
              title="Aktiv elanlar və imkanlar."
              text="Müraciət, qeydiyyat və tədbir elanları — panelden idarə olunur."
            />
            <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-[#E4E0F2] bg-white px-3.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-brand-700 sm:self-auto">
              <Megaphone size={12} /> {groups.announcement.length} elan
            </span>
          </Reveal>

          <ContentCarousel variant="announcement" items={groups.announcement} className="mt-9" />
        </div>
      </section>

      {/* ───────────────────────── NEWS ───────────────────────── */}
      <section id="xeberler" className="scroll-mt-24 bg-white py-16 lg:py-24">
        <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              label="03 / Xəbərlər"
              title="Komandanın son xəbərləri."
              text="Görüşlər, tərəfdaşlıqlar və yeni formatlar haqqında qısa xülasələr."
            />
          </Reveal>

          <ContentCarousel variant="news" items={groups.news} className="mt-9" />
        </div>
      </section>

      {/* ───────────────────────── PROJECTS ───────────────────────── */}
      <section id="layiheler" className="scroll-mt-24 bg-[#FAF9FF] py-16 lg:py-24">
        <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              label="04 / Böyük layihələr"
              title="İdeyalar böyüyür. Üfüqlər genişlənir."
              text="Elmi əlaqələrdən startap ekosisteminə — uzunmüddətli təsir üçün birlikdə."
            />
          </Reveal>

          <ContentCarousel variant="project" items={groups.project} className="mt-9" />
        </div>
      </section>

      {/* ───────────────────────── OUTCOMES ───────────────────────── */}
      <section className="dark-mesh relative overflow-hidden text-white">
        <div className="mx-auto w-full max-w-[1320px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <Reveal>
            <SectionHeading
              label={OUTCOMES.label}
              title={OUTCOMES.title}
              text={OUTCOMES.text}
              tone="dark"
            />
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-8 lg:mt-12 lg:grid-cols-4 lg:gap-x-0">
            {OUTCOMES.items.map((item, index) => (
              <Reveal key={item.label} delay={index * 70} className="lg:border-l lg:border-white/15 lg:pl-7">
                <div className="text-[30px] font-extrabold leading-none tracking-[-0.035em] sm:text-[40px] lg:text-[52px]">
                  {item.value}
                </div>
                <p className="mt-2 max-w-[190px] text-[9px] uppercase leading-[1.6] tracking-[0.1em] text-[#C6BCE6] lg:text-[10px]">
                  {item.label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── ACTIVITIES ───────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading label={ACTIVITIES.label} title={ACTIVITIES.title} text={ACTIVITIES.text} />
          </Reveal>

          <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {ACTIVITIES.items.map((item, index) => (
              <Reveal key={item.title} delay={index * 60} as="article" className="h-full">
                <div className="group flex h-full flex-col rounded-[20px] border border-[#EFEDF8] bg-[#FAF9FF] p-5 transition-all hover:-translate-y-1 hover:border-brand-200 hover:bg-white hover:shadow-[0_26px_48px_-36px_rgba(32,26,63,0.5)] lg:p-6">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[10px] font-bold text-brand-600 shadow-sm">
                      {item.no}
                    </span>
                    <span className="text-[8.5px] font-bold uppercase tracking-[0.14em] text-[#7A7391]">{item.group}</span>
                  </div>
                  <h3 className="mt-4 text-[18px] font-extrabold leading-[1.15] tracking-[-0.02em] text-ink lg:text-[20px]">{item.title}</h3>
                  <p className="mt-2.5 text-[12px] leading-[1.7] text-[#5E5776]">{item.text}</p>
                  <p className="mt-auto border-t border-[#E9E5F6] pt-3.5 text-[10.5px] text-[#6E6788]">{item.audience}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={100}>
            <div className="mt-5 rounded-[20px] border border-[#EFEDF8] bg-[#FAF9FF] p-5 lg:p-8">
              <p className="text-[8.5px] font-bold uppercase tracking-[0.16em] text-brand-600 lg:text-[9px]">{ROTATION.label}</p>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-0">
                {ROTATION.groups.map((group) => (
                  <div key={group.name} className="sm:border-l sm:border-[#DFDAEE] sm:pl-6 sm:first:border-l-0 sm:first:pl-0">
                    <p className="text-[13px] font-bold text-ink lg:text-[14px]">
                      {group.name}
                      <span className="ml-2 text-[#9A93AE]">•</span>
                      <span className="ml-2 font-medium text-[#4E4768]">{group.schedule}</span>
                    </p>
                    <p className="mt-1.5 text-[11px] text-[#7A7391] lg:text-[12px]">{group.months}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────────────────── MEMBERSHIP ───────────────────────── */}
      <section id="uzvluk" className="scroll-mt-24 bg-[#FAF9FF] py-16 lg:py-24">
        <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-14">
            <Reveal>
              <SectionHeading
                label="Üzvlük proqramı"
                title="Komandaya qoşulmağın 3 sadə addımı."
                text="Elmi maraq və komanda ilə iş bacarığı əsas meyardır. Müraciətdən sonra sizi uyğun qrupa yönləndiririk."
              />
              <div className="mt-7 flex flex-wrap gap-2.5">
                <Link
                  href="/muraciet"
                  className="group inline-flex h-11 items-center gap-2 rounded-full bg-brand-600 px-5 text-[12px] font-bold text-white transition-colors hover:bg-brand-700"
                >
                  Müraciət et
                  <ArrowUpRight size={15} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <SectionLink
                  href="#fealiyyet"
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-[#E4E0F2] bg-white px-5 text-[12px] font-bold text-ink transition-colors hover:border-brand-200 hover:text-brand-700"
                >
                  Fəaliyyət planı <ArrowRight size={14} />
                </SectionLink>
              </div>
            </Reveal>

            <div className="space-y-3">
              {groups.membership.slice(0, 5).map((step, index) => (
                <Reveal key={step.id} delay={index * 70}>
                  <div className="group flex items-start gap-4 rounded-2xl border border-[#EAE7F7] bg-white p-4 transition-all hover:border-brand-200 hover:shadow-[0_22px_44px_-34px_rgba(32,26,63,0.5)] sm:p-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#EFEBFF] to-[#E1DBFF] text-[13px] font-extrabold text-brand-700">
                      {step.subtitle || String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[14px] font-bold text-ink">{step.title}</h3>
                        {step.meta && (
                          <span className="rounded-full bg-[#F4F2FC] px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.1em] text-brand-700">
                            {step.meta}
                          </span>
                        )}
                      </div>
                      {step.text && <p className="mt-1.5 text-[11.5px] leading-[1.7] text-[#5A5270]">{step.text}</p>}
                    </div>
                    <Check size={15} className="ml-auto mt-1 shrink-0 text-emerald-500 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── ROADMAP ───────────────────────── */}
      <section id="fealiyyet" className="scroll-mt-24 bg-white py-16 lg:py-24">
        <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              label="05 / Fəaliyyət planı"
              title="9 ay. Ortaq məqsəd. Aydın yol xəritəsi."
              text="İyul 2026 – Mart 2027 üçün planlaşdırılmış mərhələlər və növbəti fəaliyyətlər."
            />
          </Reveal>

          <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {groups.plan.slice(0, 12).map((month, index) => (
              <Reveal key={month.id} delay={(index % 3) * 60} as="article" className="h-full">
                <div className="group flex h-full flex-col rounded-[20px] border border-[#EFEDF8] bg-[#FAF9FF] p-5 transition-all hover:-translate-y-1 hover:border-brand-200 hover:bg-white hover:shadow-[0_26px_48px_-36px_rgba(32,26,63,0.5)] lg:p-6">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-brand-600">
                      {month.subtitle || `Ay ${index + 1}`}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-300 group-hover:bg-brand-600" />
                  </div>
                  <h3 className="mt-3 text-[16.5px] font-bold leading-[1.25] tracking-[-0.01em] text-ink lg:text-[18px]">
                    {month.title}
                  </h3>
                  {month.text && <p className="mt-2 text-[11.5px] leading-[1.7] text-[#5E5776] lg:text-[12.5px]">{month.text}</p>}
                  {month.meta && (
                    <div className="mt-auto pt-4">
                      <span className="inline-block rounded-full bg-[#F0EDFB] px-3 py-1.5 text-[9.5px] leading-snug text-[#575070] lg:text-[10.5px]">
                        {month.meta}
                      </span>
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── CTA ───────────────────────── */}
      <section className="bg-white pb-14 lg:pb-20">
        <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#F1EEFE] via-[#EBE6FE] to-[#E4DDFD] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
              <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/50 blur-3xl" />
              <div className="relative flex flex-col items-start gap-7 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-[720px]">
                  <Label>{CTA.label}</Label>
                  <h2 className="mt-3 text-[24px] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[32px] lg:text-[40px]">
                    {CTA.title}
                  </h2>
                  <p className="mt-3 text-[12.5px] leading-relaxed text-[#5E5776] lg:text-[13.5px]">{CTA.text}</p>
                </div>
                <SectionLink
                  href="#layiheler"
                  className="group inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-ink px-6 text-[12.5px] font-bold text-white transition-colors hover:bg-[#2E2552]"
                >
                  {CTA.button}
                  <ArrowUpRight size={16} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </SectionLink>
              </div>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-[#8A83A0]">
              <Quote size={13} className="text-brand-400" />
              Araşdırırıq. Yaradırıq. Dəyişirik.
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
