"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/data/program";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#F0EEF8] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-[76px] w-full max-w-[1376px] items-center justify-between px-5 sm:px-8 lg:h-[110px]">
        <Link href="/" aria-label="AEİK ana səhifə" className="relative block h-8 w-[132px] shrink-0 lg:h-[46px] lg:w-[190px]">
          <Image
            src="/assets/logo-primary-trim.png"
            alt="Azərbaycan Elm və İnnovasiya Könüllüləri"
            fill
            sizes="190px"
            className="object-contain object-left"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex xl:gap-9">
          {NAV_LINKS.map((link) => {
            const active = link.label === "Ana səhifə";
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`relative py-2 text-[14px] transition-colors ${
                  active
                    ? "font-semibold text-brand-600 after:absolute after:-bottom-0.5 after:left-0 after:h-[2px] after:w-full after:rounded-full after:bg-brand-600 after:content-['']"
                    : "font-medium text-ink hover:text-brand-600"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Link
            href="/login"
            className="group inline-flex h-[44px] items-center gap-2 rounded-full bg-brand-600 px-6 text-[11px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-brand-700"
          >
            Daxil ol
            <ArrowUpRight size={14} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menyu"
          aria-expanded={open}
          className="rounded-xl p-2 text-ink transition-colors hover:bg-brand-50 lg:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[#F0EEF8] bg-white px-5 pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-[#F4F2FB] py-3 text-[15px] font-medium text-ink last:border-0"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="mt-5 inline-flex h-[46px] w-full items-center justify-center gap-2 rounded-full bg-brand-600 text-[12px] font-bold uppercase tracking-[0.12em] text-white"
          >
            Daxil ol
            <ArrowUpRight size={15} strokeWidth={2.5} />
          </Link>
        </div>
      )}
    </header>
  );
}
