"use client";

import React, { useState } from "react";
import { 
  Award, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Calendar, 
  User, 
  DollarSign,
  Tag
} from "lucide-react";
import { ResultItem } from "@/types";

interface ResultsViewProps {
  results: ResultItem[];
  isAdmin: boolean;
  onAddItem: (item: Omit<ResultItem, "id" | "sec" | "ts">) => void;
  onUpdateStatus: (id: string, status: ResultItem["status"]) => void;
  onDeleteItem: (id: string) => void;
}

const RESULT_STATUSES = ["Gözləyir", "Davam edir", "Uğurlu", "Uğursuz"] as const;
const RESULT_AREAS = ["Qrant", "Sponsor", "Kommunikasiya", "Tərəfdaşlıq", "Sənədləşmə", "Tədbir", "Digər"] as const;

export default function ResultsView({
  results,
  isAdmin,
  onAddItem,
  onUpdateStatus,
  onDeleteItem
}: ResultsViewProps) {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<ResultItem["status"]>("Gözləyir");
  const [area, setArea] = useState<ResultItem["area"]>("Qrant");
  const [who, setWho] = useState("");
  const [date, setDate] = useState("");
  const [val, setVal] = useState("");
  const [link, setLink] = useState("");
  const [text, setText] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddItem({
      title: title.trim(),
      status,
      area,
      who: who.trim(),
      date,
      val: val.trim(),
      link: link.trim(),
      text: text.trim()
    });
    setTitle("");
    setVal("");
    setText("");
    setLink("");
    setShowAddForm(false);
  };

  const filtered = results
    .filter((r) => filterStatus === "all" || r.status === filterStatus)
    .sort((a, b) => b.ts - a.ts);

  const getStatusBadge = (st: string) => {
    switch (st) {
      case "Gözləyir": return "bg-amber-50 text-amber-700 border-amber-200";
      case "Davam edir": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Uğurlu": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Uğursuz": return "bg-rose-50 text-rose-700 border-rose-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Add Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-purple-100 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filterStatus === "all"
                ? "bg-brand-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Hamısı ({results.length})
          </button>
          {RESULT_STATUSES.map((st) => {
            const count = results.filter((r) => r.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  filterStatus === st
                    ? "bg-brand-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold transition-all shadow-xs"
          >
            <Plus size={15} />
            <span>{showAddForm ? "Formu Bağla" : "Yeni Nəticə"}</span>
          </button>
        )}
      </div>

      {/* Add Result Form */}
      {showAddForm && isAdmin && (
        <form
          onSubmit={handleCreate}
          className="p-6 rounded-2xl bg-white border border-purple-200 shadow-md space-y-4"
        >
          <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Award size={16} className="text-brand-600" />
            <span>Yeni Nəticə və ya Nailiyyət Qeydiyyatı</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="İş və ya nəticənin adı *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none"
            >
              {RESULT_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value as any)}
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none"
            >
              {RESULT_AREAS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Məsul şəxs"
              value={who}
              onChange={(e) => setWho(e.target.value)}
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none"
            />
            <input
              type="text"
              placeholder="Məbləğ / Say göstəricisi (məs: 5000 AZN və ya 150 nəfər)"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none"
            />
          </div>

          <input
            type="url"
            placeholder="Nəticənin sənəd və ya sübut linki"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none"
          />

          <textarea
            placeholder="Nəticənin ətraflı təsviri..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-600"
            >
              İmtina
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs"
            >
              Nəticəni Saxla
            </button>
          </div>
        </form>
      )}

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-2xl border border-purple-100 shadow-xs p-5 hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm leading-snug">{r.title}</h4>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500">
                    {r.area && (
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-brand-700 font-semibold text-[11px]">
                        {r.area}
                      </span>
                    )}
                    {r.date && (
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Calendar size={12} />
                        {r.date}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <select
                    disabled={!isAdmin}
                    value={r.status}
                    onChange={(e) => onUpdateStatus(r.id, e.target.value as any)}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold border outline-none ${getStatusBadge(r.status)}`}
                  >
                    {RESULT_STATUSES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        if (confirm(`"${r.title}" nəticəsi silinsin?`)) onDeleteItem(r.id);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Sil"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 py-1">
                {r.val && (
                  <p className="flex items-center gap-2 text-emerald-700 font-bold bg-emerald-50/70 p-2 rounded-xl">
                    <DollarSign size={14} className="text-emerald-600 shrink-0" />
                    <span>Göstərici: {r.val}</span>
                  </p>
                )}
                {r.who && (
                  <p className="flex items-center gap-2">
                    <User size={13} className="text-slate-400" />
                    <span>Məsul: <b>{r.who}</b></span>
                  </p>
                )}
              </div>

              {r.text && (
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl mt-3">
                  {r.text}
                </p>
              )}
            </div>

            {r.link && (
              <a
                href={r.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-brand-600 hover:underline font-semibold mt-3"
              >
                <span>Nəticə Sənədinə Bax</span>
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
