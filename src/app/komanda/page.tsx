import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Camera, FileText, Linkedin, Mail, PenLine, Users } from "lucide-react";
import { PageCTA, PageHero, PageShell, Section } from "@/components/PageShell";
import { CONTACT, TEAM_FORMAT } from "@/data/brief";

export const metadata: Metadata = {
  title: "Komanda",
  description:
    "AEİK komandası: vahid profil formatı, açıq rollar (könüllü, mentor, rəyçi) və komandaya qoşulma qaydaları.",
  alternates: { canonical: "/komanda" },
};

const LEADERSHIP = [
  {
    name: "Nərhiz Hacıllı",
    role: "Layihə rəhbəri",
    project: "Bakı və Region Gənclərinin II Elmi Konfransı",
    image: "/assets/team/nerhiz-hacilli.jpg",
    text: "Konfransın ümumi planını, tərəfdaşlarla əlaqəni və komandalar arasında koordinasiyanı idarə edir.",
  },
  {
    name: "Gülçin Mirzayeva",
    role: "Kimya Forumu üzrə rəhbər",
    project: "Kimya Forumu",
    image: "/assets/team/gulcin-mirzayeva.jpg",
    text: "Kimya və biotexnologiya istiqamətində forum proqramını, spikerləri və iştirakçı seçimini idarə edir.",
  },
  {
    name: "Cavid Quluyev",
    role: "DNT Günü üzrə rəhbər",
    project: "DNT Günü",
    image: "/assets/team/cavid-quluyev.jpg",
    text: "Beynəlxalq DNT Günü çərçivəsində tədbir proqramını və genetika üzrə mütəxəssislərlə əlaqəni koordinasiya edir.",
  },
  {
    name: "Nərgiz İsmayılova",
    role: "DNT Günü üzrə koordinator",
    project: "DNT Günü",
    image: "/assets/team/nergiz-ismayilova.jpg",
    text: "Laboratoriya turleri, könüllü komandası və iştirakçı qeydiyyatı prosesinə cavabdehdir.",
  },
];

const ROLES = [
  {
    title: "Könüllü",
    text: "Tədbirlərin təşkili, dizayn, SMM, qeydiyyat və iştirakçılarla əlaqə.",
    cta: "Könüllü ol",
    href: "/muraciet",
  },
  {
    title: "Mentor",
    text: "Tələbə komandalarına elmi və peşəkar mentorluq, karyera görüşləri.",
    cta: "Mentor ol",
    href: "/muraciet",
  },
  {
    title: "Rəyçi",
    text: "AEİK Jurnalına göndərilən icmalların elmi qiymətləndirilməsi.",
    cta: "Rəyçi ol",
    href: `mailto:${CONTACT.journalEmail}?subject=R%C9%99y%C3%A7i%20olmaq%20ist%C9%99yi`,
  },
  {
    title: "Spiker",
    text: "Forum, Elm Kafe və master-klaslarda məruzə və ya seminar.",
    cta: "Spiker ol",
    href: `mailto:${CONTACT.email}?subject=Spiker%20t%C9%99klifi`,
  },
];

export default function TeamPage() {
  return (
    <PageShell>
      <PageHero
        back="Haqqımızda"
        backHref="/haqqimizda"
        eyebrow="Komanda"
        title="Komandanın hər üzvü eyni formatda."
        text="AEİK könüllülərdən, mentorlardan və rəyçilərdən ibarətdir. Bütün profillər vahid formatda təqdim olunur ki, iştirakçılar və tərəfdaşlar komandanı asan tanısın."
      />

      <Section eyebrow="Layihə rəhbərliyi" title="Layihələri idarə edən komanda">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LEADERSHIP.map((leader) => (
            <article
              key={leader.name}
              className="group flex flex-col overflow-hidden rounded-[22px] border border-[#EAE7F7] bg-white transition-shadow hover:premium-shadow-soft"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-[#F4F2FC]">
                <Image
                  src={leader.image}
                  alt={leader.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.1em] text-brand-700 backdrop-blur">
                  {leader.role}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="text-[13.5px] font-extrabold tracking-[-0.01em] text-ink">{leader.name}</p>
                <p className="mt-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-brand-600">
                  {leader.project}
                </p>
                <p className="mt-2 flex-1 text-[11.5px] leading-[1.75] text-[#5E5776]">{leader.text}</p>
                <a
                  href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(`${leader.name} — ${leader.project}`)}`}
                  className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-600 hover:text-brand-700"
                >
                  <Mail size={12} /> Əlaqə saxla
                </a>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-[#8A83A0]">
          <Users size={13} className="mt-0.5 shrink-0 text-brand-600" />
          Layihə rəhbərləri könüllü komandaları və mentorları koordinasiya edir. Profil məlumatlarında dəyişiklik üçün{" "}
          {CONTACT.email} ünvanına yazın.
        </p>
      </Section>

      <Section>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-12">
          <div>
            <h2 className="text-[22px] font-extrabold tracking-[-0.02em] text-ink">Profil formatı</h2>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { icon: Camera, label: "Foto", text: TEAM_FORMAT.photo },
                { icon: FileText, label: "Bio", text: TEAM_FORMAT.bio },
                { icon: Linkedin, label: "Linklər", text: TEAM_FORMAT.links },
                { icon: PenLine, label: "Razılıq", text: TEAM_FORMAT.consent },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.label} className="rounded-[20px] border border-[#EAE7F7] bg-[#FAF9FF] p-5">
                    <p className="inline-flex items-center gap-2 text-[12.5px] font-bold text-ink">
                      <Icon size={14} className="text-brand-600" /> {item.label}
                    </p>
                    <p className="mt-2 text-[11.5px] leading-[1.75] text-[#5E5776]">{item.text}</p>
                  </article>
                );
              })}
            </div>

            <div className="mt-5 rounded-[20px] border border-[#EAE7F7] bg-white p-5">
              <p className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-brand-600">Nümunə</p>
              <p className="mt-2 text-[12px] leading-[1.8] text-[#4E4768]">{TEAM_FORMAT.example}</p>
            </div>

            <p className="mt-4 flex items-start gap-2 text-[11.5px] leading-relaxed text-[#8A83A0]">
              <Mail size={13} className="mt-0.5 shrink-0 text-brand-600" />
              Profil məlumatlarını və foto faylını {CONTACT.email} ünvanına göndərin. Dərc olunmazdan əvvəl razılıq təsdiqlənir.
            </p>
          </div>

          <aside className="space-y-4">
            <div className="rounded-[22px] border border-[#EAE7F7] bg-[#FAF9FF] p-5">
              <p className="inline-flex items-center gap-2 text-[12px] font-bold text-ink">
                <Users size={14} className="text-brand-600" /> Açıq rollar
              </p>
              <div className="mt-3 space-y-3">
                {ROLES.map((role) => (
                  <div key={role.title} className="rounded-xl bg-white p-3.5">
                    <p className="text-[12.5px] font-bold text-ink">{role.title}</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-[#6E6788]">{role.text}</p>
                    <a
                      href={role.href}
                      className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-brand-600 hover:text-brand-700"
                    >
                      {role.cta} <ArrowUpRight size={11} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[22px] border border-[#EAE7F7] bg-white p-5">
              <p className="text-[12px] font-bold text-ink">10 000+ iştirakçı</p>
              <p className="mt-2 text-[11.5px] leading-relaxed text-[#5A5270]">
                Bu günədək fəaliyyətlərimizə 10 000-dən çox iştirakçı qoşulub. Komanda bu icmanın bir hissəsidir.
              </p>
              <Link href="/haqqimizda" className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-600 hover:text-brand-700">
                Haqqımızda <ArrowUpRight size={12} />
              </Link>
            </div>
          </aside>
        </div>
      </Section>

      <PageCTA
        title="Komandada yer var."
        text="Könüllü, mentor və ya rəyçi kimi qoşulmaq üçün müraciət edin."
        href="/muraciet"
        label="Müraciət et"
      />
    </PageShell>
  );
}
