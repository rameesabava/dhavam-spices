import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "Our Story | 100% Pure & Farm-Direct Spices",
  description:
    "Discover the story behind Dhavam Spices. We source premium, unadulterated spices directly from farms to kitchens across Chennai and India.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "Our Story | Dhavam Spices",
    description:
      "Discover the story behind Dhavam Spices. Premium, unadulterated spices straight from the farm.",
    url: "/about",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
