"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const PENDING_KEY = "aeik_pending_section";

/** Səhifədaxili bölməyə yumşaq scroll — URL-ə "#" əlavə etmir. */
export function scrollToSection(id: string): boolean {
  if (typeof document === "undefined") return false;
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

/** Başqa səhifədən gələndə hədəf bölməni bir dəfəlik oxuyur. */
export function consumePendingSection(): string | null {
  try {
    const id = sessionStorage.getItem(PENDING_KEY);
    if (id) sessionStorage.removeItem(PENDING_KEY);
    return id;
  } catch {
    return null;
  }
}

export function sectionFromHref(href: string): string | null {
  if (href.startsWith("/#")) return href.slice(2);
  if (href.startsWith("#")) return href.slice(1);
  return null;
}

interface SectionLinkProps extends Omit<React.ComponentProps<typeof Link>, "href"> {
  href: string;
  onNavigate?: () => void;
}

export default function SectionLink({ href, onNavigate, onClick, ...rest }: SectionLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const section = sectionFromHref(href);
  const isHome = href === "/";

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    // Naviqasiyanı dərhal dayandırırıq ki, Next `href="/"`-i yenidən açmasın.
    if (section || (isHome && pathname === "/")) event.preventDefault();
    onClick?.(event);
    onNavigate?.();

    if (section) {
      if (scrollToSection(section)) {
        if (window.location.hash) {
          history.replaceState(null, "", window.location.pathname + window.location.search);
        }
        return;
      }
      try {
        sessionStorage.setItem(PENDING_KEY, section);
      } catch {
        /* sessiya yaddaşı əlçatmazdırsa sadəcə ana səhifəyə keçirik */
      }
      if (pathname !== "/") router.push("/");
      return;
    }

    if (isHome && pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (window.location.hash) {
        history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    }
  };

  return <Link href={section ? "/" : href} onClick={handleClick} {...rest} />;
}
