import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Sparkles } from "lucide-react";
import { PageCTA, PageHero, PageShell, Section } from "@/components/PageShell";
import { ProjectList } from "@/components/ContentLists";
import EventCard from "@/components/EventCard";
import { EVENTS } from "@/data/brief";

export const metadata: Metadata = {
  title: "Layihələr",
  description:
    "AEİK-in böyük layihələri: Beynəlxalq Elmi Forum, İnnovasiya və Startap Akseleratoru, BioPhysChem Camp, Science 1.0 və digər forum və konfranslar.",
  alternates: { canonical: "/layiheler" },
};

export default function ProjectsPage() {
  const flagship = EVENTS.slice(0, 4);

  return (
    <PageShell>
      <PageHero
        eyebrow="Layihələr"
        title={
          <>
            İdeyalar böyüyür.
            <br />
            <span className="text-gradient">Üfüqlər genişlənir.</span>
          </>
        }
        text="Elmi əlaqələrdən startap ekosisteminə — uzunmüddətli təsir üçün birlikdə. Layihələrin bir hissəsi tədbir formatında keçirilir."
      >
        <div className="mt-7 flex flex-wrap gap-2.5">
          <Link
            href="/tedbirler"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-600 px-5 text-[12px] font-bold text-white transition-colors hover:bg-brand-700"
          >
            <CalendarDays size={14} /> Tədbir təqvimi
          </Link>
          <Link
            href="/tedbirler/tezis"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/80 bg-white/85 px-5 text-[12px] font-bold text-ink backdrop-blur transition-colors hover:border-brand-200 hover:text-brand-700"
          >
            <Sparkles size={14} /> Tezis göndər
          </Link>
        </div>
      </PageHero>

      <Section>
        <ProjectList />
      </Section>

      <Section eyebrow="Bayraq layihələr" title="2026–2027 mövsümünün əsas layihələri." tone="tint">
        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {flagship.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>
        <div className="mt-6 flex flex-col gap-3 rounded-[22px] border border-[#EAE7F7] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[640px] text-[12px] leading-relaxed text-[#5A5270]">
            Bütün forum, konfrans və master-klaslar tədbir təqvimində tarix və format ilə göstərilir.
          </p>
          <Link
            href="/tedbirler"
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-[#E4E0F2] px-4 text-[11.5px] font-bold text-ink transition-colors hover:border-brand-200 hover:text-brand-700"
          >
            Bütün tədbirlər <ArrowUpRight size={13} />
          </Link>
        </div>
      </Section>

      <PageCTA
        title="Layihədə iştirak etmək istəyirsiniz?"
        text="Komanda, mentor və ya iştirakçı kimi qoşulmaq üçün müraciət edin."
        href="/muraciet"
        label="Müraciət et"
      />
    </PageShell>
  );
}
