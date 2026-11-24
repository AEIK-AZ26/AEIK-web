"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Link2, Loader2, UploadCloud, X, Check } from "lucide-react";
import { IMGBB_LIBRARY, LOCAL_IMAGES } from "@/lib/siteContent";
import { uploadImage } from "@/lib/contentApi";

interface MediaPickerProps {
  value?: string;
  onChange: (url: string) => void;
  onClose: () => void;
  onError: (message: string) => void;
}

export default function MediaPicker({ value, onChange, onClose, onError }: MediaPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [customUrl, setCustomUrl] = useState("");

  const handleUpload = async (file?: File | null) => {
    if (!file) return;
    setUploading(true);
    const res = await uploadImage(file);
    setUploading(false);
    if (!res.ok || !res.url) {
      onError(res.error || "Şəkil yüklənmədi.");
      return;
    }
    onChange(res.url);
    onClose();
  };

  const library = [...IMGBB_LIBRARY, ...LOCAL_IMAGES];

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-[#120E26]/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Şəkil seç</h3>
            <p className="text-[11px] text-slate-500">imgbb-yə yüklə və ya hazır kitabxanadan seç</p>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Bağla">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 text-xs font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
            >
              {uploading ? <Loader2 size={15} className="animate-spin" /> : <UploadCloud size={15} />}
              {uploading ? "Yüklənir..." : "Kompüterdən yüklə"}
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(e) => handleUpload(e.target.files?.[0])}
            />
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
              <Link2 size={14} className="shrink-0 text-slate-400" />
              <input
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://... şəkil linki"
                className="h-10 w-full bg-transparent text-xs text-slate-700 outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (!customUrl.trim()) return;
                  onChange(customUrl.trim());
                  onClose();
                }}
                className="shrink-0 rounded-lg bg-white p-1.5 text-brand-600 shadow-sm"
                aria-label="Linki tətbiq et"
              >
                <Check size={14} />
              </button>
            </div>
          </div>

          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Media kitabxanası</p>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {library.map((image) => (
                <button
                  key={image.url}
                  type="button"
                  onClick={() => {
                    onChange(image.url);
                    onClose();
                  }}
                  className={`group relative aspect-[4/3] overflow-hidden rounded-xl border-2 bg-slate-100 transition-all ${
                    value === image.url ? "border-brand-600 ring-2 ring-brand-100" : "border-transparent hover:border-brand-200"
                  }`}
                >
                  <Image src={image.url} alt={image.label} fill sizes="200px" className="object-cover transition-transform group-hover:scale-105" />
                  <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5 text-left text-[10px] font-semibold text-white">
                    {image.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-3.5">
          <button
            type="button"
            onClick={() => {
              onChange("");
              onClose();
            }}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-rose-600"
          >
            <ImagePlus size={13} />
            Şəkli sil
          </button>
          <button type="button" onClick={onClose} className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600">
            Bağla
          </button>
        </div>
      </div>
    </div>
  );
}
