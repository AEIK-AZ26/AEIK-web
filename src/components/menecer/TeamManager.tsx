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
import { DEFAULT_TEAM, TeamMember } from "@/lib/team";
import { deleteTeamMember, loadTeam, saveTeamMember } from "@/lib/teamApi";
import MediaPicker from "@/components/menecer/MediaPicker";

const EMPTY: Partial<TeamMember> = {
  name: "",
  role: "",
  project: "",
  text: "",
  image: "",
  email: "",
  order: 0,
  status: "published",
};

interface TeamManagerProps {
  notify: (message: string, kind?: "ok" | "error") => void;
}

export default function TeamManager({ notify }: TeamManagerProps) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<Partial<TeamMember> | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadTeam()
      .then((res) => {
        if (cancelled) return;
        setMembers(res.members.length ? res.members : DEFAULT_TEAM);
        setConnected(res.connected);
      })
      .catch((error: any) => {
        if (cancelled) return;
        if (error?.status === 401) {
          window.location.href = "/login?next=/menecer";
          return;
        }
        setMembers(DEFAULT_TEAM);
        setConnected(false);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const sorted = useMemo(
    () => members.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.ts - b.ts),
    [members]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter((member) =>
      `${member.name} ${member.role} ${member.project} ${member.text}`.toLowerCase().includes(q)
    );
  }, [sorted, query]);

  const openNew = () => setDraft({ ...EMPTY, order: (sorted.at(-1)?.order ?? 0) + 1 });
  const openEdit = (member: TeamMember) => setDraft({ ...member });
  const closeDialog = () => {
    setDraft(null);
    setPickerOpen(false);
  };

  const replace = (member: TeamMember) => {
    setMembers((prev) => {
      const exists = prev.some((entry) => entry.id === member.id);
      return exists ? prev.map((entry) => (entry.id === member.id ? member : entry)) : [...prev, member];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;

    const name = String(draft.name || "").replace(/\s+/g, " ").trim();
    if (!name) {
      notify("Ad və soyad boş ola bilməz.", "error");
      return;
    }

    setSaving(true);
    const payload: Partial<TeamMember> = {
      ...draft,
      name,
      order: Number(draft.order) || 0,
      status: draft.status === "draft" ? "draft" : "published",
    };
    const res = await saveTeamMember(payload);
    setSaving(false);

    if (!res.ok) {
      if (res.offline) {
        replace({
          ...(payload as TeamMember),
          id: payload.id || `local-${Date.now().toString(36)}`,
          ts: Date.now(),
        });
        notify("Baza əlçatmazdır — dəyişiklik yalnız bu brauzerdə saxlanıldı.", "error");
        closeDialog();
        return;
      }
      notify(res.error || "Yadda saxlamaq alınmadı.", "error");
      return;
    }

    const saved = {
      ...(payload as TeamMember),
      ...(res.data || {}),
      id: res.data?.id || payload.id || `local-${Date.now()}`,
    } as TeamMember;
    replace(saved);
    notify(payload.id ? "Komanda üzvü yeniləndi." : "Yeni komanda üzvü əlavə olundu.");
    closeDialog();
  };

  const handleDelete = async (member: TeamMember) => {
    if (!window.confirm(`"${member.name}" silinsin? Bu əməliyyat geri qaytarılmır.`)) return;
    setBusyId(member.id);
    const res = await deleteTeamMember(member.id);
    setBusyId(null);
    if (!res.ok && !res.offline) {
      notify(res.error || "Silmək alınmadı.", "error");
      return;
    }
    setMembers((prev) => prev.filter((entry) => entry.id !== member.id));
    notify("Komanda üzvü silindi.");
  };

  const toggleStatus = async (member: TeamMember) => {
    const next = member.status === "draft" ? "published" : "draft";
    setBusyId(member.id);
    const res = await saveTeamMember({ ...member, status: next });
    setBusyId(null);
    if (!res.ok && !res.offline) {
      notify(res.error || "Status dəyişdirilmədi.", "error");
      return;
    }
    replace({ ...member, status: next });
    notify(next === "published" ? "Üzv saytda dərc olundu." : "Üzv qaralama kimi saxlanıldı.");
  };

  const move = async (member: TeamMember, direction: -1 | 1) => {
    const index = sorted.findIndex((entry) => entry.id === member.id);
    const neighbour = sorted[index + direction];
    if (!neighbour) return;

    setBusyId(member.id);
    await saveTeamMember({ ...member, order: neighbour.order ?? 0 });
    await saveTeamMember({ ...neighbour, order: member.order ?? 0 });
    setBusyId(null);

    replace({ ...member, order: neighbour.order ?? 0 });
    replace({ ...neighbour, order: member.order ?? 0 });
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-extrabold tracking-[-0.02em] text-ink sm:text-xl">Komanda</h2>
          <p className="mt-0.5 text-[11.5px] text-slate-500">
            {sorted.length} üzv · /komanda səhifəsində “Layihələri idarə edən komanda” bölməsində görünür
            {!connected && " · baza əlçatmazdır"}
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand-600 px-4 text-xs font-semibold text-white transition-colors hover:bg-brand-700"
        >
          <Plus size={15} />
          Yeni üzv
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-[#EAE7F7] bg-white p-3.5 premium-shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ad, vəzifə və ya layihə üzrə axtar..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-700 outline-none transition-colors focus:border-brand-400 focus:bg-white"
          />
        </div>
        <p className="text-[11px] text-slate-500">
          <span className="font-bold text-slate-700">{sorted.filter((m) => m.status !== "draft").length}</span> dərc
          olunmuş{" · "}
          <span className="font-bold text-slate-700">{sorted.filter((m) => m.status === "draft").length}</span> qaralama
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#DCD7EF] bg-white/60 px-6 py-14 text-center">
          <p className="text-sm font-semibold text-slate-700">Hələ komanda üzvü yoxdur</p>
          <p className="mt-1 text-xs text-slate-500">İlk üzvü əlavə edin — dərhal /komanda səhifəsində görünəcək.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {filtered.map((member, index) => (
            <article
              key={member.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#EAE7F7] bg-white premium-shadow-soft transition-shadow hover:shadow-lg sm:flex-row"
            >
              <div className="relative h-40 w-full shrink-0 overflow-hidden bg-[#F1EFF9] sm:h-auto sm:w-36">
                {member.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={member.image} alt={member.name} loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-2xl font-extrabold text-brand-600/50">
                    {(member.name || "?").slice(0, 1).toUpperCase()}
                  </span>
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    {member.role && (
                      <p className="truncate text-[10px] font-bold uppercase tracking-[0.14em] text-brand-600">
                        {member.role}
                      </p>
                    )}
                    <h3 className="mt-1 text-sm font-bold leading-snug text-slate-900">{member.name}</h3>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                      member.status === "draft"
                        ? "border-amber-200 bg-amber-50 text-amber-700"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {member.status === "draft" ? "Qaralama" : "Dərc"}
                  </span>
                </div>

                {member.project && (
                  <p className="mt-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                    {member.project}
                  </p>
                )}
                {member.text && <p className="mt-2 line-clamp-3 text-[11.5px] leading-relaxed text-slate-600">{member.text}</p>}

                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10.5px] text-slate-500">
                  {member.email && <span className="truncate">{member.email}</span>}
                  <span className="text-slate-400">#{index + 1}</span>
                </div>

                <div className="mt-auto flex items-center gap-1 border-t border-slate-100 pt-3">
                  <button
                    onClick={() => openEdit(member)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#F4F2FC] px-2.5 text-[11px] font-semibold text-brand-700 transition-colors hover:bg-[#EAE6FE]"
                  >
                    <Pencil size={12} /> Redaktə
                  </button>
                  <button
                    onClick={() => toggleStatus(member)}
                    disabled={busyId === member.id}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-semibold text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-50"
                    title={member.status === "draft" ? "Dərc et" : "Qaralama et"}
                  >
                    {member.status === "draft" ? <Eye size={12} /> : <EyeOff size={12} />}
                    {member.status === "draft" ? "Dərc et" : "Gizlət"}
                  </button>
                  <div className="ml-auto flex items-center gap-0.5">
                    <button
                      onClick={() => move(member, -1)}
                      disabled={index === 0 || busyId === member.id}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                      aria-label="Yuxarı"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      onClick={() => move(member, 1)}
                      disabled={index === filtered.length - 1 || busyId === member.id}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                      aria-label="Aşağı"
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(member)}
                      disabled={busyId === member.id}
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
                  {draft.id ? "Komanda üzvünü redaktə et" : "Yeni komanda üzvü"}
                </h3>
                <p className="text-[11px] text-slate-500">Dərc olunan üzvlər /komanda səhifəsində görünür</p>
              </div>
              <button type="button" onClick={closeDialog} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100" aria-label="Bağla">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-3.5 overflow-y-auto px-5 py-5">
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                    Ad və soyad
                  </label>
                  <input
                    value={draft.name || ""}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    placeholder="Məs: Nərgiz İsmayılova"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                    Vəzifə
                  </label>
                  <input
                    value={draft.role || ""}
                    onChange={(e) => setDraft({ ...draft, role: e.target.value })}
                    placeholder="Məs: DNT Günü üzrə rəhbər"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                    Layihə
                  </label>
                  <input
                    value={draft.project || ""}
                    onChange={(e) => setDraft({ ...draft, project: e.target.value })}
                    placeholder="Məs: DNT Günü"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                    E-poçt (istəyə bağlı)
                  </label>
                  <input
                    value={draft.email || ""}
                    onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                    placeholder="ad@aeik.az"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                    Sıra
                  </label>
                  <input
                    type="number"
                    value={draft.order ?? 0}
                    onChange={(e) => setDraft({ ...draft, order: Number(e.target.value) })}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                    Qısa məlumat
                  </label>
                  <textarea
                    value={draft.text || ""}
                    onChange={(e) => setDraft({ ...draft, text: e.target.value })}
                    rows={3}
                    placeholder="Vəzifə öhdəliklərini 1–2 cümlə ilə yazın"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs leading-relaxed text-slate-800 outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                    Foto
                  </label>
                  <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center">
                    <div className="relative h-20 w-full overflow-hidden rounded-lg bg-white sm:w-20">
                      {draft.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={draft.image} alt="Seçilmiş foto" className="h-full w-full object-cover" />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-[10px] text-slate-400">
                          Foto yoxdur
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] text-slate-500">{draft.image || "Foto seçilməyib"}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setPickerOpen(true)}
                          className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-white px-2.5 text-[11px] font-semibold text-brand-700 shadow-sm ring-1 ring-slate-200"
                        >
                          <ImagePlus size={13} /> Yüklə / seç
                        </button>
                        {draft.image && (
                          <button
                            type="button"
                            onClick={() => setDraft({ ...draft, image: "" })}
                            className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-[11px] font-semibold text-slate-500 hover:text-rose-600"
                          >
                            <X size={12} /> Sil
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

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
                        : "border border-slate-200 bg-white text-slate-600"
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
