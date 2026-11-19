import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-darker text-white pt-16 pb-12 border-t border-purple-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-purple-900/60">
          {/* Logo & Description */}
          <div className="md:col-span-2 space-y-4">
            <div className="relative w-56 h-14">
              <Image
                src="/assets/logo-white.png"
                alt="AEİK"
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              Azərbaycan Elm və İnnovasiya Könüllüləri gənc alimlərin, tədqiqatçıların
              və tələbələrin elmi potensialını birləşdirən, innovativ layihələri dəstəkləyən milli platformadır.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="relative w-28 h-10 bg-white rounded-lg p-1.5 flex items-center justify-center">
                <Image
                  src="/assets/partner-bir-telebe.jpg"
                  alt="Bir Tələbə Könüllü"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <span className="text-xs text-slate-400">Tərəfdaşlıq layihəsi</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-purple-300 mb-4">
              Bölmələr
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link href="#haqqimizda" className="hover:text-purple-400 transition-colors">
                  Haqqımızda
                </Link>
              </li>
              <li>
                <Link href="#layiheler" className="hover:text-purple-400 transition-colors">
                  Layihələrimiz
                </Link>
              </li>
              <li>
                <Link href="#fealiyyet" className="hover:text-purple-400 transition-colors">
                  Fəaliyyət Planı
                </Link>
              </li>
              <li>
                <Link href="/kabinet" className="hover:text-purple-400 transition-colors">
                  Şəxsi Kabinet
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-purple-300 mb-4">
              Əlaqə
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <span>Email: info@aeik.az</span>
              </li>
              <li className="flex items-center gap-2">
                <span>Ünvan: Bakı şəhəri, Azərbaycan</span>
              </li>
              <li className="pt-2 flex items-center gap-3">
                <span className="text-xs text-purple-400">Instagram · LinkedIn · Facebook</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 Azərbaycan Elm və İnnovasiya Könüllüləri. Bütün hüquqlar qorunur.</p>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-purple-300">
              İdarə Heyəti Girişi
            </Link>
            <span>·</span>
            <Link href="#gizlilik" className="hover:text-purple-300">
              Məxfilik Siyasəti
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
