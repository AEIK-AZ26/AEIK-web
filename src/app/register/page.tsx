"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Briefcase, ArrowRight, AlertCircle } from "lucide-react";

const DEPARTMENTS = [
  "Layihələrin idarə olunması",
  "SMM və dizayn",
  "Jurnal və layihələr",
  "Təhsil və Elm",
  "Beynəlxalq Əlaqələr"
];

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Şifrələr bir-biri ilə uyğun gəlmir!");
      return;
    }

    if (password.length < 6) {
      setError("Şifrə minimum 6 simvol olmalıdır!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: name,
          email,
          password,
          department,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Qeydiyyat zamanı xəta baş verdi.");
        setLoading(false);
        return;
      }

      localStorage.setItem("aeik_user", JSON.stringify(data.user));
      if (data.token) localStorage.setItem("aeik_token", data.token);

      router.push("/kabinet");
    } catch (err: any) {
      console.error("Registration fetch error:", err);
      // Fallback
      const userDoc = {
        uid: "local_" + Date.now(),
        displayName: name,
        email: email,
        department: department,
        role: "member",
        createdAt: Date.now(),
      };
      localStorage.setItem("aeik_user", JSON.stringify(userDoc));
      router.push("/kabinet");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF9FF] via-[#F4F1FD] to-[#EDE9FE] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-purple-950/5 border border-purple-100/80 p-8 sm:p-10 relative overflow-hidden">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <Link href="/" className="relative w-48 h-12 mb-3">
            <Image
              src="/assets/logo-primary.png"
              alt="AEİK"
              fill
              className="object-contain"
              priority
            />
          </Link>
          <h2 className="text-xl font-bold text-slate-800">Yeni Qeydiyyat</h2>
          <p className="text-xs text-slate-500 mt-1">İdarə heyəti və layihə komandasına qoşulun</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Ad və Soyad
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nərhiz Hacıllı"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none text-sm text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Email Ünvanı
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ad@aeik.az"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none text-sm text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Şöbə / Departament
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none text-sm text-slate-800"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Şifrə
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 simvol"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none text-sm text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Şifrə Təkrarı
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Şifrəni təkrar yazın"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-600 outline-none text-sm text-slate-800"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 rounded-full bg-brand-600 hover:bg-brand-700 active:scale-98 text-white font-medium text-sm shadow-md shadow-brand-600/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? "Hesab yaradılır..." : "Qeydiyyatı tamamla"}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-slate-600">
          Artıq hesabınız var?{" "}
          <Link href="/login" className="text-brand-600 font-bold hover:underline">
            Daxil olun
          </Link>
        </div>
      </div>
    </div>
  );
}
