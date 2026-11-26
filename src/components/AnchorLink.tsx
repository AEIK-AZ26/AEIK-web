"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * `#bölmə` keçidləri üçün Link.
 * Hədəf artıq açıq səhifədədirsə, Next yenidən naviqasiya etmir — sadəcə
 * həmin bölməyə yumşaq scroll edirik. Başqa səhifədədirsə, adi keçid olur.
 */
interface AnchorLinkProps extends Omit<React.ComponentProps<typeof Link>, "href"> {
  href: string;
  onNavigate?: () => void;
}

export default function AnchorLink({ href, onNavigate, onClick, children, ...rest }: AnchorLinkProps) {
  const pathname = usePathname();
  const [path, hash] = href.split("#");
  const normalizedPath = (path || "/").replace(/\/$/, "") || "/";
  const currentPath = pathname.replace(/\/$/, "") || "/";

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    onNavigate?.();
    if (!hash || normalizedPath !== currentPath) return;

    const target = document.getElementById(hash);
    if (!target) return;

    event.preventDefault();
    history.replaceState(null, "", `${normalizedPath === "/" ? "/" : normalizedPath}#${hash}`);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
