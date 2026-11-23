import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://aeik.vercel.app";
const SITE_TITLE = "Azərbaycan Elm və İnnovasiya Könüllüləri (AEİK)";
const SITE_DESCRIPTION =
  "Gənc tədqiqatçılar və innovatorlar üçün elm və innovasiya proqramı: böyük layihələr, davamlı fəaliyyətlər və fəaliyyət planı.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | AEİK`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "az_AZ",
    url: SITE_URL,
    siteName: SITE_TITLE,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: "/assets/pages/hero-card.jpg", width: 2432, height: 1380, alt: SITE_TITLE }],
  },
  icons: {
    icon: "/assets/icon-bulb.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az" className="scroll-smooth">
      <body className="antialiased min-h-screen flex flex-col bg-white font-sans text-ink">
        {children}
      </body>
    </html>
  );
}
