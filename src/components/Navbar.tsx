"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  BadgeCheck,
  ChevronDown,
  Instagram,
  Linkedin,
  Mail,
  Menu,
  Phone,
  X,
} from "lucide-react";
import SectionLink from "@/components/SectionLink";
import AnchorLink from "@/components/AnchorLink";
import { CONTACT, NAV, type NavItem } from "@/data/brief";

function isActive(link: NavItem, pathname: string) {
  const paths = [link.href, ...(link.match || [])];
  return paths.some((path) => (path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`)));
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  // Masaüstü açılan menyu: YALNIZ BİR menyu açıq ola bilər (hover və ya klik).
  const [menu, setMenu] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setExpanded(null);
    setMenu(null);

    // Başqa səhifədən `#bölmə` keçidi ilə gələndə hədəf bölməyə scroll et.
    if (!window.location.hash) return;
    const id = window.location.hash.slice(1);
    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 140);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {/* ── Üst əlaqə zolağı (yalnız masaüstü, sticky deyil) ── */}
      <div className="hidden bg-[#211B3E] text-white/70 lg:block">
        <div className="mx-auto flex h-9 w-full max-w-[1320px] items-center justify-between gap-4 px-8 text-[11px]">
          <div className="flex items-center gap-5">
            <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-1.5 transition-colors hover:text-white">
              <Mail size={12} /> {CONTACT.email}
            </a>
            <span className="h-3 w-px bg-white/15" />
            <a href={CONTACT.phoneHref} className="inline-flex items-center gap-1.5 transition-colors hover:text-white">
              <Phone size={12} /> {CONTACT.phone}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sertifikat" className="inline-flex items-center gap-1.5 transition-colors hover:text-white">
              <BadgeCheck size={12} /> Sertifikatı yoxla
            </Link>
            <span className="h-3 w-px bg-white/15" />
            <a
              href={CONTACT.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="AEİK Instagram"
              className="transition-colors hover:text-white"
            >
              <Instagram size={13} />
            </a>
            <a
              href={CONTACT.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="AEİK LinkedIn"
              className="transition-colors hover:text-white"
            >
              <Linkedin size={13} />
            </a>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "px-2 pt-2 sm:px-4 sm:pt-3" : "bg-transparent"
        }`}
      >
        <div
          className={`mx-auto w-full transition-all duration-300 ${
            scrolled
              ? "max-w-[1290px] rounded-2xl border border-[#E7E3F6] bg-white/95 shadow-[0_18px_44px_-30px_rgba(32,26,63,0.55)] backdrop-blur-xl sm:rounded-[22px]"
              : "max-w-[1320px]"
          }`}
        >
          <div className="flex h-[64px] w-full items-center justify-between gap-3 px-4 sm:px-6 lg:h-[76px] lg:px-8">
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

            <nav className="hidden items-center gap-1 lg:flex xl:gap-2">
              {NAV.map((link) => {
                const active = isActive(link, pathname);
                return (
                  <div
                    key={link.label}
                    className="group relative"
                    onMouseEnter={() => link.children && setMenu(link.label)}
                    onMouseLeave={() => setMenu((current) => (current === link.label ? null : current))}
                    onFocus={() => link.children && setMenu(link.label)}
                    onBlur={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                        setMenu((current) => (current === link.label ? null : current));
                      }
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenu(null)}
                      aria-expanded={link.children ? menu === link.label : undefined}
                      aria-current={active ? "page" : undefined}
                      className={`relative inline-flex items-center gap-1 rounded-full px-2.5 py-2 text-[12px] transition-all duration-300 xl:px-3 ${
                        active ? "font-semibold text-brand-600" : "font-medium text-[#413A5F] hover:text-brand-600"
                      }`}
                    >
                      <span className="relative z-10 whitespace-nowrap">{link.label}</span>
                      {link.children && (
                        <ChevronDown
                          size={12}
                          strokeWidth={2.5}
                          className={`relative z-10 opacity-60 transition-transform duration-300 ${
                            menu === link.label ? "rotate-180" : ""
                          }`}
                        />
                      )}
                      <span
                        aria-hidden
                        className={`pointer-events-none absolute inset-x-0 top-1/2 h-7 -translate-y-1/2 rounded-full bg-brand-500/15 blur-lg transition-opacity duration-500 ${
                          active ? "opacity-100" : "opacity-0 group-hover:opacity-70"
                        }`}
                      />
                    </Link>

                    {link.children && (
                      <div
                        className={`absolute left-1/2 top-full z-50 w-[288px] -translate-x-1/2 pt-2 transition-all duration-200 ${
                          menu === link.label ? "visible opacity-100" : "invisible opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden rounded-2xl border border-[#E7E3F6] bg-white p-1.5 shadow-[0_26px_60px_-30px_rgba(32,26,63,0.45)]">
                          {link.children.map((child) =>
                            child.href.startsWith("/#") ? (
                              <SectionLink
                                key={child.label}
                                href={child.href}
                                className="block rounded-xl px-3 py-2 text-[12px] font-semibold text-[#413A5F] transition-colors hover:bg-[#F5F3FE] hover:text-brand-700"
                              >
                                {child.label}
                              </SectionLink>
                            ) : (
                              <AnchorLink
                                key={child.label}
                                href={child.href}
                                onClick={() => setMenu(null)}
                                className="block rounded-xl px-3 py-2 transition-colors hover:bg-[#F5F3FE]"
                              >
                                <span className="block text-[12px] font-semibold text-[#413A5F]">{child.label}</span>
                                {child.desc && <span className="mt-0.5 block text-[10.5px] text-[#8A83A0]">{child.desc}</span>}
                              </AnchorLink>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <Link
                href="/sertifikat"
                className="hidden h-9 items-center gap-1.5 rounded-full border border-[#E4E0F2] px-3 text-[11px] font-semibold text-[#413A5F] transition-colors hover:border-brand-200 hover:text-brand-700 xl:inline-flex"
              >
                <BadgeCheck size={14} /> Sertifikat
              </Link>
              <Link
                href="/login"
                className="group hidden h-9 items-center gap-1.5 rounded-full bg-brand-600 px-4 text-[11px] font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-brand-700 lg:inline-flex"
              >
                Daxil ol
                <ArrowUpRight size={13} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
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
          </div>

          {open && (
            <div className="max-h-[calc(100vh-90px)] overflow-y-auto border-t border-[#F0EEF8] bg-white px-4 pb-6 pt-2 lg:hidden lg:rounded-b-[22px]">
              <nav className="flex flex-col">
                {NAV.map((link) => {
                  const active = isActive(link, pathname);
                  const isOpen = expanded === link.label;
                  return (
                    <div key={link.label} className="border-b border-[#F4F2FB] last:border-0">
                      <div className="flex items-center">
                        <Link
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className={`flex-1 py-3 text-[14px] transition-colors ${
                            active ? "font-semibold text-brand-600" : "font-medium text-ink"
                          }`}
                        >
                          {link.label}
                        </Link>
                        {link.children && (
                          <button
                            type="button"
                            onClick={() => setExpanded(isOpen ? null : link.label)}
                            aria-label={`${link.label} alt bölmələri`}
                            aria-expanded={isOpen}
                            className="rounded-lg p-2 text-[#8A83A0] hover:bg-[#F5F3FE]"
                          >
                            <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                          </button>
                        )}
                      </div>
                      {link.children && isOpen && (
                        <div className="pb-2 pl-2">
                          {link.children.map((child) =>
                            child.href.startsWith("/#") ? (
                              <SectionLink
                                key={child.label}
                                href={child.href}
                                onNavigate={() => setOpen(false)}
                                className="block py-2 text-[12.5px] text-[#5A5270]"
                              >
                                {child.label}
                              </SectionLink>
                            ) : (
                              <AnchorLink
                                key={child.label}
                                href={child.href}
                                onNavigate={() => setOpen(false)}
                                className="block py-2 text-[12.5px] text-[#5A5270]"
                              >
                                {child.label}
                              </AnchorLink>
                            )
                          )}
                        </div>
                      )}
                    </div>
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
                  href="/sertifikat"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#E4E0F2] text-[12px] font-semibold text-ink"
                >
                  <BadgeCheck size={14} /> Sertifikatı yoxla
                </Link>
              </div>

              <div className="mt-3 flex flex-col gap-2 rounded-2xl bg-[#FAF9FF] p-3.5 text-[12px] text-[#4E4768]">
                <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2">
                  <Mail size={13} className="text-brand-600" /> {CONTACT.email}
                </a>
                <a href={CONTACT.phoneHref} className="inline-flex items-center gap-2">
                  <Phone size={13} className="text-brand-600" /> {CONTACT.phone}
                </a>
                <div className="mt-1 flex items-center gap-3">
                  <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-brand-600">
                    <Instagram size={15} />
                  </a>
                  <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-brand-600">
                    <Linkedin size={15} />
                  </a>
                  <Link href="/login" onClick={() => setOpen(false)} className="ml-auto text-[11px] font-bold uppercase tracking-[0.1em] text-brand-700">
                    Daxil ol
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
