"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, LogIn, LayoutDashboard, Menu, X } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<{ displayName: string; role: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("aeik_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {}
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-purple-100/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-44 sm:w-56 h-12">
            <Image
              src="/assets/logo-primary.png"
              alt="Azərbaycan Elm və İnnovasiya Könüllüləri"
              fill
              className="object-contain object-left group-hover:scale-102 transition-transform"
              priority
            />
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
          <Link href="#haqqimizda" className="hover:text-brand-600 transition-colors">
            Haqqımızda
          </Link>
          <Link href="#layiheler" className="hover:text-brand-600 transition-colors">
            Layihələr
          </Link>
          <Link href="#fealiyyet" className="hover:text-brand-600 transition-colors">
            Fəaliyyət
          </Link>
          <Link href="#elaqe" className="hover:text-brand-600 transition-colors">
            Əlaqə
          </Link>
        </nav>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <Link
              href="/kabinet"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm shadow-sm hover:shadow-md transition-all active:scale-98"
            >
              <LayoutDashboard size={16} />
              <span>Şəxsi Kabinet</span>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm shadow-sm hover:shadow-md transition-all active:scale-98"
              >
                <LogIn size={16} />
                <span>Daxil ol</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-purple-50"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-purple-100 px-4 pt-2 pb-6 space-y-3">
          <Link
            href="#haqqimizda"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-purple-50 rounded-lg"
          >
            Haqqımızda
          </Link>
          <Link
            href="#layiheler"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-purple-50 rounded-lg"
          >
            Layihələr
          </Link>
          <Link
            href="#fealiyyet"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-purple-50 rounded-lg"
          >
            Fəaliyyət
          </Link>
          <Link
            href="#elaqe"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-purple-50 rounded-lg"
          >
            Əlaqə
          </Link>
          <div className="pt-2">
            {user ? (
              <Link
                href="/kabinet"
                className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-brand-600 text-white font-medium text-sm"
              >
                <LayoutDashboard size={16} />
                <span>Şəxsi Kabinet</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-brand-600 text-white font-medium text-sm"
              >
                <LogIn size={16} />
                <span>Daxil ol</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
