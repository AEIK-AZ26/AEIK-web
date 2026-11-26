import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Images, Instagram } from "lucide-react";
import { PageCTA, PageHero, PageShell, Section } from "@/components/PageShell";
import { CONTACT } from "@/data/brief";

export const metadata: Metadata = {
  title: "Arxiv və qalereya",
  description: "AEİK-in keçmiş tədbirləri, foto və video arxivi.",
  alternates: { canonical: "/tedbirler/arxiv" },
};

const ARCHIVE = [
  {
    title: "Məqalə saatları",
    year: "2026",
    text: "Elmi məqalənin strukturu, mənbələrlə iş və rəy mədəniyyəti üzrə davamlı sessiyalar.",
    image: "/assets/pages/about-lab.jpg",
  },
  {
    title: "Elm Kafe",
    year: "2026",
    text: "Gənc tədqiqatçıların elmi işini sadə dildə təqdim etdiyi açıq müzakirələr.",
    image: "/assets/pages/hero-card.jpg",
  },
  {
    title: "Akademik Yol",
    year: "2026",
    text: "Elmi karyera, təqaüdlər və beynəlxalq proqramlar haqqında görüşlər.",
    image: "/assets/pages/project-forum.jpg",
  },
  {
    title: "İnnovasiya Emalatxanası",
    year: "2026",
    text: "Dizayn təfəkkürü, layihə və qrant yazısı üzrə praktiki məşğələlər.",
    image: "/assets/pages/project-startup.jpg",
  },
];

export default function ArchivePage() {
  return (
    <PageShell>
      <PageHero
        back="Tədbirlər"
        backHref="/tedbirler"
        eyebrow="Arxiv və qalereya"
        title="Keçdiyimiz yol."
        text="Keçmiş formatların qısa nəticələri və foto arxivi. Yeni tədbirlərin materialları burada toplanır."
      />

      <Section>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6">
          {ARCHIVE.map((item) => (
            <article key={item.title} className="overflow-hidden rounded-[24px] border border-[#EAE7F7] bg-white">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#EFECFA]">
                <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-brand-600">Davamlı fəaliyyət</p>
                  <span className="rounded-full bg-[#F4F2FC] px-2 py-0.5 text-[9.5px] font-bold text-brand-700">{item.year}</span>
                </div>
                <h3 className="mt-2 text-[17px] font-extrabold tracking-[-0.02em] text-ink">{item.title}</h3>
                <p className="mt-2 text-[12px] leading-[1.7] text-[#5A5270]">{item.text}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-[22px] border border-[#EAE7F7] bg-[#FAF9FF] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600">
              <Images size={18} />
            </span>
            <div>
              <p className="text-[13.5px] font-bold text-ink">Foto və video arxivi</p>
              <p className="mt-1 max-w-[520px] text-[12px] leading-relaxed text-[#5A5270]">
                Tədbir materialları Instagram səhifəmizdə dərc olunur. Arxiv üçün əlavə foto və ya video təqdim etmək istəyirsinizsə bizə yazın.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <a
              href={CONTACT.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-[11.5px] font-bold text-white transition-colors hover:bg-[#2E2552]"
            >
              <Instagram size={13} /> Instagram
            </a>
            <Link
              href="/elaqe"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-[#E4E0F2] bg-white px-4 text-[11.5px] font-bold text-ink transition-colors hover:border-brand-200 hover:text-brand-700"
            >
              Material göndər <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </Section>

      <PageCTA
        title="Növbəti tədbirdə sən də ol."
        text="Tədbir təqviminə bax, qeydiyyatı açıq olanlarda ilkin anketi doldur."
        href="/tedbirler"
        label="Tədbir təqvimi"
      />
    </PageShell>
  );
}
