import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ABOUT,
  ACTIVITIES,
  CTA,
  HERO,
  OUTCOMES,
  PROJECTS,
  ROADMAP,
  ROTATION,
  STATS,
} from "@/data/program";

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`text-[10px] font-bold uppercase leading-none tracking-[0.16em] text-brand-600 lg:text-[11px] ${className}`}
    >
      {children}
    </span>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-ink">
      <Navbar />

      {/* ───────────────────────── HERO ───────────────────────── */}
      <section className="bg-hero">
        <div className="mx-auto w-full max-w-[1376px] px-5 sm:px-8">
          <div className="grid grid-cols-1 items-start gap-10 pb-10 pt-8 lg:grid-cols-[minmax(0,1fr)_608px] lg:gap-16 lg:pb-3 lg:pt-8">
            <div className="max-w-[560px] lg:pt-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#EAE6FE] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-600">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
                {HERO.badge}
              </span>

              <h1 className="mt-6 text-[40px] font-extrabold leading-[1.08] tracking-[-0.035em] text-ink sm:text-[52px] lg:mt-8 lg:text-[64px]">
                {HERO.title[0]}
                <br />
                {HERO.title[1]}
              </h1>

              <p className="mt-7 max-w-[460px] text-[14px] leading-[1.75] text-[#4E4768] sm:text-[15px]">
                {HERO.text}
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-3 lg:mt-11">
                <Link
                  href={HERO.primary.href}
                  className="group inline-flex h-[52px] items-center gap-2 rounded-full bg-brand-600 px-7 text-[13px] font-bold text-white transition-colors hover:bg-brand-700"
                >
                  {HERO.primary.label}
                  <ArrowUpRight size={16} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <Link
                  href={HERO.secondary.href}
                  className="group inline-flex h-[52px] items-center gap-2 rounded-full border border-[#E4E0F2] bg-white px-7 text-[13px] font-bold text-ink transition-colors hover:border-brand-200"
                >
                  {HERO.secondary.label}
                  <ArrowRight size={16} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            <div className="relative aspect-[608/571] w-full overflow-hidden rounded-[24px] bg-[#E3E1EE] lg:rounded-[28px]">
              <Image
                src="/assets/pages/hero-card.jpg"
                alt="Elm və innovasiya proqramının simvolu"
                fill
                sizes="(max-width: 1024px) 100vw, 608px"
                className="object-cover"
                priority
              />
              <div className="absolute left-[4%] top-[7%] flex items-center gap-2 rounded-full bg-white/85 px-3.5 py-2 text-[8px] font-bold uppercase tracking-[0.14em] text-ink backdrop-blur lg:left-[4.5%] lg:px-4 lg:text-[9px]">
                <span>{HERO.cardBadge[0]}</span>
                <span className="text-brand-600/40">/</span>
                <span className="text-brand-600">{HERO.cardBadge[1]}</span>
              </div>
              <div className="absolute bottom-[3%] right-[4%] w-[56%] rounded-[14px] bg-white/45 p-3.5 backdrop-blur-md lg:rounded-[16px] lg:p-5">
                <p className="text-[7px] font-bold uppercase tracking-[0.16em] text-brand-600 lg:text-[9px]">
                  {HERO.cardCaption.eyebrow}
                </p>
                <p className="mt-1.5 text-[11px] font-semibold leading-snug tracking-[-0.01em] text-ink lg:text-[15px]">
                  {HERO.cardCaption.title}
                </p>
              </div>
            </div>
          </div>

          <div className="pb-10 lg:pb-12">
            <div className="h-px w-full bg-[#DEDAF0]" />
            <div className="mt-[18px] flex flex-col gap-2 text-[9px] font-bold uppercase tracking-[0.14em] text-[#4E4768] sm:flex-row sm:items-center sm:justify-between lg:text-[10px]">
              <span>{HERO.period}</span>
              <span className="hidden sm:block">{HERO.motto}</span>
              <a href="#haqqimizda" className="inline-flex items-center gap-1.5 transition-colors hover:text-brand-600">
                {HERO.scroll}
                <ArrowDown size={13} strokeWidth={2.5} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── STATS ───────────────────────── */}
      <section className="bg-white">
        <div className="mx-auto w-full max-w-[1376px] px-5 sm:px-8">
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 py-9 sm:grid-cols-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-x-0 lg:py-10">
            <p className="col-span-2 text-[9px] font-bold uppercase leading-[1.9] tracking-[0.14em] text-[#4E4768] sm:col-span-1 lg:text-[10px]">
              Bir proqram.
              <br />
              Yeni imkanlar.
            </p>
            {STATS.map((stat) => (
              <div key={stat.label} className="lg:border-l lg:border-[#E9E6F4] lg:pl-8">
                <div className="text-[32px] font-extrabold leading-none tracking-[-0.03em] text-ink lg:text-[40px]">
                  {stat.value}
                </div>
                <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.12em] text-[#7A7391] lg:text-[10px]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── ABOUT ───────────────────────── */}
      <section id="haqqimizda" className="scroll-mt-24 bg-white pb-16 pt-10 lg:pb-24 lg:pt-16">
        <div className="mx-auto w-full max-w-[1376px] px-5 sm:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[587px_minmax(0,1fr)] lg:gap-[70px]">
            <div className="relative aspect-[2348/1620] w-full overflow-hidden rounded-[24px] bg-[#E9EDF2] lg:rounded-[28px]">
              <Image
                src="/assets/pages/about-lab.jpg"
                alt="Laboratoriyada elmi tədqiqat"
                fill
                sizes="(max-width: 1024px) 100vw, 587px"
                className="object-cover"
              />
              <div className="absolute bottom-[4%] left-[4%] flex h-[20.5%] w-[57.5%] items-center gap-[5%] rounded-[12px] bg-white pl-[3%] pr-[2%] shadow-[0_10px_26px_rgba(32,26,63,0.10)] lg:rounded-[14px]">
                <div className="relative h-[86%] w-auto shrink-0 aspect-square">
                  <Image src="/assets/pages/emblem.png" alt="" fill sizes="80px" className="object-contain" />
                </div>
                <div>
                  <p className="text-[9px] font-extrabold uppercase leading-tight tracking-[0.06em] text-[#3E3171] lg:text-[11px]">
                    {ABOUT.badge.title}
                  </p>
                  <p className="mt-1 text-[8px] leading-tight text-[#7A7391] lg:text-[9px]">
                    {ABOUT.badge.text}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Label>{ABOUT.label}</Label>
              <h2 className="mt-4 text-[28px] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[36px] lg:text-[42px]">
                {ABOUT.title[0]}
                <br />
                {ABOUT.title[1]}
              </h2>
              <p className="mt-5 max-w-[560px] text-[13px] leading-[1.75] text-[#5A5270] lg:text-[14px]">
                {ABOUT.text}
              </p>

              <ul className="mt-7 space-y-3">
                {ABOUT.points.map((point, index) => (
                  <li key={point} className="flex items-center gap-3">
                    <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[7px] border border-[#E4E0F2] text-[9px] font-bold text-brand-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[12.5px] font-medium text-ink lg:text-[13.5px]">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── PROJECTS ───────────────────────── */}
      <section id="layiheler" className="scroll-mt-24 bg-canvas py-16 lg:py-24">
        <div className="mx-auto w-full max-w-[1376px] px-5 sm:px-8">
          <Label>{PROJECTS.label}</Label>
          <h2 className="mt-4 text-[28px] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[36px] lg:text-[44px]">
            {PROJECTS.title}
          </h2>
          <p className="mt-3 max-w-[620px] text-[13px] leading-relaxed text-[#5A5270] lg:text-[14px]">
            {PROJECTS.text}
          </p>

          <div className="mt-9 grid grid-cols-1 gap-5 md:grid-cols-2 lg:mt-10 lg:gap-6">
            {PROJECTS.items.map((project) =>
              project.pending ? (
                <article
                  key={project.id}
                  className="flex flex-col rounded-[20px] bg-[#EDEBF5] p-5 lg:rounded-[24px] lg:p-7"
                >
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#7A7391]">
                    {project.eyebrow}
                  </p>
                  <h3 className="mt-3 text-[19px] font-extrabold leading-[1.2] tracking-[-0.02em] text-ink lg:text-[24px]">
                    {project.title}
                  </h3>
                  <p className="mt-3 max-w-[92%] text-[12.5px] leading-[1.75] text-[#5E5776]">
                    {project.text}
                  </p>
                </article>
              ) : (
                <article
                  key={project.id}
                  className="group flex flex-col rounded-[20px] bg-white p-3 shadow-[0_2px_16px_rgba(32,26,63,0.04)] lg:rounded-[24px]"
                >
                  <div className="relative aspect-[2500/812] w-full overflow-hidden rounded-[14px] bg-[#101828]">
                    <Image
                      src={project.image as string}
                      alt={project.title as string}
                      fill
                      sizes="(max-width: 768px) 100vw, 620px"
                      className="object-cover"
                    />
                    <span className="absolute left-[1.5%] top-[12%] flex h-[20%] w-[34%] items-center justify-center rounded-full bg-white text-[9px] font-semibold text-brand-600 lg:text-[12px]">
                      {project.pill}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col px-2 pb-1 pt-5 lg:px-4 lg:pt-6">
                    <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-brand-600 lg:text-[9px]">
                      {project.eyebrow}
                    </p>
                    <h3 className="mt-2 max-w-[92%] text-[19px] font-extrabold leading-[1.18] tracking-[-0.02em] text-ink lg:text-[25px]">
                      {project.title}
                    </h3>
                    <p className="mt-3 max-w-[95%] text-[12px] leading-[1.75] text-[#5A5270] lg:text-[13px]">
                      {project.text}
                    </p>

                    <div className="mt-5">
                      <p className="text-[11px] font-semibold text-ink lg:text-[12px]">{project.meta}</p>
                      <p className="mt-1 text-[10px] text-[#8A83A0] lg:text-[11px]">{project.note}</p>
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t border-[#F1EFF8] pt-4 lg:pt-5">
                      <span className="text-[11px] font-bold text-brand-600 lg:text-[12px]">
                        {project.link}
                      </span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EFECFE] text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white lg:h-9 lg:w-9">
                        <ArrowUpRight size={15} strokeWidth={2.5} />
                      </span>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>

          <p className="mt-6 text-[10px] leading-relaxed text-[#8A83A0] lg:text-[11px]">
            {PROJECTS.footnote}
          </p>
        </div>
      </section>

      {/* ───────────────────────── OUTCOMES ───────────────────────── */}
      <section className="bg-gradient-to-r from-[#3B2F6B] via-[#3F3273] to-[#4B3B7E] text-white">
        <div className="mx-auto w-full max-w-[1376px] px-5 py-14 sm:px-8 lg:py-20">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#B9ABEE] lg:text-[11px]">
            {OUTCOMES.label}
          </span>
          <h2 className="mt-4 text-[28px] font-extrabold leading-[1.1] tracking-[-0.03em] sm:text-[36px] lg:text-[42px]">
            {OUTCOMES.title}
          </h2>
          <p className="mt-3 max-w-[560px] text-[12px] leading-relaxed text-[#CEC5EA] lg:text-[13px]">
            {OUTCOMES.text}
          </p>

          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 lg:mt-12 lg:grid-cols-4 lg:gap-x-0">
            {OUTCOMES.items.map((item) => (
              <div key={item.label} className="lg:border-l lg:border-white/15 lg:pl-8">
                <div className="text-[32px] font-extrabold leading-none tracking-[-0.03em] lg:text-[52px]">
                  {item.value}
                </div>
                <p className="mt-2 max-w-[180px] text-[9px] uppercase leading-[1.6] tracking-[0.1em] text-[#C6BCE6] lg:text-[10px]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── ACTIVITIES ───────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto w-full max-w-[1376px] px-5 sm:px-8">
          <Label>{ACTIVITIES.label}</Label>
          <h2 className="mt-4 text-[28px] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[36px] lg:text-[42px]">
            {ACTIVITIES.title}
          </h2>
          <p className="mt-3 max-w-[520px] text-[13px] leading-relaxed text-[#5A5270] lg:text-[14px]">
            {ACTIVITIES.text}
          </p>

          <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4 lg:gap-5">
            {ACTIVITIES.items.map((item) => (
              <article
                key={item.title}
                className="flex flex-col rounded-[18px] bg-[#F2F0FA] p-5 lg:rounded-[20px] lg:p-6"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[10px] font-bold text-brand-600">
                    {item.no}
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#7A7391] lg:text-[9px]">
                    {item.group}
                  </span>
                </div>
                <h3 className="mt-5 text-[19px] font-extrabold leading-[1.15] tracking-[-0.02em] text-ink lg:text-[21px]">
                  {item.title}
                </h3>
                <p className="mt-3 text-[12px] leading-[1.7] text-[#5E5776]">{item.text}</p>
                <p className="mt-auto border-t border-[#E2DEF0] pt-4 text-[10px] text-[#6E6788] lg:text-[11px]">
                  {item.audience}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-5 rounded-[18px] bg-[#F2F0FA] p-5 lg:rounded-[20px] lg:p-8">
            <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-brand-600 lg:text-[9px]">
              {ROTATION.label}
            </p>
            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-0 lg:mt-5">
              {ROTATION.groups.map((group) => (
                <div key={group.name} className="sm:border-l sm:border-[#DFDAEE] sm:pl-6 sm:first:border-l-0 sm:first:pl-0">
                  <p className="text-[13px] font-bold text-ink lg:text-[14px]">
                    {group.name}
                    <span className="ml-2 text-[#9A93AE]">•</span>
                    <span className="ml-2 font-medium text-[#4E4768]">{group.schedule}</span>
                  </p>
                  <p className="mt-2 text-[11px] text-[#7A7391] lg:text-[12px]">{group.months}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── ROADMAP ───────────────────────── */}
      <section id="fealiyyet" className="scroll-mt-24 bg-canvas py-16 lg:py-24">
        <div className="mx-auto w-full max-w-[1376px] px-5 sm:px-8">
          <Label>{ROADMAP.label}</Label>
          <h2 className="mt-4 text-[28px] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[36px] lg:text-[44px]">
            {ROADMAP.title}
          </h2>
          <p className="mt-3 max-w-[560px] text-[13px] leading-relaxed text-[#5A5270] lg:text-[14px]">
            {ROADMAP.text}
          </p>

          <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 lg:gap-5">
            {ROADMAP.months.map((month) => (
              <article
                key={month.month}
                className="flex flex-col rounded-[18px] bg-white p-5 lg:rounded-[20px] lg:p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-brand-600 lg:text-[9px]">
                    {month.month}
                  </span>
                  <span className="text-[9px] text-[#A29BB6] lg:text-[10px]">{month.year}</span>
                </div>
                <h3 className="mt-4 text-[17px] font-bold leading-[1.25] tracking-[-0.01em] text-ink lg:text-[19px]">
                  {month.title}
                </h3>
                <p className="mt-2.5 text-[11.5px] leading-[1.7] text-[#5E5776] lg:text-[12.5px]">
                  {month.text}
                </p>
                <div className="mt-auto pt-5">
                  <span className="block w-full rounded-full bg-[#EFEDF8] px-3 py-1.5 text-[9.5px] leading-snug text-[#575070] lg:text-[10.5px]">
                    {month.tag}
                  </span>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 space-y-2">
            {ROADMAP.notes.map((note) => (
              <p key={note} className="text-[10px] leading-relaxed text-[#8A83A0] lg:text-[11px]">
                {note}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── CTA ───────────────────────── */}
      <section className="bg-white py-12 lg:py-20">
        <div className="mx-auto w-full max-w-[1376px] px-5 sm:px-8">
          <div className="flex flex-col items-start gap-8 rounded-[20px] bg-[#EFEDF8] px-6 py-8 lg:flex-row lg:items-center lg:justify-between lg:rounded-[24px] lg:px-12 lg:py-12">
            <div className="max-w-[760px]">
              <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-brand-600 lg:text-[10px]">
                {CTA.label}
              </span>
              <h2 className="mt-3 text-[24px] font-extrabold leading-[1.12] tracking-[-0.03em] text-ink sm:text-[32px] lg:text-[40px]">
                {CTA.title}
              </h2>
              <p className="mt-3 text-[12px] leading-relaxed text-[#5E5776] lg:text-[13px]">
                {CTA.text}
              </p>
            </div>
            <Link
              href="#layiheler"
              className="group inline-flex h-[52px] shrink-0 items-center gap-2 rounded-full bg-brand-600 px-7 text-[13px] font-bold text-white transition-colors hover:bg-brand-700"
            >
              {CTA.button}
              <ArrowUpRight size={16} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
