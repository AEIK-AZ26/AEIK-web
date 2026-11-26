import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-ink">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  text,
  back,
  backHref = "/",
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  text?: string;
  back?: string;
  backHref?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="hero-mesh relative -mt-[64px] overflow-hidden pt-[64px] lg:-mt-[76px] lg:pt-[76px]">
      <div className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-brand-300/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 -top-10 h-72 w-72 rounded-full bg-[#9C8AF8]/20 blur-3xl" />
      <div className="relative mx-auto w-full max-w-[1320px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        {back && (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-brand-700 transition-colors hover:text-brand-800"
          >
            <ArrowLeft size={13} /> {back}
          </Link>
        )}
        <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
          {eyebrow}
        </span>
        <h1 className="mt-4 max-w-[860px] text-[30px] font-extrabold leading-[1.06] tracking-[-0.04em] text-ink sm:text-[42px] lg:text-[52px]">
          {title}
        </h1>
        {text && (
          <p className="mt-4 max-w-[720px] text-[13px] leading-[1.8] text-[#4E4768] sm:text-[15px]">{text}</p>
        )}
        {children}
      </div>
    </section>
  );
}

export function Section({
  id,
  eyebrow,
  title,
  text,
  children,
  tone = "light",
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  title?: React.ReactNode;
  text?: string;
  children?: React.ReactNode;
  tone?: "light" | "tint";
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-28 py-14 lg:py-20 ${tone === "tint" ? "bg-[#FAF9FF]" : "bg-white"} ${className}`}
    >
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
        {(eyebrow || title || text) && (
          <div className="max-w-2xl">
            {eyebrow && (
              <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase leading-none tracking-[0.18em] text-brand-600 lg:text-[11px]">
                <span className="h-1 w-1 rounded-full bg-brand-600" />
                {eyebrow}
              </span>
            )}
            {title && (
              <h2 className="mt-4 text-[26px] font-extrabold leading-[1.1] tracking-[-0.035em] text-ink sm:text-[34px] lg:text-[40px]">
                {title}
              </h2>
            )}
            {text && <p className="mt-3 text-[13px] leading-[1.8] text-[#5A5270] sm:text-[14px]">{text}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export function PageCTA({
  title = "Növbəti addımı birlikdə ataq.",
  text = "Sualınız var, yoxsa komandaya qoşulmaq istəyirsiniz? Bizimlə əlaqə saxlayın.",
  href = "/muraciet",
  label = "Müraciət et",
}: {
  title?: string;
  text?: string;
  href?: string;
  label?: string;
}) {
  return (
    <section className="bg-white pb-14 lg:pb-20">
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#F1EEFE] via-[#EBE6FE] to-[#E4DDFD] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
          <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/50 blur-3xl" />
          <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-[720px]">
              <h2 className="text-[24px] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[30px] lg:text-[36px]">
                {title}
              </h2>
              <p className="mt-3 text-[12.5px] leading-relaxed text-[#5E5776] lg:text-[13.5px]">{text}</p>
            </div>
            <Link
              href={href}
              className="group inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-ink px-6 text-[12.5px] font-bold text-white transition-colors hover:bg-[#2E2552]"
            >
              {label}
              <ArrowUpRight size={16} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function StatusBadge({ tone, children }: { tone: "open" | "soon" | "closed" | "info"; children: React.ReactNode }) {
  const styles =
    tone === "open"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : tone === "closed"
      ? "border-slate-200 bg-slate-100 text-slate-600"
      : tone === "info"
      ? "border-brand-200 bg-brand-50 text-brand-700"
      : "border-amber-200 bg-amber-50 text-amber-700";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.1em] ${styles}`}>
      {children}
    </span>
  );
}
