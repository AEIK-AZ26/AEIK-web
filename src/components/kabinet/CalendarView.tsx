"use client";

import React, { useState } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Plus, 
  Trash2 
} from "lucide-react";
import { MON } from "@/lib/store";
import { Project, CalendarEvent } from "@/types";

interface CalendarViewProps {
  projects: Record<string, Project>;
  events: Record<string, CalendarEvent>;
  isAdmin: boolean;
  onAddEvent: (event: Omit<CalendarEvent, "id" | "ts">) => void;
  onDeleteEvent: (id: string) => void;
}

const pad = (n: number) => String(n).padStart(2, "0");
const DAYS_OF_WEEK = ["B.e.", "Ç.a.", "Çər", "C.a.", "Cümə", "Şən", "Baz"];

// Deterministic pastel color generator from project name
function getProjectChipColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) % 360;
  }
  return `hsl(${hash}, 65%, 45%)`;
}

export default function CalendarView({
  projects,
  events,
  isAdmin,
  onAddEvent,
  onDeleteEvent
}: CalendarViewProps) {
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(2); // Mart default
  const [selectedDate, setSelectedDate] = useState("");

  // Add event form fields
  const [selectedProject, setSelectedProject] = useState(Object.keys(projects)[0] || "");
  const [eventTime, setEventTime] = useState("");
  const [eventNote, setEventNote] = useState("");

  const projectList = Object.values(projects).sort((a, b) => a.ts - b.ts);
  const eventList = Object.values(events);

  const ymPrefix = `${currentYear}-${pad(currentMonth + 1)}`;

  // Month days calculation
  const firstDayIndex = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !selectedDate) return;
    onAddEvent({
      pid: selectedProject,
      date: selectedDate,
      time: eventTime,
      note: eventNote.trim()
    });
    setEventTime("");
    setEventNote("");
  };

  const currentMonthEvents = eventList
    .filter((e) => e.date.startsWith(ymPrefix))
    .sort((a, b) => (a.date + (a.time || "")).localeCompare(b.date + (b.time || "")));

  return (
    <div className="space-y-6">
      {/* Year & Month Navigator */}
      <div className="bg-white rounded-2xl border border-purple-100 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentYear(currentYear - 1)}
              className="p-2 rounded-xl text-slate-500 hover:bg-purple-50 hover:text-brand-600 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <h3 className="text-base font-bold text-slate-800">
              {currentYear} Fəaliyyət Planı və Təqvim
            </h3>
            <button
              onClick={() => setCurrentYear(currentYear + 1)}
              className="p-2 rounded-xl text-slate-500 hover:bg-purple-50 hover:text-brand-600 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <span className="text-xs font-semibold px-3 py-1 bg-purple-50 text-brand-700 rounded-full border border-purple-200">
            {currentMonthEvents.length} Tədbir
          </span>
        </div>

        {/* 12 Months Navigation Pills */}
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5">
          {MON.map((month, idx) => {
            const count = eventList.filter((e) => e.date.startsWith(`${currentYear}-${pad(idx + 1)}`)).length;
            const isSelected = idx === currentMonth;

            return (
              <button
                key={month}
                onClick={() => {
                  setCurrentMonth(idx);
                  setSelectedDate("");
                }}
                className={`py-2 px-1 text-center rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-brand-600 text-white shadow-xs"
                    : "bg-slate-50 text-slate-600 hover:bg-purple-50 hover:text-brand-600"
                }`}
              >
                <div>{month}</div>
                {count > 0 && (
                  <span
                    className={`text-[10px] inline-block px-1.5 rounded-full ${
                      isSelected ? "bg-white/30 text-white" : "bg-purple-100 text-brand-700 font-bold"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Add Event Form */}
      {isAdmin && (
        <form
          onSubmit={handleAdd}
          className="p-4 rounded-2xl bg-white border border-purple-100 shadow-xs flex flex-wrap items-center gap-3 text-xs"
        >
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <Plus size={16} className="text-brand-600" />
            <span>Tədbir Əlavə Et:</span>
          </div>

          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 outline-none"
          >
            {projectList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            required
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 outline-none"
          />

          <input
            type="time"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 outline-none"
          />

          <input
            type="text"
            placeholder="Məkan / Qeyd..."
            value={eventNote}
            onChange={(e) => setEventNote(e.target.value)}
            className="flex-1 min-w-[150px] px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 outline-none"
          />

          <button
            type="submit"
            className="px-5 py-2 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-xs"
          >
            Əlavə et
          </button>
        </form>
      )}

      {/* 7-Day Calendar Grid */}
      <div className="bg-white rounded-2xl border border-purple-100 shadow-xs p-5 overflow-x-auto">
        <div className="min-w-[650px]">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {DAYS_OF_WEEK.map((d) => (
              <div key={d} className="text-center font-bold text-xs text-slate-400 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Grid Cells */}
          <div className="grid grid-cols-7 gap-2">
            {/* Blank offset cells for previous month */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`blank-${i}`} className="min-h-[85px] bg-slate-50/40 rounded-xl" />
            ))}

            {/* Days of the current month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${currentYear}-${pad(currentMonth + 1)}-${pad(dayNum)}`;
              const dayEvents = eventList.filter((e) => e.date === dateStr);
              const isSelected = selectedDate === dateStr;

              return (
                <div
                  key={dayNum}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`min-h-[85px] p-2 rounded-xl border transition-all cursor-pointer flex flex-col ${
                    isSelected
                      ? "bg-purple-50/70 border-brand-500 shadow-xs"
                      : "bg-white border-slate-200/80 hover:border-purple-300 hover:bg-slate-50/60"
                  }`}
                >
                  <span className={`text-xs font-bold mb-1 ${isSelected ? "text-brand-600" : "text-slate-700"}`}>
                    {dayNum}
                  </span>

                  <div className="space-y-1 overflow-y-auto max-h-16">
                    {dayEvents.map((ev) => {
                      const proj = projects[ev.pid];
                      const chipColor = proj ? getProjectChipColor(proj.name) : "#5842D8";
                      return (
                        <div
                          key={ev.id}
                          style={{ backgroundColor: chipColor }}
                          title={`${proj?.name || "Layihə"} ${ev.time || ""}`}
                          className="px-1.5 py-0.5 rounded text-[10px] text-white font-medium truncate"
                        >
                          {ev.time ? `${ev.time} ` : ""}{proj?.name || "Tədbir"}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Events List for Current Month */}
      <div className="bg-white rounded-2xl border border-purple-100 shadow-xs p-5">
        <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
          <CalendarIcon size={16} className="text-brand-600" />
          <span>{MON[currentMonth]} {currentYear}: Tədbirlər Siyahısı</span>
        </h4>

        {currentMonthEvents.length > 0 ? (
          <div className="space-y-2">
            {currentMonthEvents.map((ev) => {
              const proj = projects[ev.pid];
              const chipColor = proj ? getProjectChipColor(proj.name) : "#5842D8";

              return (
                <div
                  key={ev.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      style={{ backgroundColor: chipColor }}
                      className="px-2.5 py-1 rounded-full text-white font-bold text-[11px]"
                    >
                      {proj?.name || "Layihə"}
                    </span>
                    <span className="font-semibold text-slate-800">{ev.date}</span>
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
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Sil"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic py-2">Bu ay üçün hələ tədbir planlaşdırılmayıb.</p>
        )}
      </div>
    </div>
  );
}
