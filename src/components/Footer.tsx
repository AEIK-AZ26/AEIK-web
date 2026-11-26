import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUp,
  BadgeCheck,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import SectionLink from "@/components/SectionLink";
import { CONTACT, SITE } from "@/data/brief";

const SECTION_LINKS = [
  { label: "Haqqımızda", href: "/haqqimizda" },
  { label: "Tədbirlər", href: "/tedbirler" },
  { label: "Layihələr", href: "/layiheler" },
  { label: "AEİK Jurnalı", href: "/jurnal" },
  { label: "Elmi imkanlar", href: "/elmi-imkanlar" },
  { label: "Tərəfdaşlar", href: "/terefdaslar" },
  { label: "Xəbərlər", href: "/xeberler" },
  { label: "Elanlar", href: "/elanlar" },
];

const SERVICE_LINKS = [
  { label: "Sertifikatı yoxla", href: "/sertifikat" },
  { label: "Əlaqə", href: "/elaqe" },
  { label: "Media haqqında", href: "/media" },
  { label: "Məxfilik siyasəti", href: "/mexfilik" },
];

const JOIN_LINKS = [
  { label: "Müraciət formu", href: "/muraciet" },
  { label: "Şəxsi kabinet", href: "/kabinet" },
  { label: "Tezis göndər", href: "/tedbirler/tezis" },
  { label: "Tərəfdaş ol", href: "/terefdaslar" },
];

export default function Footer() {
  return (
    <footer id="elaqe" className="relative overflow-hidden bg-[#211B3E] text-white">
      <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 h-80 w-80 rounded-full bg-[#7C67F7]/15 blur-3xl" />

      <div className="relative mx-auto w-full max-w-[1320px] px-5 pb-7 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
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

        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-10">
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
            <p className="mt-5 max-w-[320px] text-[12.5px] leading-relaxed text-white/65">
              Elm. Əməkdaşlıq. İnnovasiya. {SITE.motto}
            </p>

            <ul className="mt-5 space-y-2.5 text-[12.5px] text-white/80">
              <li>
                <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2 transition-colors hover:text-white">
                  <Mail size={13} className="text-[#B9ABEE]" /> {CONTACT.email}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.journalEmail}`} className="inline-flex items-center gap-2 transition-colors hover:text-white">
                  <Mail size={13} className="text-[#B9ABEE]" /> {CONTACT.journalEmail}
                  <span className="text-[10px] uppercase tracking-[0.1em] text-white/40">jurnal</span>
                </a>
              </li>
              <li>
                <a href={CONTACT.phoneHref} className="inline-flex items-center gap-2 transition-colors hover:text-white">
                  <Phone size={13} className="text-[#B9ABEE]" /> {CONTACT.phone}
                </a>
              </li>
              <li className="inline-flex items-center gap-2 text-white/65">
                <MapPin size={13} className="text-[#B9ABEE]" /> Bakı, Azərbaycan
              </li>
            </ul>

            <div className="mt-5 flex items-center gap-2.5">
              <a
                href={CONTACT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="AEİK Instagram"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/75 transition-colors hover:border-white/35 hover:text-white"
              >
                <Instagram size={15} />
              </a>
              <a
                href={CONTACT.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="AEİK LinkedIn"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/75 transition-colors hover:border-white/35 hover:text-white"
              >
                <Linkedin size={15} />
              </a>
              <Link
                href="/sertifikat"
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/15 px-3 text-[11px] font-semibold text-white/75 transition-colors hover:border-white/35 hover:text-white"
              >
                <BadgeCheck size={13} /> Sertifikat yoxla
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">Bölmələr</h4>
            <ul className="mt-4 space-y-2.5">
              {SECTION_LINKS.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[12.5px] text-white/80 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">Xidmətlər</h4>
            <ul className="mt-4 space-y-2.5">
              {SERVICE_LINKS.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[12.5px] text-white/80 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <SectionLink href="/#fealiyyet" className="text-[12.5px] text-white/80 transition-colors hover:text-white">
                  Fəaliyyət planı
                </SectionLink>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">Qoşul</h4>
            <ul className="mt-4 space-y-2.5">
              {JOIN_LINKS.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[12.5px] text-white/80 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-5 max-w-[240px] text-[11px] leading-relaxed text-white/45">{CONTACT.status}.</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-5 text-[11px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Azərbaycan Elm və İnnovasiya Könüllüləri</p>
          <div className="flex flex-wrap items-center gap-3">
            <p>Elm və İnnovasiya Proqramı</p>
            <span className="hidden h-3 w-px bg-white/15 sm:block" />
            <Link href="/mexfilik" className="text-white/60 transition-colors hover:text-white">
              Məxfilik
            </Link>
            <SectionLink href="/" className="inline-flex items-center gap-1 text-white/60 transition-colors hover:text-white">
              Yuxarı <ArrowUp size={12} />
            </SectionLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
