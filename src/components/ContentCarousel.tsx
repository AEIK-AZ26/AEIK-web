"use client";

import React, { useId, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import { A11y, Keyboard, Navigation, Pagination } from "swiper/modules";
import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Newspaper, Sparkles } from "lucide-react";
import { FALLBACK_IMAGE, SiteItem, SiteSection, formatDate } from "@/lib/siteContent";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const DETAIL_BASE: Partial<Record<SiteSection, string>> = {
  announcement: "/elanlar",
  news: "/xeberler",
  project: "/layiheler",
};

/** Məzmun kartının detal səhifəsi (xarici link varsa o saxlanılır). */
export function detailHref(item: SiteItem) {
  if (item.link && /^https?:\/\//i.test(item.link)) return item.link;
  const base = DETAIL_BASE[item.sec];
  return base ? `${base}/${encodeURIComponent(item.id)}` : "/";
}

function Thumb({ src, alt, className = "" }: { src?: string; alt: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src || FALLBACK_IMAGE}
      alt={alt}
      loading="lazy"
      className={`h-full w-full object-cover ${className}`}
      onError={(event) => {
        const node = event.currentTarget as HTMLImageElement;
        if (!node.src.endsWith(FALLBACK_IMAGE)) node.src = FALLBACK_IMAGE;
      }}
    />
  );
}

function AnnouncementCard({ item }: { item: SiteItem }) {
  const external = /^https?:\/\//i.test(item.link || "");
  return (
    <Link
      href={detailHref(item)}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-[#EAE7F7] bg-white transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_28px_50px_-34px_rgba(32,26,63,0.55)] sm:flex-row"
    >
      {item.image && (
        <div className="relative h-40 w-full shrink-0 overflow-hidden bg-[#EFECFA] sm:h-auto sm:w-[42%]">
          <Thumb src={item.image} alt={item.title} className="transition-transform duration-500 group-hover:scale-105" />
          <span className="absolute left-3 top-3 rounded-full bg-white/92 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-brand-700 backdrop-blur">
            {item.subtitle || "Elan"}
          </span>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col p-5">
        {!item.image && item.subtitle && (
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-brand-600">{item.subtitle}</p>
        )}
        <h3 className="mt-1 text-[16px] font-extrabold leading-[1.25] tracking-[-0.02em] text-ink sm:text-[17px]">
          {item.title}
        </h3>
        {item.text && <p className="mt-2.5 line-clamp-3 text-[12px] leading-[1.7] text-[#5A5270]">{item.text}</p>}
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold text-[#6E6788]">
            <CalendarDays size={12} className="text-brand-600" />
            {item.date ? formatDate(item.date) : item.meta || "Davam edir"}
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F1EEFE] text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
            <ArrowUpRight size={14} strokeWidth={2.5} />
          </span>
        </div>
      </div>
    </Link>
  );
}

function NewsCard({ item }: { item: SiteItem }) {
  const external = /^https?:\/\//i.test(item.link || "");
  return (
    <Link
      href={detailHref(item)}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-[#EFEDF8] bg-white transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_30px_54px_-36px_rgba(32,26,63,0.5)]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#EFECFA]">
        <Thumb src={item.image} alt={item.title} className="transition-transform duration-500 group-hover:scale-[1.04]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1B1533]/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        {item.subtitle && (
          <span className="absolute left-3 top-3 rounded-full bg-white/92 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-brand-700 backdrop-blur">
            {item.subtitle}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A83A0]">
          {item.date ? formatDate(item.date) : "Xəbər"}
        </p>
        <h3 className="mt-2 text-[16px] font-extrabold leading-[1.3] tracking-[-0.02em] text-ink">{item.title}</h3>
        {item.text && <p className="mt-2 line-clamp-3 text-[12px] leading-[1.7] text-[#5A5270]">{item.text}</p>}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[11px] font-bold text-brand-600">
          <Newspaper size={12} /> Oxu
          <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}

function ProjectCard({ item }: { item: SiteItem }) {
  const external = /^https?:\/\//i.test(item.link || "");
  return (
    <Link
      href={detailHref(item)}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex h-full flex-col rounded-[24px] border border-[#EAE7F7] bg-white p-2.5 transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_32px_60px_-38px_rgba(32,26,63,0.55)] lg:rounded-[28px] lg:p-3"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[16px] bg-[#101828] lg:rounded-[20px]">
        <Thumb src={item.image} alt={item.title} className="transition-transform duration-500 group-hover:scale-[1.03]" />
        <span className="absolute left-3 top-3 rounded-full bg-white/92 px-3 py-1 text-[9.5px] font-semibold text-brand-700 backdrop-blur">
          {item.subtitle || "Layihə"}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-3 pb-2 pt-5 lg:px-4 lg:pt-6">
        <h3 className="text-[19px] font-extrabold leading-[1.18] tracking-[-0.025em] text-ink lg:text-[23px]">
          {item.title}
        </h3>
        {item.text && <p className="mt-2.5 line-clamp-3 text-[12px] leading-[1.75] text-[#5A5270] lg:text-[12.5px]">{item.text}</p>}
        {item.meta && <p className="mt-4 line-clamp-2 text-[11px] font-semibold leading-relaxed text-[#3E3171]">{item.meta}</p>}

        <div className="mt-auto flex items-center justify-between border-t border-[#F3F1FA] pt-4">
          <span className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-brand-600 group-hover:text-brand-700">
            Ətraflı bax <ArrowUpRight size={13} />
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F1EEFE] text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
            <Sparkles size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export type CarouselVariant = "announcement" | "news" | "project";

const BREAKPOINTS: Record<CarouselVariant, Record<number, { slidesPerView: number; spaceBetween: number }>> = {
  announcement: {
    0: { slidesPerView: 1, spaceBetween: 14 },
    1024: { slidesPerView: 2, spaceBetween: 20 },
  },
  news: {
    0: { slidesPerView: 1, spaceBetween: 14 },
    640: { slidesPerView: 2, spaceBetween: 16 },
    1024: { slidesPerView: 3, spaceBetween: 20 },
  },
  project: {
    0: { slidesPerView: 1, spaceBetween: 14 },
    768: { slidesPerView: 2, spaceBetween: 18 },
    1280: { slidesPerView: 3, spaceBetween: 20 },
  },
};

interface ContentCarouselProps {
  items: SiteItem[];
  variant: CarouselVariant;
  className?: string;
}

export default function ContentCarousel({ items, variant, className = "" }: ContentCarouselProps) {
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9_-]/g, "");
  const prevId = `${uid}-prev`;
  const nextId = `${uid}-next`;
  const dotsId = `${uid}-dots`;

  // Bütün slaydlar bir ekrana sığanda Swiper naviqasiyanı "kilidləyir" və
  // düymələri gizlədir — boş idarəetmə sətri qalmasın deyə onu biz də gizlədirik.
  const [locked, setLocked] = useState<boolean | null>(null);

  if (!items.length) return null;

  const Card = variant === "announcement" ? AnnouncementCard : variant === "news" ? NewsCard : ProjectCard;
  // 4-dən çox olduqda sonsuz (infinite) dövrə.
  const loop = items.length > 4;

  const handleSwiper = (instance: SwiperClass) => {
    const sync = () => setLocked(instance.isLocked);
    sync();
    ["lock", "unlock", "resize", "breakpoint", "update"].forEach((event) =>
      instance.on(event as never, sync)
    );
  };

  return (
    <div className={`content-swiper ${className}`}>
      <Swiper
        key={items.length}
        onSwiper={handleSwiper}
        modules={[Navigation, Pagination, A11y, Keyboard]}
        breakpoints={BREAKPOINTS[variant]}
        slidesPerView={1}
        spaceBetween={14}
        loop={loop}
        loopAdditionalSlides={1}
        speed={520}
        grabCursor
        keyboard={{ enabled: true }}
        navigation={{ prevEl: `#${prevId}`, nextEl: `#${nextId}` }}
        pagination={{ el: `#${dotsId}`, clickable: true }}
        a11y={{
          prevSlideMessage: "Əvvəlki",
          nextSlideMessage: "Növbəti",
          paginationBulletMessage: "Slayd {{index}}",
        }}
      >
        {items.map((item) => (
          <SwiperSlide key={item.id} className="!h-auto pb-1">
            <Card item={item} />
          </SwiperSlide>
        ))}
      </Swiper>

      {locked === false && (
      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            id={prevId}
            type="button"
            aria-label="Əvvəlki"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E4E0F2] bg-white text-ink transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 disabled:opacity-40"
          >
            <ArrowLeft size={15} strokeWidth={2.4} />
          </button>
          <button
            id={nextId}
            type="button"
            aria-label="Növbəti"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E4E0F2] bg-white text-ink transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 disabled:opacity-40"
          >
            <ArrowRight size={15} strokeWidth={2.4} />
          </button>
        </div>
        <div id={dotsId} className="flex flex-1 items-center justify-end" />
      </div>
      )}
    </div>
  );
}
