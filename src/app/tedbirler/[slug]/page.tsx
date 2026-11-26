import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  FileText,
  Mail,
  MapPin,
  Users,
} from "lucide-react";
import { PageCTA, PageHero, PageShell, Section } from "@/components/PageShell";
import EventCard from "@/components/EventCard";
import SubmissionForm from "@/components/forms/SubmissionForm";
import EventCertificateLink from "@/components/EventCertificateLink";
import { CONTACT, EVENTS } from "@/data/brief";

export function generateStaticParams() {
  return EVENTS.map((event) => ({ slug: event.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const event = EVENTS.find((entry) => entry.slug === params.slug);
  if (!event) return { title: "Tədbir tapılmadı" };
  return {
    title: event.title,
    description: event.text,
    alternates: { canonical: `/tedbirler/${event.slug}` },
  };
}

export default function EventDetailPage({ params }: { params: { slug: string } }) {
  const event = EVENTS.find((entry) => entry.slug === params.slug);
  if (!event) notFound();

  const related = EVENTS.filter((entry) => entry.slug !== event.slug).slice(0, 3);

  return (
    <PageShell>
      <PageHero
        back="Bütün tədbirlər"
        backHref="/tedbirler"
        eyebrow={event.kind}
        title={event.title}
        text={event.text}
      >
        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/85 px-3 py-1.5 text-[10.5px] font-bold text-ink backdrop-blur">
            <CalendarDays size={12} className="text-brand-600" /> {event.dateNote}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/85 px-3 py-1.5 text-[10.5px] font-bold text-ink backdrop-blur">
            <MapPin size={12} className="text-brand-600" /> {event.place}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/85 px-3 py-1.5 text-[10.5px] font-bold text-ink backdrop-blur">
            <Users size={12} className="text-brand-600" /> {event.format}
          </span>
        </div>
      </PageHero>

      <Section>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
          <article>
            <div className="space-y-4">
              {event.body.map((paragraph) => (
                <p key={paragraph.slice(0, 24)} className="text-[13.5px] leading-[1.9] text-[#4E4768]">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-8 rounded-[22px] border border-[#EAE7F7] bg-[#FAF9FF] p-5">
              <p className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-brand-600">Kimlər üçün</p>
              <p className="mt-2 text-[13px] font-semibold leading-relaxed text-ink">{event.audience}</p>
              <p className="mt-3 text-[12px] leading-relaxed text-[#6E6788]">
                Tədbirin dili Azərbaycan dilidir. İştirak {event.registration ? "ilkin qeydiyyat əsasında" : "elan olunan qaydada"} təsdiqlənir.
              </p>
            </div>

            {event.thesis && (
              <div className="mt-4 flex flex-col gap-3 rounded-[22px] border border-brand-200 bg-brand-50/60 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[13px] font-bold text-ink">Bu tədbirdə tezislə iştirak mümkündür</p>
                  <p className="mt-1 text-[12px] text-[#5A5270]">Tezis şablonu və qəbul qaydaları ilə tanış olun.</p>
                </div>
                <Link
                  href="/tedbirler/tezis"
                  className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-brand-600 px-4 text-[11.5px] font-bold text-white transition-colors hover:bg-brand-700"
                >
                  <FileText size={13} /> Tezis göndər
                </Link>
              </div>
            )}

            <div className="mt-8">
              <h2 className="text-[20px] font-extrabold tracking-[-0.02em] text-ink">
                {event.registration ? "İlkin qeydiyyat" : "Qeydiyyat"}
              </h2>
              {event.registration ? (
                <>
                  <p className="mt-2 max-w-[640px] text-[12.5px] leading-relaxed text-[#5A5270]">
                    Tarix və yer təsdiqlənməmişdir. Anketi doldurun — proqram dəqiqləşdikdə sizinlə əlaqə saxlayacağıq.
                  </p>
                  <div className="mt-4">
                    <SubmissionForm
                      kind="event"
                      hidden={{ event: event.title }}
                      fields={[
                        { name: "name", label: "Ad və soyad", required: true, placeholder: "Adınız və soyadınız" },
                        { name: "email", label: "E-poçt", type: "email", required: true, placeholder: "ad@example.com" },
                        { name: "phone", label: "Telefon", type: "tel", placeholder: "+994 50 000 00 00" },
                        {
                          name: "role",
                          label: "İştirak formatı",
                          type: "select",
                          options: ["İştirakçı", "Tezislə iştirak", "Könüllü", "Mentor / spiker"],
                          required: true,
                        },
                        { name: "organization", label: "Universitet / təşkilat", placeholder: "Müəssisənin adı" },
                        {
                          name: "note",
                          label: "Qeyd",
                          type: "textarea",
                          placeholder: "Maraq sahəniz, sualınız və ya gözləntiniz",
                        },
                      ]}
                      consent="Məlumatlarımın tədbir qeydiyyatı üçün işlənməsinə razıyam."
                      submitLabel="Qeydiyyatı göndər"
                      successMessage="İlkin qeydiyyatınız alındı. Tədbirin tarixi və proqramı təsdiqlənəndə sizə e-poçtla məlumat veriləcək."
                    />
                  </div>
                </>
              ) : (
                <div className="mt-3 rounded-[22px] border border-[#EAE7F7] bg-white p-5">
                  <p className="inline-flex items-center gap-2 text-[13px] font-bold text-ink">
                    <CheckCircle2 size={15} className="text-amber-500" /> Qeydiyyat hələ açılmayıb
                  </p>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-[#5A5270]">
                    Tədbirin tarixi və yeri təsdiqlənəndən sonra bu səhifədə qeydiyyat forması açılacaq. Suala cavab üçün{" "}
                    <a href={`mailto:${CONTACT.email}`} className="font-bold text-brand-600 hover:text-brand-700">
                      {CONTACT.email}
                    </a>{" "}
                    ünvanına yaza bilərsiniz.
                  </p>
                  <a
                    href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(`Tədbir: ${event.title}`)}`}
                    className="mt-4 inline-flex h-10 items-center gap-2 rounded-full border border-[#E4E0F2] px-4 text-[11.5px] font-bold text-ink transition-colors hover:border-brand-200 hover:text-brand-700"
                  >
                    <Mail size={13} /> Maraqlanıram
                  </a>
                </div>
              )}
            </div>
          </article>

          <aside className="space-y-4">
            <div className="rounded-[22px] border border-[#EAE7F7] bg-[#FAF9FF] p-5">
              <p className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-brand-600">Tədbir məlumatı</p>
              <dl className="mt-4 space-y-3 text-[12px]">
                {[
                  ["Format", event.format],
                  ["Tarix", event.dateNote],
                  ["Məkan", event.place],
                  ["Kimlər üçün", event.audience],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8A83A0]">{label}</dt>
                    <dd className="mt-1 font-semibold leading-relaxed text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <EventCertificateLink slug={event.slug} />

            <div className="rounded-[22px] border border-[#EAE7F7] bg-white p-5">
              <p className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-brand-600">Digər tədbirlər</p>
              <ul className="mt-3 space-y-2.5">
                {related.map((entry) => (
                  <li key={entry.slug}>
                    <Link
                      href={`/tedbirler/${entry.slug}`}
                      className="group flex items-start justify-between gap-2 text-[12px] font-semibold leading-snug text-ink transition-colors hover:text-brand-600"
                    >
                      {entry.title}
                      <ArrowUpRight size={13} className="mt-0.5 shrink-0 text-brand-500" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/tedbirler"
              className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-brand-600 hover:text-brand-700"
            >
              <ArrowLeft size={13} /> Bütün tədbirlər
            </Link>
          </aside>
        </div>
      </Section>

      <Section eyebrow="Oxşar tədbirlər" title="Digər imkanlar" tone="tint">
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {related.map((entry) => (
            <EventCard key={entry.slug} event={entry} />
          ))}
        </div>
      </Section>

      <PageCTA
        title="Sualınız var?"
        text="Tədbir proqramı, iştirak şərtləri və ya təşkilati məsələlər üzrə bizə yazın."
        href="/elaqe"
        label="Əlaqə saxla"
      />
    </PageShell>
  );
}
