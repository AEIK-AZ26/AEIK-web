"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { SiteItem, SiteSection, SECTION_LABELS, formatDate, FALLBACK_IMAGE } from "@/lib/siteContent";
import { deleteContent, saveContent } from "@/lib/contentApi";
import MediaPicker from "@/components/menecer/MediaPicker";

type FieldKey = "title" | "subtitle" | "text" | "body" | "image" | "link" | "date" | "meta" | "order" | "status";

const SECTION_FIELDS: Record<SiteSection, FieldKey[]> = {
  announcement: ["title", "subtitle", "text", "date", "link", "image", "order", "status"],
  news: ["title", "subtitle", "text", "date", "link", "image", "order", "status"],
  membership: ["title", "subtitle", "text", "meta", "order", "status"],
  project: ["title", "subtitle", "text", "meta", "link", "image", "order", "status"],
  plan: ["title", "subtitle", "text", "meta", "order", "status"],
  about: ["title", "subtitle", "text", "body", "image", "link", "status"],
};

const FIELD_META: Record<FieldKey, { label: string; placeholder?: string; type: "text" | "textarea" | "long" }> = {
  title: { label: "Başlıq", type: "text", placeholder: "Qısa və aydın başlıq" },
  subtitle: { label: "Alt başlıq / etiket", type: "text", placeholder: "Məs: Aktiv elan, 01, Sentyabr 2026" },
  text: { label: "Qısa mətn", type: "textarea", placeholder: "Kartda görünən 1–3 cümlə" },
  body: { label: "Ətraflı mətn", type: "long", placeholder: "Hər sətir ayrı abzas/kateqoriya kimi göstərilir" },
  image: { label: "Şəkil", type: "text" },
  link: { label: "Keçid (URL)", type: "text", placeholder: "https://... və ya #elaqe" },
  date: { label: "Tarix", type: "text", placeholder: "2026-12-15" },
  meta: { label: "Qeyd / müddət", type: "text", placeholder: "Məs: 4 ay, Tezis qəbulu" },
  order: { label: "Sıra", type: "text", placeholder: "1" },
  status: { label: "Status", type: "text" },
};

const EMPTY: Partial<SiteItem> = {
  title: "",
  subtitle: "",
  text: "",
  body: "",
  image: "",
  link: "",
  date: "",
  meta: "",
  order: 0,
  status: "published",
};

interface ContentManagerProps {
  section: SiteSection;
  items: SiteItem[];
  onSaved: (item: SiteItem, isNew: boolean) => void;
  onDeleted: (id: string) => void;
  notify: (message: string, kind?: "ok" | "error") => void;
}

export default function ContentManager({ section, items, onSaved, onDeleted, notify }: ContentManagerProps) {
  const single = section === "about";
  const fields = SECTION_FIELDS[section];

  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<Partial<SiteItem> | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const sorted = useMemo(
    () =>
      items
        .slice()
        .sort(
          (a, b) =>
            (a.order ?? 0) - (b.order ?? 0) ||
            String(b.date || "").localeCompare(String(a.date || "")) ||
            b.ts - a.ts
        ),
    [items]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter((item) =>
      `${item.title} ${item.subtitle || ""} ${item.text || ""} ${item.meta || ""}`.toLowerCase().includes(q)
    );
  }, [sorted, query]);

  useEffect(() => {
    setQuery("");
    setDraft(null);
  }, [section]);

  const openNew = () => setDraft({ ...EMPTY, sec: section, order: (sorted.at(-1)?.order ?? 0) + 1 });
  const openEdit = (item: SiteItem) => setDraft({ ...item });

  const closeDialog = () => {
    setDraft(null);
    setPickerOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    const title = String(draft.title || "").trim();
    if (!title) {
      notify("Başlıq boş ola bilməz.", "error");
      return;
    }

    setSaving(true);
    const isNew = !draft.id;
    const payload: Partial<SiteItem> = {
      ...draft,
      sec: section,
      title,
      order: Number(draft.order) || 0,
      status: draft.status === "draft" ? "draft" : "published",
    };

    const res = await saveContent(payload);
    setSaving(false);

    if (!res.ok) {
      if (res.offline) {
        // API əlçatmazdır — dəyişiklik brauzerdə saxlanılır ki, iş dayanmasın.
        const local: SiteItem = {
          ...(payload as SiteItem),
          id: payload.id || `local-${Date.now().toString(36)}`,
          ts: Date.now(),
        };
        onSaved(local, isNew);
        notify("Baza əlçatmazdır — dəyişiklik yalnız bu brauzerdə saxlanıldı.", "error");
        closeDialog();
        return;
      }
      notify(res.error || "Yadda saxlamaq alınmadı.", "error");
      return;
    }

    onSaved({ ...(payload as SiteItem), ...(res.data || {}), id: res.data?.id || payload.id || `local-${Date.now()}` }, isNew);
    notify(isNew ? "Yeni məzmun əlavə olundu." : "Dəyişikliklər yadda saxlanıldı.");
    closeDialog();
  };

  const handleDelete = async (item: SiteItem) => {
    if (!window.confirm(`"${item.title}" silinsin? Bu əməliyyat geri qaytarılmır.`)) return;
    setBusyId(item.id);
    const res = await deleteContent(item.id);
    setBusyId(null);
    if (!res.ok) {
      notify(res.error || "Silmək alınmadı.", "error");
      if (res.offline) onDeleted(item.id);
      return;
    }
    onDeleted(item.id);
    notify("Məzmun silindi.");
  };

  const toggleStatus = async (item: SiteItem) => {
    const next = item.status === "draft" ? "published" : "draft";
    setBusyId(item.id);
    const res = await saveContent({ id: item.id, sec: section, title: item.title, status: next });
    setBusyId(null);
    if (!res.ok && !res.offline) {
      notify(res.error || "Status dəyişdirilmədi.", "error");
      return;
    }
    onSaved({ ...item, status: next }, false);
    notify(next === "published" ? "Məzmun dərc olundu." : "Məzmun qaralama kimi saxlanıldı.");
  };

  const move = async (item: SiteItem, direction: -1 | 1) => {
    const index = sorted.findIndex((i) => i.id === item.id);
    const neighbour = sorted[index + direction];
    if (!neighbour) return;

    setBusyId(item.id);
    await saveContent({ id: item.id, sec: section, title: item.title, order: (neighbour.order ?? 0) });
    await saveContent({ id: neighbour.id, sec: section, title: neighbour.title, order: (item.order ?? 0) });
    setBusyId(null);

    onSaved({ ...item, order: neighbour.order ?? 0 }, false);
    onSaved({ ...neighbour, order: item.order ?? 0 }, false);
  };

  // ── Tək qeyd (Haqqımızda) ────────────────────────────────────────
  if (single) {
    const record = sorted[0];
    const value = draft || record || { ...EMPTY, sec: section };
    return (
      <div className="space-y-5">
        <SectionHeading section={section} count={record ? 1 : 0} onNew={() => setDraft({ ...(record || EMPTY), sec: section })} newLabel="Redaktə et" />
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#EAE7F7] bg-white p-5 premium-shadow-soft sm:p-7"
        >
          <FieldGrid
            fields={fields.filter((f) => f !== "status")}
            value={value}
            onChange={(key, val) => setDraft({ ...value, [key]: val })}
            onPickImage={() => setPickerOpen(true)}
          />
          <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-slate-500">
              Haqqımızda bölməsi ana səhifədə birbaşa bu məlumatla göstərilir.
            </p>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand-600 px-5 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Yadda saxla
            </button>
          </div>
        </form>
        {pickerOpen && (
          <MediaPicker
            value={value.image}
            onChange={(url) => setDraft({ ...value, image: url })}
            onClose={() => setPickerOpen(false)}
            onError={(message) => notify(message, "error")}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <SectionHeading section={section} count={sorted.length} onNew={openNew} newLabel="Yeni əlavə et" />

      <div className="flex flex-col gap-3 rounded-2xl border border-[#EAE7F7] bg-white p-3.5 premium-shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Axtar..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-700 outline-none transition-colors focus:border-brand-400 focus:bg-white"
          />
        </div>
        <p className="text-[11px] text-slate-500">
          <span className="font-bold text-slate-700">{sorted.filter((i) => i.status !== "draft").length}</span> dərc olunmuş
          {" · "}
          <span className="font-bold text-slate-700">{sorted.filter((i) => i.status === "draft").length}</span> qaralama
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#DCD7EF] bg-white/60 px-6 py-14 text-center">
          <p className="text-sm font-semibold text-slate-700">Hələ məzmun yoxdur</p>
          <p className="mt-1 text-xs text-slate-500">İlk yazını əlavə edin — dərhal ana səhifədə görünəcək.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {filtered.map((item, index) => (
            <article
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#EAE7F7] bg-white premium-shadow-soft transition-shadow hover:shadow-lg sm:flex-row"
            >
              {fields.includes("image") && (
                <div className="relative h-40 w-full shrink-0 overflow-hidden bg-[#F1EFF9] sm:h-auto sm:w-40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image || FALLBACK_IMAGE}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
                    }}
                  />
                </div>
              )}

              <div className="flex min-w-0 flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    {item.subtitle && (
                      <p className="truncate text-[10px] font-bold uppercase tracking-[0.14em] text-brand-600">{item.subtitle}</p>
                    )}
                    <h3 className="mt-1 text-sm font-bold leading-snug text-slate-900">{item.title}</h3>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                      item.status === "draft"
                        ? "border-amber-200 bg-amber-50 text-amber-700"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {item.status === "draft" ? "Qaralama" : "Dərc"}
                  </span>
                </div>

                {item.text && <p className="mt-2 line-clamp-3 text-[11.5px] leading-relaxed text-slate-600">{item.text}</p>}

                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10.5px] text-slate-500">
                  {item.date && <span>{formatDate(item.date)}</span>}
                  {item.meta && <span className="truncate">{item.meta}</span>}
                  <span className="text-slate-400">#{index + 1}</span>
                </div>

                <div className="mt-auto flex items-center gap-1 border-t border-slate-100 pt-3">
                  <button
                    onClick={() => openEdit(item)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#F4F2FC] px-2.5 text-[11px] font-semibold text-brand-700 transition-colors hover:bg-[#EAE6FE]"
                  >
                    <Pencil size={12} /> Redaktə
                  </button>
                  <button
                    onClick={() => toggleStatus(item)}
                    disabled={busyId === item.id}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-semibold text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-50"
                    title={item.status === "draft" ? "Dərc et" : "Qaralama et"}
                  >
                    {item.status === "draft" ? <Eye size={12} /> : <EyeOff size={12} />}
                    {item.status === "draft" ? "Dərc et" : "Gizlət"}
                  </button>
                  <div className="ml-auto flex items-center gap-0.5">
                    <button
                      onClick={() => move(item, -1)}
                      disabled={index === 0 || busyId === item.id}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                      aria-label="Yuxarı"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      onClick={() => move(item, 1)}
                      disabled={index === filtered.length - 1 || busyId === item.id}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                      aria-label="Aşağı"
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      disabled={busyId === item.id}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                      aria-label="Sil"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {draft && (
        <div className="fixed inset-0 z-[65] flex items-end justify-center bg-[#120E26]/60 backdrop-blur-sm sm:items-center sm:p-4">
          <form
            onSubmit={handleSubmit}
            className="flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {draft.id ? "Məzmunu redaktə et" : "Yeni məzmun"} — {SECTION_LABELS[section]}
                </h3>
                <p className="text-[11px] text-slate-500">Bütün sahələr ana səhifədə uyğun bölmədə görünür</p>
              </div>
              <button type="button" onClick={closeDialog} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100" aria-label="Bağla">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
              <FieldGrid
                fields={fields.filter((f) => f !== "status")}
                value={draft}
                onChange={(key, val) => setDraft({ ...draft, [key]: val })}
                onPickImage={() => setPickerOpen(true)}
              />

              <div className="flex flex-wrap items-center gap-2 rounded-xl bg-slate-50 p-3">
                <span className="text-[11px] font-semibold text-slate-600">Status:</span>
                {(["published", "draft"] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setDraft({ ...draft, status })}
                    className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                      (draft.status || "published") === status
                        ? "bg-brand-600 text-white"
                        : "bg-white text-slate-600 border border-slate-200"
                    }`}
                  >
                    {status === "published" ? "Dərc olunmuş" : "Qaralama"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-3.5">
              <button type="button" onClick={closeDialog} className="h-10 rounded-full border border-slate-200 px-4 text-xs font-semibold text-slate-600">
                İmtina
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-600 px-5 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Yadda saxla
              </button>
            </div>
          </form>
        </div>
      )}

      {pickerOpen && draft && (
        <MediaPicker
          value={draft.image}
          onChange={(url) => setDraft({ ...draft, image: url })}
          onClose={() => setPickerOpen(false)}
          onError={(message) => notify(message, "error")}
        />
      )}
    </div>
  );
}

function SectionHeading({
  section,
  count,
  onNew,
  newLabel,
}: {
  section: SiteSection;
  count: number;
  onNew: () => void;
  newLabel: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-extrabold tracking-[-0.02em] text-ink sm:text-xl">{SECTION_LABELS[section]}</h2>
        <p className="mt-0.5 text-[11.5px] text-slate-500">
          {count} qeyd · ana səhifədə avtomatik yenilənir
        </p>
      </div>
      <button
        onClick={onNew}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand-600 px-4 text-xs font-semibold text-white transition-colors hover:bg-brand-700"
      >
        <Plus size={15} />
        {newLabel}
      </button>
    </div>
  );
}

function FieldGrid({
  fields,
  value,
  onChange,
  onPickImage,
}: {
  fields: FieldKey[];
  value: Partial<SiteItem>;
  onChange: (key: FieldKey, value: string | number) => void;
  onPickImage: () => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
      {fields.map((field) => {
        const meta = FIELD_META[field];
        const wide = meta.type !== "text" || field === "title" || field === "link";

        if (field === "image") {
          return (
            <div key={field} className="sm:col-span-2">
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                {meta.label}
              </label>
              <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center">
                <div className="relative h-20 w-full overflow-hidden rounded-lg bg-white sm:w-28">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={value.image || FALLBACK_IMAGE}
                    alt="Seçilmiş şəkil"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] text-slate-500">{value.image || "Şəkil seçilməyib"}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={onPickImage}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-white px-2.5 text-[11px] font-semibold text-brand-700 shadow-sm ring-1 ring-slate-200"
                    >
                      <ImagePlus size={13} /> Yüklə / seç
                    </button>
                    {value.image && (
                      <button
                        type="button"
                        onClick={() => onChange("image", "")}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-[11px] font-semibold text-slate-500 hover:text-rose-600"
                      >
                        <X size={12} /> Sil
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div key={field} className={wide ? "sm:col-span-2" : ""}>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
              {meta.label}
            </label>
            {meta.type === "text" ? (
              <input
                type={field === "date" ? "text" : field === "order" ? "number" : "text"}
                value={(value[field] as string | number | undefined) ?? ""}
                onChange={(e) => onChange(field, field === "order" ? Number(e.target.value) : e.target.value)}
                placeholder={meta.placeholder}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            ) : (
              <textarea
                value={(value[field] as string | undefined) ?? ""}
                onChange={(e) => onChange(field, e.target.value)}
                placeholder={meta.placeholder}
                rows={meta.type === "long" ? 5 : 3}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs leading-relaxed text-slate-800 outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
