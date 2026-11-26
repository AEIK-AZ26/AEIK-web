"use client";

import React, { useState } from "react";
import { CheckCircle2, Loader2, Mail, Send } from "lucide-react";
import { CONTACT } from "@/data/brief";

export interface SubmissionField {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "textarea" | "select" | "date";
  required?: boolean;
  placeholder?: string;
  help?: string;
  options?: string[];
  wide?: boolean;
}

const inputClass =
  "w-full rounded-xl border border-[#E4E0F2] bg-white px-3.5 py-2.5 text-[12.5px] text-ink outline-none transition-colors placeholder:text-[#A29BB8] focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

export default function SubmissionForm({
  kind,
  fields,
  submitLabel = "Göndər",
  successMessage = "Müraciətiniz qeydə alındı. Komanda qısa müddətdə sizinlə əlaqə saxlayacaq.",
  consent,
  hidden = {},
}: {
  kind: "event" | "thesis" | "partner" | "volunteer";
  fields: SubmissionField[];
  submitLabel?: string;
  successMessage?: string;
  consent?: string;
  hidden?: Record<string, string>;
}) {
  const [values, setValues] = useState<Record<string, string>>(hidden);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const set = (name: string, value: string) => setValues((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, values }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json?.error || "Göndəriş qeydə alınmadı.");
        return;
      }
      setSuccess(true);
      setValues(hidden);
    } catch {
      setError("Şəbəkə xətası. E-poçtla müraciət edin.");
    } finally {
      setSending(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-[22px] border border-emerald-200 bg-white p-7 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <CheckCircle2 size={22} />
        </span>
        <p className="mt-4 text-[14px] font-bold text-ink">Təşəkkür edirik!</p>
        <p className="mt-2 text-[12.5px] leading-relaxed text-[#5A5270]">{successMessage}</p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-5 inline-flex h-10 items-center rounded-full border border-[#E4E0F2] px-4 text-[11.5px] font-bold text-ink transition-colors hover:border-brand-200 hover:text-brand-700"
        >
          Yeni göndəriş
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[22px] border border-[#EAE7F7] bg-white p-5 sm:p-7">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name} className={field.wide || field.type === "textarea" ? "sm:col-span-2" : ""}>
            <label htmlFor={`${kind}-${field.name}`} className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#6E6788]">
              {field.label}
              {field.required && <span className="ml-1 text-rose-500">*</span>}
            </label>
            {field.type === "textarea" ? (
              <textarea
                id={`${kind}-${field.name}`}
                rows={4}
                required={field.required}
                value={values[field.name] || ""}
                onChange={(e) => set(field.name, e.target.value)}
                placeholder={field.placeholder}
                className={`${inputClass} leading-relaxed`}
              />
            ) : field.type === "select" ? (
              <select
                id={`${kind}-${field.name}`}
                required={field.required}
                value={values[field.name] || ""}
                onChange={(e) => set(field.name, e.target.value)}
                className={inputClass}
              >
                <option value="">Seçin...</option>
                {(field.options || []).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={`${kind}-${field.name}`}
                type={field.type === "email" ? "email" : field.type === "tel" ? "tel" : field.type === "date" ? "date" : "text"}
                required={field.required}
                value={values[field.name] || ""}
                onChange={(e) => set(field.name, e.target.value)}
                placeholder={field.placeholder}
                className={inputClass}
              />
            )}
            {field.help && <p className="mt-1 text-[10.5px] text-[#8A83A0]">{field.help}</p>}
          </div>
        ))}
      </div>

      {consent && (
        <label className="mt-4 flex items-start gap-2.5 rounded-xl bg-[#FAF9FF] p-3 text-[11px] leading-relaxed text-[#5A5270]">
          <input
            type="checkbox"
            required
            checked={values.consent === "Bəli"}
            onChange={(e) => set("consent", e.target.checked ? "Bəli" : "")}
            className="mt-0.5 h-3.5 w-3.5 accent-brand-600"
          />
          <span>{consent}</span>
        </label>
      )}

      {error && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-[11.5px] leading-relaxed text-amber-800">
          <p className="font-semibold">{error}</p>
          <a href={`mailto:${CONTACT.email}`} className="mt-1 inline-flex items-center gap-1.5 font-bold underline">
            <Mail size={12} /> {CONTACT.email} ünvanına yazın
          </a>
        </div>
      )}

      <div className="mt-5 flex flex-col-reverse items-stretch gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[10.5px] leading-relaxed text-[#8A83A0]">
          <span className="text-rose-500">*</span> Məcburi sahələr. Məlumatlarınız yalnız bu müraciət üçün istifadə olunur.
        </p>
        <button
          type="submit"
          disabled={sending}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-brand-600 px-6 text-[12px] font-bold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
        >
          {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={14} />}
          {sending ? "Göndərilir..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
