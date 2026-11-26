import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Building2, Handshake, Mail, Sparkles } from "lucide-react";
import { PageCTA, PageHero, PageShell, Section } from "@/components/PageShell";
import SubmissionForm from "@/components/forms/SubmissionForm";
import { CONTACT, PARTNER_BENEFITS, PARTNER_FORMATS, PARTNER_VALUE } from "@/data/brief";

export const metadata: Metadata = {
  title: "Tərəfdaşlar",
  description:
    "AEİK ilə əməkdaşlıq: tədbir tərəfdaşlığı, təhsil proqramları, tələbə məsələləri və mentorluq. Tərəfdaşlıq formatları və sorğu forması.",
  alternates: { canonical: "/terefdaslar" },
};

export default function PartnersPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Tərəfdaşlar"
        title={
          <>
            Elmə investisiya —
            <br />
            <span className="text-gradient">gələcəyə investisiya.</span>
          </>
        }
        text="AEİK universitet, şirkət və dövlət qurumları ilə birlikdə gənc tədqiqatçılar üçün real imkanlar yaradır. Tərəfdaşlıq formatları şəffafdır, sponsorluq məbləğləri saytda göstərilmir."
      >
        <div className="mt-7 flex flex-wrap gap-2.5">
          <Link
            href="#sorgu"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-600 px-5 text-[12px] font-bold text-white transition-colors hover:bg-brand-700"
          >
            <Handshake size={14} /> Əməkdaşlıq təklif et
          </Link>
          <a
            href={`mailto:${CONTACT.email}?subject=%C6%8Fm%C9%99kda%C5%9Fl%C4%B1q%20t%C9%99klifi`}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/80 bg-white/85 px-5 text-[12px] font-bold text-ink backdrop-blur transition-colors hover:border-brand-200 hover:text-brand-700"
          >
            <Mail size={14} /> {CONTACT.email}
          </a>
        </div>
      </PageHero>

      <Section id="niye" eyebrow="Niyə AEİK-ə dəstək" title="Rəqəmlərlə elmi gənclik.">
        <div className="mt-7 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {PARTNER_VALUE.map((block) => (
            <article key={block.title} className="flex h-full flex-col rounded-[22px] border border-[#EAE7F7] bg-[#FAF9FF] p-5">
              <h3 className="text-[15px] font-extrabold leading-snug text-ink">{block.title}</h3>
              <p className="mt-2.5 text-[12px] leading-[1.75] text-[#5E5776]">{block.text}</p>
              {block.sources && (
                <div className="mt-auto flex flex-wrap gap-2 pt-4">
                  {block.sources.map((source) => (
                    <a
                      key={source.href}
                      href={source.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-[#E4E0F2] bg-white px-2.5 py-1 text-[10px] font-semibold text-brand-700 transition-colors hover:border-brand-300"
                    >
                      {source.label} <ArrowUpRight size={10} />
                    </a>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
        <p className="mt-4 text-[11px] leading-relaxed text-[#8A83A0]">
          Rəqəmlər brifdə göstərilən mənbələrə əsaslanır və dərc olunmazdan əvvəl ən son statistika ilə yoxlanmalıdır.
        </p>
      </Section>

      <Section id="fayda" eyebrow="Tərəfdaş nə qazanır" title="Beş konkret fayda." tone="tint">
        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {PARTNER_BENEFITS.map((benefit, index) => (
            <article key={benefit.title} className="flex h-full flex-col rounded-[20px] border border-[#EAE7F7] bg-white p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F1EEFE] text-[10px] font-extrabold text-brand-700">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-[13.5px] font-extrabold leading-snug text-ink">{benefit.title}</h3>
              <p className="mt-2 text-[11.5px] leading-[1.7] text-[#5E5776]">{benefit.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="formatlar" eyebrow="Əməkdaşlıq formatları" title="Necə birlikdə işləyə bilərik?">
        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PARTNER_FORMATS.map((format) => (
            <article key={format.title} className="rounded-[20px] border border-[#EFEDF8] bg-[#FAF9FF] p-5">
              <p className="inline-flex items-center gap-2 text-[14px] font-extrabold text-ink">
                <Sparkles size={14} className="text-brand-600" /> {format.title}
              </p>
              <p className="mt-2 text-[12px] leading-[1.75] text-[#5E5776]">{format.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="logolar" eyebrow="Tərəfdaşlarımız" title="Birlikdə qurduğumuz şəbəkə." tone="tint">
        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article className="flex flex-col items-center justify-center rounded-[20px] border border-[#EAE7F7] bg-white p-6 text-center">
            <div className="relative h-16 w-full">
              <Image
                src="/assets/partner-bir-telebe.jpg"
                alt="Bir Könüllü Tələbələrin Əməkdaşlığı İctimai Birliyi"
                fill
                sizes="220px"
                className="object-contain"
              />
            </div>
            <p className="mt-4 text-[11.5px] font-bold leading-snug text-ink">
              Bir Könüllü Tələbələrin Əməkdaşlığı İctimai Birliyi
            </p>
            <p className="mt-1 text-[10.5px] text-[#8A83A0]">Təsisçi təşkilat</p>
          </article>

          <article className="flex flex-col items-start justify-center rounded-[20px] border border-[#EAE7F7] bg-white p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1EEFE] text-brand-600">
              <Building2 size={18} />
            </span>
            <p className="mt-3 text-[12.5px] font-bold leading-snug text-ink">Universitetlər və elmi müəssisələr</p>
            <p className="mt-1 text-[11px] leading-relaxed text-[#6E6788]">Birgə tədbir, mentorluq və tədqiqat əməkdaşlığı.</p>
          </article>

          <article className="flex flex-col items-start justify-center rounded-[20px] border border-[#EAE7F7] bg-white p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1EEFE] text-brand-600">
              <Handshake size={18} />
            </span>
            <p className="mt-3 text-[12.5px] font-bold leading-snug text-ink">Şirkətlər və startap ekosistemi</p>
            <p className="mt-1 text-[11px] leading-relaxed text-[#6E6788]">Case, mentorluq, akselerator və Demo Day.</p>
          </article>

          <Link
            href="#sorgu"
            className="group flex flex-col items-start justify-center rounded-[20px] border border-dashed border-brand-300 bg-white p-6 transition-colors hover:bg-[#FBFAFF]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
              <ArrowUpRight size={18} />
            </span>
            <p className="mt-3 text-[12.5px] font-bold leading-snug text-ink">Növbəti tərəfdaş siz olun</p>
            <p className="mt-1 text-[11px] leading-relaxed text-[#6E6788]">Sorğu formunu doldurun, 3 iş günü içində cavab veririk.</p>
          </Link>
        </div>
      </Section>

      <Section id="sorgu" eyebrow="Sorğu forması" title="Əməkdaşlıq təklifi">
        <div className="mt-6 max-w-[820px]">
          <SubmissionForm
            kind="partner"
            fields={[
              { name: "organization", label: "Təşkilat / şirkət", required: true, placeholder: "Adı" },
              { name: "name", label: "Əlaqə şəxsi", required: true, placeholder: "Ad və soyad" },
              { name: "email", label: "E-poçt", type: "email", required: true, placeholder: "ad@sirket.az" },
              { name: "phone", label: "Telefon", type: "tel", placeholder: "+994 50 000 00 00" },
              {
                name: "format",
                label: "Maraqlandığınız format",
                type: "select",
                required: true,
                options: PARTNER_FORMATS.map((format) => format.title),
              },
              {
                name: "message",
                label: "Təklifin qısa təsviri",
                type: "textarea",
                required: true,
                placeholder: "Nə etmək istəyirsiniz, hansı resurs və ya ekspertizanı təklif edirsiniz",
              },
            ]}
            consent="Məlumatlarımın əməkdaşlıq sorğusu üçün işlənməsinə razıyam."
            submitLabel="Sorğunu göndər"
            successMessage="Sorğunuz qeydə alındı. Komanda 3 iş günü ərzində sizinlə əlaqə saxlayacaq."
          />
          <p className="mt-3 text-[11px] leading-relaxed text-[#8A83A0]">
            Sponsorluq məbləğləri saytda göstərilmir; bütün şərtlər fərdi qaydada razılaşdırılır.
          </p>
        </div>
      </Section>

      <PageCTA
        title="Tələbələr üçün real məsələ."
        text="Şirkətinizin real problemi üzərində tələbə komandaları işləsin — nəticələri birlikdə təqdim edək."
        href={`mailto:${CONTACT.email}?subject=Case%20t%C9%99klifi`}
        label="Case təklif et"
      />
    </PageShell>
  );
}
