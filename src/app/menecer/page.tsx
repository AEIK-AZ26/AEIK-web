"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Crown,
  Database,
  ExternalLink,
  FileText,
  FolderGit2,
  Gauge,
  LayoutDashboard,
  Loader2,
  LogOut,
  Megaphone,
  Menu,
  Newspaper,
  ShieldCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { DEFAULT_CONTENT, SiteItem, SiteSection, SECTION_LABELS, formatDate } from "@/lib/siteContent";
import { loadContent } from "@/lib/contentApi";
import ContentManager from "@/components/menecer/ContentManager";
import FormManager from "@/components/menecer/FormManager";
import { UserRole } from "@/types";
import { shortName, initial } from "@/lib/userName";

type Tab = "overview" | "form" | SiteSection;

const NAV: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "overview", label: "İcmal", icon: Gauge },
  { key: "announcement", label: "Elanlar", icon: Megaphone },
  { key: "news", label: "Xəbərlər", icon: Newspaper },
  { key: "membership", label: "Üzvlük proqramı", icon: UserPlus },
  { key: "form", label: "Müraciət formu", icon: ClipboardList },
  { key: "project", label: "Layihələr", icon: FolderGit2 },
  { key: "about", label: "Haqqımızda", icon: FileText },
  { key: "plan", label: "Fəaliyyət planı", icon: CalendarClock },
];

interface CurrentUser {
  displayName: string;
  email: string;
  role: UserRole;
  department: string;
}

export default function MenecerPage() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");
  const [items, setItems] = useState<SiteItem[]>(DEFAULT_CONTENT);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; kind: "ok" | "error" } | null>(null);

  const notify = useCallback((message: string, kind: "ok" | "error" = "ok") => {
    setToast({ message, kind });
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem("aeik_user");
    const token = localStorage.getItem("aeik_token");

    // Menecer paneli yalnız giriş etmiş istifadəçilər üçün açıqdır.
    if (!raw || !token) {
      router.replace("/login?next=/menecer");
      return;
    }

    try {
      const parsed = JSON.parse(raw) as CurrentUser;
      if (parsed.role !== "owner" && parsed.role !== "admin") {
        setUser(parsed);
        setReady(true);
        setLoading(false);
        return;
      }
      setUser(parsed);
      setReady(true);
    } catch {
      localStorage.removeItem("aeik_user");
      localStorage.removeItem("aeik_token");
      router.replace("/login?next=/menecer");
    }
  }, [router]);

  useEffect(() => {
    if (!user || (user.role !== "owner" && user.role !== "admin")) return;
    let cancelled = false;
    loadContent()
      .then((res) => {
        if (cancelled) return;
        setItems(res.items.length ? res.items : DEFAULT_CONTENT);
        setConnected(res.connected);
      })
      .catch((error: Error & { status?: number }) => {
        if (cancelled) return;
        // Token yoxdursa/bitibsə server 401 qaytarır — yenidən girişə göndəririk.
        if (error?.status === 401) {
          localStorage.removeItem("aeik_user");
          localStorage.removeItem("aeik_token");
          router.replace("/login?next=/menecer");
          return;
        }
        setItems(DEFAULT_CONTENT);
        setConnected(false);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const bySection = useMemo(() => {
    const groups = {} as Record<SiteSection, SiteItem[]>;
    (["announcement", "news", "membership", "project", "about", "plan"] as SiteSection[]).forEach((sec) => {
      groups[sec] = items.filter((item) => item.sec === sec);
    });
    return groups;
  }, [items]);

  const handleLogout = () => {
    localStorage.removeItem("aeik_user");
    localStorage.removeItem("aeik_token");
    router.push("/login");
  };

  const handleSaved = (item: SiteItem, isNew: boolean) => {
    setItems((prev) => (isNew ? [...prev.filter((i) => i.id !== item.id), item] : prev.map((i) => (i.id === item.id ? { ...i, ...item } : i))));
  };

  const handleDeleted = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F6FC]">
        <div className="text-center">
          <Loader2 className="mx-auto animate-spin text-brand-600" size={26} />
          <p className="mt-3 text-xs font-semibold text-slate-500">Panel yüklənir...</p>
        </div>
      </div>
    );
  }

  if (!user || (user.role !== "owner" && user.role !== "admin")) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F6FC] p-5">
        <div className="w-full max-w-md rounded-3xl border border-[#EAE7F7] bg-white p-8 text-center premium-shadow">
          <AlertTriangle className="mx-auto text-amber-500" size={30} />
          <h1 className="mt-4 text-lg font-extrabold text-ink">İcazə yoxdur</h1>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            Menecer paneli yalnız owner və admin rolları üçün açıqdır. Hesabınızın rolunu idarə heyətindən dəyişməyi xahiş edin.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link href="/kabinet" className="inline-flex h-10 items-center justify-center rounded-full bg-brand-600 px-5 text-xs font-semibold text-white">
              Kabinetə qayıt
            </Link>
            <button onClick={handleLogout} className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 px-5 text-xs font-semibold text-slate-600">
              Çıxış
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeLabel = tab === "overview" ? "İcmal" : tab === "form" ? "Müraciət formu" : SECTION_LABELS[tab as SiteSection];

  return (
    <div className="min-h-screen bg-[#F7F6FC] font-sans">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-[#EAE7F7] bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[62px] w-full max-w-[1440px] items-center gap-3 px-3 sm:h-[70px] sm:px-5 lg:px-7">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Menyu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <Link href="/" className="flex shrink-0 items-center gap-2" title="Ana səhifə">
            <span className="relative block h-8 w-8 shrink-0 overflow-hidden rounded-lg sm:h-9 sm:w-9">
              <Image src="/assets/icon-bulb.jpg" alt="AEİK" fill sizes="36px" className="object-contain" priority />
            </span>
            <span className="hidden text-[13px] font-extrabold tracking-[-0.01em] text-ink min-[400px]:block">AEİK</span>
          </Link>
          <span className="hidden h-6 w-px bg-slate-200 md:block" />
          <div className="hidden min-w-0 md:block">
            <p className="whitespace-nowrap text-[12.5px] font-bold leading-tight text-slate-900">Menecer paneli</p>
            <p className="hidden whitespace-nowrap text-[10.5px] text-slate-500 lg:block">Sayt məzmununun idarəsi</p>
          </div>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <span
              title={connected ? "MongoDB aktiv əlaqə" : "Baza əlçatmaz — lokal məzmun göstərilir"}
              className={`hidden items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-semibold md:flex ${
                connected
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-amber-200 bg-amber-50 text-amber-700"
              }`}
            >
              <Database size={12} />
              {connected ? "MongoDB aktiv" : "Lokal rejim"}
              {connected ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
            </span>

            <Link
              href="/"
              target="_blank"
              title="Saytı yeni tabda aç"
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-slate-200 px-2.5 text-[11px] font-semibold text-slate-600 transition-colors hover:border-brand-200 hover:text-brand-600 md:h-auto md:py-1.5 md:pl-3 md:pr-3"
            >
              <ExternalLink size={14} className="md:hidden" />
              <ExternalLink size={12} className="hidden md:block" />
              <span className="hidden md:inline">Sayt</span>
            </Link>
            <Link
              href="/kabinet"
              title="Kabinetə keç"
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-slate-200 px-2.5 text-[11px] font-semibold text-slate-600 transition-colors hover:border-brand-200 hover:text-brand-600 md:h-auto md:py-1.5 md:pl-3 md:pr-3"
            >
              <LayoutDashboard size={14} className="md:hidden" />
              <LayoutDashboard size={12} className="hidden md:block" />
              <span className="hidden md:inline">Kabinet</span>
            </Link>

            <span
              title={user.role === "owner" ? "Owner" : "Admin"}
              className={`hidden h-8 items-center gap-1 rounded-full px-2.5 text-[10.5px] font-bold text-white sm:inline-flex md:h-auto md:py-1 ${
                user.role === "owner" ? "bg-amber-500" : "bg-brand-600"
              }`}
            >
              {user.role === "owner" ? <Crown size={13} /> : <ShieldCheck size={13} />}
              <span className="hidden md:inline">{user.role === "owner" ? "Owner" : "Admin"}</span>
            </span>

            <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200/80 bg-slate-50 px-1.5 py-1.5 sm:gap-2 sm:px-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-[11px] font-bold text-brand-700">
                {initial(user.displayName)}
              </span>
              <span
                title={user.displayName}
                className="max-w-[68px] truncate text-[11px] font-bold text-slate-800 sm:max-w-[140px]"
              >
                {shortName(user.displayName)}
              </span>
            </div>

            <button onClick={handleLogout} className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600" title="Çıxış">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1440px] gap-6 px-3 pb-16 pt-4 sm:px-5 lg:px-7 lg:pt-6">
        {/* ── Sidebar ─────────────────────────────────────────── */}
        <aside
          className={`${
            menuOpen ? "block" : "hidden"
          } fixed inset-x-0 top-[62px] z-40 max-h-[calc(100vh-62px)] overflow-y-auto border-b border-[#EAE7F7] bg-white p-3 shadow-lg sm:top-[70px] sm:max-h-[calc(100vh-70px)] lg:sticky lg:top-[94px] lg:block lg:max-h-[calc(100vh-110px)] lg:w-[248px] lg:shrink-0 lg:rounded-2xl lg:border lg:border-[#EAE7F7] lg:p-3 lg:shadow-none`}
        >
          <p className="hidden px-2 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 lg:block">
            Məzmun bölmələri
          </p>
          <nav className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-1">
            {NAV.map((entry) => {
              const Icon = entry.icon;
              const active = tab === entry.key;
              const count =
                entry.key === "overview"
                  ? items.length
                  : entry.key === "form"
                  ? null
                  : bySection[entry.key as SiteSection]?.length || 0;
              return (
                <button
                  key={entry.key}
                  onClick={() => {
                    setTab(entry.key);
                    setMenuOpen(false);
                  }}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[12.5px] font-semibold transition-all ${
                    active
                      ? "bg-brand-600 text-white shadow-[0_10px_24px_-14px_rgba(101,82,245,0.9)]"
                      : "text-slate-600 hover:bg-[#F4F2FC] hover:text-brand-700"
                  }`}
                >
                  <Icon size={15} className="shrink-0" />
                  <span className="flex-1 truncate">{entry.label}</span>
                  {count !== null && (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                        active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-3 rounded-2xl border border-[#EAE7F7] bg-[#FAF9FF] p-3.5">
            <p className="flex items-center gap-1.5 text-[11px] font-bold text-ink">
              <Users size={13} className="text-brand-600" /> Komanda
            </p>
            <p className="mt-1 text-[10.5px] leading-relaxed text-slate-500">
              İstifadəçi və rolları kabinetin “İstifadəçilər” bölməsindən idarə edin.
            </p>
            <Link
              href="/kabinet/users"
              className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-brand-600 hover:text-brand-700"
            >
              İstifadəçilərə keç <ArrowUpRight size={12} />
            </Link>
          </div>
        </aside>

        {menuOpen && <div className="fixed inset-0 z-30 bg-black/20 lg:hidden" onClick={() => setMenuOpen(false)} />}

        {/* ── Main ────────────────────────────────────────────── */}
        <main className="min-w-0 flex-1">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-600">AEİK · Menecer</p>
              <h1 className="mt-1 text-[22px] font-extrabold tracking-[-0.03em] text-ink sm:text-[28px]">{activeLabel}</h1>
            </div>
            <p className="text-[11px] text-slate-500">
              Dəyişikliklər ana səhifədə avtomatik görünür · son sinxron: indi
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center rounded-2xl border border-[#EAE7F7] bg-white py-24">
              <Loader2 className="animate-spin text-brand-600" size={24} />
            </div>
          ) : tab === "overview" ? (
            <Overview items={items} bySection={bySection} connected={connected} onOpen={setTab} />
          ) : tab === "form" ? (
            <FormManager notify={notify} />
          ) : (
            <ContentManager
              section={tab}
              items={bySection[tab]}
              onSaved={handleSaved}
              onDeleted={handleDeleted}
              notify={notify}
            />
          )}
        </main>
      </div>

      {toast && (
        <div
          className={`fixed bottom-4 left-1/2 z-[80] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border px-4 py-3 text-[12px] font-semibold shadow-xl ${
            toast.kind === "ok"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-amber-200 bg-amber-50 text-amber-800"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

function Overview({
  items,
  bySection,
  connected,
  onOpen,
}: {
  items: SiteItem[];
  bySection: Record<SiteSection, SiteItem[]>;
  connected: boolean;
  onOpen: (tab: Tab) => void;
}) {
  const published = items.filter((i) => i.status !== "draft").length;
  const drafts = items.filter((i) => i.status === "draft").length;
  const recent = items
    .slice()
    .sort((a, b) => (b.ts || 0) - (a.ts || 0))
    .slice(0, 6);

  const cards = [
    { key: "announcement" as Tab, label: "Elanlar", value: bySection.announcement.length, icon: Megaphone, tint: "from-[#EFEBFF] to-[#F8F5FF]" },
    { key: "news" as Tab, label: "Xəbərlər", value: bySection.news.length, icon: Newspaper, tint: "from-[#E9F6FF] to-[#F5FBFF]" },
    { key: "project" as Tab, label: "Layihələr", value: bySection.project.length, icon: FolderGit2, tint: "from-[#EAF9F1] to-[#F4FDF8]" },
    { key: "plan" as Tab, label: "Plan ayı", value: bySection.plan.length, icon: CalendarClock, tint: "from-[#FFF4E6] to-[#FFFBF4]" },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.key}
              onClick={() => onOpen(card.key)}
              className={`group relative overflow-hidden rounded-2xl border border-[#EAE7F7] bg-gradient-to-br ${card.tint} p-4 text-left transition-transform hover:-translate-y-0.5 sm:p-5`}
            >
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm">
                  <Icon size={16} />
                </span>
                <ArrowUpRight size={15} className="text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
              <p className="mt-4 text-[26px] font-extrabold leading-none tracking-[-0.03em] text-ink">{card.value}</p>
              <p className="mt-1 text-[10.5px] font-bold uppercase tracking-[0.12em] text-slate-500">{card.label}</p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.15fr_1fr]">
        <section className="rounded-2xl border border-[#EAE7F7] bg-white p-4 premium-shadow-soft sm:p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink">Son yenilənən məzmun</h2>
            <span className="rounded-full bg-[#F4F2FC] px-2 py-0.5 text-[10px] font-bold text-brand-700">{published} dərc</span>
          </div>
          <ul className="mt-3 divide-y divide-slate-100">
            {recent.map((item) => (
              <li key={item.id} className="flex items-center gap-3 py-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F4F2FC] text-brand-600">
                  {item.sec === "news" ? <Newspaper size={13} /> : item.sec === "project" ? <FolderGit2 size={13} /> : <Megaphone size={13} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-semibold text-slate-800">{item.title}</p>
                  <p className="text-[10px] text-slate-500">
                    {SECTION_LABELS[item.sec]} · {item.date ? formatDate(item.date) : "tarixsiz"}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[9.5px] font-bold ${
                    item.status === "draft" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {item.status === "draft" ? "Qaralama" : "Dərc"}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl border border-[#EAE7F7] bg-white p-4 premium-shadow-soft sm:p-5">
            <h2 className="text-sm font-bold text-ink">Sistem vəziyyəti</h2>
            <div className="mt-3 space-y-2.5">
              <div className="flex items-center justify-between rounded-xl bg-[#FAF9FF] px-3 py-2.5">
                <span className="flex items-center gap-2 text-[11.5px] font-semibold text-slate-600">
                  <Database size={13} className="text-brand-600" /> MongoDB
                </span>
                <span className={`text-[11px] font-bold ${connected ? "text-emerald-600" : "text-amber-600"}`}>
                  {connected ? "Bağlıdır" : "Fallback rejimi"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-[#FAF9FF] px-3 py-2.5">
                <span className="flex items-center gap-2 text-[11.5px] font-semibold text-slate-600">
                  <ImageIcon /> imgbb
                </span>
                <span className="text-[11px] font-bold text-emerald-600">Server üzərindən aktiv</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-[#FAF9FF] px-3 py-2.5">
                <span className="flex items-center gap-2 text-[11.5px] font-semibold text-slate-600">
                  <FileText size={13} className="text-brand-600" /> Qaralamalar
                </span>
                <span className="text-[11px] font-bold text-slate-800">{drafts}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#EAE7F7] bg-gradient-to-br from-[#211A3E] via-[#2B2352] to-[#3A2E66] p-4 text-white sm:p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#B9ABEE]">Tez işlər</p>
            <h3 className="mt-1.5 text-[15px] font-extrabold leading-snug">Ana səhifəni canlı saxla</h3>
            <p className="mt-1.5 text-[11px] leading-relaxed text-white/70">
              Yeni elan və xəbər əlavə etdikdə dərhal saytda görünür. Şəkil yükləmə imgbb üzərindən aparılır.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={() => onOpen("announcement")} className="rounded-full bg-white px-3.5 py-1.5 text-[11px] font-bold text-[#2B2352]">
                Elan yaz
              </button>
              <button onClick={() => onOpen("news")} className="rounded-full border border-white/25 px-3.5 py-1.5 text-[11px] font-bold text-white">
                Xəbər əlavə et
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ImageIcon() {
  // Kiçik inline ikon — lucide bağlamasını genişləndirməmək üçün
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-brand-600">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-4.5-4.5L9 18" />
    </svg>
  );
}
