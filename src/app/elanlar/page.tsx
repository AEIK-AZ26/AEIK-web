import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Megaphone } from "lucide-react";
import { PageCTA, PageHero, PageShell, Section } from "@/components/PageShell";
import { AnnouncementList } from "@/components/ContentLists";

export const metadata: Metadata = {
  title: "Elanlar",
  description:
    "AEİK-in aktiv elanları: müraciət, qeydiyyat və tədbir imkanları. Son tarixi keçmiş elanlar avtomatik “Bitib” nişanı alır.",
  alternates: { canonical: "/elanlar" },
};

export default function AnnouncementsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Elanlar"
        title="Aktiv imkanlar və müraciətlər."
        text="Müraciət, qeydiyyat və tədbir elanları. Hər elanın son tarixi və statusu göstərilir — vaxtı keçən elanlar arxivə düşür."
      >
        <div className="mt-7">
          <Link
            href="/tedbirler"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-600 px-5 text-[12px] font-bold text-white transition-colors hover:bg-brand-700"
          >
            <Megaphone size={14} /> Tədbirlər təqvimi
          </Link>
        </div>
      </PageHero>

      <Section>
        <AnnouncementList />
      </Section>

      <Section eyebrow="Fəaliyyət planı" title="Nə vaxt nə olacaq?" tone="tint">
        <div className="mt-5 flex flex-col gap-4 rounded-[22px] border border-[#EAE7F7] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[640px] text-[12.5px] leading-relaxed text-[#5A5270]">
            9 aylıq yol xəritəsi: hazırlıq, seçim, mentorluq, forum və Demo Day mərhələləri.
          </p>
          <Link
            href="/#fealiyyet"
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-[#E4E0F2] px-4 text-[11.5px] font-bold text-ink transition-colors hover:border-brand-200 hover:text-brand-700"
          >
            Fəaliyyət planı <ArrowUpRight size={13} />
          </Link>
        </div>
      </Section>

      <PageCTA
        title="Elanı qaçırmaq istəmirsiniz?"
        text="Instagram səhifəmizdə bütün yeni elanlar dərc olunur."
        href="/elaqe"
        label="Əlaqə saxla"
      />
    </PageShell>
  );
}
