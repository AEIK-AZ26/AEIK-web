"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Inbox,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import {
  ApplicationFormConfig,
  DEFAULT_APPLICATION_FORM,
  FIELD_TYPE_LABELS,
  FormField,
  FormFieldType,
} from "@/lib/applicationForm";
import {
  ApplicationRecord,
  deleteApplication,
  loadApplications,
  loadApplicationForm,
  saveApplicationForm,
} from "@/lib/contentApi";

const TYPE_OPTIONS = Object.keys(FIELD_TYPE_LABELS) as FormFieldType[];

const EMPTY_FIELD: FormField = {
  id: "",
  label: "",
  type: "text",
  required: false,
  placeholder: "",
  help: "",
  options: [],
  order: 1,
};

function fieldId(label: string) {
  const slug = label
    .toLowerCase()
    .replace(/ə/g, "e")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ç/g, "c")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${slug || "field"}-${Math.random().toString(36).slice(2, 6)}`;
}

export default function FormManager({ notify }: { notify: (message: string, kind?: "ok" | "error") => void }) {
  const [config, setConfig] = useState<ApplicationFormConfig>(DEFAULT_APPLICATION_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [draft, setDraft] = useState<FormField | null>(null);
  const [optionsText, setOptionsText] = useState("");
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const loadApps = useCallback(async () => {
    setAppsLoading(true);
    try {
      setApplications(await loadApplications());
    } catch (error: any) {
      notify(error?.message || "Müraciətlər yüklənmədi.", "error");
    } finally {
      setAppsLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    let cancelled = false;
    loadApplicationForm()
      .then((res) => {
        if (!cancelled) setConfig(res.config);
      })
      .catch((error: any) => notify(error?.message || "Form yüklənmədi.", "error"))
      .finally(() => !cancelled && setLoading(false));
    loadApps();
    return () => {
      cancelled = true;
    };
  }, [loadApps, notify]);

  const fields = useMemo(() => config.fields.slice().sort((a, b) => a.order - b.order), [config.fields]);

  const persist = async (next: ApplicationFormConfig, message: string) => {
    setSaving(true);
    const res = await saveApplicationForm(next);
    setSaving(false);
    if (!res.ok) {
      notify(res.error || "Form yadda saxlanmadı.", "error");
      return false;
    }
    setConfig(res.config || next);
    notify(message);
    return true;
  };

  const toggleActive = async () => {
    const next = { ...config, active: !config.active };
    setToggling(true);
    const res = await saveApplicationForm(next);
    setToggling(false);
    if (!res.ok) {
      notify(res.error || "Status dəyişdirilmədi.", "error");
      return;
    }
    setConfig(res.config || next);
    notify(next.active ? "Müraciət formu aktivdir." : "Müraciət formu deaktiv edildi.");
  };

  const openNewField = () => {
    setDraft({ ...EMPTY_FIELD, order: fields.length + 1 });
    setOptionsText("");
  };

  const openEditField = (field: FormField) => {
    setDraft({ ...field });
    setOptionsText((field.options || []).join("\n"));
  };

  const closeFieldDialog = () => {
    setDraft(null);
    setOptionsText("");
  };

  const saveField = () => {
    if (!draft) return;
    const label = draft.label.trim();
    if (!label) {
      notify("Sahə adı boş ola bilməz.", "error");
      return;
    }
    if (draft.type === "select" && !optionsText.trim()) {
      notify("Seçim siyahısı üçün ən azı bir variant yazın.", "error");
      return;
    }

    const prepared: FormField = {
      ...draft,
      id: draft.id || fieldId(label),
      label,
      placeholder: String(draft.placeholder || "").trim(),
      help: String(draft.help || "").trim(),
      options:
        draft.type === "select"
          ? optionsText
              .split("\n")
              .map((option) => option.trim())
              .filter(Boolean)
          : [],
      order: Number(draft.order) || fields.length + 1,
    };

    setConfig((prev) => {
      const exists = prev.fields.some((field) => field.id === prepared.id);
      const nextFields = exists
        ? prev.fields.map((field) => (field.id === prepared.id ? prepared : field))
        : [...prev.fields, prepared];
      return { ...prev, fields: nextFields };
    });
    closeFieldDialog();
    notify("Sahə hazırdır — yadda saxla düyməsi ilə dərci tamamlayın.");
  };

  const removeField = (field: FormField) => {
    if (!window.confirm(`"${field.label}" sahəsi formdan çıxarılsın?`)) return;
    setConfig((prev) => ({ ...prev, fields: prev.fields.filter((item) => item.id !== field.id) }));
  };

  const moveField = (field: FormField, direction: -1 | 1) => {
    const index = fields.findIndex((item) => item.id === field.id);
    const neighbour = fields[index + direction];
    if (!neighbour) return;
    setConfig((prev) => ({
      ...prev,
      fields: prev.fields.map((item) => {
        if (item.id === field.id) return { ...item, order: neighbour.order };
        if (item.id === neighbour.id) return { ...item, order: field.order };
        return item;
      }),
    }));
  };

  const handleDeleteApplication = async (record: ApplicationRecord) => {
    if (!window.confirm("Bu müraciət silinsin?")) return;
    const res = await deleteApplication(record.id);
    if (!res.ok) {
      notify(res.error || "Müraciət silinmədi.", "error");
      return;
    }
    setApplications((prev) => prev.filter((item) => item.id !== record.id));
    notify("Müraciət silindi.");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-[#EAE7F7] bg-white py-24">
        <Loader2 className="animate-spin text-brand-600" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Status */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#EAE7F7] bg-white p-4 premium-shadow-soft sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-start gap-3">
          <span
            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
              config.active ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"
            }`}
          >
            {config.active ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          </span>
          <div>
            <p className="text-sm font-bold text-ink">
              Müraciət formu {config.active ? "aktivdir" : "deaktivdir"}
            </p>
            <p className="mt-0.5 max-w-md text-[11.5px] leading-relaxed text-slate-500">
              {config.active
                ? "Ana səhifədəki “Müraciət et” düyməsi form səhifəsinə yönləndirir."
                : "Sadə saytda “Müraciət bağlıdır” mesajı göstərilir və form açılmır."}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={toggleActive}
          disabled={toggling}
          className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full px-5 text-xs font-semibold text-white transition-colors disabled:opacity-60 ${
            config.active ? "bg-rose-500 hover:bg-rose-600" : "bg-emerald-600 hover:bg-emerald-700"
          }`}
        >
          {toggling ? <Loader2 size={14} className="animate-spin" /> : config.active ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
          {config.active ? "Deaktiv et" : "Aktiv et"}
        </button>
      </div>

      {/* Mətnlər */}
      <section className="rounded-2xl border border-[#EAE7F7] bg-white p-4 premium-shadow-soft sm:p-5">
        <h2 className="text-sm font-bold text-ink">Form mətnləri</h2>
        <p className="mt-0.5 text-[11.5px] text-slate-500">Başlıq və izahlar müraciət səhifəsində göstərilir.</p>
        <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Başlıq</span>
            <input
              value={config.title}
              onChange={(e) => setConfig({ ...config, title: e.target.value })}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Giriş mətni</span>
            <textarea
              rows={2}
              value={config.intro}
              onChange={(e) => setConfig({ ...config, intro: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs leading-relaxed text-slate-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Bağlı olduqda mesaj</span>
            <textarea
              rows={2}
              value={config.closedMessage}
              onChange={(e) => setConfig({ ...config, closedMessage: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs leading-relaxed text-slate-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Uğurlu göndəriş mesajı</span>
            <textarea
              rows={2}
              value={config.successMessage}
              onChange={(e) => setConfig({ ...config, successMessage: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs leading-relaxed text-slate-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </label>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => persist(config, "Form mətnləri yadda saxlanıldı.")}
            disabled={saving}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-600 px-5 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Yadda saxla
          </button>
        </div>
      </section>

      {/* Sahələr */}
      <section className="rounded-2xl border border-[#EAE7F7] bg-white p-4 premium-shadow-soft sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-bold text-ink">Form sahələri</h2>
            <p className="mt-0.5 text-[11.5px] text-slate-500">{fields.length} sahə · sıra və məcburilik tənzimlənir</p>
          </div>
          <button
            type="button"
            onClick={openNewField}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#F4F2FC] px-4 text-xs font-semibold text-brand-700 transition-colors hover:bg-[#EAE6FE]"
          >
            <Plus size={15} /> Sahə əlavə et
          </button>
        </div>

        <ul className="mt-4 divide-y divide-slate-100">
          {fields.map((field, index) => (
            <li key={field.id} className="flex flex-wrap items-center gap-3 py-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F4F2FC] text-[10px] font-bold text-brand-700">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12.5px] font-semibold text-slate-800">
                  {field.label}
                  {field.required && <span className="ml-1.5 text-rose-500">*</span>}
                </p>
                <p className="text-[10.5px] text-slate-500">
                  {FIELD_TYPE_LABELS[field.type]}
                  {field.type === "select" && field.options?.length ? ` · ${field.options.join(", ")}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => moveField(field, -1)}
                  disabled={index === 0}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                  aria-label="Yuxarı"
                >
                  <ArrowUp size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => moveField(field, 1)}
                  disabled={index === fields.length - 1}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                  aria-label="Aşağı"
                >
                  <ArrowDown size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => openEditField(field)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-brand-700"
                  aria-label="Redaktə"
                >
                  <Pencil size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => removeField(field)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                  aria-label="Sil"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex justify-end border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={() => persist(config, "Form sahələri yadda saxlanıldı.")}
            disabled={saving}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-600 px-5 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Dəyişiklikləri yadda saxla
          </button>
        </div>
      </section>

      {/* Müraciətlər */}
      <section className="rounded-2xl border border-[#EAE7F7] bg-white p-4 premium-shadow-soft sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Inbox size={16} className="text-brand-600" />
            <h2 className="text-sm font-bold text-ink">Gələn müraciətlər</h2>
            <span className="rounded-full bg-[#F4F2FC] px-2 py-0.5 text-[10px] font-bold text-brand-700">{applications.length}</span>
          </div>
          <button
            type="button"
            onClick={loadApps}
            disabled={appsLoading}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-200 px-3 text-[11px] font-semibold text-slate-600 hover:border-brand-200 hover:text-brand-700 disabled:opacity-60"
          >
            <RefreshCw size={13} className={appsLoading ? "animate-spin" : ""} /> Yenilə
          </button>
        </div>

        {applications.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-[#DCD7EF] bg-[#FBFAFF] px-5 py-10 text-center">
            <p className="text-xs font-semibold text-slate-600">Hələ müraciət yoxdur</p>
            <p className="mt-1 text-[11px] text-slate-500">Form aktiv olduqda göndərilən müraciətlər burada görünəcək.</p>
          </div>
        ) : (
          <ul className="mt-3 divide-y divide-slate-100">
            {applications.map((record) => {
              const first = fields.find((field) => record.values[field.id]) || fields[0];
              const title = (first && record.values[first.id]) || "Müraciət";
              const isOpen = expanded === record.id;
              return (
                <li key={record.id} className="py-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : record.id)}
                      className="flex min-w-0 flex-1 items-center gap-2 text-left"
                    >
                      <ChevronDown size={14} className={`shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                      <span className="min-w-0">
                        <span className="block truncate text-[12.5px] font-semibold text-slate-800">{title}</span>
                        <span className="mt-0.5 flex items-center gap-1 text-[10.5px] text-slate-500">
                          <CalendarDays size={11} />
                          {new Date(record.ts).toLocaleDateString("az-AZ")}
                        </span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteApplication(record)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                      aria-label="Müraciəti sil"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  {isOpen && (
                    <dl className="mt-3 space-y-2 rounded-xl bg-[#FBFAFF] p-3">
                      {fields.map((field) => (
                        <div key={field.id}>
                          <dt className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">{field.label}</dt>
                          <dd className="mt-0.5 whitespace-pre-line text-[12px] leading-relaxed text-slate-700">
                            {record.values[field.id] || "—"}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Sahə dialogu */}
      {draft && (
        <div className="fixed inset-0 z-[65] flex items-end justify-center bg-[#120E26]/60 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{draft.id ? "Sahəni redaktə et" : "Yeni form sahəsi"}</h3>
                <p className="text-[11px] text-slate-500">Müraciət səhifəsində bu sahə avtomatik görünür</p>
              </div>
              <button type="button" onClick={closeFieldDialog} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100" aria-label="Bağla">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-3.5 overflow-y-auto px-5 py-5">
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Sahə adı</span>
                <input
                  value={draft.label}
                  onChange={(e) => setDraft({ ...draft, label: e.target.value })}
                  placeholder="Məs: Ad və soyad"
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs text-slate-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                />
              </label>

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Növ</span>
                  <select
                    value={draft.type}
                    onChange={(e) => setDraft({ ...draft, type: e.target.value as FormFieldType })}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none focus:border-brand-400"
                  >
                    {TYPE_OPTIONS.map((type) => (
                      <option key={type} value={type}>
                        {FIELD_TYPE_LABELS[type]}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Sıra</span>
                  <input
                    type="number"
                    value={draft.order}
                    onChange={(e) => setDraft({ ...draft, order: Number(e.target.value) })}
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs text-slate-800 outline-none focus:border-brand-400"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Placeholder</span>
                <input
                  value={draft.placeholder || ""}
                  onChange={(e) => setDraft({ ...draft, placeholder: e.target.value })}
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs text-slate-800 outline-none focus:border-brand-400"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Köməkçi mətn</span>
                <input
                  value={draft.help || ""}
                  onChange={(e) => setDraft({ ...draft, help: e.target.value })}
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs text-slate-800 outline-none focus:border-brand-400"
                />
              </label>

              {draft.type === "select" && (
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Variantlar (hər sətirdə bir)</span>
                  <textarea
                    rows={4}
                    value={optionsText}
                    onChange={(e) => setOptionsText(e.target.value)}
                    placeholder={"Bakalavr\nMagistr\nDoktorant"}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs leading-relaxed text-slate-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  />
                </label>
              )}

              <label className="flex cursor-pointer items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-2.5">
                <input
                  type="checkbox"
                  checked={draft.required}
                  onChange={(e) => setDraft({ ...draft, required: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-400"
                />
                <span className="text-[11.5px] font-semibold text-slate-700">Məcburi sahə</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-3.5">
              <button type="button" onClick={closeFieldDialog} className="h-10 rounded-full border border-slate-200 px-4 text-xs font-semibold text-slate-600">
                İmtina
              </button>
              <button
                type="button"
                onClick={saveField}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-600 px-5 text-xs font-semibold text-white hover:bg-brand-700"
              >
                <Save size={14} /> Tətbiq et
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
