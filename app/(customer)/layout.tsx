import type { Metadata } from "next";
import Header from "@/components/Header";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Dhavam Spices | Pure, Farm-Direct Spices & Masalas in Chennai",
    template: "%s | Dhavam Spices",
  },
  description: SITE.description,
  keywords: [
    "Dhavam Spices",
    "pure spices",
    "farm direct spices",
    "unadulterated spices",
    "cardamom",
    "black pepper",
    "cloves",
    "cinnamon",
    "star anise",
    "black coffee powder",
    "spices Chennai",
    "Tamil Nadu spices",
    "whole spices",
    "ground spices",
    "buy spices online India",
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    title: "Dhavam Spices | Pure, Farm-Direct Spices & Masalas in Chennai",
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/images/banner2.png",
        width: 1774,
        height: 887,
        alt: "Dhavam Spices - Pure farm-direct spices and masalas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dhavam Spices | Pure, Farm-Direct Spices & Masalas in Chennai",
    description: SITE.description,
    images: ["/images/banner2.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const storeSchema = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: SITE.name,
    legalName: SITE.legalName,
    description: SITE.description,
    url: SITE.url,
    telephone: SITE.phones[0].tel,
    email: SITE.email,
    image: `${SITE.url}/images/banner2.png`,
    priceRange: "₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.streetAddress,
      addressLocality: SITE.address.addressLocality,
      addressRegion: SITE.address.addressRegion,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.addressCountry,
    },
    sameAs: [SITE.socials.facebook, SITE.socials.instagram],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
}
