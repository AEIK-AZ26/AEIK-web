import type { Metadata } from "next";
import "./globals.css";
import { CONTACT, SITE, SITE as SITE_INFO } from "@/data/brief";

// Canonical domen brifə uyğun olaraq aeik.az-dır; Vercel preview üçün env ilə dəyişilə bilər.
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || SITE.url).replace(/\/$/, "");
const SITE_TITLE = SITE.title;
const SITE_DESCRIPTION = SITE.description;

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
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/assets/pages/hero-card.jpg"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: SITE_INFO.title,
  alternateName: "AEİK",
  url: SITE_URL,
  logo: `${SITE_URL}/assets/logo-primary.png`,
  email: CONTACT.email,
  telephone: CONTACT.phone,
  slogan: SITE_INFO.motto,
  address: { "@type": "PostalAddress", addressLocality: "Bakı", addressCountry: "AZ" },
  sameAs: [CONTACT.instagram, CONTACT.linkedin],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az" className="scroll-smooth">
      <body className="antialiased min-h-screen flex flex-col bg-white font-sans text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
