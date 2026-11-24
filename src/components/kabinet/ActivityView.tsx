"use client";

import React, { useMemo, useState } from "react";
import { UserPlus, Trash2, BarChart3, TrendingUp, CalendarDays, Users } from "lucide-react";
import { MON } from "@/lib/store";
import { Member, AttendanceRecord } from "@/types";
import { shortName } from "@/lib/userName";

interface ActivityViewProps {
  members: Record<string, Member>;
  att: Record<string, AttendanceRecord>;
  isAdmin: boolean;
  onAddMember: (name: string) => void;
  onDeleteMember: (id: string) => void;
  onToggleAttendance: (key: string, nextVal: '+' | '-' | '') => void;
}

const CURRENT_YEAR = new Date().getFullYear();

export default function ActivityView({
  members,
  att,
  isAdmin,
  onAddMember,
  onDeleteMember,
  onToggleAttendance
}: ActivityViewProps) {
  const [newMemberName, setNewMemberName] = useState("");
  const [year, setYear] = useState(CURRENT_YEAR);

  const memberList = Object.values(members).sort((a, b) => a.ts - b.ts);

  const years = useMemo(() => {
    const found = new Set<number>([CURRENT_YEAR]);
    Object.values(att).forEach((record) => {
      if (record?.year) found.add(record.year);
    });
    return Array.from(found).sort((a, b) => b - a);
  }, [att]);

  const recordFor = (memberId: string, month: number) => {
    const scoped = att[`${memberId}_${year}_${month}`];
    if (scoped) return scoped;
    if (year === CURRENT_YEAR) return att[`${memberId}_${month}`];
    return undefined;
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    onAddMember(newMemberName.trim());
    setNewMemberName("");
  };

  const toggle = (memberId: string, month: number, value: '+' | '-' | '') => {
    onToggleAttendance(`${memberId}_${year}_${month}`, value);
  };

  const nextValue = (value: '+' | '-' | ''): '+' | '-' | '' => {
    if (value === "") return "+";
    if (value === "+") return "-";
    return "";
  };

  const monthlyCounts = Array(12).fill(0);
  const memberStats: { id: string; name: string; attended: number; total: number; rate: number }[] = [];

  memberList.forEach((m) => {
    let attended = 0;
    let total = 0;

    MON.forEach((_, idx) => {
      const record = recordFor(m.id, idx);
      if (record?.v === "+") {
        attended++;
        total++;
        monthlyCounts[idx]++;
      } else if (record?.v === "-") {
        total++;
      }
    });

    const rate = total > 0 ? Math.round((attended / total) * 100) : 0;
    memberStats.push({ id: m.id, name: m.name, attended, total, rate });
  });

  const maxMonthly = Math.max(1, ...monthlyCounts);
  const cellClass = (val: '+' | '-' | '') =>
    `flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-bold transition-all ${
      val === "+"
        ? "border border-emerald-300 bg-emerald-100 text-emerald-700"
        : val === "-"
        ? "border border-rose-300 bg-rose-50 text-rose-600"
        : "border border-slate-200 bg-slate-50 text-slate-400"
    } ${isAdmin ? "cursor-pointer active:scale-95 hover:border-brand-400" : "cursor-default opacity-90"}`;

  return (
    <div className="space-y-5">
      {/* Yuxarı idarəetmə */}
      <div className="flex flex-col gap-3 rounded-2xl border border-purple-100 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
            <Users size={16} className="text-brand-600" /> Davamiyyət cədvəli
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
            Xanaya klikləyin: <b className="text-emerald-600">+</b> qatılıb, <b className="text-rose-600">−</b> qatılmayıb,{" "}
            <b>boş</b> qeyd yoxdur.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5">
            <CalendarDays size={13} className="text-brand-600" />
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-slate-500">İl</span>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="bg-transparent text-[12px] font-bold text-slate-800 outline-none"
            >
              {years.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <span className="rounded-full bg-[#F4F2FC] px-2.5 py-1 text-[10.5px] font-bold text-brand-700">
            {memberList.length} üzv
          </span>
        </div>
      </div>

      {isAdmin && (
        <form
          onSubmit={handleAdd}
          className="flex flex-col gap-3 rounded-2xl border border-purple-100 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-2">
            <UserPlus size={18} className="text-brand-600" />
            <span className="text-sm font-bold text-slate-800">Yeni idarə heyəti üzvü</span>
          </div>
          <div className="flex flex-1 items-center gap-2 sm:max-w-md sm:justify-end">
            <input
              type="text"
              placeholder="Üzvün ad və soyadı..."
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-brand-600 focus:bg-white"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-brand-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-brand-700 active:scale-95"
            >
              Əlavə et
            </button>
          </div>
        </form>
      )}

      {/* Mobil: üzv kartları */}
      <div className="space-y-2.5 md:hidden">
        {memberList.map((m) => {
          const stat = memberStats.find((item) => item.id === m.id);
          return (
            <div key={m.id} className="rounded-2xl border border-purple-100 bg-white p-3.5 shadow-xs">
              <div className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-bold text-slate-800" title={m.name}>
                    {m.name}
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-500">
                    {stat && stat.total > 0 ? `Qatılım: ${stat.attended}/${stat.total} · ${stat.rate}%` : "Qeyd yoxdur"}
                  </p>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => {
                      if (confirm(`${m.name} silinsin?`)) onDeleteMember(m.id);
                    }}
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                    title="Üzvü sil"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              <div className="mt-3 grid grid-cols-6 gap-1.5">
                {MON.map((label, idx) => {
                  const val = recordFor(m.id, idx)?.v || "";
                  return (
                    <div key={label} className="flex flex-col items-center gap-1">
                      <span className="text-[9px] font-semibold uppercase tracking-[0.04em] text-slate-400">{label}</span>
                      <button
                        disabled={!isAdmin}
                        onClick={() => toggle(m.id, idx, nextValue(val))}
                        className={cellClass(val)}
                        aria-label={`${m.name} — ${label}`}
                      >
                        {val === "+" ? "+" : val === "-" ? "−" : "·"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        {memberList.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-xs text-slate-500">
            Hələ üzv əlavə olunmayıb.
          </p>
        )}
      </div>

      {/* Desktop: cədvəl */}
      <div className="hidden overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-xs md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 font-semibold text-slate-400">
                <th className="sticky left-0 z-10 w-[132px] max-w-[132px] bg-slate-50 px-3 py-2.5 text-slate-700">
                  Üzv
                </th>
                {MON.map((m) => (
                  <th key={m} className="px-1 py-2.5 text-center font-semibold text-slate-600">
                    {m}
                  </th>
                ))}
                {isAdmin && <th className="w-10 px-2 py-2.5 text-center"></th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {memberList.map((m) => (
                <tr key={m.id} className="transition-colors hover:bg-purple-50/30">
                  <td
                    className="sticky left-0 z-10 max-w-[132px] truncate border-r border-slate-100 bg-white px-3 py-2 font-medium text-slate-800"
                    title={m.name}
                  >
                    {shortName(m.name)}
                  </td>
                  {MON.map((_, idx) => {
                    const val = recordFor(m.id, idx)?.v || "";
                    return (
                      <td key={idx} className="px-1 py-1 text-center">
                        <button
                          disabled={!isAdmin}
                          onClick={() => toggle(m.id, idx, nextValue(val))}
                          className={`mx-auto ${cellClass(val)}`}
                        >
                          {val === "+" ? "+" : val === "-" ? "−" : ""}
                        </button>
                      </td>
                    );
                  })}
                  {isAdmin && (
                    <td className="px-2 py-2 text-center">
                      <button
                        onClick={() => {
                          if (confirm(`${m.name} silinsin?`)) onDeleteMember(m.id);
                        }}
                        className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                        title="Üzvü sil"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analitika */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-purple-100 bg-white p-4 shadow-xs sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <BarChart3 size={16} className="text-brand-600" />
              <span>Aylar üzrə iştirak</span>
            </h4>
            <span className="shrink-0 text-[10.5px] text-slate-500">{year}</span>
          </div>

          <div className="flex h-32 items-end gap-1.5 px-0.5 pt-6 sm:gap-2">
            {MON.map((m, idx) => {
              const count = monthlyCounts[idx];
              const heightPercent = maxMonthly > 0 ? Math.round((count / maxMonthly) * 100) : 0;
              return (
                <div key={m} className="group flex flex-1 flex-col items-center gap-1.5">
                  <span className="text-[9.5px] font-bold text-slate-600 group-hover:text-brand-600 sm:text-[10px]">{count}</span>
                  <div className="flex h-20 w-full items-end rounded-t-md bg-slate-100">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="min-h-[3px] w-full rounded-t-md bg-brand-600 transition-all group-hover:bg-brand-700"
                    />
                  </div>
                  <span className="text-[9px] font-medium text-slate-400 sm:text-[10px]">{m}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-purple-100 bg-white p-4 shadow-xs sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <TrendingUp size={16} className="text-emerald-600" />
              <span>Üzvlər üzrə aktivlik</span>
            </h4>
            <span className="shrink-0 text-[10.5px] text-slate-500">İştirak faizi</span>
          </div>

          <div className="max-h-40 space-y-3 overflow-y-auto pr-1">
            {memberStats.map((st) => (
              <div key={st.id} className="flex items-center gap-2.5 text-xs">
                <span className="w-[92px] shrink-0 truncate font-medium text-slate-700" title={st.name}>
                  {shortName(st.name)}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    style={{ width: `${st.rate}%` }}
                    className={`h-full rounded-full transition-all ${
                      st.rate >= 80 ? "bg-emerald-500" : st.rate >= 50 ? "bg-brand-600" : "bg-amber-500"
                    }`}
                  />
                </div>
                <span className="w-16 shrink-0 text-right text-[10.5px] font-bold text-slate-600">
                  {st.total > 0 ? `${st.rate}%` : "–"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
