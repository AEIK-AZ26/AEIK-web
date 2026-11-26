"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Award,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  ImagePlus,
  Link2,
  Loader2,
  Move,
  Palette,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";
import { uploadImage } from "@/lib/contentApi";
import {
  AUTO_ELEMENTS,
  CertificateBox,
  CertificateBoxes,
  CertificateElement,
  CertificateProgram,
  CertificateTheme,
  DEFAULT_DESIGN,
  DEFAULT_ELEMENTS,
  DESIGN_HEIGHT,
  DESIGN_WIDTH,
  ELEMENT_KEYS,
  ELEMENT_LABELS,
  ElementKey,
  certificateImageProxy,
  formatCertificateDate,
  loadCertificateImage,
  paintCertificate,
  renderCertificate,
} from "@/lib/certificate";

const SAMPLE_NAME = "Aysel Məmmədova";
const SAMPLE_CODE = "AEIK-2026-ABC123";

interface AdminProgram extends CertificateProgram {
  id: string;
  active: boolean;
  issuedCount?: number;
}

interface Draft {
  id?: string;
  title: string;
  date: string;
  guestsText: string;
  active: boolean;
  theme: CertificateTheme;
  frameColor: string;
  accentColor: string;
  logoUrl: string;
  logoUrls: string[];
  elements: CertificateElement[];
}

const today = () => {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

const EMPTY: Draft = {
  title: "",
  date: today(),
  guestsText: "",
  active: false,
  theme: DEFAULT_DESIGN.theme,
  frameColor: DEFAULT_DESIGN.frameColor,
  accentColor: DEFAULT_DESIGN.accentColor,
  logoUrl: "",
  logoUrls: [],
  elements: DEFAULT_DESIGN.elements.map((item) => ({ ...item })),
};

function authHeaders(json = true): Record<string, string> {
  const headers: Record<string, string> = {};
  if (json) headers["Content-Type"] = "application/json";
  const token = typeof window !== "undefined" ? localStorage.getItem("aeik_token") : "";
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function splitGuests(value: string): string[] {
  return value
    .split(/[\n,;]+/)
    .map((guest) => guest.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function toDraft(program: AdminProgram): Draft {
  return {
    id: program.id,
    title: program.title,
    date: program.date,
    guestsText: (program.guests || []).join(", "),
    active: program.active,
    theme: program.theme === "ribbon" ? "ribbon" : "classic",
    frameColor: program.frameColor || DEFAULT_DESIGN.frameColor,
    accentColor: program.accentColor || DEFAULT_DESIGN.accentColor,
    logoUrl: program.logoUrl || "",
    logoUrls: Array.isArray(program.logoUrls) ? [...program.logoUrls] : [],
    elements: (program.elements && program.elements.length ? program.elements : DEFAULT_DESIGN.elements).map((item) => ({
      ...item,
    })),
  };
}

function programFromDraft(draft: Draft): CertificateProgram {
  return {
    slug: "preview",
    title: draft.title || "Tədbirin adı",
    date: draft.date,
    guests: splitGuests(draft.guestsText),
    theme: draft.theme,
    frameColor: draft.frameColor,
    accentColor: draft.accentColor,
    logoUrl: draft.logoUrl,
    logoUrls: draft.logoUrls,
    elements: draft.elements,
  };
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));

export default function CertificateManager({
  notify,
}: {
  notify: (message: string, kind?: "ok" | "error") => void;
}) {
  const [programs, setPrograms] = useState<AdminProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [selected, setSelected] = useState<ElementKey>("name");
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/certificate-programs", {
        headers: authHeaders(false),
        cache: "no-store",
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Sertifikat proqramları yüklənmədi.");
      setPrograms(Array.isArray(json?.data) ? json.data : []);
    } catch (error: any) {
      notify(error?.message || "Sertifikat proqramları yüklənmədi.", "error");
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    load();
  }, [load]);

  const openNew = () => {
    setSelected("name");
    setDraft({ ...EMPTY, elements: DEFAULT_DESIGN.elements.map((item) => ({ ...item })), date: today() });
  };

  const openEdit = (program: AdminProgram) => {
    setSelected("name");
    setDraft(toDraft(program));
  };

  const updateElement = (key: ElementKey, patch: Partial<CertificateElement>) => {
    setDraft((current) =>
      current
        ? {
            ...current,
            elements: current.elements.map((item) => (item.key === key ? { ...item, ...patch } : item)),
          }
        : current
    );
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !draft) return;
    setUploading(true);
    const result = await uploadImage(file);
    setUploading(false);
    if (!result.ok || !result.url) {
      notify(result.error || "Loqo yüklənmədi.", "error");
      return;
    }
    setDraft({ ...draft, logoUrl: result.url });
    notify("Loqo yükləndi.");
  };

  const submit = async () => {
    if (!draft) return;
    if (draft.title.trim().length < 3) {
      notify("Tədbirin adını yazın.", "error");
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.date)) {
      notify("Tarixi seçin.", "error");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: draft.title,
        date: draft.date,
        guests: splitGuests(draft.guestsText),
        active: draft.active,
        theme: draft.theme,
        frameColor: draft.frameColor,
        accentColor: draft.accentColor,
        logoUrl: draft.logoUrl,
        logoUrls: draft.logoUrls,
        elements: draft.elements,
      };

      const res = await fetch(
        draft.id ? `/api/certificate-programs/${encodeURIComponent(draft.id)}` : "/api/certificate-programs",
        {
          method: draft.id ? "PATCH" : "POST",
          headers: authHeaders(),
          body: JSON.stringify(payload),
        }
      );
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        notify(json?.error || "Yadda saxlamaq alınmadı.", "error");
        return;
      }

      notify(draft.id ? "Sertifikat proqramı yeniləndi." : "Sertifikat proqramı yaradıldı.");
      setDraft(null);
      load();
    } catch (error: any) {
      notify(error?.message || "Şəbəkə xətası.", "error");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (program: AdminProgram) => {
    setBusyId(program.id);
    try {
      const res = await fetch(`/api/certificate-programs/${encodeURIComponent(program.id)}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ active: !program.active }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        notify(json?.error || "Status dəyişdirilmədi.", "error");
        return;
      }
      setPrograms((prev) => prev.map((item) => (item.id === program.id ? { ...item, active: !program.active } : item)));
      notify(
        !program.active
          ? "Sertifikat səhifəsi aktiv edildi — iştirakçılar linkə girə bilər."
          : "Sertifikat səhifəsi deaktiv edildi."
      );
    } catch (error: any) {
      notify(error?.message || "Şəbəkə xətası.", "error");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (program: AdminProgram) => {
    if (
      !window.confirm(
        `"${program.title}" sertifikat proqramı silinsin? Artıq yüklənmiş sertifikatlar yoxlama üçün bazada qalacaq.`
      )
    ) {
      return;
    }
    setBusyId(program.id);
    try {
      const res = await fetch(`/api/certificate-programs/${encodeURIComponent(program.id)}`, {
        method: "DELETE",
        headers: authHeaders(false),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        notify(json?.error || "Silmək alınmadı.", "error");
        return;
      }
      setPrograms((prev) => prev.filter((item) => item.id !== program.id));
      notify("Sertifikat proqramı silindi.");
    } catch (error: any) {
      notify(error?.message || "Şəbəkə xətası.", "error");
    } finally {
      setBusyId(null);
    }
  };

  const copyLink = async (program: AdminProgram) => {
    const url = `${window.location.origin}/sertifikat/${program.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      notify("Sertifikat linki kopyalandı.");
    } catch {
      notify(url, "ok");
    }
  };

  const activeCount = useMemo(() => programs.filter((program) => program.active).length, [programs]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-extrabold tracking-[-0.02em] text-ink sm:text-xl">Sertifikatlar</h2>
          <p className="mt-0.5 text-[11.5px] text-slate-500">
            {programs.length} proqram · {activeCount} aktiv · dizayn redaktoru, tədbir məlumatı və iştirakçı yükləməsi
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand-600 px-4 text-xs font-semibold text-white transition-colors hover:bg-brand-700"
        >
          <Plus size={15} /> Yeni sertifikat
        </button>
      </div>

      <div className="flex items-start gap-2.5 rounded-2xl border border-brand-200 bg-brand-50/60 p-4 text-[11.5px] leading-relaxed text-[#4E4768]">
        <Award size={16} className="mt-0.5 shrink-0 text-brand-600" />
        <div>
          <p className="font-bold text-ink">Dizayn şəkil yükləmədən hazırlanır</p>
          <p className="mt-1">
            Sertifikatın haşiyəsi, başlığı və mətnləri kodla çəkilir. Redaktorda hər elementi siçanla sürüşdürə, X/Y
            koordinatlarını dəyişə, şrift ölçüsünü, rəngini və mətnini redaktə edə bilərsiniz. Loqonu yükləyin, sonra
            səhifəni aktiv edin — iştirakçı yalnız adını yazıb JPEG və ya PDF yükləyəcək.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-[#EAE7F7] bg-white py-24">
          <Loader2 className="animate-spin text-brand-600" size={24} />
        </div>
      ) : programs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#DCD7EF] bg-white/60 px-6 py-14 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F4F2FC] text-brand-600">
            <Award size={22} />
          </span>
          <p className="mt-4 text-sm font-semibold text-slate-700">Hələ sertifikat proqramı yoxdur</p>
          <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-slate-500">
            İlk tədbir üçün sertifikat dizaynını yaradın və iştirakçı yükləmə səhifəsini aktiv edin.
          </p>
          <button
            onClick={openNew}
            className="mt-4 inline-flex h-10 items-center gap-2 rounded-full bg-brand-600 px-4 text-xs font-semibold text-white hover:bg-brand-700"
          >
            <Plus size={14} /> Sertifikat yarat
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {programs.map((program) => (
            <article
              key={program.id}
              className={`overflow-hidden rounded-2xl border bg-white premium-shadow-soft ${
                program.active ? "border-emerald-200" : "border-[#EAE7F7]"
              }`}
            >
              <div className="relative h-40 w-full overflow-hidden bg-[#F1EFF9]">
                <CertificateThumb program={program} />
                <span
                  className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.1em] ${
                    program.active ? "bg-emerald-600 text-white" : "bg-slate-800/80 text-white"
                  }`}
                >
                  {program.active ? <Eye size={11} /> : <EyeOff size={11} />}
                  {program.active ? "Aktiv" : "Deaktiv"}
                </span>
                {typeof program.issuedCount === "number" && (
                  <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[9.5px] font-bold text-slate-700">
                    {program.issuedCount} sertifikat
                  </span>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold leading-snug text-slate-900">{program.title}</h3>
                    <p className="mt-1 text-[10.5px] text-slate-500">
                      {formatCertificateDate(program.date) || "Tarix yoxdur"}
                      {program.guests?.length ? ` · ${program.guests.length} qonaq` : ""}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleActive(program)}
                    disabled={busyId === program.id}
                    className={`inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-[10.5px] font-bold transition-colors disabled:opacity-60 ${
                      program.active
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {busyId === program.id ? (
                      <Loader2 size={11} className="animate-spin" />
                    ) : program.active ? (
                      <EyeOff size={11} />
                    ) : (
                      <Eye size={11} />
                    )}
                    {program.active ? "Deaktiv et" : "Aktiv et"}
                  </button>
                </div>

                {program.guests?.length > 0 && (
                  <p className="mt-2 flex items-start gap-1.5 text-[10.5px] leading-relaxed text-slate-500">
                    <Users size={11} className="mt-0.5 shrink-0" />
                    {program.guests.join(", ")}
                  </p>
                )}

                <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-[10px] text-slate-500">
                  <Link2 size={11} className="shrink-0" />
                  <span className="min-w-0 flex-1 truncate">/sertifikat/{program.slug}</span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3">
                  <button
                    onClick={() => openEdit(program)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#F4F2FC] px-2.5 text-[11px] font-semibold text-brand-700 transition-colors hover:bg-[#EAE6FE]"
                  >
                    <Pencil size={12} /> Redaktə
                  </button>
                  <button
                    onClick={() => copyLink(program)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-semibold text-slate-600 transition-colors hover:bg-slate-100"
                  >
                    <Copy size={12} /> Linki kopyala
                  </button>
                  <a
                    href={`/sertifikat/${program.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-semibold text-slate-600 transition-colors hover:bg-slate-100"
                  >
                    <ExternalLink size={12} /> Aç
                  </a>
                  <button
                    onClick={() => remove(program)}
                    disabled={busyId === program.id}
                    className="ml-auto rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                    aria-label="Sil"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {draft && (
        <div className="fixed inset-0 z-[65] flex items-end justify-center bg-[#120E26]/60 backdrop-blur-sm sm:items-center sm:p-4">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              submit();
            }}
            className="flex max-h-[96vh] w-full max-w-6xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {draft.id ? "Sertifikat proqramını redaktə et" : "Yeni sertifikat proqramı"}
                </h3>
                <p className="text-[11px] text-slate-500">Dizayn redaktoru + tədbir məlumatı + iştirakçı səhifəsi</p>
              </div>
              <button
                type="button"
                onClick={() => setDraft(null)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
                aria-label="Bağla"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid flex-1 grid-cols-1 gap-5 overflow-y-auto px-5 py-5 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                    Tədbirin adı
                  </label>
                  <input
                    value={draft.title}
                    onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                    placeholder="Məs: Elm Kafe — ilk açıq müzakirə"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                      Tarix
                    </label>
                    <input
                      type="date"
                      value={draft.date}
                      onChange={(event) => setDraft({ ...draft, date: event.target.value })}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                      Tema
                    </label>
                    <div className="grid h-10 grid-cols-2 gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
                      {[
                        { value: "classic" as const, label: "Klassik" },
                        { value: "ribbon" as const, label: "Müasir" },
                      ].map((theme) => (
                        <button
                          key={theme.value}
                          type="button"
                          onClick={() => setDraft({ ...draft, theme: theme.value })}
                          className={`rounded-lg text-[11px] font-semibold transition-colors ${
                            draft.theme === theme.value ? "bg-white text-brand-700 shadow-sm" : "text-slate-500"
                          }`}
                        >
                          {theme.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: "frameColor" as const, label: "Haşiyə rəngi" },
                    { key: "accentColor" as const, label: "Vurgu rəngi" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                        {field.label}
                      </label>
                      <div className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-2">
                        <input
                          type="color"
                          value={draft[field.key]}
                          onChange={(event) => setDraft({ ...draft, [field.key]: event.target.value })}
                          className="h-7 w-9 cursor-pointer rounded border-0 bg-transparent p-0"
                          aria-label={field.label}
                        />
                        <span className="text-[11px] font-semibold uppercase text-slate-500">{draft[field.key]}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                    Loqo
                  </label>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input
                        value={draft.logoUrl}
                        onChange={(event) => setDraft({ ...draft, logoUrl: event.target.value })}
                        placeholder="https://i.ibb.co/... (şəffaf PNG tövsiyə olunur)"
                        className="h-9 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2.5 text-[11px] text-slate-700 outline-none focus:border-brand-400"
                      />
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        disabled={uploading}
                        className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-white px-3 text-[11px] font-semibold text-brand-700 ring-1 ring-slate-200 disabled:opacity-60"
                      >
                        {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                        {uploading ? "Yüklənir..." : "Loqo yüklə"}
                      </button>
                    </div>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <p className="mt-2 flex items-center gap-1.5 text-[10.5px] text-slate-500">
                      <ImagePlus size={11} /> Şəffaf PNG loqo ən yaxşı nəticə verir. Boş saxlasanız loqo çəkilməyəcək.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                    Qonaqlar
                  </label>
                  <textarea
                    value={draft.guestsText}
                    onChange={(event) => setDraft({ ...draft, guestsText: event.target.value })}
                    placeholder="Hər qonağı vergül və ya yeni sətirlə ayırın"
                    rows={2}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs leading-relaxed text-slate-800 outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  />
                  <p className="mt-1 text-[10.5px] text-slate-500">
                    Tədbir mətnində <code className="rounded bg-slate-100 px-1">{"{guests}"}</code> yazsanız, qonaqlar
                    sertifikata da düşəcək.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setDraft({ ...draft, active: !draft.active })}
                  className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-left transition-colors ${
                    draft.active ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white"
                  }`}
                >
                  <span>
                    <span className="block text-[11.5px] font-bold text-slate-800">
                      {draft.active ? "Səhifə aktivdir" : "Səhifə deaktivdir"}
                    </span>
                    <span className="mt-0.5 block text-[10px] text-slate-500">
                      {draft.active
                        ? "İştirakçılar linkə girib sertifikat yükləyə bilər."
                        : "Link açıq olsa da, sertifikat yükləmə bağlıdır."}
                    </span>
                  </span>
                  <span
                    className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
                      draft.active ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
                        draft.active ? "left-[18px]" : "left-0.5"
                      }`}
                    />
                  </span>
                </button>
              </div>

              <div className="space-y-3">
                <CertificateEditor
                  draft={draft}
                  selected={selected}
                  onSelect={setSelected}
                  onChangeElement={updateElement}
                  onDraftChange={setDraft}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-3.5">
              <button
                type="button"
                onClick={() => setDraft(null)}
                className="h-10 rounded-full border border-slate-200 px-4 text-xs font-semibold text-slate-600"
              >
                İmtina
              </button>
              <button
                type="submit"
                disabled={saving || uploading}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-600 px-5 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Yadda saxla
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function CertificateThumb({ program }: { program: AdminProgram }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    renderCertificate(
      canvas,
      program,
      { name: SAMPLE_NAME, code: SAMPLE_CODE },
      { scale: 0.45 }
    ).catch(() => {
      /* önizləmə alınmasa kart boş qalır */
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program.id, program.theme, program.frameColor, program.accentColor, program.logoUrl, program.elements]);

  return <canvas ref={canvasRef} className="h-full w-full object-cover object-top" aria-hidden="true" />;
}

function CertificateEditor({
  draft,
  selected,
  onSelect,
  onChangeElement,
  onDraftChange,
}: {
  draft: Draft;
  selected: ElementKey;
  onSelect: (key: ElementKey) => void;
  onChangeElement: (key: ElementKey, patch: Partial<CertificateElement>) => void;
  onDraftChange: (draft: Draft) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const boxesRef = useRef<CertificateBoxes>({});
  const logosRef = useRef<HTMLImageElement[]>([]);
  const dragRef = useRef<{ key: ElementKey; startX: number; startY: number; origX: number; origY: number } | null>(null);
  const logoUrlsKeyRef = useRef("");
  const [logoStatus, setLogoStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");

  const element = draft.elements.find((item) => item.key === selected) || DEFAULT_ELEMENTS[selected];
  const auto = AUTO_ELEMENTS.includes(selected);

  const program = programFromDraft(draft);

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    boxesRef.current = paintCertificate(
      canvas,
      program,
      { name: SAMPLE_NAME, code: SAMPLE_CODE },
      logosRef.current,
      { highlight: selected }
    );
  }, [program, selected]);

  useEffect(() => {
    paint();
  }, [paint]);

  useEffect(() => {
    const urls =
      Array.isArray(draft.logoUrls) && draft.logoUrls.length
        ? draft.logoUrls
        : draft.logoUrl
          ? [draft.logoUrl]
          : [];
    const key = urls.join("|");
    if (key === logoUrlsKeyRef.current) return;
    logoUrlsKeyRef.current = key;
    logosRef.current = [];
    if (!urls.length) {
      setLogoStatus("idle");
      paint();
      return;
    }
    let cancelled = false;
    setLogoStatus("loading");
    Promise.all(
      urls.map((url) =>
        loadCertificateImage(certificateImageProxy(url)).catch(() => null)
      )
    ).then((images) => {
      if (cancelled) return;
      logosRef.current = images.filter((img): img is HTMLImageElement => Boolean(img));
      setLogoStatus(logosRef.current.length ? "ready" : "error");
      paint();
    });
    return () => {
      cancelled = true;
    };
  }, [draft.logoUrls, draft.logoUrl, paint]);

  const toDesignPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * DESIGN_WIDTH,
      y: ((event.clientY - rect.top) / rect.height) * DESIGN_HEIGHT,
    };
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const point = toDesignPoint(event);
    const order = draft.elements.map((item) => item.key);
    const hits = order
      .map((key) => ({ key, box: boxesRef.current[key] }))
      .filter((item): item is { key: ElementKey; box: CertificateBox } => Boolean(item.box))
      .filter(({ box }) => point.x >= box.x - 12 && point.x <= box.x + box.w + 12 && point.y >= box.y - 12 && point.y <= box.y + box.h + 12)
      .reverse();

    if (!hits.length) {
      onSelect("name");
      return;
    }

    const key = hits[0].key;
    onSelect(key);
    const current = draft.elements.find((item) => item.key === key);
    if (!current) return;
    dragRef.current = { key, startX: point.x, startY: point.y, origX: current.x, origY: current.y };
    event.currentTarget.setPointerCapture(event.pointerId);
    shellRef.current?.focus();
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const point = toDesignPoint(event);
    const dx = ((point.x - drag.startX) / DESIGN_WIDTH) * 100;
    const dy = ((point.y - drag.startY) / DESIGN_HEIGHT) * 100;
    onChangeElement(drag.key, {
      x: clamp(drag.origX + dx, 0, 100),
      y: clamp(drag.origY + dy, 0, 100),
    });
  };

  const endDrag = () => {
    dragRef.current = null;
  };

  const nudge = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 2 : 0.4;
    const map: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const delta = map[event.key];
    if (!delta) return;
    event.preventDefault();
    onChangeElement(selected, {
      x: clamp(element.x + delta[0], 0, 100),
      y: clamp(element.y + delta[1], 0, 100),
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
          <Move size={12} /> Canlı redaktor
        </p>
        <p className="text-[10.5px] text-slate-400">Elementi sürüşdürün · ox düymələri ilə dəqiq yerdəyişmə</p>
      </div>

      <div
        ref={shellRef}
        tabIndex={0}
        onKeyDown={nudge}
        className="overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 outline-none focus:ring-2 focus:ring-brand-200"
      >
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="h-auto w-full cursor-grab touch-none rounded-lg active:cursor-grabbing"
          aria-label="Sertifikat dizaynı — elementləri sürüşdürmək olar"
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {draft.elements.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onSelect(item.key)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-semibold transition-colors ${
              selected === item.key
                ? "border-brand-300 bg-brand-50 text-brand-700"
                : "border-slate-200 bg-white text-slate-600 hover:border-brand-200"
            } ${item.visible ? "" : "opacity-50"}`}
          >
            {ELEMENT_LABELS[item.key]}
            <span
              role="button"
              tabIndex={-1}
              onClick={(event) => {
                event.stopPropagation();
                onChangeElement(item.key, { visible: !item.visible });
              }}
              className="text-slate-400 hover:text-slate-700"
            >
              {item.visible ? <Eye size={10} /> : <EyeOff size={10} />}
            </span>
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11.5px] font-bold text-slate-800">{ELEMENT_LABELS[selected]}</p>
          <button
            type="button"
            onClick={() => onChangeElement(selected, { ...DEFAULT_ELEMENTS[selected] })}
            className="inline-flex items-center gap-1 rounded-lg px-1.5 py-1 text-[10px] font-semibold text-slate-500 hover:bg-white hover:text-slate-700"
            title="Standart vəziyyətə qaytar"
          >
            <RotateCcw size={11} /> Sıfırla
          </button>
        </div>

        <div className="mt-2 space-y-2.5">
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">
              Mətn
            </label>
            {auto ? (
              <p className="rounded-lg border border-dashed border-slate-300 bg-white px-2.5 py-2 text-[10.5px] text-slate-500">
                {selected === "name" ? "{name}" : "{code}"} — iştirakçı üçün avtomatik yazılır.
              </p>
            ) : (
              <textarea
                value={element.text}
                onChange={(event) => onChangeElement(selected, { text: event.target.value })}
                rows={selected === "body" || selected === "sigLeft" || selected === "sigRight" ? 3 : 2}
                className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-[11px] leading-relaxed text-slate-700 outline-none focus:border-brand-400"
              />
            )}
            {!auto && (
              <p className="mt-1 text-[9.5px] text-slate-400">
                Yer tutucular: {"{event}"} · {"{date}"} · {"{guests}"} · {"{name}"} · {"{code}"}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <NumberSlider
              label="X (sola–sağa)"
              value={element.x}
              min={0}
              max={100}
              step={0.5}
              suffix="%"
              onChange={(value) => onChangeElement(selected, { x: value })}
            />
            <NumberSlider
              label="Y (yuxarı–aşağı)"
              value={element.y}
              min={0}
              max={100}
              step={0.5}
              suffix="%"
              onChange={(value) => onChangeElement(selected, { y: value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <NumberSlider
              label={selected === "logo" ? "Loqo hündürlüyü" : "Şrift ölçüsü"}
              value={element.size}
              min={selected === "logo" ? 24 : 8}
              max={selected === "logo" ? 400 : 180}
              step={1}
              onChange={(value) => onChangeElement(selected, { size: value })}
            />
            <div>
              <label className="mb-1 block text-[10px] font-semibold text-slate-500">Rəng</label>
              <div className="flex h-8 items-center gap-2 rounded-lg border border-slate-200 bg-white px-1.5">
                <input
                  type="color"
                  value={element.color}
                  onChange={(event) => onChangeElement(selected, { color: event.target.value })}
                  className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
                  aria-label="Element rəngi"
                />
                <span className="text-[10px] font-semibold uppercase text-slate-500">{element.color}</span>
              </div>
            </div>
          </div>

          {selected !== "logo" && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-[10px] font-semibold text-slate-500">Şrift qalınlığı</label>
                <select
                  value={element.weight}
                  onChange={(event) => onChangeElement(selected, { weight: Number(event.target.value) })}
                  className="h-8 w-full rounded-lg border border-slate-200 bg-white px-1.5 text-[11px] text-slate-700 outline-none focus:border-brand-400"
                >
                  {[300, 400, 500, 600, 700, 800].map((weight) => (
                    <option key={weight} value={weight}>
                      {weight}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-semibold text-slate-500">Düzləndirmə</label>
                <div className="grid h-8 grid-cols-3 gap-1 rounded-lg border border-slate-200 bg-white p-0.5">
                  {[
                    { value: "left" as const, icon: AlignLeft },
                    { value: "center" as const, icon: AlignCenter },
                    { value: "right" as const, icon: AlignRight },
                  ].map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => onChangeElement(selected, { align: option.value })}
                        className={`flex items-center justify-center rounded ${
                          element.align === option.value ? "bg-brand-50 text-brand-700" : "text-slate-400"
                        }`}
                        aria-label={option.value}
                      >
                        <Icon size={12} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {selected !== "logo" && (
            <div className="grid grid-cols-2 gap-2">
              <NumberSlider
                label="Hərf aralığı"
                value={element.letterSpacing}
                min={-2}
                max={30}
                step={0.5}
                onChange={(value) => onChangeElement(selected, { letterSpacing: value })}
              />
              <NumberSlider
                label="Sətir aralığı"
                value={element.lineHeight}
                min={0.9}
                max={2.6}
                step={0.05}
                onChange={(value) => onChangeElement(selected, { lineHeight: value })}
              />
            </div>
          )}

          {selected === "logo" && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  onDraftChange({ ...draft, logoUrl: "" });
                }}
                className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white text-[10.5px] font-semibold text-slate-600 hover:border-rose-200 hover:text-rose-600"
              >
                <Trash2 size={11} /> Loqonu sil
              </button>
              <span className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg bg-white text-[10px] font-semibold text-slate-500">
                {logoStatus === "loading" ? (
                  <>
                    <Loader2 size={11} className="animate-spin" /> yüklənir
                  </>
                ) : logoStatus === "error" ? (
                  "şəkil açılmadı"
                ) : draft.logoUrl ? (
                  <>
                    <Palette size={11} /> hazır
                  </>
                ) : (
                  "loqo yoxdur"
                )}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NumberSlider({
  label,
  value,
  min,
  max,
  step,
  suffix = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <label className="text-[10px] font-semibold text-slate-500">{label}</label>
        <span className="text-[10px] font-bold tabular-nums text-slate-600">
          {Math.round(value * 10) / 10}
          {suffix}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="h-1.5 w-full accent-brand-600"
          aria-label={label}
        />
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={Math.round(value * 100) / 100}
          onChange={(event) => onChange(clamp(Number(event.target.value), min, max))}
          className="h-7 w-14 shrink-0 rounded-md border border-slate-200 bg-white px-1 text-[10.5px] tabular-nums text-slate-700 outline-none focus:border-brand-400"
        />
      </div>
    </div>
  );
}
