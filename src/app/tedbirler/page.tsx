import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, FileText, Images, Mail } from "lucide-react";
import { PageCTA, PageHero, PageShell, Section } from "@/components/PageShell";
import EventCard from "@/components/EventCard";
import { CONTACT, EVENTS } from "@/data/brief";

export const metadata: Metadata = {
  title: "Tədbirlər və qeydiyyat",
  description:
    "AEİK-in forumları, konfransları, festivalları, master-klasları və elmi düşərgələri. Tədbir təqvimi, onlayn qeydiyyat və tezis qəbulu.",
  alternates: { canonical: "/tedbirler" },
};

export default function EventsPage() {
  const withThesis = EVENTS.filter((event) => event.thesis);
  const openRegistration = EVENTS.filter((event) => event.registration);

  return (
    <PageShell>
      <PageHero
        eyebrow="Tədbirlər"
        title={
          <>
            Elmə çıxış üçün
            <br />
            <span className="text-gradient">ilk addım burada başlayır.</span>
          </>
        }
        text="Forumlar, konfranslar, festivallar, master-klaslar və elmi düşərgələr — bir yerdə. Hər tədbirin öz səhifəsi, qeydiyyatı və tezis imkanı var."
      >
        <div className="mt-7 flex flex-wrap gap-2.5">
          <Link
            href="/tedbirler/tezis"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-600 px-5 text-[12px] font-bold text-white transition-colors hover:bg-brand-700"
          >
            <FileText size={14} /> Tezis göndər
          </Link>
          <Link
            href="/tedbirler/arxiv"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/80 bg-white/85 px-5 text-[12px] font-bold text-ink backdrop-blur transition-colors hover:border-brand-200 hover:text-brand-700"
          >
            <Images size={14} /> Arxiv və qalereya
          </Link>
        </div>
      </PageHero>

      <Section
        id="teqvim"
        eyebrow="Tədbir təqvimi"
        title="2026–2027 mövsümü."
        text="Tarixlər təsdiqləndikcə yenilənir. Qeydiyyatı açıq tədbirlərdə ilkin maraq anketini indi doldura bilərsiniz."
        tone="tint"
      >
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {EVENTS.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>
      </Section>

      <Section id="qeydiyyat" eyebrow="Onlayn qeydiyyat" title="Necə qeydiyyatdan keçmək olar?">
        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {[
            {
              title: "1. Tədbiri seçin",
              text: "Təqvimdən maraqlandığınız tədbiri açın. Tarix, məkan, format və kimlər üçün olduğu kartda göstərilib.",
            },
            {
              title: "2. Formu doldurun",
              text: "Tədbir səhifəsindəki ilkin qeydiyyat anketini doldurun. Tarix təsdiqlənəndə sizə e-poçtla məlumat verilir.",
            },
            {
              title: "3. Təsdiqi gözləyin",
              text: "Yer sayı məhdud tədbirlərdə seçim komanda tərəfindən aparılır. Nəticə e-poçtla bildirilir.",
            },
          ].map((step) => (
            <article key={step.title} className="rounded-[20px] border border-[#EFEDF8] bg-[#FAF9FF] p-5">
              <h3 className="text-[15px] font-extrabold text-ink">{step.title}</h3>
              <p className="mt-2 text-[12px] leading-[1.7] text-[#5E5776]">{step.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 rounded-[20px] border border-[#EAE7F7] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[13px] font-bold text-ink">Qeydiyyatı açıq tədbirlər</p>
            <p className="mt-1 text-[12px] text-[#6E6788]">
              {openRegistration.length
                ? openRegistration.map((event) => event.title).join(" · ")
                : "Hazırda qeydiyyatı açıq tədbir yoxdur."}
            </p>
          </div>
          <a
            href={`mailto:${CONTACT.email}?subject=T%C9%99dbir%20bar%C9%99d%C9%99%20sual`}
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-[#E4E0F2] px-4 text-[11.5px] font-bold text-ink transition-colors hover:border-brand-200 hover:text-brand-700"
          >
            <Mail size={13} /> Sual ver
          </a>
        </div>
      </Section>

      <Section eyebrow="Tezis qəbulu" title="Konfrans və forumlar üçün tezis." tone="tint">
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {withThesis.map((event) => (
            <Link
              key={event.slug}
              href="/tedbirler/tezis"
              className="group flex items-start justify-between gap-4 rounded-[20px] border border-[#EAE7F7] bg-white p-5 transition-all hover:border-brand-200"
            >
              <div>
                <p className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-brand-600">{event.kind}</p>
                <h3 className="mt-2 text-[15px] font-bold leading-snug text-ink">{event.title}</h3>
                <p className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] text-[#6E6788]">
                  <CalendarDays size={12} /> {event.dateNote}
                </p>
              </div>
              <ArrowUpRight size={16} className="mt-1 shrink-0 text-brand-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          ))}
        </div>
        <p className="mt-5 text-[12px] leading-relaxed text-[#6E6788]">
          Tezis şablonu, həcm limitləri və qiymətləndirmə meyarları{" "}
          <Link href="/tedbirler/tezis" className="font-bold text-brand-600 hover:text-brand-700">
            tezis səhifəsində
          </Link>{" "}
          göstərilib.
        </p>
      </Section>

      <PageCTA
        title="Tədbirinizi birlikdə planlaşdaq."
        text="Universitet, şirkət və ya tələbə təşkilatısınızsa, birgə tədbir keçirmək üçün bizimlə əlaqə saxlayın."
        href="/terefdaslar"
        label="Əməkdaşlıq təklif et"
      />
    </PageShell>
  );
}
