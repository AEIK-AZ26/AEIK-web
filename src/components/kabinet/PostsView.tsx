"use client";

import React, { useState } from "react";
import { 
  Share2, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Calendar, 
  User, 
  Layers,
  Instagram,
  Facebook,
  Linkedin,
  Send,
  Twitter
} from "lucide-react";
import { PostItem, Project } from "@/types";

interface PostsViewProps {
  posts: PostItem[];
  projects: Record<string, Project>;
  isAdmin: boolean;
  onAddItem: (item: Omit<PostItem, "id" | "sec" | "ts">) => void;
  onUpdateStatus: (id: string, status: PostItem["status"]) => void;
  onDeleteItem: (id: string) => void;
}

const POST_STATUSES = ["İdeya", "Hazırlanır", "Təsdiqdə", "Paylaşıldı"] as const;
const PLATFORMS = ["Instagram", "Facebook", "LinkedIn", "Telegram", "X"] as const;

export default function PostsView({
  posts,
  projects,
  isAdmin,
  onAddItem,
  onUpdateStatus,
  onDeleteItem
}: PostsViewProps) {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<PostItem["status"]>("İdeya");
  const [date, setDate] = useState("");
  const [plat, setPlat] = useState<PostItem["plat"]>("Instagram");
  const [proj, setProj] = useState("");
  const [who, setWho] = useState("");
  const [link, setLink] = useState("");
  const [text, setText] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddItem({
      title: title.trim(),
      status,
      date,
      plat,
      proj,
      who: who.trim(),
      link: link.trim(),
      text: text.trim()
    });
    setTitle("");
    setText("");
    setLink("");
    setShowAddForm(false);
  };

  const filteredPosts = posts
    .filter((p) => filterStatus === "all" || p.status === filterStatus)
    .sort((a, b) => (b.date || "").localeCompare(a.date || "") || b.ts - a.ts);

  const getStatusBadge = (st: string) => {
    switch (st) {
      case "İdeya": return "bg-amber-50 text-amber-700 border-amber-200";
      case "Hazırlanır": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Təsdiqdə": return "bg-purple-50 text-purple-700 border-purple-200";
      case "Paylaşıldı": return "bg-emerald-50 text-emerald-700 border-emerald-200";
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
            Hamısı ({posts.length})
          </button>
          {POST_STATUSES.map((st) => {
            const count = posts.filter((p) => p.status === st).length;
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
            <span>{showAddForm ? "Formu Bağla" : "Yeni Post Planı"}</span>
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
            <Share2 size={16} className="text-brand-600" />
            <span>Yeni SMM Postu Planlaşdır</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="Post mövzusu *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none"
            >
              {POST_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none"
            />
            <select
              value={plat}
              onChange={(e) => setPlat(e.target.value as any)}
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none"
            >
              {PLATFORMS.map((pl) => (
                <option key={pl} value={pl}>{pl}</option>
              ))}
            </select>
            <select
              value={proj}
              onChange={(e) => setProj(e.target.value)}
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none"
            >
              <option value="">Layihə seçin...</option>
              {Object.values(projects).map((pr) => (
                <option key={pr.id} value={pr.name}>{pr.name}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Məsul şəxs"
              value={who}
              onChange={(e) => setWho(e.target.value)}
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none"
            />
          </div>

          <input
            type="url"
            placeholder="Post Linki (paylaşıldıqdan sonra doldurula bilər)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none"
          />

          <textarea
            placeholder="Mətn və ya ideya təsviri..."
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
              Postu Əlavə Et
            </button>
          </div>
        </form>
      )}

      {/* Posts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPosts.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl border border-purple-100 shadow-xs p-5 hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm leading-snug">{p.title}</h4>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500">
                    {p.plat && (
                      <span className="px-2 py-0.5 rounded-full bg-purple-50 text-brand-700 font-semibold text-[11px]">
                        {p.plat}
                      </span>
                    )}
                    {p.proj && (
                      <span className="flex items-center gap-1 text-[11px] font-medium text-slate-600">
                        <Layers size={12} className="text-brand-600" />
                        {p.proj}
                      </span>
                    )}
                    {p.date && (
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Calendar size={12} />
                        {p.date}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <select
                    disabled={!isAdmin}
                    value={p.status}
                    onChange={(e) => onUpdateStatus(p.id, e.target.value as any)}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold border outline-none ${getStatusBadge(p.status)}`}
                  >
                    {POST_STATUSES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        if (confirm("Bu post planı silinsin?")) onDeleteItem(p.id);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Sil"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              {p.who && (
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-2">
                  <User size={13} className="text-slate-400" />
                  <span>Məsul: <b>{p.who}</b></span>
                </p>
              )}

              {p.text && (
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl mb-3">
                  {p.text}
                </p>
              )}
            </div>

            {p.link && (
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-brand-600 hover:underline font-semibold mt-2"
              >
                <span>Paylaşılmış Posta Bax</span>
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
