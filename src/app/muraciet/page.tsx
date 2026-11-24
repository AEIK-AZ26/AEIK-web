"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  ClipboardList,
  Loader2,
  Lock,
  Send,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DEFAULT_APPLICATION_FORM, ApplicationFormConfig, FormField } from "@/lib/applicationForm";
import { loadApplicationForm, submitApplication } from "@/lib/contentApi";

const inputClass =
  "w-full rounded-xl border border-[#E4E0F2] bg-white px-3.5 py-2.5 text-[12.5px] text-ink outline-none transition-colors placeholder:text-[#A29BB8] focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
}) {
  if (field.type === "textarea") {
    return (
      <textarea
        rows={4}
        required={field.required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className={`${inputClass} leading-relaxed`}
      />
    );
  }

  if (field.type === "select") {
    return (
      <select required={field.required} value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
        <option value="">Seçin...</option>
        {(field.options || []).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      type={field.type === "email" ? "email" : field.type === "tel" ? "tel" : field.type === "date" ? "date" : "text"}
      required={field.required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      className={inputClass}
    />
  );
}

export default function MuracietPage() {
  const [config, setConfig] = useState<ApplicationFormConfig>(DEFAULT_APPLICATION_FORM);
  const [ready, setReady] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;
    loadApplicationForm()
      .then((res) => {
        if (!cancelled) setConfig(res.config);
      })
      .catch(() => undefined)
      .finally(() => !cancelled && setReady(true));
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSending(true);
    const res = await submitApplication(values);
    setSending(false);
    if (!res.ok) {
      setError(res.error || "Müraciət göndərilmədi.");
      return;
    }
    setSuccess(res.message || config.successMessage);
    setValues({});
  };

  return (
    <div className="min-h-screen bg-white text-ink">
      <Navbar />

      <section className="hero-mesh relative overflow-hidden">
        <div className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-brand-300/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 -top-10 h-72 w-72 rounded-full bg-[#9C8AF8]/20 blur-3xl" />

        <div className="relative mx-auto w-full max-w-[1100px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <Link
            href="/#uzvluk"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-brand-700 transition-colors hover:text-brand-800"
          >
            <ArrowLeft size={13} /> Üzvlük proqramı
          </Link>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-[620px]">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700 backdrop-blur">
                <ClipboardList size={12} /> AEİK · Müraciət
              </span>
              <h1 className="mt-4 text-[30px] font-extrabold leading-[1.08] tracking-[-0.035em] text-ink sm:text-[40px]">
                {config.title}
              </h1>
              {config.active && (
                <p className="mt-3 text-[13px] leading-[1.75] text-[#5A5270] sm:text-[14px]">{config.intro}</p>
              )}
            </div>
          </div>

          <div className="mt-8">
            {!ready ? (
              <div className="flex items-center justify-center rounded-[26px] border border-[#EAE7F7] bg-white py-24">
                <Loader2 className="animate-spin text-brand-600" size={24} />
              </div>
            ) : !config.active ? (
              <div className="rounded-[26px] border border-[#EAE7F7] bg-white p-8 text-center premium-shadow sm:p-12">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                  <Lock size={24} />
                </span>
                <h2 className="mt-4 text-xl font-extrabold tracking-[-0.02em] text-ink">Müraciət bağlıdır</h2>
                <p className="mx-auto mt-2 max-w-md text-[12.5px] leading-relaxed text-[#5A5270]">{config.closedMessage}</p>
                <Link
                  href="/"
                  className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-brand-600 px-5 text-[12px] font-bold text-white transition-colors hover:bg-brand-700"
                >
                  Ana səhifəyə qayıt <ArrowUpRight size={14} />
                </Link>
              </div>
            ) : success ? (
              <div className="rounded-[26px] border border-emerald-200 bg-white p-8 text-center premium-shadow sm:p-12">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={26} />
                </span>
                <h2 className="mt-4 text-xl font-extrabold tracking-[-0.02em] text-ink">Müraciət göndərildi</h2>
                <p className="mx-auto mt-2 max-w-md text-[12.5px] leading-relaxed text-[#5A5270]">{success}</p>
                <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
                  <Link
                    href="/"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-600 px-5 text-[12px] font-bold text-white transition-colors hover:bg-brand-700"
                  >
                    Ana səhifə <ArrowUpRight size={14} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSuccess("")}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-[#E4E0F2] bg-white px-5 text-[12px] font-bold text-ink transition-colors hover:border-brand-200 hover:text-brand-700"
                  >
                    Yeni müraciət
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-[26px] border border-[#EAE7F7] bg-white p-5 premium-shadow sm:p-8"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {config.fields.map((field) => (
                    <div key={field.id} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                      <label htmlFor={`field-${field.id}`} className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#6E6788]">
                        {field.label}
                        {field.required && <span className="ml-1 text-rose-500">*</span>}
                      </label>
                      <FieldInput
                        field={field}
                        value={values[field.id] || ""}
                        onChange={(value) => setValues((prev) => ({ ...prev, [field.id]: value }))}
                      />
                      {field.help && <p className="mt-1 text-[10.5px] text-[#8A83A0]">{field.help}</p>}
                    </div>
                  ))}
                </div>

                {error && (
                  <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-[11.5px] font-semibold text-amber-800">
                    {error}
                  </p>
                )}

                <div className="mt-6 flex flex-col-reverse items-stretch gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[10.5px] leading-relaxed text-[#8A83A0]">
                    <span className="text-rose-500">*</span> Məcburi sahələr. Məlumatlarınız yalnız üzvlük müraciəti üçün istifadə olunur.
                  </p>
                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-brand-600 px-6 text-[12px] font-bold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
                  >
                    {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={14} />}
                    {sending ? "Göndərilir..." : "Müraciəti göndər"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
