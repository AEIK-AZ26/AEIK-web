"use client";

import React, { useState } from "react";
import { 
  Users2, 
  Plus, 
  Trash2, 
  Calendar, 
  FileText, 
  CheckCircle2 
} from "lucide-react";
import { MeetingItem } from "@/types";

interface MeetingsViewProps {
  meetings: MeetingItem[];
  isAdmin: boolean;
  onAddItem: (item: Omit<MeetingItem, "id" | "sec" | "ts">) => void;
  onDeleteItem: (id: string) => void;
}

export default function MeetingsView({
  meetings,
  isAdmin,
  onAddItem,
  onDeleteItem
}: MeetingsViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [meta, setMeta] = useState("");
  const [text, setText] = useState("");
  const [text2, setText2] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddItem({
      title: title.trim(),
      meta: meta.trim(),
      text: text.trim(),
      text2: text2.trim()
    });
    setTitle("");
    setMeta("");
    setText("");
    setText2("");
    setShowAddForm(false);
  };

  const sorted = [...meetings].sort((a, b) => b.ts - a.ts);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-purple-100 shadow-xs">
        <div className="flex items-center gap-2">
          <Users2 size={18} className="text-brand-600" />
          <span className="font-bold text-sm text-slate-800">
            İclas Protokolları və Qərarlar ({meetings.length})
          </span>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition-all"
          >
            <Plus size={15} />
            <span>{showAddForm ? "Formu Bağla" : "Yeni İclas Qeydi"}</span>
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
            <FileText size={16} className="text-brand-600" />
            <span>Yeni İclas Protokolu</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="İclasın mövzusu *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none"
            />
            <input
              type="text"
              placeholder="Tarix (məs: 20 Mart 2026)"
              value={meta}
              onChange={(e) => setMeta(e.target.value)}
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none"
            />
          </div>

          <textarea
            placeholder="İclasın gündəliyi və müzakirə olunan əsas mövzular..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none"
          />

          <textarea
            placeholder="Qəbul edilmiş qərarlar və təyinatlar..."
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            rows={2}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-emerald-200 bg-emerald-50/40 focus:bg-white focus:border-emerald-600 outline-none"
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
              İclası Yadda Saxla
            </button>
          </div>
        </form>
      )}

      {/* Meetings List */}
      <div className="space-y-4">
        {sorted.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-2xl border border-purple-100 shadow-xs p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-800">{m.title}</h3>
                {m.meta && (
                  <span className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <Calendar size={13} />
                    <span>{m.meta}</span>
                  </span>
                )}
              </div>

              {isAdmin && (
                <button
                  onClick={() => {
                    if (confirm("Bu iclas qeydi silinsin?")) onDeleteItem(m.id);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  title="Sil"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>

            {m.text && (
              <div className="py-3 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                {m.text}
              </div>
            )}

            {m.text2 && (
              <div className="mt-2 p-3.5 rounded-xl bg-emerald-50/70 border-l-4 border-emerald-500 text-xs text-emerald-950 font-medium space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <CheckCircle2 size={14} />
                  <span>Qəbul edilmiş qərarlar:</span>
                </div>
                <p className="whitespace-pre-wrap">{m.text2}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
