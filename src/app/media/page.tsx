import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Download, Mail, Newspaper } from "lucide-react";
import { PageCTA, PageHero, PageShell, Section } from "@/components/PageShell";
import { CONTACT, MEDIA_INFO } from "@/data/brief";

export const metadata: Metadata = {
  title: "Media haqqında",
  description:
    "AEİK media məlumatları: təşkilat haqqında qısa faktlar, loqo faylları və mətbuat üçün əlaqə.",
  alternates: { canonical: "/media" },
};

const LOGOS = [
  { label: "Loqo (rəngli, PNG)", href: "/assets/logo-primary.png" },
  { label: "Loqo (ağ, PNG)", href: "/assets/logo-white.png" },
  { label: "Emblem (PNG)", href: "/assets/pages/emblem.png" },
];

export default function MediaPage() {
  return (
    <PageShell>
      <PageHero
        back="Xəbərlər"
        backHref="/xeberler"
        eyebrow="Media"
        title="Mətbuat üçün məlumat."
        text={MEDIA_INFO.about}
      >
        <a
          href={`mailto:${CONTACT.email}?subject=Media%20sor%C4%9Fusu`}
          className="mt-7 inline-flex h-11 items-center gap-2 rounded-full bg-brand-600 px-5 text-[12px] font-bold text-white transition-colors hover:bg-brand-700"
        >
          <Mail size={14} /> Media sorğusu göndər
        </a>
      </PageHero>

      <Section>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:gap-12">
          <div>
            <h2 className="text-[20px] font-extrabold tracking-[-0.02em] text-ink">Qısa faktlar</h2>
            <dl className="mt-4 divide-y divide-[#F1EFF8] rounded-[20px] border border-[#EAE7F7] bg-white">
              {MEDIA_INFO.facts.map((fact) => (
                <div key={fact.label} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <dt className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#8A83A0]">{fact.label}</dt>
                  <dd className="text-right text-[12.5px] font-bold text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>

            <h2 className="mt-9 text-[20px] font-extrabold tracking-[-0.02em] text-ink">Loqo və brend faylları</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {LOGOS.map((logo) => (
                <a
                  key={logo.href}
                  href={logo.href}
                  download
                  className="group flex flex-col justify-between rounded-[18px] border border-[#EAE7F7] bg-[#FAF9FF] p-4 transition-colors hover:border-brand-200"
                >
                  <div className="relative h-14 w-full">
                    <Image
                      src={logo.href}
                      alt={logo.label}
                      fill
                      sizes="180px"
                      className="object-contain object-left"
                    />
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-700">
                    <Download size={12} /> {logo.label}
                  </span>
                </a>
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-[#8A83A0]">
              Loqo dəyişdirilmədən, proporsiyalar saxlanmaqla və ağ fon üzərində istifadə olunmalıdır.
            </p>
          </div>

          <aside className="space-y-4">
            <div className="rounded-[22px] border border-[#EAE7F7] bg-[#FAF9FF] p-5">
              <p className="inline-flex items-center gap-2 text-[12px] font-bold text-ink">
                <Newspaper size={14} className="text-brand-600" /> Mətbuat əlaqəsi
              </p>
              <ul className="mt-3 space-y-2 text-[12px] font-semibold text-ink">
                <li>
                  <a href={`mailto:${CONTACT.email}`} className="hover:text-brand-600">
                    {CONTACT.email}
                  </a>
                </li>
                <li>
                  <a href={CONTACT.phoneHref} className="hover:text-brand-600">
                    {CONTACT.phone}
                  </a>
                </li>
              </ul>
              <p className="mt-3 text-[11.5px] leading-relaxed text-[#6E6788]">Cavab müddəti: 2 iş günü.</p>
            </div>
            <div className="rounded-[22px] border border-[#EAE7F7] bg-white p-5">
              <p className="text-[12px] font-bold text-ink">Sosial media</p>
              <div className="mt-3 flex flex-col gap-2 text-[12px] font-semibold">
                <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-brand-700 hover:text-brand-800">
                  Instagram <ArrowUpRight size={12} />
                </a>
                <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-brand-700 hover:text-brand-800">
                  LinkedIn <ArrowUpRight size={12} />
                </a>
              </div>
            </div>
            <Link href="/xeberler" className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-brand-600 hover:text-brand-700">
              Bütün xəbərlər <ArrowUpRight size={12} />
            </Link>
          </aside>
        </div>
      </Section>

      <PageCTA
        title="Tədbirimizi işıqlandırmaq istəyirsiniz?"
        text="Media akkreditasiyası üçün əvvəlcədən yazın — tədbir proqramı və foto zonaları barədə məlumat verək."
        href={`mailto:${CONTACT.email}?subject=Media%20akkreditasiyas%C4%B1`}
        label="Akkreditasiya"
      />
    </PageShell>
  );
}
