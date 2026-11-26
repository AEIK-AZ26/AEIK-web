import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpen, CheckCircle2, FileText, Users } from "lucide-react";
import { PageCTA, PageHero, PageShell, Section } from "@/components/PageShell";
import { ABOUT, CONTACT } from "@/data/brief";

export const metadata: Metadata = {
  title: "Haqqımızda",
  description:
    "AEİK — Azərbaycan Elm və İnnovasiya Könüllüləri: missiya, status, fəaliyyət formatları, dəyərlər, 10 000+ iştirakçı və hesabatlar.",
  alternates: { canonical: "/haqqimizda" },
};

export default function AboutPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Haqqımızda"
        title={
          <>
            Bilikdə başlayan,
            <br />
            <span className="text-gradient">birlikdə böyüyən gələcək.</span>
          </>
        }
        text={ABOUT.intro}
      >
        <div className="mt-7 flex flex-wrap gap-2.5">
          <Link
            href="/muraciet"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-600 px-5 text-[12px] font-bold text-white transition-colors hover:bg-brand-700"
          >
            <Users size={14} /> Könüllü / mentor ol
          </Link>
          <Link
            href="/komanda"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/80 bg-white/85 px-5 text-[12px] font-bold text-ink backdrop-blur transition-colors hover:border-brand-200 hover:text-brand-700"
          >
            Komanda <ArrowUpRight size={13} />
          </Link>
        </div>
      </PageHero>

      <Section id="missiya" eyebrow="Missiya və status">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:gap-12">
          <div>
            <div className="space-y-4">
              {ABOUT.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)} className="text-[13.5px] leading-[1.9] text-[#4E4768]">
                  {paragraph}
                </p>
              ))}
            </div>

            <h2 className="mt-9 text-[20px] font-extrabold tracking-[-0.02em] text-ink">Nə edirik</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {ABOUT.what.map((block) => (
                <article key={block.title} className="rounded-[20px] border border-[#EFEDF8] bg-[#FAF9FF] p-4">
                  <p className="text-[12.5px] font-bold text-ink">{block.title}</p>
                  <p className="mt-1.5 text-[11.5px] leading-[1.7] text-[#5E5776]">{block.text}</p>
                </article>
              ))}
            </div>

            <h2 className="mt-9 text-[20px] font-extrabold tracking-[-0.02em] text-ink">Dəyərlərimiz</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {ABOUT.values.map((value) => (
                <span
                  key={value}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E0F2] bg-white px-3 py-1.5 text-[11.5px] font-semibold text-ink"
                >
                  <CheckCircle2 size={12} className="text-brand-600" /> {value}
                </span>
              ))}
            </div>
            <p className="mt-4 text-[13px] font-extrabold italic tracking-[-0.01em] text-brand-700">
              Araşdırırıq. Yaradırıq. Dəyişirik.
            </p>
          </div>

          <aside className="space-y-4">
            <div className="rounded-[22px] border border-[#EAE7F7] bg-[#FAF9FF] p-5">
              <p className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-brand-600">Status</p>
              <p className="mt-2 text-[12.5px] font-semibold leading-relaxed text-ink">{CONTACT.status}.</p>
              <p className="mt-3 text-[11.5px] leading-relaxed text-[#6E6788]">
                AEİK "Bir Könüllü" Tələbələrin Əməkdaşlığı İctimai Birliyinin Elm və İnnovasiya proqramının tərkib layihəsidir.
              </p>
            </div>

            <div className="rounded-[22px] border border-[#EAE7F7] bg-white p-5">
              <p className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-brand-600">Əlaqə</p>
              <ul className="mt-3 space-y-2 text-[12px] font-semibold text-ink">
                <li>
                  <a href={`mailto:${CONTACT.email}`} className="hover:text-brand-600">
                    {CONTACT.email}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${CONTACT.journalEmail}`} className="hover:text-brand-600">
                    {CONTACT.journalEmail}
                  </a>
                </li>
                <li>
                  <a href={CONTACT.phoneHref} className="hover:text-brand-600">
                    {CONTACT.phone}
                  </a>
                </li>
              </ul>
              <Link href="/elaqe" className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-600 hover:text-brand-700">
                Əlaqə səhifəsi <ArrowUpRight size={12} />
              </Link>
            </div>
          </aside>
        </div>
      </Section>

      <Section id="komanda" eyebrow="Komanda" title="Komanda kimlərdən ibarətdir?" tone="tint">
        <p className="mt-3 max-w-[760px] text-[13px] leading-[1.8] text-[#5A5270]">
          AEİK könüllülər, mentorlar və rəyçilərdən ibarət komanda ilə işləyir. Hər istiqamətin öz məsuliyyət dairəsi var:
          tədbirlərin planlaşdırılması, jurnalın redaksiya prosesi, dizayn və media, iştirakçılarla əlaqə.
        </p>
        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Koordinasiya və idarəetmə", text: "Proqramın illik planı, tərəfdaşlarla əlaqə və komandalar arasında koordinasiya." },
            { title: "Tədbirlər komandası", text: "Forum, konfrans, master-klas və Elm Kafe formatlarının hazırlanması və keçirilməsi." },
            { title: "Jurnal redaksiyası", text: "İcmalların qəbulu, sahə redaktorlarının seçimi və rəy prosesinin idarə olunması." },
            { title: "Dizayn, SMM və media", text: "Afişa, sertifikat və sosial media materialları, foto-video və media sorğuları." },
          ].map((block) => (
            <article key={block.title} className="flex h-full flex-col rounded-[20px] border border-[#EAE7F7] bg-white p-5">
              <p className="text-[12.5px] font-bold leading-snug text-ink">{block.title}</p>
              <p className="mt-2 text-[11.5px] leading-[1.7] text-[#5E5776]">{block.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-5 flex flex-col gap-4 rounded-[22px] border border-[#EAE7F7] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[640px] text-[12px] leading-relaxed text-[#5A5270]">
            Komanda üzvlərinin profilləri vahid formatda dərc olunur: foto, qısa bio və LinkedIn/ORCID linki. Profil yalnız
            üzvün yazılı razılığı ilə saytda göstərilir.
          </p>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Link
              href="/komanda"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-600 px-4 text-[11.5px] font-bold text-white transition-colors hover:bg-brand-700"
            >
              <Users size={13} /> Komanda səhifəsi
            </Link>
            <Link
              href="/muraciet"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-[#E4E0F2] px-4 text-[11.5px] font-bold text-ink transition-colors hover:border-brand-200 hover:text-brand-700"
            >
              Komandaya qoşul
            </Link>
          </div>
        </div>
      </Section>

      <Section id="gosterici" eyebrow="Göstəricilər" title="10 000+ iştirakçı.">
        <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { value: "10 000+", label: "Fəaliyyətlərə qoşulan iştirakçı" },
            { value: "4", label: "Davamlı fəaliyyət formatı" },
            { value: "11", label: "Tədbir və layihə formatı" },
            { value: "3", label: "Jurnal istiqaməti" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-[20px] border border-[#EAE7F7] bg-white p-5">
              <p className="text-[28px] font-extrabold leading-none tracking-[-0.035em] text-ink">{stat.value}</p>
              <p className="mt-2 text-[9.5px] font-bold uppercase leading-[1.6] tracking-[0.1em] text-[#7A7391]">{stat.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[11px] text-[#8A83A0]">
          İştirakçı sayı brifdə göstərilən rəqəmə əsaslanır; digər göstəricilər cari proqramın format sayıdır.
        </p>
      </Section>

      <Section id="hesabatlar" eyebrow="Hesabatlar" title="Şəffaflıq." tone="tint">
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <article className="rounded-[22px] border border-[#EAE7F7] bg-[#FAF9FF] p-5">
            <p className="inline-flex items-center gap-2 text-[13px] font-bold text-ink">
              <FileText size={15} className="text-brand-600" /> İllik fəaliyyət hesabatı
            </p>
            <p className="mt-2 text-[12px] leading-[1.75] text-[#5E5776]">
              2026–2027 dövrü üzrə yekun hesabat mart 2027-də hazırlanır: tədbirlərin nəticələri, iştirakçı statistikası və
              tərəfdaşlıq göstəriciləri.
            </p>
            <p className="mt-3 inline-flex rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#8A83A0]">
              Hazırlanır
            </p>
          </article>
          <article className="rounded-[22px] border border-[#EAE7F7] bg-[#FAF9FF] p-5">
            <p className="inline-flex items-center gap-2 text-[13px] font-bold text-ink">
              <BookOpen size={15} className="text-brand-600" /> Tədbir hesabatları
            </p>
            <p className="mt-2 text-[12px] leading-[1.75] text-[#5E5776]">
              Hər tədbirdən sonra foto, video və statistika ilə qısa hesabat hazırlanır. Tərəfdaşlar üçün ayrıca KŞM
              formatında təqdim olunur.
            </p>
            <p className="mt-3 inline-flex rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#8A83A0]">
              Tədbir əsasında
            </p>
          </article>
        </div>
        <p className="mt-4 text-[11.5px] text-[#6E6788]">
          Hesabat sorğusu üçün{" "}
          <a href={`mailto:${CONTACT.email}`} className="font-bold text-brand-600 hover:text-brand-700">
            {CONTACT.email}
          </a>
          .
        </p>
      </Section>

      <PageCTA
        title="Komanda səni gözləyir."
        text="Könüllü, mentor və ya rəyçi kimi qoşul — elmi gəncliyin bir hissəsi ol."
        href="/muraciet"
        label="Müraciət et"
      />
    </PageShell>
  );
}
