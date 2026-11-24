"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  ShieldCheck,
  Users,
  X,
  Crown,
  UserCheck,
  Database,
  CheckCircle2,
} from "lucide-react";
import { UserRole } from "@/types";
import { shortName, initial } from "@/lib/userName";

interface KabinetHeaderProps {
  currentUser: {
    displayName: string;
    email: string;
    role: UserRole;
    department: string;
  };
  isMongoConnected?: boolean;
}

export default function KabinetHeader({
  currentUser,
  isMongoConnected = false,
}: KabinetHeaderProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("aeik_user");
    localStorage.removeItem("aeik_token");
    router.push("/login");
  };

  const canManage = currentUser.role === "owner" || currentUser.role === "admin";

  const roleLabel = currentUser.role === "owner" ? "Owner" : currentUser.role === "admin" ? "Admin" : "Üzv";
  const RoleIcon = currentUser.role === "owner" ? Crown : currentUser.role === "admin" ? ShieldCheck : UserCheck;

  const roleBadge = (
    <span
      title={roleLabel}
      className={`inline-flex h-8 items-center gap-1.5 rounded-full px-2 text-[10.5px] font-bold text-white sm:px-2.5 ${
        currentUser.role === "owner" ? "bg-amber-500" : currentUser.role === "admin" ? "bg-brand-600" : "bg-slate-400"
      }`}
    >
      <RoleIcon size={13} />
      <span className="hidden md:inline">{roleLabel}</span>
    </span>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-purple-100/80 bg-white/95 shadow-xs backdrop-blur-xl">
      <div className="mx-auto flex h-[60px] max-w-7xl items-center gap-2 px-3 sm:h-[68px] sm:gap-3 sm:px-5 lg:px-8">
        {/* Loqo — mobil-də yalnız ampul */}
        <Link href="/" className="flex shrink-0 items-center gap-2" title="Ana səhifə">
          <span className="relative block h-8 w-8 shrink-0 overflow-hidden rounded-lg sm:h-9 sm:w-9">
            <Image src="/assets/icon-bulb.jpg" alt="AEİK" fill sizes="36px" className="object-contain" priority />
          </span>
          <span className="hidden text-[13px] font-extrabold tracking-[-0.01em] text-ink sm:block">AEİK</span>
        </Link>

        <span className="hidden h-6 w-px bg-slate-200 md:block" />
        <div className="hidden min-w-0 md:block">
          <h1 className="whitespace-nowrap text-[12.5px] font-bold leading-tight text-slate-800">İdarə Heyəti Paneli</h1>
          <p className="hidden whitespace-nowrap text-[10.5px] text-slate-500 lg:block">Şəxsi kabinet və fəaliyyət modulları</p>
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          {/* MongoDB status — yalnız ikon mobil-də */}
          <span
            title={isMongoConnected ? "MongoDB Atlas aktiv əlaqə" : "Məlumatlar lokal saxlanılır"}
            className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-2 text-[10.5px] font-semibold md:px-2.5 ${
              isMongoConnected
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-purple-200 bg-purple-50 text-brand-700"
            }`}
          >
            <Database size={13} />
            <span className="hidden md:inline">{isMongoConnected ? "MongoDB Aktiv" : "Daxili Yaddaş"}</span>
            <CheckCircle2 size={12} className={`hidden md:block ${isMongoConnected ? "text-emerald-500" : "text-brand-500"}`} />
          </span>

          {/* Desktop: mətnli düymələr, mobil: yalnız ikonlar */}
          {canManage && (
            <Link
              href="/menecer"
              title="Menecer paneli"
              className="inline-flex h-8 items-center gap-1.5 rounded-full bg-brand-600 px-2 text-[11px] font-semibold text-white transition-colors hover:bg-brand-700 sm:px-3"
            >
              <Megaphone size={14} />
              <span className="hidden lg:inline">Menecer</span>
            </Link>
          )}

          {canManage && (
            <Link
              href="/kabinet/users"
              title="İstifadəçilər"
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-2 text-[11px] font-semibold text-brand-700 transition-colors hover:bg-purple-100 sm:px-3"
            >
              <Users size={14} />
              <span className="hidden lg:inline">İstifadəçilər</span>
            </Link>
          )}

          {roleBadge}

          {/* Profil — mobil-də yalnız avatar */}
          <div className="flex h-8 items-center gap-1.5 rounded-2xl border border-slate-200/80 bg-slate-50 px-1 sm:px-1.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-[10.5px] font-bold text-brand-700">
              {initial(currentUser.displayName)}
            </span>
            <span className="hidden max-w-[120px] truncate pr-1 text-[11px] font-bold text-slate-800 md:block" title={currentUser.displayName}>
              {shortName(currentUser.displayName)}
            </span>
          </div>

          <Link
            href="/"
            target="_blank"
            className="hidden h-8 w-8 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-purple-50 hover:text-brand-600 sm:inline-flex"
            title="Əsas saytı yeni tabda aç"
          >
            <ExternalLink size={16} />
          </Link>

          <button
            onClick={handleLogout}
            className="hidden h-8 w-8 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 sm:inline-flex"
            title="Çıxış"
          >
            <LogOut size={16} />
          </button>

          {/* Mobil menyu */}
          <div className="relative sm:hidden" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menyu"
              aria-expanded={menuOpen}
              className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50"
            >
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-10 z-50 w-60 overflow-hidden rounded-2xl border border-[#EAE7F7] bg-white shadow-2xl">
                <div className="border-b border-slate-100 px-3.5 py-3">
                  <p className="truncate text-[12px] font-bold text-slate-800">{currentUser.displayName}</p>
                  <p className="mt-0.5 truncate text-[10.5px] text-slate-500">{currentUser.department || currentUser.email}</p>
                </div>
                <div className="p-1.5">
                  {canManage && (
                    <Link
                      href="/menecer"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-[12px] font-semibold text-slate-700 hover:bg-[#F4F2FC] hover:text-brand-700"
                    >
                      <Megaphone size={15} className="text-brand-600" /> Menecer paneli
                    </Link>
                  )}
                  {canManage && (
                    <Link
                      href="/kabinet/users"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-[12px] font-semibold text-slate-700 hover:bg-[#F4F2FC] hover:text-brand-700"
                    >
                      <Users size={15} className="text-brand-600" /> İstifadəçilər
                    </Link>
                  )}
                  <Link
                    href="/"
                    target="_blank"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-[12px] font-semibold text-slate-700 hover:bg-[#F4F2FC] hover:text-brand-700"
                  >
                    <ExternalLink size={15} className="text-brand-600" /> Saytı aç
                  </Link>
                  <Link
                    href="/"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-[12px] font-semibold text-slate-700 hover:bg-[#F4F2FC] hover:text-brand-700"
                  >
                    <LayoutDashboard size={15} className="text-brand-600" /> Ana səhifə
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-left text-[12px] font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut size={15} /> Çıxış
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
