"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Menu, X, LayoutDashboard } from "lucide-react";

const NAV_LINKS = [
  { label: "Ana səhifə", href: "/" },
  { label: "Haqqımızda", href: "/#haqqimizda" },
  { label: "Elanlar", href: "/#elanlar" },
  { label: "Xəbərlər", href: "/#xeberler" },
  { label: "Layihələr", href: "/#layiheler" },
  { label: "Fəaliyyət planı", href: "/#fealiyyet" },
  { label: "Üzvlük", href: "/#uzvluk" },
  { label: "Əlaqə", href: "/#elaqe" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
              const active = link.label === "Ana səhifə";
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative py-1.5 text-[12.5px] transition-colors ${link.label === "Üzvlük" ? "hidden xl:block" : ""} ${
                    active
                      ? "font-semibold text-brand-600 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:rounded-full after:bg-brand-600 after:content-['']"
                      : "font-medium text-[#413A5F] hover:text-brand-600"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href="/menecer"
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#E4E0F2] bg-white px-3.5 text-[11px] font-semibold text-[#413A5F] transition-colors hover:border-brand-200 hover:text-brand-600"
            >
              <LayoutDashboard size={13} />
              Menecer
            </Link>
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
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-[#F4F2FB] py-3 text-[14px] font-medium text-ink last:border-0"
                >
                  {link.label}
                </Link>
              ))}
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
                href="/menecer"
                onClick={() => setOpen(false)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#E4E0F2] text-[12px] font-semibold text-ink"
              >
                <LayoutDashboard size={15} />
                Menecer paneli
              </Link>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-600 text-[12px] font-bold uppercase tracking-[0.1em] text-white sm:col-span-2"
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
