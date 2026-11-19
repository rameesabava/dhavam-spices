import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: "Dhavam",
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#171b0c",
    theme_color: "#2f381b",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
