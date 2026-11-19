"use client";

import React, { useState } from "react";
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  User, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";
import { TaskItem } from "@/types";

interface TasksViewProps {
  tasks: TaskItem[];
  isAdmin: boolean;
  onAddItem: (item: Omit<TaskItem, "id" | "sec" | "ts">) => void;
  onUpdateStatus: (id: string, status: TaskItem["status"]) => void;
  onDeleteItem: (id: string) => void;
}

const TASK_STATUSES = ["Gözləyir", "Davam edir", "Tamam"] as const;

export default function TasksView({
  tasks,
  isAdmin,
  onAddItem,
  onUpdateStatus,
  onDeleteItem
}: TasksViewProps) {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [meta, setMeta] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState<TaskItem["status"]>("Gözləyir");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddItem({
      title: title.trim(),
      meta: meta.trim(),
      text: text.trim(),
      status
    });
    setTitle("");
    setMeta("");
    setText("");
    setShowAddForm(false);
  };

  const filtered = tasks
    .filter((t) => filterStatus === "all" || t.status === filterStatus)
    .sort((a, b) => b.ts - a.ts);

  const getStatusBadge = (st: string) => {
    switch (st) {
      case "Gözləyir": return "bg-amber-50 text-amber-700 border-amber-200";
      case "Davam edir": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Tamam": return "bg-emerald-50 text-emerald-700 border-emerald-200";
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
            Bütün Tapşırıqlar ({tasks.length})
          </button>
          {TASK_STATUSES.map((st) => {
            const count = tasks.filter((t) => t.status === st).length;
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
            <span>{showAddForm ? "Formu Bağla" : "Yeni İş / Tapşırıq"}</span>
          </button>
        )}
      </div>

      {/* Add Task Form */}
      {showAddForm && isAdmin && (
        <form
          onSubmit={handleCreate}
          className="p-6 rounded-2xl bg-white border border-purple-200 shadow-md space-y-4"
        >
          <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <CheckSquare size={16} className="text-brand-600" />
            <span>Yeni Görüləcək İş Qeydiyyatı</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="İşin adı *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none"
            />
            <input
              type="text"
              placeholder="Məsul şəxs"
              value={meta}
              onChange={(e) => setMeta(e.target.value)}
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none"
            >
              {TASK_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <textarea
            placeholder="Tapşırığın təfərrüatları, son müddət və təlimat..."
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
              Tapşırığı Saxla
            </button>
          </div>
        </form>
      )}

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-2xl border border-purple-100 shadow-xs p-5 hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-bold text-slate-800 text-sm leading-snug">{t.title}</h4>
                <select
                  disabled={!isAdmin}
                  value={t.status}
                  onChange={(e) => onUpdateStatus(t.id, e.target.value as any)}
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold border outline-none shrink-0 ${getStatusBadge(t.status)}`}
                >
                  {TASK_STATUSES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              {t.meta && (
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-2">
                  <User size={13} className="text-brand-600" />
                  <span>Məsul: <b>{t.meta}</b></span>
                </p>
              )}

              {t.text && (
                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl leading-relaxed whitespace-pre-wrap">
                  {t.text}
                </p>
              )}
            </div>

            {isAdmin && (
              <div className="pt-3 mt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => {
                    if (confirm("Bu tapşırıq silinsin?")) onDeleteItem(t.id);
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 text-xs flex items-center gap-1"
                >
                  <Trash2 size={13} />
                  <span>Sil</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
