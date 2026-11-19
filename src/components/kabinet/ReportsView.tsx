"use client";

import React, { useState } from "react";
import { Folder, ExternalLink, Edit3, Check, Link as LinkIcon, Info } from "lucide-react";
import { ROOT_DRIVE, MON, DEPTS } from "@/lib/store";
import { DriveLinks } from "@/types";

interface ReportsViewProps {
  links: DriveLinks;
  isAdmin: boolean;
  onUpdateLink: (id: string, url: string) => void;
}

export default function ReportsView({ links, isAdmin, onUpdateLink }: ReportsViewProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-6">
      {/* Top action banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-white to-purple-50/50 border border-purple-100 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-xs">
            <Folder size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">Google Drive Hesabat Sistemi</h3>
            <p className="text-xs text-slate-500">
              Departamentlər üzrə aylıq sənədlər, təqdimatlar və protokollar
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={ROOT_DRIVE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all active:scale-98"
          >
            <span>Əsas Drive Qovluğunu Aç</span>
            <ExternalLink size={14} />
          </a>

          {isAdmin && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold border transition-all ${
                isEditing
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {isEditing ? <Check size={14} /> : <Edit3 size={14} />}
              <span>{isEditing ? "Redaktəni Tamamla" : "Ay Linklərini Dəyiş"}</span>
            </button>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="flex items-start gap-2.5 p-4 rounded-xl bg-purple-50/80 border border-purple-200 text-xs text-brand-900">
          <Info size={16} className="text-brand-600 shrink-0 mt-0.5" />
          <span>
            Hər ay üçün Google Drive-dakı müvafiq alt qovluğun linkini yapışdırın. Boş qalsa, avtomatik olaraq əsas Drive qovluğu açılacaq.
          </span>
        </div>
      )}

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DEPTS.map(([code, name]) => (
          <div
            key={code}
            className="bg-white rounded-2xl border border-purple-100 shadow-xs p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-600" />
                <span>{name}</span>
              </h4>
              <span className="text-[11px] font-semibold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full">
                12 Ay
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {MON.map((month, idx) => {
                const linkId = `${code}_${idx}`;
                const url = links[linkId]?.url || "";

                if (isEditing && isAdmin) {
                  return (
                    <div key={month} className="col-span-3 flex items-center gap-2 my-0.5">
                      <span className="w-10 text-xs font-semibold text-slate-600">{month}:</span>
                      <div className="relative flex-1">
                        <LinkIcon size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="url"
                          placeholder="Drive qovluq linki"
                          value={url}
                          onChange={(e) => onUpdateLink(linkId, e.target.value)}
                          className="w-full pl-7 pr-2 py-1 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-600 outline-none"
                        />
                      </div>
                    </div>
                  );
                }

                return (
                  <a
                    key={month}
                    href={url || ROOT_DRIVE}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center p-2 rounded-xl text-xs font-medium border text-center transition-all ${
                      url
                        ? "bg-purple-50 text-brand-700 border-purple-200 hover:bg-brand-600 hover:text-white hover:border-brand-600 shadow-2xs"
                        : "bg-slate-50/70 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span>{month}</span>
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
