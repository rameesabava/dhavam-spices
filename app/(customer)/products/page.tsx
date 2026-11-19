import type { Metadata } from "next";
import ProductsPageClient from "./ProductsPageClient";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pure Whole Spices & Freshly Ground Powders | Dhavam Spices",
  description:
    "Explore Dhavam Spices range of farm-direct cardamom, black pepper, cloves, cinnamon, star anise, and spice powders. 100% natural with no artificial additives.",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Pure Whole Spices & Spice Powders | Dhavam Spices",
    description:
      "Buy farm-direct cardamom, black pepper, cloves, cinnamon, and star anise online in Chennai.",
    url: "/products",
  },
};

export default function ProductsPage() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Dhavam Spices Products",
    description: "Farm-direct whole spices and powders in Chennai",
    url: `${SITE.url}/products`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Whole Spices",
        description: "Farm-fresh whole cardamom, black pepper, cloves, cinnamon, and star anise.",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Spice Powders",
        description: "Freshly ground pure spice powders with no artificial preservatives.",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Spice Combos",
        description: "Curated farm-fresh spice combo packs for home kitchens and gifting.",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <ProductsPageClient />
    </>
  );
}
