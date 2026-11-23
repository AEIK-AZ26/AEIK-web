import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FOOTER } from "@/data/program";

export default function Footer() {
  return (
    <footer id="elaqe" className="bg-[#29213F] text-white">
      <div className="mx-auto w-full max-w-[1376px] px-5 pb-8 pt-14 sm:px-8 lg:pt-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr] lg:gap-16">
          <div>
            <Link href="/" aria-label="AEİK" className="relative block h-11 w-[196px]">
              <Image
                src="/assets/logo-white-trim.png"
                alt="Azərbaycan Elm və İnnovasiya Könüllüləri"
                fill
                sizes="196px"
                className="object-contain object-left"
              />
            </Link>
            <p className="mt-6 max-w-[320px] text-[13px] leading-relaxed text-white/70">
              {FOOTER.tagline}
            </p>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">
              {FOOTER.discoverTitle}
            </h4>
            <ul className="mt-5 space-y-3">
              {FOOTER.discover.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[13px] text-white/85 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">
              {FOOTER.periodTitle}
            </h4>
            <p className="mt-5 text-[13px] text-white/85">{FOOTER.period}</p>
            <Link
              href="#fealiyyet"
              className="mt-3 inline-flex items-center gap-1.5 text-[13px] text-white/85 transition-colors hover:text-white"
            >
              {FOOTER.periodLink}
              <ArrowUpRight size={13} />
            </Link>
            <p className="mt-3 text-[13px] text-white/85">{FOOTER.periodText}</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-[11px] text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>{FOOTER.copyright}</p>
          <p>{FOOTER.note}</p>
        </div>
      </div>
    </footer>
  );
}
