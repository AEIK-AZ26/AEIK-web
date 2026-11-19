"use client";

import React, { useState } from "react";
import { 
  StickyNote, 
  Plus, 
  Trash2, 
  Calendar 
} from "lucide-react";
import { NoteItem } from "@/types";

interface NotesViewProps {
  notes: NoteItem[];
  isAdmin: boolean;
  onAddItem: (item: Omit<NoteItem, "id" | "sec" | "ts">) => void;
  onDeleteItem: (id: string) => void;
}

export default function NotesView({
  notes,
  isAdmin,
  onAddItem,
  onDeleteItem
}: NotesViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [meta, setMeta] = useState("");
  const [text, setText] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddItem({
      title: title.trim(),
      meta: meta.trim() || new Date().toLocaleDateString("az-AZ"),
      text: text.trim()
    });
    setTitle("");
    setMeta("");
    setText("");
    setShowAddForm(false);
  };

  const sorted = [...notes].sort((a, b) => b.ts - a.ts);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-purple-100 shadow-xs">
        <div className="flex items-center gap-2">
          <StickyNote size={18} className="text-brand-600" />
          <span className="font-bold text-sm text-slate-800">
            Daxili Qeydlər və Xatırlatmalar ({notes.length})
          </span>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition-all"
          >
            <Plus size={15} />
            <span>{showAddForm ? "Formu Bağla" : "Yeni Qeyd"}</span>
          </button>
        )}
      </div>

      {/* Add Form */}
      {showAddForm && isAdmin && (
        <form
          onSubmit={handleCreate}
          className="p-6 rounded-2xl bg-white border border-purple-200 shadow-md space-y-4"
        >
          <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <StickyNote size={16} className="text-brand-600" />
            <span>Yeni Qeyd Yaz</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="Qeydin başlığı *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none"
            />
            <input
              type="text"
              placeholder="Tarix və ya kateqoriya (məs: 2026 / Təcili)"
              value={meta}
              onChange={(e) => setMeta(e.target.value)}
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none"
            />
          </div>

          <textarea
            placeholder="Qeydin mətni..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
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
              Qeydi Yadda Saxla
            </button>
          </div>
        </form>
      )}

      {/* Notes Masonry / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((n) => (
          <div
            key={n.id}
            className="bg-white rounded-2xl border border-purple-100 shadow-xs p-5 hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 pb-2 mb-2 border-b border-slate-100">
                <h4 className="font-bold text-slate-800 text-sm">{n.title}</h4>
                {isAdmin && (
                  <button
                    onClick={() => {
                      if (confirm("Bu qeyd silinsin?")) onDeleteItem(n.id);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    title="Sil"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              {n.meta && (
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-2">
                  <Calendar size={12} />
                  <span>{n.meta}</span>
                </div>
              )}

              {n.text && (
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {n.text}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
