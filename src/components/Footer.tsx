import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUp, ArrowUpRight, LayoutDashboard } from "lucide-react";
import { FOOTER } from "@/data/program";

const PANEL_LINKS = [
  { label: "Müraciət formu", href: "/muraciet" },
  { label: "Menecer paneli", href: "/menecer" },
  { label: "Şəxsi kabinet", href: "/kabinet" },
];

export default function Footer() {
  return (
    <footer id="elaqe" className="relative overflow-hidden bg-[#211B3E] text-white">
      <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 h-80 w-80 rounded-full bg-[#7C67F7]/15 blur-3xl" />

      <div className="relative mx-auto w-full max-w-[1320px] px-5 pb-7 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
        {/* Üst CTA zolağı */}
        <div className="mb-10 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-5 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:rounded-[22px] sm:px-7 sm:py-6">
          <div>
            <p className="text-[9.5px] font-bold uppercase tracking-[0.18em] text-[#B9ABEE]">Üzvlük proqramı</p>
            <p className="mt-1.5 text-[15px] font-extrabold leading-snug tracking-[-0.01em] text-white sm:text-[17px]">
              Komandaya qoşul — ideyanı birlikdə böyüdək.
            </p>
          </div>
          <Link
            href="/muraciet"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 text-[12px] font-bold text-[#211B3E] transition-colors hover:bg-[#EFEBFF]"
          >
            Müraciət et
            <ArrowRight size={15} strokeWidth={2.5} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-10">
          <div>
            <Link href="/" aria-label="AEİK" className="relative block h-10 w-[190px]">
              <Image
                src="/assets/logo-white-trim.png"
                alt="Azərbaycan Elm və İnnovasiya Könüllüləri"
                fill
                sizes="190px"
                className="object-contain object-left"
              />
            </Link>
            <p className="mt-5 max-w-[300px] text-[12.5px] leading-relaxed text-white/65">{FOOTER.tagline}</p>
            <Link
              href="/muraciet"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-2 text-[11px] font-semibold text-white/80 transition-colors hover:border-white/35 hover:text-white"
            >
              Müraciət və suallar <ArrowUpRight size={12} />
            </Link>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
              {FOOTER.discoverTitle}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {FOOTER.discover.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[12.5px] text-white/80 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
              {FOOTER.periodTitle}
            </h4>
            <p className="mt-4 text-[12.5px] font-semibold text-white/90">{FOOTER.period}</p>
            <Link
              href="/#fealiyyet"
              className="mt-2 inline-flex items-center gap-1.5 text-[12px] text-white/70 transition-colors hover:text-white"
            >
              {FOOTER.periodLink}
              <ArrowUpRight size={12} />
            </Link>
            <p className="mt-3 text-[12px] text-white/55">{FOOTER.periodText}</p>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">Panel</h4>
            <ul className="mt-4 space-y-2.5">
              {PANEL_LINKS.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="inline-flex items-center gap-1.5 text-[12.5px] text-white/80 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/menecer"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-[10.5px] font-semibold text-white/75 transition-colors hover:border-white/35 hover:text-white"
            >
              <LayoutDashboard size={12} /> İdarəetmə
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-5 text-[11px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>{FOOTER.copyright}</p>
          <div className="flex items-center gap-3">
            <p>{FOOTER.note}</p>
            <span className="hidden h-3 w-px bg-white/15 sm:block" />
            <a href="#" className="inline-flex items-center gap-1 text-white/60 transition-colors hover:text-white">
              Yuxarı <ArrowUp size={12} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
