"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  LogOut, 
  ExternalLink, 
  ShieldCheck, 
  Database,
  CheckCircle2,
  Server
} from "lucide-react";

interface KabinetHeaderProps {
  currentUser: {
    displayName: string;
    email: string;
    role: 'admin' | 'member';
    department: string;
  };
  isMongoConnected?: boolean;
  onRoleToggle: () => void;
}

export default function KabinetHeader({ 
  currentUser, 
  isMongoConnected = false,
  onRoleToggle 
}: KabinetHeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("aeik_user");
    localStorage.removeItem("aeik_token");
    router.push("/login");
  };

  return (
    <header className="bg-white border-b border-purple-100/80 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Brand & Title */}
        <div className="flex items-center gap-4">
          <Link href="/" className="relative w-40 sm:w-48 h-10 block">
            <Image
              src="/assets/logo-primary.png"
              alt="AEİK"
              fill
              className="object-contain object-left"
              priority
            />
          </Link>
          <div className="hidden sm:block h-6 w-px bg-slate-200" />
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-slate-800 leading-tight">
              İdarə Heyəti Paneli
            </h1>
            <p className="text-xs text-slate-500">
              Şəxsi kabinet və fəaliyyət modulları
            </p>
          </div>
        </div>

        {/* Right: User details, role switch, sync status, and actions */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Storage / MongoDB Status */}
          <div 
            title={isMongoConnected ? "MongoDB Atlas Aktiv Əlaqə" : ".env faylında MONGODB_URI qeyd edildikdə avtomatik aktivləşir"}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
              isMongoConnected 
                ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                : "bg-purple-50 text-brand-700 border-purple-200"
            }`}
          >
            <Database size={13} className={isMongoConnected ? "text-emerald-600" : "text-brand-600"} />
            <span>{isMongoConnected ? "MongoDB Aktiv" : "Daxili Yaddaş"}</span>
            <CheckCircle2 size={13} className={isMongoConnected ? "text-emerald-500" : "text-brand-500"} />
          </div>

          {/* Role switch pill */}
          <button
            onClick={onRoleToggle}
            title="Rolu dəyişmək üçün klikləyin"
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
              currentUser.role === 'admin'
                ? "bg-brand-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <ShieldCheck size={14} />
            <span>{currentUser.role === 'admin' ? "Admin" : "Üzv"}</span>
          </button>

          {/* User profile capsule */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
              {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-xs font-semibold text-slate-800 leading-none">
                {currentUser.displayName}
              </div>
              <div className="text-[10px] text-slate-500 leading-none mt-1">
                {currentUser.department}
              </div>
            </div>
          </div>

          {/* Website link */}
          <Link
            href="/"
            title="Əsas veb saytı aç"
            className="p-2 rounded-xl text-slate-600 hover:text-brand-600 hover:bg-purple-50 transition-colors"
          >
            <ExternalLink size={18} />
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            title="Çıxış et"
            className="p-2 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
