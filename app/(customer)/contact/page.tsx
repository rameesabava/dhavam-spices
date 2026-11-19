import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us & Order Spices | Dhavam Spices Chennai",
  description:
    "Order 100% pure, farm-direct cardamom, black pepper, cloves, cinnamon, star anise and coffee in Chennai. Contact Dhavam Spices via WhatsApp, phone, or email.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us | Dhavam Spices Chennai",
    description:
      "Order 100% pure, farm-direct spices in Chennai. Contact Dhavam Spices via WhatsApp, phone, or email.",
    url: "/contact",
  },
};

const OWNER = SITE.name;

const PHONES = SITE.phones;

const EMAIL = SITE.email;

const ADDRESS = [
  SITE.address.streetAddress,
  `${SITE.address.addressLocality} ${SITE.address.postalCode}`,
];

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Casagrand+Northern+Star+Madhavaram+Chennai+600110";

const WHATSAPP_URL = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
  "Hi Dhavam Spices, I'd like to place an order."
)}`;

const FACEBOOK_URL = SITE.socials.facebook;
const INSTAGRAM_URL = SITE.socials.instagram;

const SPICES = [
  "Cardamom",
  "Pepper",
  "Cloves",
  "Cinnamon",
  "Star anise",
  "Black coffee powder",
];

const focus =
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d9825f]/40";

const link = `rounded text-lg text-white underline-offset-4 hover:underline ${focus}`;

const row = "grid gap-1 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6";

const term = "text-sm font-medium text-[#b9c29a]";

export default function ContactPage() {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Dhavam Spices",
    url: `${SITE.url}/contact`,
    description:
      "Contact information for Dhavam Spices in Chennai. Inquire and order farm-direct spices by phone, WhatsApp, or email.",
    mainEntity: {
      "@type": "LocalBusiness",
      name: SITE.name,
      telephone: PHONES[0].tel,
      email: EMAIL,
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE.address.streetAddress,
        addressLocality: SITE.address.addressLocality,
        addressRegion: SITE.address.addressRegion,
        postalCode: SITE.address.postalCode,
        addressCountry: SITE.address.addressCountry,
      },
    },
  };

  return (
    <main className="bg-[#2f381b] px-6 py-20 text-[#e6ebdc] sm:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
          Pure spices, straight from the farm to your kitchen.
        </h1>

        <p className="mt-6 text-lg leading-relaxed text-[#d5dcc0]">
          We pack whole and freshly ground spices in clear jars, direct from the
          farm. Reach out to order, ask about bulk supplies, or just say hello.
        </p>

        <dl className="mt-12 divide-y divide-[#424e27] border-y border-[#424e27]">
          {/* WhatsApp */}
          <div className={row}>
            <dt className={term}>Order online</dt>
            <dd>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 font-medium text-[#e3a27f] hover:underline ${focus}`}
              >
                <span>Chat on WhatsApp</span>
                <span aria-hidden="true">→</span>
              </a>
              <p className="mt-1 text-sm text-[#b9c29a]">
                Quickest way to check prices and place an order.
              </p>
            </dd>
          </div>

          {/* Phone */}
          <div className={row}>
            <dt className={term}>Phone</dt>
            <dd className="space-y-1">
              {PHONES.map((p) => (
                <div key={p.tel}>
                  <a href={`tel:${p.tel}`} className={link}>
                    {p.display}
                  </a>
                </div>
              ))}
            </dd>
          </div>

          {/* Social Media */}
          <div className={row}>
            <dt className={term}>Follow us</dt>
            <dd className="space-y-2">
              <div>
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={link}
                >
                  Facebook
                </a>
              </div>
              <div>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={link}
                >
                  Instagram
                </a>
              </div>
            </dd>
          </div>

          {/* Email */}
          <div className={row}>
            <dt className={term}>Email</dt>
            <dd>
              <a href={`mailto:${EMAIL}`} className={`break-all ${link}`}>
                {EMAIL}
              </a>
            </dd>
          </div>

          {/* Address */}
          <div className={row}>
            <dt className={term}>Find us</dt>
            <dd className="text-lg text-white">
              {ADDRESS.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}

              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-2 inline-block rounded text-base text-[#d5dcc0] underline underline-offset-4 hover:text-white ${focus}`}
              >
                Open in Google Maps
              </a>
            </dd>
          </div>

          {/* Products */}
          <div className={row}>
            <dt className={term}>What we sell</dt>
            <dd>
              <ul className="flex flex-wrap gap-2">
                {SPICES.map((s) => (
                  <li
                    key={s}
                    className="rounded-full border border-[#56633a] px-3.5 py-1.5 text-sm text-[#d5dcc0]"
                  >
                    {s}
                  </li>
                ))}
              </ul>

              <p className="mt-3 text-base text-[#d5dcc0]">
                Powders of all these spices are also available.
              </p>
            </dd>
          </div>
        </dl>
      </div>
    </main>
  );
}
