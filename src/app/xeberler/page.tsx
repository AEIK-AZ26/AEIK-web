import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Instagram, Newspaper } from "lucide-react";
import { PageCTA, PageHero, PageShell, Section } from "@/components/PageShell";
import { NewsList } from "@/components/ContentLists";
import { CONTACT } from "@/data/brief";

export const metadata: Metadata = {
  title: "Xəbərlər",
  description: "AEİK-in son xəbərləri: görüşlər, tərəfdaşlıqlar, yeni formatlar və komanda yenilikləri.",
  alternates: { canonical: "/xeberler" },
};

export default function NewsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Xəbər və elanlar"
        title="Komandanın son xəbərləri."
        text="Görüşlər, tərəfdaşlıqlar və yeni formatlar haqqında qısa xülasələr. Daha çox gündəlik məzmun üçün Instagram səhifəmizə baxın."
      >
        <div className="mt-7 flex flex-wrap gap-2.5">
          <Link
            href="/elanlar"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-600 px-5 text-[12px] font-bold text-white transition-colors hover:bg-brand-700"
          >
            <Newspaper size={14} /> Elanlara bax
          </Link>
          <a
            href={CONTACT.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/80 bg-white/85 px-5 text-[12px] font-bold text-ink backdrop-blur transition-colors hover:border-brand-200 hover:text-brand-700"
          >
            <Instagram size={14} /> Instagram
          </a>
        </div>
      </PageHero>

      <Section>
        <NewsList />
      </Section>

      <Section eyebrow="Media" title="Jurnalistlər üçün." tone="tint">
        <div className="mt-5 flex flex-col gap-4 rounded-[22px] border border-[#EAE7F7] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[640px] text-[12.5px] leading-relaxed text-[#5A5270]">
            AEİK-in fəaliyyəti haqqında məlumat, müsahibə və foto/video sorğuları üçün media səhifəmizə baxın.
          </p>
          <Link
            href="/media"
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-[#E4E0F2] px-4 text-[11.5px] font-bold text-ink transition-colors hover:border-brand-200 hover:text-brand-700"
          >
            Media haqqında <ArrowUpRight size={13} />
          </Link>
        </div>
      </Section>

      <PageCTA
        title="Yeniliklərdən ilk sən xəbərdar ol."
        text="Tədbirlər və elanlar üçün təqvimi izləyin — qeydiyyat açılan tədbirlərdə yer sayı məhduddur."
        href="/tedbirler"
        label="Tədbir təqvimi"
      />
    </PageShell>
  );
}
