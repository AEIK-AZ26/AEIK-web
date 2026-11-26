import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Clock, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { PageCTA, PageHero, PageShell, Section } from "@/components/PageShell";
import { CONTACT } from "@/data/brief";

export const metadata: Metadata = {
  title: "Əlaqə",
  description:
    "AEİK ilə əlaqə: info@aeik.az, jurnal@aeik.az, +994 70 399 25 54, Instagram və LinkedIn. Ünvan: Bakı, Azərbaycan.",
  alternates: { canonical: "/elaqe" },
};

export default function ContactPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Əlaqə"
        title="Sualınız var? Yazın."
        text="Üzvlük, tədbirlər, jurnal və tərəfdaşlıq üzrə bütün müraciətlər komanda tərəfindən 2 iş günü ərzində cavablandırılır."
      />

      <Section>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-12">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <a
              href={`mailto:${CONTACT.email}`}
              className="group rounded-[22px] border border-[#EAE7F7] bg-[#FAF9FF] p-5 transition-colors hover:border-brand-200"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm">
                <Mail size={18} />
              </span>
              <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-[#8A83A0]">Ümumi e-poçt</p>
              <p className="mt-1 text-[14px] font-extrabold text-ink group-hover:text-brand-700">{CONTACT.email}</p>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-[#6E6788]">Üzvlük, tədbir və tərəfdaşlıq müraciətləri.</p>
            </a>

            <a
              href={`mailto:${CONTACT.journalEmail}`}
              className="group rounded-[22px] border border-[#EAE7F7] bg-[#FAF9FF] p-5 transition-colors hover:border-brand-200"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm">
                <Mail size={18} />
              </span>
              <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-[#8A83A0]">AEİK Jurnalı</p>
              <p className="mt-1 text-[14px] font-extrabold text-ink group-hover:text-brand-700">{CONTACT.journalEmail}</p>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-[#6E6788]">İcmal, rəyçilik və nəşr müraciətləri.</p>
            </a>

            <a
              href={CONTACT.phoneHref}
              className="group rounded-[22px] border border-[#EAE7F7] bg-[#FAF9FF] p-5 transition-colors hover:border-brand-200"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm">
                <Phone size={18} />
              </span>
              <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-[#8A83A0]">Telefon</p>
              <p className="mt-1 text-[14px] font-extrabold text-ink group-hover:text-brand-700">{CONTACT.phone}</p>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-[#6E6788]">Bazar ertəsi–cümə, 10:00–18:00.</p>
            </a>

            <div className="rounded-[22px] border border-[#EAE7F7] bg-[#FAF9FF] p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm">
                <MapPin size={18} />
              </span>
              <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-[#8A83A0]">Ünvan</p>
              <p className="mt-1 text-[14px] font-extrabold text-ink">Bakı, Azərbaycan</p>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-[#6E6788]">Görüşlər əvvəlcədən razılaşdırılmaqla.</p>
            </div>

            <div className="sm:col-span-2 flex flex-col gap-3 rounded-[22px] border border-[#EAE7F7] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[13px] font-bold text-ink">Sosial media</p>
                <p className="mt-1 text-[11.5px] text-[#6E6788]">Yeni tədbirlər və elanlar ilk olaraq Instagram-da paylaşılır.</p>
              </div>
              <div className="flex gap-2">
                <a
                  href={CONTACT.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-[11.5px] font-bold text-white transition-colors hover:bg-[#2E2552]"
                >
                  <Instagram size={14} /> Instagram
                </a>
                <a
                  href={CONTACT.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-[#E4E0F2] px-4 text-[11.5px] font-bold text-ink transition-colors hover:border-brand-200 hover:text-brand-700"
                >
                  <Linkedin size={14} /> LinkedIn
                </a>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-[22px] border border-[#EAE7F7] bg-[#FAF9FF] p-5">
              <p className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-brand-600">Hansı kanal?</p>
              <ul className="mt-3 space-y-3 text-[12px] leading-relaxed text-[#4E4768]">
                <li>
                  <span className="font-bold text-ink">Komandaya qoşulmaq</span> — müraciət formu
                </li>
                <li>
                  <span className="font-bold text-ink">Tədbir qeydiyyatı</span> — tədbir səhifəsindəki anket
                </li>
                <li>
                  <span className="font-bold text-ink">Tezis</span> — tezis göndəriş forması
                </li>
                <li>
                  <span className="font-bold text-ink">Jurnal icmalı</span> — {CONTACT.journalEmail}
                </li>
                <li>
                  <span className="font-bold text-ink">Tərəfdaşlıq</span> — tərəfdaş sorğu forması
                </li>
              </ul>
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href="/muraciet"
                  className="inline-flex h-10 items-center justify-between rounded-xl bg-white px-3.5 text-[11.5px] font-bold text-ink transition-colors hover:text-brand-700"
                >
                  Müraciət formu <ArrowUpRight size={13} className="text-brand-600" />
                </Link>
                <Link
                  href="/terefdaslar"
                  className="inline-flex h-10 items-center justify-between rounded-xl bg-white px-3.5 text-[11.5px] font-bold text-ink transition-colors hover:text-brand-700"
                >
                  Tərəfdaş sorğusu <ArrowUpRight size={13} className="text-brand-600" />
                </Link>
                <Link
                  href="/sertifikat"
                  className="inline-flex h-10 items-center justify-between rounded-xl bg-white px-3.5 text-[11.5px] font-bold text-ink transition-colors hover:text-brand-700"
                >
                  Sertifikatı yoxla <ArrowUpRight size={13} className="text-brand-600" />
                </Link>
              </div>
            </div>

            <div className="rounded-[22px] border border-[#EAE7F7] bg-white p-5">
              <p className="inline-flex items-center gap-2 text-[12px] font-bold text-ink">
                <Clock size={14} className="text-brand-600" /> Cavab müddəti
              </p>
              <p className="mt-2 text-[12px] leading-relaxed text-[#5A5270]">
                İş günləri ərzində 2 iş günü, jurnal müraciətləri üzrə 10 iş günü.
              </p>
              <p className="mt-3 text-[11px] leading-relaxed text-[#8A83A0]">{CONTACT.status}.</p>
            </div>
          </aside>
        </div>
      </Section>

      <PageCTA
        title="Komandaya qoşulmaq istəyirsiniz?"
        text="Müraciət formunu doldurun — maraq sahənizə uyğun qrupa yönləndiriləcəksiniz."
        href="/muraciet"
        label="Müraciət et"
      />
    </PageShell>
  );
}
