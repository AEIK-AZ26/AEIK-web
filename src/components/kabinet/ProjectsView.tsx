"use client";

import React, { useState } from "react";
import { 
  FolderGit2, 
  Plus, 
  Trash2, 
  Calendar, 
  Users, 
  UserCheck, 
  Clock, 
  MapPin,
  Tag
} from "lucide-react";
import { Project, CalendarEvent } from "@/types";

interface ProjectsViewProps {
  projects: Record<string, Project>;
  events: Record<string, CalendarEvent>;
  isAdmin: boolean;
  onAddProject: (project: Omit<Project, "id" | "ts">) => void;
  onUpdateProject: (id: string, updates: Partial<Project>) => void;
  onDeleteProject: (id: string) => void;
  onAddEvent: (event: Omit<CalendarEvent, "id" | "ts">) => void;
  onDeleteEvent: (id: string) => void;
}

const STAGES = ["Planlaşma", "Hazırlıq", "İcrada", "Tamamlandı"] as const;

export default function ProjectsView({
  projects,
  events,
  isAdmin,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onAddEvent,
  onDeleteEvent
}: ProjectsViewProps) {
  const [filterType, setFilterType] = useState<"all" | "Dövri" | "Böyük">("all");
  const [showAddForm, setShowAddForm] = useState(false);

  // New project state
  const [name, setName] = useState("");
  const [type, setType] = useState<"Dövri" | "Böyük">("Dövri");
  const [stage, setStage] = useState<typeof STAGES[number]>("Planlaşma");
  const [membersCount, setMembersCount] = useState<number>(0);
  const [owner, setOwner] = useState("");
  const [guest, setGuest] = useState("");
  const [note, setNote] = useState("");

  // New event inputs per project
  const [eventDate, setEventDate] = useState<Record<string, string>>({});
  const [eventTime, setEventTime] = useState<Record<string, string>>({});
  const [eventNote, setEventNote] = useState<Record<string, string>>({});

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddProject({
      name: name.trim(),
      type,
      stage,
      members: membersCount,
      owner: owner.trim(),
      guest: guest.trim(),
      note: note.trim()
    });
    setName("");
    setOwner("");
    setGuest("");
    setNote("");
    setShowAddForm(false);
  };

  const projectList = Object.values(projects)
    .filter((p) => filterType === "all" || p.type === filterType)
    .sort((a, b) => a.ts - b.ts);

  const getStageColor = (stg: string) => {
    switch (stg) {
      case "Planlaşma": return "bg-amber-50 text-amber-700 border-amber-200";
      case "Hazırlıq": return "bg-blue-50 text-blue-700 border-blue-200";
      case "İcrada": return "bg-purple-50 text-purple-700 border-purple-200";
      case "Tamamlandı": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar: Filters & Add Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-purple-100 shadow-xs">
        <div className="flex items-center gap-2">
          {(["all", "Dövri", "Böyük"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                filterType === t
                  ? "bg-brand-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t === "all" ? "Bütün Layihələr" : `${t} Layihələr`}
            </button>
          ))}
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold transition-all shadow-xs"
          >
            <Plus size={15} />
            <span>{showAddForm ? "Formu Bağla" : "Yeni Layihə"}</span>
          </button>
        )}
      </div>

      {/* Add Project Form Modal/Card */}
      {showAddForm && isAdmin && (
        <form
          onSubmit={handleCreate}
          className="p-6 rounded-2xl bg-white border border-purple-200 shadow-md space-y-4"
        >
          <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <FolderGit2 size={18} className="text-brand-600" />
            <span>Yeni Layihə Məlumatları</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="Layihənin adı *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="sm:col-span-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none"
            >
              <option value="Dövri">Dövri Layihə</option>
              <option value="Böyük">Böyük Layihə</option>
            </select>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as any)}
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none"
            >
              {STAGES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="number"
              min={0}
              placeholder="İştirakçı sayı"
              value={membersCount || ""}
              onChange={(e) => setMembersCount(Number(e.target.value) || 0)}
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none"
            />
            <input
              type="text"
              placeholder="Məsul şəxs"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none"
            />
            <input
              type="text"
              placeholder="Qonaq (varsa)"
              value={guest}
              onChange={(e) => setGuest(e.target.value)}
              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none"
            />
          </div>

          <textarea
            placeholder="Layihə haqqında qısa qeyd və məqsədlər..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              İmtina
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs"
            >
              Layihəni Saxla
            </button>
          </div>
        </form>
      )}

      {/* Projects Cards List */}
      <div className="grid grid-cols-1 gap-5">
        {projectList.map((p) => {
          const projectEvents = Object.values(events)
            .filter((e) => e.pid === p.id)
            .sort((a, b) => a.date.localeCompare(b.date));

          return (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-purple-100 shadow-xs p-5 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-800">{p.name}</h3>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-brand-700 border border-purple-200">
                      {p.type}
                    </span>
                  </div>
                  {p.owner && (
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                      <UserCheck size={14} className="text-brand-600" />
                      <span>Məsul: <b>{p.owner}</b></span>
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <select
                    disabled={!isAdmin}
                    value={p.stage}
                    onChange={(e) => onUpdateProject(p.id, { stage: e.target.value as any })}
                    className={`px-3 py-1 rounded-full text-xs font-bold border outline-none ${getStageColor(p.stage)} ${!isAdmin ? "cursor-default" : "cursor-pointer"}`}
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        if (confirm(`"${p.name}" layihəsi və onun təqvim tarixləri silinsin?`)) {
                          onDeleteProject(p.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Layihəni sil"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>

              {/* Editable Fields: Members & Guest */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-3 text-xs border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Users size={15} className="text-slate-400" />
                  <span className="text-slate-500">İştirakçı sayı:</span>
                  {isAdmin ? (
                    <input
                      type="number"
                      min={0}
                      value={p.members || 0}
                      onChange={(e) => onUpdateProject(p.id, { members: Number(e.target.value) || 0 })}
                      className="w-16 px-2 py-0.5 text-xs rounded border border-slate-200 bg-slate-50 focus:bg-white text-center font-bold text-slate-700"
                    />
                  ) : (
                    <span className="font-bold text-slate-700">{p.members || 0}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Tag size={15} className="text-slate-400" />
                  <span className="text-slate-500">Qonaq:</span>
                  {isAdmin ? (
                    <input
                      type="text"
                      placeholder="Qonağın adı..."
                      value={p.guest || ""}
                      onChange={(e) => onUpdateProject(p.id, { guest: e.target.value })}
                      className="flex-1 px-2 py-0.5 text-xs rounded border border-slate-200 bg-slate-50 focus:bg-white text-slate-700"
                    />
                  ) : (
                    <span className="text-slate-700 font-medium">{p.guest || "–"}</span>
                  )}
                </div>
              </div>

              {p.note && (
                <p className="text-xs text-slate-600 py-3 italic bg-slate-50/50 px-3 rounded-xl my-2">
                  {p.note}
                </p>
              )}

              {/* Linked Calendar Events */}
              <div className="mt-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
                  <Calendar size={14} className="text-brand-600" />
                  <span>Layihənin Təqvim Tarixləri</span>
                </div>

                {projectEvents.length > 0 ? (
                  <div className="space-y-1.5 mb-3">
                    {projectEvents.map((ev) => (
                      <div
                        key={ev.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-purple-50/60 border border-purple-100 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-brand-700">{ev.date}</span>
                          {ev.time && (
                            <span className="text-slate-500 flex items-center gap-1">
                              <Clock size={12} />
                              {ev.time}
                            </span>
                          )}
                          {ev.note && (
                            <span className="text-slate-600 flex items-center gap-1">
                              <MapPin size={12} />
                              {ev.note}
                            </span>
                          )}
                        </div>
                        {isAdmin && (
                          <button
                            onClick={() => onDeleteEvent(ev.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            title="Tarixi sil"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 mb-3 italic">Hələ tarix təyin olunmayıb.</p>
                )}

                {/* Add Event Form for this project */}
                {isAdmin && (
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                    <input
                      type="date"
                      value={eventDate[p.id] || ""}
                      onChange={(e) => setEventDate({ ...eventDate, [p.id]: e.target.value })}
                      className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50"
                    />
                    <input
                      type="time"
                      value={eventTime[p.id] || ""}
                      onChange={(e) => setEventTime({ ...eventTime, [p.id]: e.target.value })}
                      className="px-2 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50"
                    />
                    <input
                      type="text"
                      placeholder="Yer / Qeyd"
                      value={eventNote[p.id] || ""}
                      onChange={(e) => setEventNote({ ...eventNote, [p.id]: e.target.value })}
                      className="flex-1 min-w-[140px] px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50"
                    />
                    <button
                      onClick={() => {
                        const d = eventDate[p.id];
                        if (!d) return;
                        onAddEvent({
                          pid: p.id,
                          date: d,
                          time: eventTime[p.id] || "",
                          note: eventNote[p.id] || ""
                        });
                        setEventDate({ ...eventDate, [p.id]: "" });
                        setEventTime({ ...eventTime, [p.id]: "" });
                        setEventNote({ ...eventNote, [p.id]: "" });
                      }}
                      className="px-3 py-1.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold"
                    >
                      Təqvimə Yaz
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
