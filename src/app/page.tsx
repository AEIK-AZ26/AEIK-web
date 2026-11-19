"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  Calendar, 
  Users, 
  Target, 
  Rocket, 
  BookOpen, 
  Lightbulb, 
  Compass, 
  Globe2 
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ROADMAP_MONTHS = [
  { month: "Yanvar", title: "Planlaşma Mərhələsi", desc: "İllik fəaliyyət planı və idarə heyəti təyinatlarının təsdiqi", tags: ["İclaslar", "Komanda"] },
  { month: "Fevral", title: "Tərəfdaşlıq Şəbəkəsi", desc: "Universitetlər və elmi mərkəzlərlə memorandumların imzalanması", tags: ["Əməkdaşlıq", "BDU"] },
  { month: "Mart", title: "Beynəlxalq Qadınlar Günü", desc: "Qadın alimlərin elmi fəaliyyətinə həsr olunmuş dəyirmi masa", tags: ["Forum", "Panel"] },
  { month: "Aprel", title: "DNT və Biotexnologiya Günü", desc: "Genetik və molekulyar biologiya üzrə master-klaslar", tags: ["Seminar", "Laboratoriya"] },
  { month: "May", title: "KİMYA FORUMU 2026", desc: "Gənc kimyaçı və mühəndislərin ümumrespublika elmi forumu", tags: ["Forum", "Böyük Layihə"] },
  { month: "İyun", title: "Region Gənclərinin II Elmi Konfransı", desc: "Gənc alimlərin elmi məqalələrinin nəşri və təqdimatı", tags: ["Konfrans", "Nəşr"] },
  { month: "İyul", title: "Yay Elmi Düşərgəsi (Camp)", desc: "İnnovativ layihələrin hazırlanması üçün intensiv düşərgə", tags: ["Camp", "İnnovasiya"] },
  { month: "Avqust", title: "Startap Akselerasiyası", desc: "Layihələrin investorlar və qrant təşkilatlarına təqdimatı", tags: ["Startap", "Qrant"] },
  { month: "Sentyabr", title: "Nəticələrin Yekun Təqdimatı", desc: "İllik nailiyyətlərin hesabatı və fəal könüllülərin mükafatlandırılması", tags: ["Yekun", "Mükafat"] },
];

export default function HomePage() {
  const [activeRoadmap, setActiveRoadmap] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-purple-100 selection:text-brand-700">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-gradient-to-b from-[#FAF9FF] via-white to-white">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-brand-100/50 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/80 text-brand-700 text-xs font-bold tracking-wide uppercase">
                <Sparkles size={14} className="text-brand-600" />
                <span>ELM VƏ İNNOVASİYA PROQRAMI</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                Gələcəyi elmlə <br />
                <span className="text-brand-600">birlikdə quraq.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Tələbə və gənc alimlərin elmi potensialını inkişaf etdirən,
                innovasiya ekosistemini formalaşdıran və yeni üfüqlər açan milli platforma.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/register"
                  className="px-8 py-3.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-600/25 transition-all hover:scale-102 active:scale-98 flex items-center gap-2"
                >
                  <span>Bizə qoşul</span>
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/kabinet"
                  className="px-8 py-3.5 rounded-full bg-white hover:bg-purple-50 border border-slate-200 text-slate-800 font-semibold text-sm transition-all shadow-xs flex items-center gap-2"
                >
                  <span>Şəxsi Kabinet</span>
                </Link>
              </div>

              {/* Verified badge */}
              <div className="flex items-center gap-4 pt-4 text-xs text-slate-500 font-medium">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-brand-200 border-2 border-white flex items-center justify-center font-bold text-[10px] text-brand-800">
                    A
                  </div>
                  <div className="w-7 h-7 rounded-full bg-emerald-200 border-2 border-white flex items-center justify-center font-bold text-[10px] text-emerald-800">
                    E
                  </div>
                  <div className="w-7 h-7 rounded-full bg-indigo-200 border-2 border-white flex items-center justify-center font-bold text-[10px] text-indigo-800">
                    İ
                  </div>
                  <div className="w-7 h-7 rounded-full bg-purple-200 border-2 border-white flex items-center justify-center font-bold text-[10px] text-purple-800">
                    K
                  </div>
                </div>
                <span>100+ aktiv idarə heyəti və könüllü komandası</span>
              </div>
            </div>

            {/* Right Visual Card */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-br from-purple-100/70 via-white to-purple-50 p-8 shadow-xl shadow-purple-950/5 border border-purple-100 flex flex-col items-center justify-center group hover:scale-102 transition-transform">
                <div className="relative w-64 h-64">
                  <Image
                    src="/assets/badge-atom-blue.png"
                    alt="AEİK Elm və İnnovasiya"
                    fill
                    className="object-contain drop-shadow-md animate-pulse"
                    priority
                  />
                </div>
                <div className="mt-4 text-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                    2026 Fəaliyyət Dövrü
                  </span>
                  <h3 className="text-sm font-bold text-slate-800 mt-2">
                    Azərbaycan Elm və İnnovasiya Könüllüləri
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="border-y border-purple-100 bg-[#FAF9FF]/60 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-brand-600">100+</div>
              <p className="text-xs sm:text-sm font-semibold text-slate-600">Aktiv İştirakçı</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-brand-600">4</div>
              <p className="text-xs sm:text-sm font-semibold text-slate-600">Əsas Böyük Layihə</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-brand-600">4</div>
              <p className="text-xs sm:text-sm font-semibold text-slate-600">Tərəfdaş Universitet</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-brand-600">9 ay</div>
              <p className="text-xs sm:text-sm font-semibold text-slate-600">Davamlı Fəaliyyət Planı</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT / MISSION SECTION */}
      <section id="haqqimizda" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-purple-100 via-purple-50 to-white border border-purple-100 p-8 flex flex-col justify-center items-center shadow-lg shadow-purple-950/5">
                <div className="relative w-40 h-40 mb-4">
                  <Image
                    src="/assets/icon-bulb.jpg"
                    alt="AEİK Emblemi"
                    fill
                    className="object-contain rounded-2xl"
                  />
                </div>
                <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-purple-100 text-center shadow-xs">
                  <p className="text-xs font-bold text-slate-800">Elm · Maariflənmə · İnnovasiya</p>
                  <p className="text-[10px] text-slate-500">Milli İnkişaf Naminə</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-block px-3 py-1 rounded-full bg-purple-50 text-brand-700 text-xs font-bold uppercase tracking-wider">
                BİZİM MİSSİYA
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                Biliklə başlayan, <br />
                birlikdə böyüyən gələcək.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                AEİK elmə həvəs göstərən gəncləri bir araya toplayaraq onların elmi-tədqiqat
                bacarıqlarını artırır, qlobal layihələrdə iştirakını təmin edir və
                innovativ ideyaların reallaşması üçün tam dəstək verir.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  "Gənc tədqiqatçılara elmi və praktiki mentorluq",
                  "Respublika və beynəlxalq elmi forumların təşkili",
                  "Müasir laboratoriya və texnoloji mərkəzlərlə inteqrasiya",
                  "Real startap və qrant layihələrinə birbaşa çıxış"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-700">
                    <CheckCircle2 size={18} className="text-brand-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PROJECTS SECTION */}
      <section id="layiheler" className="py-20 lg:py-28 bg-[#FAF9FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-purple-100 text-brand-700 text-xs font-bold uppercase tracking-wider">
              LAYİHƏLƏRİMİZ
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              İdeyalar böyüyür. Üfüqlər genişlənir.
            </h2>
            <p className="text-sm text-slate-600">
              Müxtəlif elmi istiqamətləri və gəncləri əhatə edən əsas flaqman təşəbbüslərimiz
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Gənc Alimlərin Beynəlxalq Elmi Forumu",
                desc: "Xarici və yerli gənc tədqiqatçıların təcrübə mübadiləsi və ortaq məqalə layihələri.",
                tag: "Böyük Layihə",
                owner: "Nərhiz Hacıllı",
                color: "from-purple-600 to-indigo-700"
              },
              {
                title: "İnnovasiya və Startap Akseleratoru",
                desc: "Texnoloji prototiplərin hazırlanması, patent dəstəyi və investisiya mühitinin yaradılması.",
                tag: "Böyük Layihə",
                owner: "Komanda",
                color: "from-indigo-600 to-purple-800"
              },
              {
                title: "Bakı və Region Gənclərinin II Elmi Konfransı",
                desc: "Regional universitetlərin tələbələrinin elmi işlərinin təqdimatı və müsabiqəsi.",
                tag: "Böyük Layihə",
                owner: "Təhsil Şöbəsi",
                color: "from-purple-700 to-brand-600"
              },
              {
                title: "KİMYA FORUMU 2026",
                desc: "Yaşıl kimya, nanotexnologiyalar və sənaye innovasiyaları üzrə ümumrespublika elmi sessiyası.",
                tag: "Böyük Layihə",
                owner: "Gülçin Mirzayeva",
                color: "from-brand-600 to-purple-900"
              }
            ].map((p) => (
              <div
                key={p.title}
                className="bg-white rounded-3xl border border-purple-100/80 p-8 shadow-xs hover:shadow-xl hover:shadow-purple-950/5 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-purple-50 text-brand-700 text-xs font-bold border border-purple-200">
                      {p.tag}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Məsul: {p.owner}</span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-brand-600 transition-colors mb-2">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href="/kabinet"
                    className="text-xs font-bold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
                  >
                    <span>Kabinetdə izlə</span>
                    <ArrowRight size={14} />
                  </Link>
                  <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    Aktiv
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TARGETS STRATEGIC BANNER */}
      <section className="py-16 bg-gradient-to-r from-brand-900 via-purple-900 to-brand-darker text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10 space-y-2">
            <span className="text-xs font-bold text-purple-300 uppercase tracking-widest">
              STRATEJİ PLAN
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Qarşımıza qoyduğumuz hədəflər.
            </h2>
            <p className="text-xs sm:text-sm text-purple-200">
              Gənclər üçün dayanıqlı və şəffaf elmi mühitin inkişafı
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="border-l-2 border-purple-400 pl-4 space-y-1">
              <div className="text-4xl font-extrabold">100+</div>
              <p className="text-xs text-purple-200">Könüllü və Gənc Alim</p>
            </div>
            <div className="border-l-2 border-purple-400 pl-4 space-y-1">
              <div className="text-4xl font-extrabold">8–10</div>
              <p className="text-xs text-purple-200">Respublika və Beynəlxalq Tədbir</p>
            </div>
            <div className="border-l-2 border-purple-400 pl-4 space-y-1">
              <div className="text-4xl font-extrabold">4 ay</div>
              <p className="text-xs text-purple-200">İntensiv Təlim və Laboratoriya</p>
            </div>
            <div className="border-l-2 border-purple-400 pl-4 space-y-1">
              <div className="text-4xl font-extrabold">9 ay</div>
              <p className="text-xs text-purple-200">Yol Xəritəsi və Hesabatlılıq</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PERIODIC INITIATIVES */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-purple-100 text-brand-700 text-xs font-bold uppercase tracking-wider">
              DÖVRİ TƏŞƏBBÜSLƏR
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Hər görüş yeni bir başlanğıcdır.
            </h2>
            <p className="text-sm text-slate-600">
              Həftəlik və aylıq davamlı olaraq həyata keçirilən təhsil və müzakirə proqramları
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: BookOpen,
                title: "Məqalə Saatları",
                desc: "Dünyanın nüfuzlu jurnallarında dərc olunmuş elmi məqalələrin təhlili."
              },
              {
                icon: Compass,
                title: "Akademik Yol",
                desc: "Magistratura, doktorantura və xaricdə təhsil üçün peşəkar mentorluq."
              },
              {
                icon: Lightbulb,
                title: "Elm Məlumatxanası",
                desc: "Elmi kəşflər və innovativ xəbərlərin ictimaiyyətə anlaşıqlı çatdırılması."
              },
              {
                icon: Rocket,
                title: "İnnovasiya Ekosistemi",
                desc: "Startap komandalarının formalaşması və texnoparklarla əməkdaşlıq."
              }
            ].map((it) => {
              const Icon = it.icon;
              return (
                <div
                  key={it.title}
                  className="bg-white rounded-3xl border border-purple-100 p-6 shadow-xs hover:shadow-lg transition-all text-left flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-brand-600 flex items-center justify-center mb-4">
                      <Icon size={22} />
                    </div>
                    <h4 className="text-base font-bold text-slate-800 mb-2">{it.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{it.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-brand-600">Həftəlik rejimdə</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. ROADMAP SECTION (9 MONTHS) */}
      <section id="fealiyyet" className="py-20 lg:py-28 bg-[#FAF9FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-purple-100 text-brand-700 text-xs font-bold uppercase tracking-wider">
              YOL XƏRİTƏSİ
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              9 ay. Ortaq məqsəd. Aydın yol xəritəsi.
            </h2>
            <p className="text-sm text-slate-600">
              Hər ay üçün konkret layihələr və ölçülə bilən nəticələr
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ROADMAP_MONTHS.map((item, idx) => {
              const isOpen = activeRoadmap === idx;
              return (
                <div
                  key={item.month}
                  onClick={() => setActiveRoadmap(isOpen ? null : idx)}
                  className={`bg-white rounded-3xl border transition-all p-6 cursor-pointer text-left ${
                    isOpen
                      ? "border-brand-500 shadow-md ring-1 ring-brand-500/20"
                      : "border-purple-100 hover:border-purple-300 shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-brand-600 bg-purple-50 px-3 py-1 rounded-full">
                      {item.month}
                    </span>
                    <ChevronRight
                      size={18}
                      className={`text-slate-400 transition-transform ${isOpen ? "rotate-90 text-brand-600" : ""}`}
                    />
                  </div>

                  <h4 className="text-base font-bold text-slate-800 mb-1">{item.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">{item.desc}</p>

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                    {item.tags.map((t) => (
                      <span key={t} className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION BANNER */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-purple-100/80 via-purple-50 to-indigo-100/80 rounded-3xl p-8 sm:p-14 border border-purple-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                GƏLƏCƏK SƏNDƏN BAŞLAYIR
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Sənin ideyan gələcəyi dəyişə bilər.
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md">
                Könüllülər komandasına qoşulun, layihələrdə iştirak edin və elmi potensialınızı kəşf edin.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/register"
                className="px-8 py-3.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-600/25 transition-all hover:scale-102 active:scale-98"
              >
                Bizə qoşul
              </Link>
              <Link
                href="/login"
                className="px-8 py-3.5 rounded-full bg-white hover:bg-purple-50 border border-purple-200 text-brand-700 font-semibold text-sm transition-all"
              >
                Şəxsi Kabinetə Giriş
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
