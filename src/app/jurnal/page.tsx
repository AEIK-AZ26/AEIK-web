import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  CalendarDays,
  Download,
  FileText,
  Mail,
  PenLine,
  Users,
} from "lucide-react";
import { PageCTA, PageHero, PageShell, Section } from "@/components/PageShell";
import { CONTACT, JOURNAL } from "@/data/brief";

export const metadata: Metadata = {
  title: "AEİK Jurnalı",
  description:
    "AEİK Jurnalı — tələbələrin kimya, fizika və biologiya üzrə elmi icmalları üçün pulsuz, DOI-li nəşr platforması. İcmal göndər, rəyçi ol, şablon və nəşr təqvimi.",
  alternates: { canonical: "/jurnal" },
};

const STATS = [
  { value: "3", label: "İstiqamət: kimya, fizika, biologiya" },
  { value: "DOI", label: "Zenodo-da rəsmi identifikator" },
  { value: "0 ₼", label: "Nəşr və müraciət pulsuzdur" },
  { value: "3", label: "Buraxılış: 2026–2027" },
];

const mail = (subject: string) =>
  `mailto:${CONTACT.journalEmail}?subject=${encodeURIComponent(subject)}`;

export default function JournalPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="AEİK Jurnalı"
        title={
          <>
            Tələbə icmalları üçün
            <br />
            <span className="text-gradient">akademik nəşr platforması.</span>
          </>
        }
        text={JOURNAL.intro}
      >
        <div className="mt-7 flex flex-wrap gap-2.5">
          <a
            href={mail("İcmal müraciəti — AEİK Jurnalı")}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-600 px-5 text-[12px] font-bold text-white transition-colors hover:bg-brand-700"
          >
            <PenLine size={14} /> İcmal göndər
          </a>
          <a
            href={mail("Rəyçi olmaq istəyi — AEİK Jurnalı")}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/80 bg-white/85 px-5 text-[12px] font-bold text-ink backdrop-blur transition-colors hover:border-brand-200 hover:text-brand-700"
          >
            <Users size={14} /> Rəyçi ol
          </a>
          <a
            href={JOURNAL.links.zenodo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/80 bg-white/85 px-5 text-[12px] font-bold text-ink backdrop-blur transition-colors hover:border-brand-200 hover:text-brand-700"
          >
            <BookOpen size={14} /> Zenodo-da oxu
          </a>
        </div>
      </PageHero>

      <section className="border-b border-[#F1EFF8] bg-white">
        <div className="mx-auto grid w-full max-w-[1320px] grid-cols-2 gap-x-5 gap-y-7 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:gap-x-0 lg:px-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="lg:border-l lg:border-[#EDEAF7] lg:pl-7 lg:first:border-l-0 lg:first:pl-0">
              <p className="text-[26px] font-extrabold leading-none tracking-[-0.035em] text-ink lg:text-[32px]">{stat.value}</p>
              <p className="mt-2 text-[9.5px] font-bold uppercase leading-[1.6] tracking-[0.1em] text-[#7A7391]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <Section id="haqqinda" eyebrow="Jurnal haqqında" title="Nə qəbul edirik?">
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Yalnız icmallar", text: "Elmi icmal (review) xarakterli yazılar qəbul olunur; orijinal tədqiqat məqalələri qəbul edilmir." },
            { title: "Üç istiqamət", text: "Kimya, fizika və biologiya sahələri üzrə yazılar." },
            { title: "Pulsuz nəşr", text: "Müəllif üçün heç bir ödəniş yoxdur." },
            { title: "DOI ilə arxiv", text: "Hər icmal Zenodo-da DOI ilə yayımlanır və uzunmüddətli saxlanılır." },
          ].map((card) => (
            <article key={card.title} className="rounded-[20px] border border-[#EFEDF8] bg-[#FAF9FF] p-5">
              <h3 className="text-[14.5px] font-extrabold text-ink">{card.title}</h3>
              <p className="mt-2 text-[12px] leading-[1.7] text-[#5E5776]">{card.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="icmal" eyebrow="Necə müraciət etməli" title="Dörd addımda nəşr." tone="tint">
        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-4">
          {JOURNAL.process.map((step, index) => (
            <article key={step} className="relative rounded-[20px] border border-[#EAE7F7] bg-white p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#EFEBFF] to-[#E1DBFF] text-[12px] font-extrabold text-brand-700">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 text-[12.5px] font-semibold leading-relaxed text-ink">{step}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <a
            href={mail("İcmal müraciəti — AEİK Jurnalı")}
            className="group flex items-center justify-between gap-3 rounded-xl border border-[#EAE7F7] bg-white px-4 py-3.5 text-[12px] font-bold text-ink transition-colors hover:border-brand-200 hover:text-brand-700"
          >
            <span className="inline-flex items-center gap-2">
              <PenLine size={14} className="text-brand-600" /> İcmal göndər
            </span>
            <ArrowUpRight size={13} className="text-brand-500" />
          </a>
          <a
            href={mail("Rəyçi olmaq istəyi — AEİK Jurnalı")}
            className="group flex items-center justify-between gap-3 rounded-xl border border-[#EAE7F7] bg-white px-4 py-3.5 text-[12px] font-bold text-ink transition-colors hover:border-brand-200 hover:text-brand-700"
          >
            <span className="inline-flex items-center gap-2">
              <Users size={14} className="text-brand-600" /> Rəyçi ol
            </span>
            <ArrowUpRight size={13} className="text-brand-500" />
          </a>
        </div>

        <p className="mt-5 flex flex-wrap items-center gap-2 text-[12px] text-[#5A5270]">
          <Mail size={13} className="text-brand-600" /> Ətraflı məlumat üçün:
          <a href={`mailto:${CONTACT.journalEmail}`} className="font-bold text-brand-600 hover:text-brand-700">
            {CONTACT.journalEmail}
          </a>
        </p>
      </Section>

      <Section id="sablon" eyebrow="Şablon və bələdçi" title="Nə ilə başlamaq lazımdır?">
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <a
            href={JOURNAL.links.template}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-3 rounded-xl border border-[#EAE7F7] bg-[#FAF9FF] px-4 py-3.5 text-[12px] font-bold text-ink transition-colors hover:border-brand-200 hover:text-brand-700"
          >
            <span className="inline-flex items-center gap-2">
              <Download size={14} className="text-brand-600" /> Şablonu yüklə
            </span>
            <ArrowUpRight size={13} className="text-brand-500" />
          </a>
          <a
            href={JOURNAL.links.template}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-3 rounded-xl border border-[#EAE7F7] bg-[#FAF9FF] px-4 py-3.5 text-[12px] font-bold text-ink transition-colors hover:border-brand-200 hover:text-brand-700"
          >
            <span className="inline-flex items-center gap-2">
              <FileText size={14} className="text-brand-600" /> Müəllif bələdçisi
            </span>
            <ArrowUpRight size={13} className="text-brand-500" />
          </a>
          <Link
            href="/resurslar#beledciler"
            className="group flex items-center justify-between gap-3 rounded-xl border border-[#EAE7F7] bg-[#FAF9FF] px-4 py-3.5 text-[12px] font-bold text-ink transition-colors hover:border-brand-200 hover:text-brand-700"
          >
            <span className="inline-flex items-center gap-2">
              <BookOpen size={14} className="text-brand-600" /> Elmi yazı bələdçisi
            </span>
            <ArrowUpRight size={13} className="text-brand-500" />
          </Link>
          <a
            href={mail("Şablon və bələdçi sualı — AEİK Jurnalı")}
            className="group flex items-center justify-between gap-3 rounded-xl border border-[#EAE7F7] bg-[#FAF9FF] px-4 py-3.5 text-[12px] font-bold text-ink transition-colors hover:border-brand-200 hover:text-brand-700"
          >
            <span className="inline-flex items-center gap-2">
              <Mail size={14} className="text-brand-600" /> Sual ver
            </span>
            <ArrowUpRight size={13} className="text-brand-500" />
          </a>
        </div>
        <p className="mt-4 text-[11.5px] leading-relaxed text-[#6E6788]">
          Şablon və bələdçi faylları bütün müəlliflər üçün açıqdır. Uyğunluq və həcm limitləri bələdçidə göstərilib.
        </p>
      </Section>

      <Section id="teqvim" eyebrow="Nəşr təqvimi" title="2026–2027 buraxılışları." tone="tint">
        <div className="mt-8 overflow-hidden rounded-[22px] border border-[#EAE7F7]">
          <table className="w-full border-collapse text-left">
            <thead className="bg-[#FAF9FF]">
              <tr>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#7A7391]">Buraxılış</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#7A7391]">İcmal qəbulu</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#7A7391]">Nəşr tarixi</th>
              </tr>
            </thead>
            <tbody>
              {JOURNAL.calendar.map((row) => (
                <tr key={row.issue} className="border-t border-[#F1EFF8]">
                  <td className="px-4 py-3.5 text-[12.5px] font-bold text-ink">{row.issue}</td>
                  <td className="px-4 py-3.5 text-[12px] text-[#5A5270]">{row.submission}</td>
                  <td className="px-4 py-3.5 text-[12px] font-semibold text-ink">{row.publish}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-[#EAE7F7] bg-[#FAF9FF] p-4 text-[12px] text-[#5A5270] sm:flex-row sm:items-center sm:justify-between">
          <p className="inline-flex items-start gap-2">
            <CalendarDays size={14} className="mt-0.5 shrink-0 text-brand-600" /> {JOURNAL.note}
          </p>
          <a
            href={JOURNAL.links.plan}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 text-[11.5px] font-bold text-brand-600 hover:text-brand-700"
          >
            Fəaliyyət planı <ArrowUpRight size={12} />
          </a>
        </div>
      </Section>

      <Section id="reyci" eyebrow="Rəyçi ol" title="Rəy prosesi necə işləyir?" tone="tint">
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { title: "Sahə redaktoru", text: "Hər icmal əvvəlcə sahə redaktoru tərəfindən yoxlanılır və uyğunluq qiymətləndirilir." },
            { title: "Rəy və düzəliş", text: "Lazım olduqda müəllifə e-poçtla düzəliş qeydləri göndərilir." },
            { title: "Baş redaktor təsdiqi", text: "Yekun təsdiqdən sonra icmal DOI ilə Zenodo-da nəşr olunur." },
          ].map((card) => (
            <article key={card.title} className="rounded-[20px] border border-[#EAE7F7] bg-white p-5">
              <p className="inline-flex items-center gap-2 text-[13px] font-bold text-ink">
                <BadgeCheck size={14} className="text-brand-600" /> {card.title}
              </p>
              <p className="mt-2 text-[12px] leading-[1.7] text-[#5E5776]">{card.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-3 rounded-[22px] border border-[#EAE7F7] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[640px] text-[12px] leading-relaxed text-[#5A5270]">
            Kimya, fizika və ya biologiya sahəsində tədqiqat təcrübəniz varsa, icmalları qiymətləndirmək üçün rəyçi
            komandasına qoşula bilərsiniz. Rəylər müəllifə anonim şəkildə çatdırılır.
          </p>
          <a
            href={mail("Rəyçi olmaq istəyi — AEİK Jurnalı")}
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-brand-600 px-4 text-[11.5px] font-bold text-white transition-colors hover:bg-brand-700"
          >
            <Users size={13} /> Rəyçi ol
          </a>
        </div>
      </Section>

      <PageCTA
        title="İlk icmalını yaz."
        text="Şablonu yüklə, bələdçi ilə tanış ol və icmalını jurnal@aeik.az ünvanına göndər."
        href={mail("İcmal müraciəti — AEİK Jurnalı")}
        label="İcmal göndər"
      />
    </PageShell>
  );
}
