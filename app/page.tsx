import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import StarMark from "@/components/StarMark";
import { waLink } from "@/lib/site";

const WHY = [
  { t: "Direct from the farm", d: "We source our spices at the farm, so what reaches you is fresh and traceable." },
  { t: "Pure and unadulterated", d: "100% natural spices with no artificial flavours and nothing added." },
  { t: "Hygienically packed", d: "Sealed in clear jars that lock in aroma and show you exactly what you're getting." },
  { t: "Whole or ground", d: "Choose whole spices to grind fresh, or finely ground powders ready to use." },
];

const USES = ["Tea & beverages", "Rice & curries", "Desserts & baking", "Sauces & spice blends"];
const CHIPS = ["100% natural", "No artificial flavours", "Hygienically packed"];
const SPICES = ["Cardamom", "Black pepper", "Cloves", "Cinnamon", "Star anise", "Black coffee powder"];

const btnFocus = "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9a432a]/40";

export default function Home() {
  return (
    <>
      {/* Keyframes used by the marquee */}
      <style>{`
        @keyframes dh-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .dh-marquee { animation: none !important; } }
      `}</style>

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#e6ebdc]">
        <StarMark className="pointer-events-none absolute -right-28 -top-28 size-[460px] animate-[spin_120s_linear_infinite] text-[#3f4a24] opacity-[0.07] motion-reduce:animate-none" />
        <StarMark className="pointer-events-none absolute -bottom-24 -left-20 size-[300px] animate-[spin_90s_linear_infinite_reverse] text-[#3f4a24] opacity-[0.06] motion-reduce:animate-none" />

        <div className="relative mx-auto grid max-w-[1200px] items-center gap-12 px-4 py-16 md:px-6 lg:grid-cols-[1fr_1.1fr] lg:py-24">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#3f4a24]/25 bg-white/60 px-4 py-1.5 text-sm font-semibold text-[#3f4a24] backdrop-blur">
                <span className="size-2 rounded-full bg-[#9a432a]" />
                Farm-direct spices from Chennai
              </span>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="mt-5 font-[family-name:var(--font-bricolage)] text-4xl font-bold leading-[1.05] tracking-tight text-[#2f381b] sm:text-5xl lg:text-6xl">
                Pure spices, straight from the{" "}
                <span className="relative inline-block text-[#9a432a]">
                  farm
                  <svg viewBox="0 0 120 12" preserveAspectRatio="none" aria-hidden="true" className="absolute -bottom-1 left-0 h-2 w-full text-[#9a432a]/40">
                    <path d="M2 8 Q 30 0 60 6 T 118 5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>
                .
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#4a5538]">
                Premium, unadulterated spices and masalas. Cardamom, pepper, cloves, cinnamon and star anise, whole or freshly ground.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/products" className={`group inline-flex items-center gap-2 rounded-full bg-[#3f4a24] px-7 py-3.5 font-semibold text-white shadow-lg shadow-[#3f4a24]/25 transition-all hover:-translate-y-0.5 hover:bg-[#2f381b] ${btnFocus}`}>
                  Browse products
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
                <Link href="/about" className={`rounded-full border-[1.5px] border-[#3f4a24] px-7 py-3.5 font-semibold text-[#3f4a24] transition-colors hover:bg-[#3f4a24] hover:text-white ${btnFocus}`}>
                  Our story
                </Link>
              </div>
            </Reveal>
            <Reveal delay={400}>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-[#4a5538]">
                {CHIPS.map((c) => (
                  <li key={c} className="flex items-center gap-2">
                    <svg viewBox="0 0 20 20" className="size-4 text-[#3f4a24]" aria-hidden="true"><path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal from="right" delay={200}>
            <div className="group relative">
              <div aria-hidden="true" className="absolute -inset-3 rotate-2 rounded-[2rem] border-2 border-[#3f4a24]/20 transition-transform duration-500 group-hover:rotate-0" />
              <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-[#2f381b]/20">
                <Image
                  src="/images/home.jpeg"
                  alt="Dhavam Spices jars of pepper, cardamom, cinnamon, star anise and cloves"
                  width={0}
                  height={0}
                  sizes="(min-width:1024px) 55vw, 100vw"
                  priority
                  className="h-auto w-full transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="overflow-hidden bg-[#3f4a24] py-4 text-[#e6ebdc]" aria-hidden="true">
        <div className="dh-marquee flex w-max animate-[dh-marquee_30s_linear_infinite]" style={{ animationName: "dh-marquee" }}>
          {[0, 1].map((k) => (
            <ul key={k} className="flex shrink-0 items-center">
              {SPICES.map((s) => (
                <li key={s + k} className="flex items-center font-[family-name:var(--font-bricolage)] text-lg font-semibold tracking-wide">
                  <span className="px-8">{s}</span>
                  <StarMark className="size-5 text-[#e6ebdc]" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* WHY */}
      <section className="relative overflow-hidden bg-[#2f381b] text-[#e9edd9]">
        <StarMark className="pointer-events-none absolute -right-24 top-1/2 size-[420px] -translate-y-1/2 text-white opacity-[0.04]" />
        <div className="relative mx-auto max-w-[1200px] px-4 py-20 md:px-6">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#e3a27f]">Why Dhavam</p>
            <h2 className="mt-3 max-w-xl font-[family-name:var(--font-bricolage)] text-3xl font-bold text-white sm:text-4xl">Why cooks choose Dhavam</h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w, i) => (
              <Reveal key={w.t} delay={i * 120} className="h-full">
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.05] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#e3a27f]/50 hover:bg-white/[0.09]">
                  <span className="font-[family-name:var(--font-bricolage)] text-3xl font-bold text-[#e3a27f]">0{i + 1}</span>
                  <h3 className="mt-4 text-lg font-semibold text-white">{w.t}</h3>
                  <p className="mt-2 leading-relaxed text-[#c9d1b2]">{w.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* USES */}
      <section className="mx-auto grid max-w-[1200px] items-center gap-12 px-4 py-20 md:px-6 lg:grid-cols-2">
        <Reveal from="left">
          <div className="group relative">
            <div aria-hidden="true" className="absolute -bottom-4 -left-4 size-full rounded-3xl bg-[#e6ebdc]" />
            <div className="relative overflow-hidden rounded-3xl shadow-xl shadow-[#2f381b]/15">
              {/* Natural aspect ratio, so the whole image is visible */}
              <Image
                src="/images/home2.jpeg"
                alt="Cooking at the stove with Dhavam Spices jars on the counter"
                width={0}
                height={0}
                sizes="(min-width:1024px) 50vw, 100vw"
                className="h-auto w-full transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a432a]">In your kitchen</p>
            <h2 className="mt-3 font-[family-name:var(--font-bricolage)] text-3xl font-bold text-[#2f381b] sm:text-4xl">Five spices, endless dishes</h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {USES.map((u, i) => (
              <Reveal key={u} delay={150 + i * 100}>
                <div className="rounded-xl border border-[#e3dcc6] bg-[#f6f1e4] px-4 py-4 font-medium text-[#3f4a24] transition-all duration-300 hover:-translate-y-1 hover:border-[#3f4a24] hover:bg-[#3f4a24] hover:text-white">
                  {u}
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={600}>
            <Link href="/about" className={`group mt-8 inline-flex items-center gap-2 rounded font-semibold text-[#9a432a] ${btnFocus}`}>
              <span className="group-hover:underline">Read our story</span>
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20 md:px-6">
        <Reveal>
          <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-3xl bg-[#3f4a24] px-6 py-14 text-center md:px-12">
            <StarMark className="pointer-events-none absolute -left-10 -top-10 size-48 animate-[spin_100s_linear_infinite] text-white opacity-[0.07] motion-reduce:animate-none" />
            <StarMark className="pointer-events-none absolute -bottom-12 -right-8 size-56 animate-[spin_110s_linear_infinite_reverse] text-white opacity-[0.07] motion-reduce:animate-none" />
            <h2 className="relative font-[family-name:var(--font-bricolage)] text-3xl font-bold text-white sm:text-4xl">Ready to order?</h2>
            <p className="relative mx-auto mt-3 max-w-md text-[#d3dbbd]">Message us on WhatsApp for prices, sizes and delivery.</p>
            <a
              href={waLink("Hi Dhavam Spices, I'd like to place an order.")}
              target="_blank"
              rel="noopener noreferrer"
              className={`relative mt-8 inline-flex rounded-full bg-[#f6f1e4] px-8 py-3.5 font-semibold text-[#2f381b] shadow-lg transition-all hover:-translate-y-0.5 hover:bg-white ${btnFocus}`}
            >
              Order on WhatsApp
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
