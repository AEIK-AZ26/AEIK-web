import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Compass, GraduationCap, MapPin, Users } from "lucide-react";
import { PageCTA, PageHero, PageShell, Section, StatusBadge } from "@/components/PageShell";
import { OPPORTUNITIES } from "@/data/brief";

export const metadata: Metadata = {
  title: "Elmi imkanlar",
  description:
    "Laboratoriya və müəssisə xəritəsi, akademik karyera, beynəlxalq təqaüdlər, bələdçilər və mentor görüşləri — AEİK-in elmi imkanlar bölməsi.",
  alternates: { canonical: "/elmi-imkanlar" },
};

const CAREER_STEPS = [
  { title: "Bakalavr", text: "Elmi dərnəklər, məqalə saatları və ilk tezis təcrübəsi." },
  { title: "Magistr", text: "Tədqiqat mövzusunun seçimi, laboratoriya praktikası, konfrans iştirakı." },
  { title: "Doktorantura", text: "Beynəlxalq nəşr, təqaüd proqramları və elmi şəbəkə." },
  { title: "Postdok", text: "Müstəqil tədqiqat, qrant yazımı və mentorluq." },
];

export default function OpportunitiesPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Elmi imkanlar"
        title={
          <>
            Elmə gedən yolu
            <br />
            <span className="text-gradient">birlikdə qısaldırıq.</span>
          </>
        }
        text="Laboratoriya və müəssisələrin xəritəsi, akademik karyera mərhələləri, təqaüd proqramları və mentor dəstəyi — bir səhifədə."
      >
        <div className="mt-7 flex flex-wrap gap-2.5">
          <Link
            href="/resurslar"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-600 px-5 text-[12px] font-bold text-white transition-colors hover:bg-brand-700"
          >
            <BookOpen size={14} /> Bələdçilər
          </Link>
          <Link
            href="/muraciet"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/80 bg-white/85 px-5 text-[12px] font-bold text-ink backdrop-blur transition-colors hover:border-brand-200 hover:text-brand-700"
          >
            <Users size={14} /> Mentor ol
          </Link>
        </div>
      </PageHero>

      <Section id="xerite" eyebrow="Laboratoriya xəritəsi" title="Harada tədqiqat aparmaq olar?">
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="relative flex min-h-[260px] flex-col justify-center overflow-hidden rounded-[24px] border border-[#EAE7F7] bg-[linear-gradient(135deg,#F5F3FE_0%,#EFEBFF_45%,#E7E1FF_100%)] p-7">
            <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-white/60 blur-2xl" />
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-sm">
              <MapPin size={20} />
            </span>
            <h3 className="mt-4 text-[19px] font-extrabold tracking-[-0.02em] text-ink">Xəritə hazırlanır</h3>
            <p className="mt-2 max-w-[520px] text-[12.5px] leading-[1.8] text-[#4E4768]">
              Azərbaycanda elmi tədqiqat aparmaq üçün laboratoriya, elm mərkəzi və müəssisələrin xəritədə toplusu hazırlanır.
              Müəssisəniz siyahıda olmalıdırsa, bizə yazın.
            </p>
            <Link
              href="/elaqe"
              className="mt-4 inline-flex w-fit items-center gap-1.5 text-[11.5px] font-bold text-brand-700 hover:text-brand-800"
            >
              Müəssisə əlavə et <ArrowUpRight size={12} />
            </Link>
          </div>

          <div className="rounded-[24px] border border-[#EAE7F7] bg-[#FAF9FF] p-6">
            <p className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-brand-600">Xəritədə nə olacaq</p>
            <ul className="mt-4 space-y-2.5 text-[12px] leading-relaxed text-[#4E4768]">
              {[
                "Universitet laboratoriyaları və elmi-tədqiqat mərkəzləri",
                "Açıq qapı günləri və tələbə praktikası imkanları",
                "İstiqamət üzrə filtr: kimya, fizika, biologiya, mühəndislik",
                "Əlaqə və müraciət qaydaları",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section id="karyera" eyebrow="Akademik karyera" title="Dörd mərhələ, aydın yol." tone="tint">
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CAREER_STEPS.map((step, index) => (
            <article key={step.title} className="rounded-[20px] border border-[#EAE7F7] bg-white p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#EFEBFF] to-[#E1DBFF] text-[12px] font-extrabold text-brand-700">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-extrabold text-ink">
                <GraduationCap size={14} className="text-brand-600" /> {step.title}
              </h3>
              <p className="mt-2 text-[12px] leading-[1.7] text-[#5E5776]">{step.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="imkanlar" eyebrow="İmkanlar" title="Növbəti addımlar.">
        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {OPPORTUNITIES.map((item) => (
            <article key={item.title} className="flex h-full flex-col rounded-[20px] border border-[#EFEDF8] bg-[#FAF9FF] p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[14.5px] font-extrabold leading-snug text-ink">{item.title}</h3>
                <StatusBadge tone={item.status === "Hazırlanır" ? "soon" : "info"}>{item.status}</StatusBadge>
              </div>
              <p className="mt-2 text-[12px] leading-[1.75] text-[#5E5776]">{item.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-[22px] border border-[#EAE7F7] bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1EEFE] text-brand-600">
              <Compass size={18} />
            </span>
            <div>
              <p className="text-[13.5px] font-bold text-ink">Bələdçilər və şablonlar</p>
              <p className="mt-1 max-w-[520px] text-[12px] leading-relaxed text-[#5A5270]">
                Elmi yazı, APA 7 sənədləşmə, ədəbiyyat axtarışı və Elm Kafe video yazıları.
              </p>
            </div>
          </div>
          <Link
            href="/resurslar"
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-ink px-4 text-[11.5px] font-bold text-white transition-colors hover:bg-[#2E2552]"
          >
            Resurslara keç <ArrowUpRight size={13} />
          </Link>
        </div>
      </Section>

      <PageCTA
        title="Mentorluq istəyirsiniz?"
        text="Müraciət formunda maraq sahənizi qeyd edin — sizə uyğun mentor və qrupla əlaqə quraq."
        href="/muraciet"
        label="Müraciət et"
      />
    </PageShell>
  );
}
