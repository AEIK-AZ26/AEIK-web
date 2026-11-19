"use client";

import React, { useState } from "react";
import { UserPlus, Trash2, CheckCircle2, XCircle, BarChart3, TrendingUp } from "lucide-react";
import { MON } from "@/lib/store";
import { Member, AttendanceRecord } from "@/types";

interface ActivityViewProps {
  members: Record<string, Member>;
  att: Record<string, AttendanceRecord>;
  isAdmin: boolean;
  onAddMember: (name: string) => void;
  onDeleteMember: (id: string) => void;
  onToggleAttendance: (key: string, nextVal: '+' | '-' | '') => void;
}

export default function ActivityView({
  members,
  att,
  isAdmin,
  onAddMember,
  onDeleteMember,
  onToggleAttendance
}: ActivityViewProps) {
  const [newMemberName, setNewMemberName] = useState("");

  const memberList = Object.values(members).sort((a, b) => a.ts - b.ts);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    onAddMember(newMemberName.trim());
    setNewMemberName("");
  };

  // Monthly stats computation
  const monthlyCounts = Array(12).fill(0);
  const memberStats: { name: string; attended: number; total: number; rate: number }[] = [];

  memberList.forEach((m) => {
    let attended = 0;
    let total = 0;

    MON.forEach((_, idx) => {
      const record = att[`${m.id}_${idx}`];
      if (record?.v === "+") {
        attended++;
        total++;
        monthlyCounts[idx]++;
      } else if (record?.v === "-") {
        total++;
      }
    });

    const rate = total > 0 ? Math.round((attended / total) * 100) : 0;
    memberStats.push({ name: m.name, attended, total, rate });
  });

  const maxMonthly = Math.max(1, ...monthlyCounts);

  return (
    <div className="space-y-6">
      {/* Top Banner: Add member form */}
      {isAdmin && (
        <form
          onSubmit={handleAdd}
          className="p-5 rounded-2xl bg-white border border-purple-100 shadow-xs flex flex-wrap items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2">
            <UserPlus size={18} className="text-brand-600" />
            <span className="font-bold text-sm text-slate-800">Yeni İdarə Heyəti Üzvü</span>
          </div>
          <div className="flex items-center gap-2 flex-1 max-w-md ml-auto">
            <input
              type="text"
              placeholder="Üzvün ad və soyadı..."
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none text-xs text-slate-800"
            />
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-brand-600 hover:bg-brand-700 active:scale-98 text-white font-semibold text-xs transition-all shadow-xs"
            >
              Əlavə et
            </button>
          </div>
        </form>
      )}

      {/* Attendance Matrix Table */}
      <div className="bg-white rounded-2xl border border-purple-100 shadow-xs overflow-hidden">
        <div className="p-4 bg-purple-50/50 border-b border-purple-100 flex items-center justify-between">
          <div className="text-xs text-slate-600 font-medium flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span>Xanaya klikləyin: <b>+</b> qatılıb, <b>−</b> qatılmayıb, <b>boş</b> qeyd yoxdur</span>
          </div>
          <span className="text-xs font-semibold text-brand-600">
            {memberList.length} Üzv
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold bg-slate-50/60">
                <th className="py-3 px-4 sticky left-0 bg-slate-50 z-10 min-w-[170px] text-slate-700">
                  İdarə Heyəti Üzvü
                </th>
                {MON.map((m) => (
                  <th key={m} className="py-3 px-1 text-center font-semibold text-slate-600">
                    {m}
                  </th>
                ))}
                {isAdmin && <th className="py-3 px-3 text-center w-12"></th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {memberList.map((m) => (
                <tr key={m.id} className="hover:bg-purple-50/30 transition-colors">
                  <td className="py-2.5 px-4 sticky left-0 bg-white font-medium text-slate-800 z-10 border-r border-slate-100">
                    {m.name}
                  </td>
                  {MON.map((_, idx) => {
                    const key = `${m.id}_${idx}`;
                    const val = att[key]?.v || "";
                    return (
                      <td key={idx} className="py-1 px-1 text-center">
                        <button
                          disabled={!isAdmin}
                          onClick={() => {
                            const next = val === "" ? "+" : val === "+" ? "-" : "";
                            onToggleAttendance(key, next);
                          }}
                          className={`w-7 h-7 rounded-lg font-bold text-xs transition-all flex items-center justify-center mx-auto ${
                            val === "+"
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                              : val === "-"
                              ? "bg-rose-50 text-rose-600 border border-rose-300"
                              : "bg-slate-50 border border-slate-200 text-slate-400 hover:border-brand-400"
                          } ${!isAdmin ? "cursor-default opacity-85" : "cursor-pointer active:scale-95"}`}
                        >
                          {val === "+" ? "+" : val === "-" ? "−" : ""}
                        </button>
                      </td>
                    );
                  })}
                  {isAdmin && (
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => {
                          if (confirm(`${m.name} silinsin?`)) onDeleteMember(m.id);
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Attendance Chart */}
        <div className="bg-white rounded-2xl border border-purple-100 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <BarChart3 size={16} className="text-brand-600" />
              <span>Aylar üzrə İştirak Qrafiki</span>
            </h4>
            <span className="text-[11px] text-slate-500">Ümumi qatılım sayı</span>
          </div>

          <div className="flex items-end gap-2 h-36 pt-6 px-1">
            {MON.map((m, idx) => {
              const count = monthlyCounts[idx];
              const heightPercent = maxMonthly > 0 ? Math.round((count / maxMonthly) * 100) : 0;
              return (
                <div key={m} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <span className="text-[10px] font-bold text-slate-600 group-hover:text-brand-600">
                    {count}
                  </span>
                  <div className="w-full bg-slate-100 rounded-t-md h-24 flex items-end">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-brand-600 rounded-t-md group-hover:bg-brand-700 transition-all min-h-[3px]"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {m}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Member Activity Rates */}
        <div className="bg-white rounded-2xl border border-purple-100 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-600" />
              <span>Üzvlər üzrə Aktivlik Faizi</span>
            </h4>
            <span className="text-[11px] text-slate-500">İştirak faizi</span>
          </div>

          <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
            {memberStats.map((st) => (
              <div key={st.name} className="flex items-center gap-3 text-xs">
                <span className="w-32 truncate font-medium text-slate-700">
                  {st.name}
                </span>
                <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    style={{ width: `${st.rate}%` }}
                    className={`h-full rounded-full transition-all ${
                      st.rate >= 80 ? "bg-emerald-500" : st.rate >= 50 ? "bg-brand-600" : "bg-amber-500"
                    }`}
                  />
                </div>
                <span className="w-20 text-right font-bold text-slate-600">
                  {st.total > 0 ? `${st.rate}% (${st.attended}/${st.total})` : "–"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
