import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Dhavam Spices",
  description:
    "Premium, pure, unadulterated spices and masalas straight from the farm. Order by WhatsApp, phone or email.",
};

const OWNER = "Shiyas A";
const PHONES = [
  { display: "63830 73503", tel: "+916383073503" },
  { display: "81481 23417", tel: "+918148123417" },
];
const EMAIL = "Dhavamspices@gmail.com";
const ADDRESS = ["Casagrand Northern Star", "Madhavaram, Chennai 600110"];
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Casagrand+Northern+Star+Madhavaram+Chennai+600110";
const WHATSAPP_URL = `https://wa.me/916383073503?text=${encodeURIComponent(
  "Hi Dhavam Spices, I'd like to place an order."
)}`;

const SPICES = ["Cardamom", "Pepper", "Cloves", "Cinnamon", "Star anise", "Black coffee powder"];

const focus =
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d9825f]/40";
const link = `rounded text-lg text-white underline-offset-4 hover:underline ${focus}`;
const row = "grid gap-1 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6";
const term = "text-sm font-medium text-[#b9c29a]";

export default function ContactPage() {
  return (
    <main className="bg-[#2f381b] px-6 py-20 text-[#e6ebdc] sm:py-28">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
          Pure spices, straight from the farm to your kitchen.
        </h1>
        <p className="mt-5 max-w-prose text-lg leading-relaxed text-[#d5dcc0]">
          Dhavam Spices sells premium, unadulterated spices and masalas sourced directly from the farm. Message us with
          what you need and how much, and we'll reply with price and delivery details.
        </p>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-10 inline-flex items-center justify-center rounded-full bg-[#9a432a] px-7 py-3.5 text-base font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#b4502f] hover:shadow-lg active:translate-y-0 active:scale-[0.97] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${focus}`}
        >
          Message us on WhatsApp
        </a>

        <dl className="mt-16 divide-y divide-[#56633a] border-y border-[#56633a]">
          <div className={row}>
            <dt className={term}>Call {OWNER}</dt>
            <dd className="flex flex-col gap-1">
              {PHONES.map((p) => (
                <a key={p.tel} href={`tel:${p.tel}`} className={`w-fit ${link}`}>
                  {p.display}
                </a>
              ))}
            </dd>
          </div>

          <div className={row}>
            <dt className={term}>Email</dt>
            <dd>
              <a href={`mailto:${EMAIL}`} className={`break-all ${link}`}>
                {EMAIL}
              </a>
            </dd>
          </div>

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
                className={`mt-2 inline-block text-base text-[#d5dcc0] underline underline-offset-4 hover:text-white ${focus} rounded`}
              >
                Open in Google Maps
              </a>
            </dd>
          </div>

          <div className={row}>
            <dt className={term}>What we sell</dt>
            <dd>
              <ul className="flex flex-wrap gap-2">
                {SPICES.map((s) => (
                  <li key={s} className="rounded-full border border-[#56633a] px-3.5 py-1.5 text-sm text-[#d5dcc0]">
                    {s}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-base text-[#d5dcc0]">Powders of all these spices are also available.</p>
            </dd>
          </div>
        </dl>
      </div>
    </main>
  );
}
