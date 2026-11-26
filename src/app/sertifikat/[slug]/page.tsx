"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Award,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Download,
  FileDown,
  ImageDown,
  Loader2,
  Mail,
  ShieldCheck,
  Users,
} from "lucide-react";
import { PageCTA, PageHero, PageShell, Section } from "@/components/PageShell";
import { CONTACT } from "@/data/brief";
import {
  CertificateProgram,
  CertificateRecord,
  canvasToJpegBlob,
  certificateFileBase,
  formatCertificateDate,
  renderCertificate,
} from "@/lib/certificate";
import { certificateJpegToPdf } from "@/lib/certificatePdf";

type Status = "loading" | "ready" | "inactive" | "error";

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export default function EventCertificatePage({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug || "");

  const [status, setStatus] = useState<Status>("loading");
  const [loadError, setLoadError] = useState("");
  const [program, setProgram] = useState<CertificateProgram | null>(null);

  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [issuing, setIssuing] = useState(false);
  const [certificate, setCertificate] = useState<CertificateRecord | null>(null);
  const [preview, setPreview] = useState("");
  const [downloading, setDownloading] = useState<"jpeg" | "pdf" | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setLoadError("");
    setCertificate(null);
    setPreview("");

    fetch(`/api/certificate-programs?slug=${encodeURIComponent(slug)}`, { cache: "no-store" })
      .then(async (res) => {
        const json = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok) {
          setLoadError(json?.error || "Sertifikat səhifəsi yüklənmədi.");
          setStatus("error");
          return;
        }
        if (json?.found && json?.data) {
          setProgram(json.data);
          setStatus("ready");
        } else {
          setStatus("inactive");
        }
      })
      .catch(() => {
        if (cancelled) return;
        setLoadError("Şəbəkə xətası. Səhifəni yeniləyin.");
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const issue = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Adınızı yazın.");
      return;
    }

    setIssuing(true);
    try {
      const res = await fetch("/api/certificates/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name: name.trim() }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json?.error || "Sertifikat yaradılmadı.");
        return;
      }

      const nextProgram: CertificateProgram = json.program;
      const nextCertificate: CertificateRecord = json.certificate;
      setProgram(nextProgram);
      setCertificate(nextCertificate);
      setName(nextCertificate.name);

      const canvas = canvasRef.current;
      if (canvas) {
        await renderCertificate(canvas, nextProgram, { name: nextCertificate.name, code: nextCertificate.code });
        setPreview(canvas.toDataURL("image/jpeg", 0.93));
      }
      window.setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    } catch (err: any) {
      setError(err?.message || "Şəbəkə xətası. Yenidən cəhd edin.");
    } finally {
      setIssuing(false);
    }
  };

  const buildExportCanvas = async () => {
    if (!program || !certificate) return null;
    const canvas = document.createElement("canvas");
    await renderCertificate(canvas, program, { name: certificate.name, code: certificate.code }, { scale: 1.6 });
    return canvas;
  };

  const downloadJpeg = async () => {
    if (!certificate) return;
    setDownloading("jpeg");
    try {
      const canvas = await buildExportCanvas();
      if (!canvas) return;
      const blob = await canvasToJpegBlob(canvas, 0.96);
      if (blob) saveBlob(blob, `${certificateFileBase(certificate.name)}-sertifikat.jpg`);
    } finally {
      setDownloading(null);
    }
  };

  const downloadPdf = async () => {
    if (!certificate) return;
    setDownloading("pdf");
    try {
      const canvas = await buildExportCanvas();
      if (!canvas) return;
      const dataUrl = canvas.toDataURL("image/jpeg", 0.96);
      const blob = certificateJpegToPdf(dataUrl, canvas.width, canvas.height);
      saveBlob(blob, `${certificateFileBase(certificate.name)}-sertifikat.pdf`);
    } finally {
      setDownloading(null);
    }
  };

  if (status === "loading") {
    return (
      <PageShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto animate-spin text-brand-600" size={26} />
            <p className="mt-3 text-xs font-semibold text-slate-500">Sertifikat səhifəsi yüklənir...</p>
          </div>
        </div>
      </PageShell>
    );
  }

  if (status !== "ready" || !program) {
    const inactive = status === "inactive";
    return (
      <PageShell>
        <PageHero
          back="Sertifikat yoxlaması"
          backHref="/sertifikat"
          eyebrow="Sertifikat"
          title={inactive ? "Sertifikat hazırda aktiv deyil." : "Səhifə açıla bilmədi."}
          text={
            inactive
              ? "Bu tədbir üzrə sertifikat yükləmə səhifəsi admin tərəfindən hələ aktiv edilməyib. Tədbir komandası səhifəni açdıqdan sonra link yenidən işləyəcək."
              : loadError || "Sertifikat səhifəsini yükləmək alınmadı."
          }
        />
        <Section>
          <div className="mx-auto max-w-[720px] rounded-[22px] border border-[#EAE7F7] bg-[#FAF9FF] p-6 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-600">
              {inactive ? <ShieldCheck size={22} /> : <AlertTriangle size={22} />}
            </span>
            <p className="mt-4 text-[13.5px] font-bold text-ink">
              {inactive ? "Səhifə deaktivdir" : "Xəta baş verdi"}
            </p>
            <p className="mx-auto mt-2 max-w-[460px] text-[12px] leading-relaxed text-[#5A5270]">
              Sualınız varsa bizimlə əlaqə saxlayın:{" "}
              <a href={`mailto:${CONTACT.email}`} className="font-bold text-brand-600 hover:text-brand-700">
                {CONTACT.email}
              </a>
            </p>
            <Link
              href="/sertifikat"
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-full border border-[#E4E0F2] bg-white px-4 text-[11.5px] font-bold text-ink transition-colors hover:border-brand-200 hover:text-brand-700"
            >
              <ArrowLeft size={13} /> Sertifikat yoxlamasına qayıt
            </Link>
          </div>
        </Section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHero
        back="Bütün sertifikatlar"
        backHref="/sertifikat"
        eyebrow="Sertifikatını yüklə"
        title={program.title}
        text="Yalnız adınızı yazın — sertifikat avtomatik hazırlanacaq. Sonra JPEG və ya PDF kimi yükləyə bilərsiniz."
      >
        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          {program.date && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/85 px-3 py-1.5 text-[10.5px] font-bold text-ink backdrop-blur">
              <CalendarDays size={12} className="text-brand-600" /> {formatCertificateDate(program.date)}
            </span>
          )}
          {program.guests.length > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/85 px-3 py-1.5 text-[10.5px] font-bold text-ink backdrop-blur">
              <Users size={12} className="text-brand-600" /> {program.guests.length} qonaq
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10.5px] font-bold text-emerald-700">
            <CheckCircle2 size={12} /> Aktiv
          </span>
        </div>
      </PageHero>

      <Section>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10">
          <div>
            <form onSubmit={issue} className="rounded-[22px] border border-[#EAE7F7] bg-white p-5 sm:p-6">
              <label htmlFor="participant-name" className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#6E6788]">
                Ad və soyad
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  id="participant-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Məsələn: Aysel Məmmədova"
                  autoComplete="name"
                  maxLength={80}
                  className="h-12 w-full rounded-xl border border-[#E4E0F2] bg-white px-3.5 text-[13px] text-ink outline-none transition-colors placeholder:text-[#A29BB8] focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                />
                <button
                  type="submit"
                  disabled={issuing}
                  className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 text-[12.5px] font-bold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
                >
                  {issuing ? <Loader2 size={15} className="animate-spin" /> : <Award size={15} />}
                  {issuing ? "Hazırlanır..." : "Sertifikatı hazırla"}
                </button>
              </div>
              <p className="mt-2.5 text-[11px] leading-relaxed text-[#8A83A0]">
                Ad və soyad sertifikatda göstəriləcək. Səhv yazdıqda adı düzəldib yenidən hazırlaya bilərsiniz.
              </p>
              {error && (
                <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-[11.5px] font-semibold text-amber-800">
                  {error}
                </p>
              )}
            </form>

            {certificate && preview && (
              <div ref={resultRef} className="mt-5 rounded-[22px] border border-[#EAE7F7] bg-white p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[13px] font-extrabold text-ink">Sertifikatınız hazırdır</p>
                    <p className="mt-1 text-[11px] text-[#6E6788]">
                      Yoxlama kodu: <span className="font-bold text-ink">{certificate.code}</span>
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                    <BadgeCheck size={12} /> Etibarlı
                  </span>
                </div>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt={`${certificate.name} üçün sertifikat`}
                  className="mt-4 w-full rounded-xl border border-slate-200 bg-white"
                />

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={downloadJpeg}
                    disabled={downloading !== null}
                    className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 text-[12px] font-bold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
                  >
                    {downloading === "jpeg" ? <Loader2 size={15} className="animate-spin" /> : <ImageDown size={15} />}
                    JPEG kimi yüklə
                  </button>
                  <button
                    type="button"
                    onClick={downloadPdf}
                    disabled={downloading !== null}
                    className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-[#E4E0F2] bg-white px-5 text-[12px] font-bold text-ink transition-colors hover:border-brand-200 hover:text-brand-700 disabled:opacity-60"
                  >
                    {downloading === "pdf" ? <Loader2 size={15} className="animate-spin" /> : <FileDown size={15} />}
                    PDF kimi yüklə
                  </button>
                </div>

                <p className="mt-3 flex items-start gap-2 text-[10.5px] leading-relaxed text-[#8A83A0]">
                  <Download size={12} className="mt-0.5 shrink-0" />
                  Fayl adı və sertifikat kodu sizin adınıza uyğun yaradılır. Kodu{" "}
                  <Link href="/sertifikat" className="font-bold text-brand-600 hover:text-brand-700">
                    sertifikat yoxlama
                  </Link>{" "}
                  səhifəsində yoxlaya bilərsiniz.
                </p>
              </div>
            )}

            <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-[#EAE7F7] bg-[#FAF9FF] p-4 text-[11.5px] leading-relaxed text-[#5A5270]">
              <ShieldCheck size={15} className="mt-0.5 shrink-0 text-brand-600" />
              <div>
                <p className="font-bold text-ink">Sertifikat fərdi ad üçün yaradılır</p>
                <p className="mt-1">
                  Tədbirin rəsmi iştirakçısı olmasanız, adınıza sertifikat yaradılması üçün tədbir komandası ilə əlaqə saxlayın.
                </p>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-[22px] border border-[#EAE7F7] bg-[#FAF9FF] p-5">
              <p className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-brand-600">Tədbir məlumatı</p>
              <dl className="mt-4 space-y-3 text-[12px]">
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8A83A0]">Tədbir</dt>
                  <dd className="mt-1 font-semibold leading-relaxed text-ink">{program.title}</dd>
                </div>
                {program.date && (
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8A83A0]">Tarix</dt>
                    <dd className="mt-1 font-semibold leading-relaxed text-ink">{formatCertificateDate(program.date)}</dd>
                  </div>
                )}
                {program.guests.length > 0 && (
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8A83A0]">Qonaqlar</dt>
                    <dd className="mt-1 font-semibold leading-relaxed text-ink">{program.guests.join(", ")}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="rounded-[22px] border border-[#EAE7F7] bg-white p-5">
              <p className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-brand-600">Kömək lazımdır?</p>
              <p className="mt-2 text-[11.5px] leading-relaxed text-[#5A5270]">
                Adınız sistemdə görünmürsə və ya sertifikat yüklənmirsə, tədbir komandasına yazın.
              </p>
              <a
                href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(`Sertifikat: ${program.title}`)}`}
                className="mt-3 inline-flex h-10 items-center gap-2 rounded-full border border-[#E4E0F2] px-4 text-[11.5px] font-bold text-ink transition-colors hover:border-brand-200 hover:text-brand-700"
              >
                <Mail size={13} /> {CONTACT.email}
              </a>
            </div>
          </aside>
        </div>

        <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
      </Section>

      <PageCTA
        title="Sertifikatın həqiqətini yoxlayın"
        text="Sertifikatın sağ aşağı küncündəki kodu yoxlama səhifəsində daxil edərək təsdiqləyə bilərsiniz."
        href="/sertifikat"
        label="Yoxlama səhifəsi"
      />
    </PageShell>
  );
}
