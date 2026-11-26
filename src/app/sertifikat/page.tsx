"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Award,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Info,
  Loader2,
  Mail,
  Search,
  XCircle,
} from "lucide-react";
import { PageCTA, PageHero, PageShell, Section } from "@/components/PageShell";
import { CONTACT } from "@/data/brief";

interface Certificate {
  code: string;
  name: string;
  event: string;
  date: string;
  role: string;
  status: "valid" | "revoked";
  demo?: boolean;
}

const formatDate = (value?: string) => {
  if (!value) return "";
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return value;
  const months = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avqust", "sentyabr", "oktyabr", "noyabr", "dekabr"];
  return `${Number(match[3])} ${months[Number(match[2]) - 1]} ${match[1]}`;
};

export default function CertificatePage() {
  const [programs, setPrograms] = useState<{ slug: string; title: string; date: string }[]>([]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ found: boolean; demo: boolean; data: Certificate | null } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/certificate-programs?active=1", { cache: "no-store" })
      .then((res) => res.json().catch(() => null))
      .then((json) => {
        if (!cancelled && Array.isArray(json?.data)) setPrograms(json.data);
      })
      .catch(() => {
        /* siyahı olmadıqda yoxlama forması işləməyə davam edir */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const check = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setResult(null);
    if (!code.trim()) {
      setError("Sertifikat kodunu daxil edin.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/sertifikat?code=${encodeURIComponent(code.trim())}`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json?.error || "Yoxlama aparıla bilmədi.");
        return;
      }
      setResult({ found: Boolean(json.found), demo: Boolean(json.demo), data: json.data || null });
    } catch {
      setError("Şəbəkə xətası. Bir az sonra yenidən cəhd edin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <PageHero
        eyebrow="Sertifikat yoxlama"
        title="Sertifikatın həqiqətini yoxla."
        text="Tədbirlərdə verilən sertifikatların kodunu daxil edin. Nəticədə iştirakçının adı, tədbirin adı, tarixi və statusu göstərilir."
      />

      <Section>
        <div className="mx-auto max-w-[720px]">
          <form onSubmit={check} className="rounded-[22px] border border-[#EAE7F7] bg-white p-5 sm:p-6">
            <label htmlFor="cert-code" className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#6E6788]">
              Sertifikat kodu
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A29BB8]" />
                <input
                  id="cert-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="AEIK-2026-0001"
                  autoComplete="off"
                  className="h-12 w-full rounded-xl border border-[#E4E0F2] bg-white pl-10 pr-3.5 text-[13px] uppercase tracking-[0.05em] text-ink outline-none transition-colors placeholder:normal-case placeholder:tracking-normal placeholder:text-[#A29BB8] focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 text-[12.5px] font-bold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
              >
                {loading ? <Loader2 size={15} className="animate-spin" /> : <BadgeCheck size={15} />}
                {loading ? "Yoxlanılır..." : "Yoxla"}
              </button>
            </div>
            <p className="mt-2.5 text-[11px] leading-relaxed text-[#8A83A0]">
              Kod sertifikatın sağ aşağı küncündə və ya sizə göndərilən e-poçtda göstərilir.
            </p>
            {error && (
              <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-[11.5px] font-semibold text-amber-800">
                {error}
              </p>
            )}
          </form>

          {result && (
            <div className="mt-5">
              {result.found && result.data ? (
                <div
                  className={`overflow-hidden rounded-[22px] border p-6 ${
                    result.data.status === "valid" ? "border-emerald-200 bg-emerald-50/40" : "border-rose-200 bg-rose-50/40"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                        result.data.status === "valid" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {result.data.status === "valid" ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                    </span>
                    <div>
                      <p className="text-[14px] font-extrabold text-ink">
                        {result.data.status === "valid" ? "Sertifikat etibarlıdır" : "Sertifikat ləğv edilib"}
                      </p>
                      <p className="mt-1 text-[11.5px] text-[#5A5270]">Kod: {result.data.code}</p>
                    </div>
                  </div>

                  <dl className="mt-5 grid grid-cols-1 gap-3 border-t border-black/5 pt-4 sm:grid-cols-2">
                    {[
                      ["Ad və soyad", result.data.name],
                      ["Tədbir", result.data.event],
                      ["Rol", result.data.role],
                      ["Tarix", formatDate(result.data.date)],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#8A83A0]">{label}</dt>
                        <dd className="mt-1 text-[12.5px] font-semibold leading-relaxed text-ink">{value || "—"}</dd>
                      </div>
                    ))}
                  </dl>

                  {result.demo && (
                    <p className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[11px] leading-relaxed text-amber-800">
                      <AlertTriangle size={13} className="mt-0.5 shrink-0" />
                      Bu nəticə nümunə (demo) qeydindən gəlir; canlı sertifikat bazası hələ qoşulmayıb.
                    </p>
                  )}
                </div>
              ) : (
                <div className="rounded-[22px] border border-[#EAE7F7] bg-[#FAF9FF] p-6 text-center">
                  <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#8A83A0]">
                    <XCircle size={20} />
                  </span>
                  <p className="mt-3 text-[13.5px] font-bold text-ink">Bu kodla sertifikat tapılmadı</p>
                  <p className="mx-auto mt-1.5 max-w-[440px] text-[12px] leading-relaxed text-[#5A5270]">
                    Kodu yoxlayın və ya sertifikatın verildiyi tədbir üzrə bizimlə əlaqə saxlayın.
                  </p>
                  <a
                    href={`mailto:${CONTACT.email}?subject=Sertifikat%20yoxlamas%C4%B1%20-%20${encodeURIComponent(code)}`}
                    className="mt-4 inline-flex h-10 items-center gap-2 rounded-full border border-[#E4E0F2] bg-white px-4 text-[11.5px] font-bold text-ink transition-colors hover:border-brand-200 hover:text-brand-700"
                  >
                    <Mail size={13} /> Bizə yaz
                  </a>
                  {result.demo && (
                    <p className="mt-3 text-[10.5px] text-[#8A83A0]">
                      Demo kodlar: AEIK-2026-0001, AEIK-2026-0002
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {programs.length > 0 && (
            <div className="mt-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-600">Aktiv sertifikat proqramları</p>
              <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {programs.map((program) => (
                  <Link
                    key={program.slug}
                    href={`/sertifikat/${program.slug}`}
                    className="group flex items-start gap-3 rounded-2xl border border-[#EAE7F7] bg-white p-4 transition-colors hover:border-brand-200"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <Award size={16} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[12px] font-bold leading-snug text-ink group-hover:text-brand-700">
                        {program.title}
                      </span>
                      <span className="mt-0.5 block text-[10.5px] text-[#8A83A0]">{formatDate(program.date)}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-[#EAE7F7] bg-[#FAF9FF] p-4 text-[11.5px] leading-relaxed text-[#5A5270]">
            <Info size={15} className="mt-0.5 shrink-0 text-brand-600" />
            <div>
              <p className="font-bold text-ink">Sertifikatlar harada saxlanılır?</p>
              <p className="mt-1">
                Bütün qeydlər AEİK-in sertifikat bazasında saxlanılır. Yalnız rəsmi sertifikat kodları yoxlanıla bilər;
                şübhəli halda{" "}
                <a href={`mailto:${CONTACT.email}`} className="font-bold text-brand-600 hover:text-brand-700">
                  {CONTACT.email}
                </a>{" "}
                ünvanına müraciət edin.
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-[11.5px] text-[#6E6788]">
            <CalendarDays size={13} className="text-brand-600" />
            Tədbir sertifikatları tədbirdən sonra 10 iş günü ərzində bazaya əlavə olunur.
            <Link href="/tedbirler" className="font-bold text-brand-600 hover:text-brand-700">
              Tədbirlərə bax
            </Link>
          </div>
        </div>
      </Section>

      <PageCTA
        title="Tərəfdaş və işəgötürənsiniz?"
        text="Namizədin təqdim etdiyi sertifikatı bu səhifədə saniyələr içində yoxlaya bilərsiniz."
        href="/terefdaslar"
        label="Tərəfdaşlıq"
      />
    </PageShell>
  );
}
