"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Award, ArrowUpRight } from "lucide-react";

/** Tədbirin slug-ı ilə aktiv sertifikat proqramı varsa, səhifədə yükləmə keçidi göstərir. */
export default function EventCertificateLink({ slug }: { slug: string }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/certificate-programs?slug=${encodeURIComponent(slug)}`, { cache: "no-store" })
      .then((res) => res.json().catch(() => null))
      .then((json) => {
        if (!cancelled) setActive(Boolean(json?.found && json?.data));
      })
      .catch(() => {
        if (!cancelled) setActive(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!active) return null;

  return (
    <div className="rounded-[22px] border border-emerald-200 bg-emerald-50/60 p-5">
      <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-700">
        <Award size={13} /> Sertifikat hazırdır
      </p>
      <p className="mt-2 text-[12px] leading-relaxed text-[#3F5B4A]">
        Tədbirdə iştirak edibsinizsə, adınızı yazaraq sertifikatı JPEG və ya PDF kimi yükləyə bilərsiniz.
      </p>
      <Link
        href={`/sertifikat/${slug}`}
        className="mt-3 inline-flex h-10 items-center gap-2 rounded-full bg-emerald-600 px-4 text-[11.5px] font-bold text-white transition-colors hover:bg-emerald-700"
      >
        Sertifikatı yüklə <ArrowUpRight size={13} />
      </Link>
    </div>
  );
}
