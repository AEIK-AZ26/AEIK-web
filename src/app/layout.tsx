import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Azərbaycan Elm və İnnovasiya Könüllüləri (AEİK) | Şəxsi Kabinet",
  description: "AEİK İdarə Heyəti Paneli, fəaliyyət planı, layihələrin idarə olunması və şəxsi kabinet.",
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
