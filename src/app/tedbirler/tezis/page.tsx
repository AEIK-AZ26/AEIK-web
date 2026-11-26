import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText, Info } from "lucide-react";
import { PageCTA, PageHero, PageShell, Section } from "@/components/PageShell";
import SubmissionForm from "@/components/forms/SubmissionForm";
import { CONTACT, EVENTS } from "@/data/brief";

export const metadata: Metadata = {
  title: "Tezis göndər",
  description:
    "AEİK konfrans və forumları üçün tezis qəbulu: tələblər, qiymətləndirmə meyarları və onlayn göndəriş forması.",
  alternates: { canonical: "/tedbirler/tezis" },
};

const REQUIREMENTS = [
  "Tezis Azərbaycan və ya ingilis dilində ola bilər; hər iki halda başlıq hər iki dildə verilir.",
  "Həcm: 300–500 söz (mənbələr istisna olmaqla). Arial 11, tək sətir aralığı.",
  "Struktur: mövzunun aktuallığı, məqsəd, metod, gözlənilən nəticələr.",
  "Müəllif məlumatları: ad-soyad, universitet/təşkilat, e-poçt.",
  "Şablon faylı ilə göndərilən tezislərə üstünlük verilir.",
];

const CRITERIA = [
  "Mövzunun elmi aktuallığı",
  "Metodun aydınlığı və uyğunluğu",
  "Nəticələrin əsaslandırılması",
  "Struktur və dil dəqiqliyi",
];

export default function ThesisPage() {
  const targets = EVENTS.filter((event) => event.thesis);

  return (
    <PageShell>
      <PageHero
        back="Tədbirlər"
        backHref="/tedbirler"
        eyebrow="Tezis qəbulu"
        title={
          <>
            Tədqiqatını səhnəyə çıxar.
            <br />
            <span className="text-gradient">Tezisini göndər.</span>
          </>
        }
        text="Konfrans və forumlarda iştirak tezis əsasında olur. Aşağıdaki tələbləri yoxlayın və formu doldurun — komanda 10 iş günü ərzində cavab verir."
      />

      <Section>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
          <div>
            <h2 className="text-[22px] font-extrabold tracking-[-0.02em] text-ink">Tezisə tələblər</h2>
            <ul className="mt-4 space-y-3">
              {REQUIREMENTS.map((item, index) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-[#E4E0F2] bg-[#FBFAFF] text-[9px] font-bold text-brand-600">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[12.5px] leading-relaxed text-ink">{item}</span>
                </li>
              ))}
            </ul>

            <h2 className="mt-9 text-[22px] font-extrabold tracking-[-0.02em] text-ink">Qiymətləndirmə meyarları</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {CRITERIA.map((item) => (
                <div key={item} className="rounded-xl border border-[#EFEDF8] bg-[#FAF9FF] px-4 py-3 text-[12px] font-semibold text-[#4E4768]">
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-[11.5px] leading-relaxed text-amber-800">
              <Info size={15} className="mt-0.5 shrink-0" />
              <p>
                Tezis faylı (PDF və ya DOCX) formada link kimi təqdim olunur. Fayl yükləmə mümkün olmadıqda tezisi{" "}
                <a href={`mailto:${CONTACT.email}`} className="font-bold underline">
                  {CONTACT.email}
                </a>{" "}
                ünvanına göndərin.
              </p>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-[22px] border border-[#EAE7F7] bg-[#FAF9FF] p-5">
              <p className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-brand-600">Tezis qəbul edən tədbirlər</p>
              <ul className="mt-3 space-y-3">
                {targets.map((event) => (
                  <li key={event.slug}>
                    <Link
                      href={`/tedbirler/${event.slug}`}
                      className="group flex items-start justify-between gap-2 text-[12px] font-semibold leading-snug text-ink transition-colors hover:text-brand-600"
                    >
                      {event.title}
                      <ArrowRight size={13} className="mt-0.5 shrink-0 text-brand-500" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[22px] border border-[#EAE7F7] bg-white p-5">
              <p className="inline-flex items-center gap-2 text-[12px] font-bold text-ink">
                <FileText size={14} className="text-brand-600" /> Jurnal üçün icmal
              </p>
              <p className="mt-2 text-[12px] leading-relaxed text-[#5A5270]">
                Tezis deyil, tam elmi icmal hazırlayırsınızsa AEİK Jurnalına müraciət edin.
              </p>
              <Link href="/jurnal" className="mt-3 inline-flex items-center gap-1.5 text-[11.5px] font-bold text-brand-600 hover:text-brand-700">
                Jurnal səhifəsi <ArrowRight size={12} />
              </Link>
            </div>
          </aside>
        </div>
      </Section>

      <Section eyebrow="Göndəriş" title="Tezis müraciəti" tone="tint">
        <div className="mt-6 max-w-[820px]">
          <SubmissionForm
            kind="thesis"
            fields={[
              { name: "name", label: "Ad və soyad", required: true, placeholder: "Adınız və soyadınız" },
              { name: "email", label: "E-poçt", type: "email", required: true, placeholder: "ad@example.com" },
              { name: "phone", label: "Telefon", type: "tel", placeholder: "+994 50 000 00 00" },
              { name: "organization", label: "Universitet / təşkilat", placeholder: "Müəssisənin adı" },
              {
                name: "event",
                label: "Tədbir",
                type: "select",
                required: true,
                options: targets.map((event) => event.title),
              },
              { name: "title", label: "Tezisin başlığı", required: true, wide: true, placeholder: "Tezisin tam adı" },
              {
                name: "abstract",
                label: "Tezis (300–500 söz)",
                type: "textarea",
                required: true,
                placeholder: "Mövzunun aktuallığı, məqsəd, metod və gözlənilən nəticələr",
              },
              { name: "link", label: "Fayl linki (Google Drive / OneDrive)", wide: true, placeholder: "https://..." },
            ]}
            consent="Tezisin elmi konfrans materiallarında dərc olunmasına və məlumatlarımın işlənməsinə razıyam."
            submitLabel="Tezisi göndər"
            successMessage="Tezis müraciətiniz qeydə alındı. Komanda 10 iş günü ərzində e-poçtla cavab verəcək."
          />
        </div>
      </Section>

      <PageCTA
        title="Tezis hazırlığında dəstək lazımdır?"
        text="Elmi yazı və təqdimat bacarıqları üzrə master-klaslarımızda iştirak edin."
        href="/elmi-imkanlar"
        label="Elmi imkanlar"
      />
    </PageShell>
  );
}
