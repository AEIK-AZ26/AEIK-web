"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import SectionLink, { consumePendingSection, scrollToSection, sectionFromHref } from "@/components/SectionLink";

const NAV_LINKS = [
  { label: "Ana səhifə", href: "/" },
  { label: "Haqqımızda", href: "#haqqimizda" },
  { label: "Elanlar", href: "#elanlar" },
  { label: "Xəbərlər", href: "#xeberler" },
  { label: "Layihələr", href: "#layiheler" },
  { label: "Üzvlük", href: "#uzvluk" },
  { label: "Fəaliyyət planı", href: "#fealiyyet" },
  { label: "Əlaqə", href: "#elaqe" },
];

const SECTION_IDS = NAV_LINKS.map((link) => sectionFromHref(link.href)).filter(
  (id): id is string => Boolean(id)
);

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>(pathname === "/" ? "top" : "");
  const scrollLockUntil = useRef(0);
  const computeActiveRef = useRef<() => void>(() => {});

  // Kliklənən bölmə dərhal aktiv olur və yumşaq scroll bitənə qədər kilidlənir.
  const lockSection = (id: string | null) => {
    if (!id) return;
    scrollLockUntil.current = Date.now() + 1100;
    setActiveSection(id);
    // Scroll bitəndən sonra vəziyyəti mövqeyə görə yenidən təsdiqləyirik.
    window.setTimeout(() => {
      scrollLockUntil.current = 0;
      computeActiveRef.current();
    }, 1200);
    window.setTimeout(() => computeActiveRef.current(), 1900);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Aktiv bölmə scroll mövqeyinə görə dinamik hesablanır.
  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("");
      return;
    }

    const compute = () => {
      if (window.scrollY < 120) {
        setActiveSection("top");
        return;
      }
      // Sənəddə ən aşağıda olan (amma artıq yuxarıya çatmış) bölmə aktiv sayılır.
      if (Date.now() < scrollLockUntil.current) return;

      let current = "top";
      let bestTop = -Infinity;
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= 140 && top > bestTop) {
          bestTop = top;
          current = id;
        }
      }
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
      if (atBottom) current = SECTION_IDS[SECTION_IDS.length - 1];
      setActiveSection(current);
    };

    computeActiveRef.current = compute;
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [pathname]);

  // Başqa səhifədən bölməyə keçid: məzmun yüklənənə qədər kiçik cəhdlərlə scroll.
  useEffect(() => {
    if (pathname !== "/") return;
    const target = consumePendingSection();
    if (!target) return;
    let attempts = 0;
    let frame = 0;
    const tryScroll = () => {
      if (scrollToSection(target) || attempts++ > 60) return;
      frame = requestAnimationFrame(tryScroll);
    };
    tryScroll();
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "px-2 pt-2 sm:px-4 sm:pt-3"
          : "border-b border-transparent bg-white/70 backdrop-blur-md"
      }`}
    >
      <div
        className={`mx-auto w-full transition-all duration-300 ${
          scrolled
            ? "max-w-[1290px] rounded-2xl border border-[#E7E3F6] bg-white/95 shadow-[0_18px_44px_-30px_rgba(32,26,63,0.55)] backdrop-blur-xl sm:rounded-[22px]"
            : "max-w-[1320px]"
        }`}
      >
        <div className="flex h-[64px] w-full items-center justify-between gap-4 px-4 sm:px-6 lg:h-[76px] lg:px-8">
          <Link href="/" aria-label="AEİK ana səhifə" className="relative block h-7 w-[116px] shrink-0 sm:h-8 sm:w-[132px] lg:h-9 lg:w-[150px]">
            <Image
              src="/assets/logo-primary-trim.png"
              alt="Azərbaycan Elm və İnnovasiya Könüllüləri"
              fill
              sizes="150px"
              className="object-contain object-left"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-5 lg:flex xl:gap-6">
            {NAV_LINKS.map((link) => {
              const section = sectionFromHref(link.href);
              const isActive = section ? activeSection === section : activeSection === "top";
              return (
                <SectionLink
                  key={link.label}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => lockSection(section ?? (link.href === "/" ? "top" : null))}
                  className={`group relative py-1.5 text-[12.5px] transition-all duration-300 ${
                    link.label === "Üzvlük" ? "hidden xl:inline-block" : ""
                  } ${isActive ? "font-semibold text-brand-600" : "font-medium text-[#413A5F] hover:text-brand-600"}`}
                >
                  <span className="relative z-10">{link.label}</span>
                  {/* Aktiv bölmə üçün düymə deyil — yumşaq işıq/kölgə effekti */}
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute -bottom-1 left-1/2 h-[5px] w-[calc(100%+6px)] -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-400/0 via-brand-500/70 to-brand-400/0 blur-[5px] transition-opacity duration-500 ease-out ${
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                    }`}
                  />
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute inset-x-0 top-1/2 h-7 -translate-y-1/2 rounded-full bg-brand-500/20 blur-lg transition-opacity duration-500 ease-out ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </SectionLink>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href="/login"
              className="group inline-flex h-9 items-center gap-1.5 rounded-full bg-brand-600 px-4 text-[11px] font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-brand-700"
            >
              Daxil ol
              <ArrowUpRight size={13} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menyu"
            aria-expanded={open}
            className="rounded-xl p-2 text-ink transition-colors hover:bg-brand-50 lg:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <div className="max-h-[calc(100vh-90px)] overflow-y-auto border-t border-[#F0EEF8] bg-white px-4 pb-6 pt-2 lg:hidden lg:rounded-b-[22px]">
            <nav className="flex flex-col">
              {NAV_LINKS.map((link) => {
                const section = sectionFromHref(link.href);
                const isActive = section ? activeSection === section : activeSection === "top";
                return (
                  <SectionLink
                    key={link.label}
                    href={link.href}
                    onClick={() => lockSection(section ?? (link.href === "/" ? "top" : null))}
                    onNavigate={() => setOpen(false)}
                    className={`flex items-center justify-between border-b border-[#F4F2FB] py-3 text-[14px] transition-colors last:border-0 ${
                      isActive ? "font-semibold text-brand-600" : "font-medium text-ink"
                    }`}
                  >
                    {link.label}
                    <span
                      aria-hidden
                      className={`h-1.5 w-1.5 rounded-full bg-brand-600 transition-all duration-300 ${
                        isActive ? "scale-100 opacity-100" : "scale-0 opacity-0"
                      }`}
                    />
                  </SectionLink>
                );
              })}
            </nav>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Link
                href="/muraciet"
                onClick={() => setOpen(false)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#E4E0F2] text-[12px] font-semibold text-ink"
              >
                Müraciət formu
              </Link>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-600 text-[12px] font-bold uppercase tracking-[0.1em] text-white"
              >
                Daxil ol
                <ArrowUpRight size={14} strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
