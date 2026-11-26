"use client";

import { useEffect, useRef } from "react";
import {
  CertificateProgram,
  DEFAULT_DESIGN,
  loadCertificateImage,
  paintCertificate,
} from "@/lib/certificate";

const base: CertificateProgram = {
  slug: "preview",
  title: "Məqalə Saatları IV",
  date: "2026-11-20",
  guests: ["Ayan Əhmədova"],
  theme: "classic",
  frameColor: DEFAULT_DESIGN.frameColor,
  accentColor: DEFAULT_DESIGN.accentColor,
  logoUrl: "",
  elements: DEFAULT_DESIGN.elements,
};

export default function CertificateDesignPreview() {
  const classicRef = useRef<HTMLCanvasElement | null>(null);
  const ribbonRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const data = { name: "Ayan Əhmədova", code: "AEIK-2026-ABC123" };
    (async () => {
      const logo = await loadCertificateImage("/assets/logo-primary-trim.png").catch(() => null);
      if (classicRef.current) {
        paintCertificate(classicRef.current, { ...base, theme: "classic" }, data, logo);
      }
      if (ribbonRef.current) {
        paintCertificate(ribbonRef.current, { ...base, theme: "ribbon" }, data, logo);
      }
    })();
  }, []);

  return (
    <main className="mx-auto max-w-[1000px] space-y-6 bg-white p-4">
      <canvas ref={classicRef} className="w-full rounded border border-slate-200" />
      <canvas ref={ribbonRef} className="w-full rounded border border-slate-200" />
    </main>
  );
}
