"use client";

import React, { useState } from "react";
import { 
  Building2, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Calendar, 
  User, 
  ArrowRight,
  PhoneCall
} from "lucide-react";
import { PartnerItem } from "@/types";

interface PartnersViewProps {
  partners: PartnerItem[];
  isAdmin: boolean;
  onAddItem: (item: Omit<PartnerItem, "id" | "sec" | "ts">) => void;
  onUpdateStatus: (id: string, status: PartnerItem["status"]) => void;
  onDeleteItem: (id: string) => void;
}

const PARTNER_STATUSES = ["Əlaqə qurulub", "Danışıqlar", "Razılaşma", "Aktiv", "Dayandırılıb"] as const;
const PARTNER_TYPES = ["Universitet", "Dövlət qurumu", "QHT", "Şirkət / sponsor", "Media", "Digər"] as const;

export default function PartnersView({
  partners,
  isAdmin,
  onAddItem,
  onUpdateStatus,
  onDeleteItem
}: PartnersViewProps) {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<PartnerItem["status"]>("Əlaqə qurulub");
  const [ptype, setPtype] = useState<PartnerItem["ptype"]>("Universitet");
  const [who, setWho] = useState("");
  const [contact, setContact] = useState("");
  const [date, setDate] = useState("");
  const [next, setNext] = useState("");
  const [link, setLink] = useState("");
  const [text, setText] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddItem({
      title: title.trim(),
      status,
      ptype,
      who: who.trim(),
      contact: contact.trim(),
      date,
      next: next.trim(),
      link: link.trim(),
      text: text.trim()
    });
    setTitle("");
    setContact("");
    setNext("");
    setText("");
    setLink("");
    setShowAddForm(false);
  };

  const filtered = partners
    .filter((p) => filterStatus === "all" || p.status === filterStatus)
    .sort((a, b) => b.ts - a.ts);

  const getStatusBadge = (st: string) => {
    switch (st) {
      case "Əlaqə qurulub": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Danışıqlar": return "bg-amber-50 text-amber-700 border-amber-200";
      case "Razılaşma": return "bg-purple-50 text-purple-700 border-purple-200";
      case "Aktiv": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Dayandırılıb": return "bg-rose-50 text-rose-700 border-rose-200";
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
            Hamısı ({partners.length})
          </button>
          {PARTNER_STATUSES.map((st) => {
            const count = partners.filter((p) => p.status === st).length;
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
            <span>{showAddForm ? "Formu Bağla" : "Yeni Əməkdaşlıq"}</span>
          </button>
        )}
      </div>

      {/* Add Partner Form */}
      {showAddForm && isAdmin && (
        <form
          onSubmit={handleCreate}
          className="p-6 rounded-2xl bg-white border border-purple-200 shadow-md space-y-4"
        >
          <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Building2 size={16} className="text-brand-600" />
            <span>Yeni Tərəfdaş / Əməkdaşlıq Qeydiyyatı</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="Qurumun adı *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none"
            >
              {PARTNER_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              value={ptype}
              onChange={(e) => setPtype(e.target.value as any)}
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none"
            >
              {PARTNER_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Bizdən məsul şəxs"
              value={who}
              onChange={(e) => setWho(e.target.value)}
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none"
            />
            <input
              type="text"
              placeholder="Əlaqə şəxsi (Qurum tərəfdən)"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Növbəti addım nədir?"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none"
            />
            <input
              type="url"
              placeholder="Nəticə / Sənəd linki"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none"
            />
          </div>

          <textarea
            placeholder="Əməkdaşlığın məzmunu və nəticəsi haqqında qeydlər..."
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
              Qurumu Əlavə Et
            </button>
          </div>
        </form>
      )}

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl border border-purple-100 shadow-xs p-5 hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm leading-snug">{p.title}</h4>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500">
                    {p.ptype && (
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-brand-700 font-semibold text-[11px]">
                        {p.ptype}
                      </span>
                    )}
                    {p.date && (
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Calendar size={12} />
                        Son: {p.date}
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
                    {PARTNER_STATUSES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        if (confirm(`"${p.title}" tərəfdaşlığı silinsin?`)) onDeleteItem(p.id);
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
                {p.contact && (
                  <p className="flex items-center gap-2">
                    <PhoneCall size={13} className="text-brand-600" />
                    <span>Əlaqə şəxsi: <b>{p.contact}</b></span>
                  </p>
                )}
                {p.who && (
                  <p className="flex items-center gap-2">
                    <User size={13} className="text-slate-400" />
                    <span>Bizdən məsul: <b>{p.who}</b></span>
                  </p>
                )}
                {p.next && (
                  <p className="flex items-center gap-2 text-brand-700 font-medium bg-purple-50/70 p-2 rounded-xl">
                    <ArrowRight size={13} className="text-brand-600 shrink-0" />
                    <span>Növbəti addım: {p.next}</span>
                  </p>
                )}
              </div>

              {p.text && (
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl mt-3">
                  {p.text}
                </p>
              )}
            </div>

            {p.link && (
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-brand-600 hover:underline font-semibold mt-3"
              >
                <span>Memorandum və ya Sənədə Bax</span>
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
