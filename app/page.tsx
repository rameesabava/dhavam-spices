import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import StarMark from "@/components/StarMark";
import { waLink } from "@/lib/site";

// Swap this for a wide banner photo (ideally 2400x1200) when you have one.
const HERO_IMG = "/images/hero-banner.jpg";

const WHY = [
  { t: "Direct from the farm", d: "We source our spices at the farm, so what reaches you is fresh and traceable." },
  { t: "Pure and unadulterated", d: "100% natural spices with no artificial flavours and nothing added." },
  { t: "Hygienically packed", d: "Sealed in clear jars that lock in aroma and show you exactly what you're getting." },
  { t: "Whole or ground", d: "Choose whole spices to grind fresh, or finely ground powders ready to use." },
];

const USES = ["Tea & beverages", "Rice & curries", "Desserts & baking", "Sauces & spice blends"];
const CHIPS = ["100% natural", "No artificial flavours", "Hygienically packed"];
const SPICES = ["Cardamom", "Black pepper", "Cloves", "Cinnamon", "Star anise", "Black coffee powder"];

const btnFocus = "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#e3a27f]/60";

export default function Home() {
  return (
    <>
      {/* Keyframes used by the marquee */}
      <style>{`
        @keyframes dh-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .dh-marquee { animation: none !important; } }
      `}</style>

      {/* HERO: full-bleed banner */}
      <section className="relative isolate flex min-h-[620px] items-end overflow-hidden bg-[#1f2612] lg:min-h-[88vh]">
        <Image
          src={HERO_IMG}
          alt="Dhavam Spices jars of pepper, cardamom, cinnamon, star anise and cloves"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-center"
        />
        {/* Readability overlays */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-[#1f2612]/90 via-[#1f2612]/60 to-[#1f2612]/10" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-[#1f2612]/80 via-transparent to-[#1f2612]/20" />

        <StarMark className="pointer-events-none absolute -right-32 -top-32 -z-10 size-[520px] animate-[spin_140s_linear_infinite] text-white opacity-[0.08] motion-reduce:animate-none" />

        <div className="relative mx-auto w-full max-w-[1200px] px-4 pb-14 pt-32 md:px-6 lg:pb-20">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-medium text-[#f6f1e4] backdrop-blur-md">
              <span className="size-2 rounded-full bg-[#c29177]" />
              Farm-direct spices from Chennai
            </span>
          </Reveal>

          <Reveal delay={120}>
            <h1 className="mt-6 max-w-3xl font-[family-name:var(--font-bricolage)] text-5xl font-bold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Pure spices, straight from the farm.
            </h1>
          </Reveal>

          <Reveal delay={240}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#f6f1e4]/85 sm:text-xl">
              Premium, unadulterated spices and masalas. Cardamom, pepper, cloves, cinnamon and star anise, whole or freshly ground.
            </p>
          </Reveal>

          <Reveal delay={360}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/products"
                className={`group inline-flex items-center gap-2 rounded-full bg-[#f6f1e4] px-8 py-4 font-semibold text-[#2f381b] shadow-xl shadow-black/20 transition-all hover:-translate-y-0.5 hover:bg-white ${btnFocus}`}
              >
                Browse products
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/about"
                className={`rounded-full border-[1.5px] border-white/60 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15 ${btnFocus}`}
              >
                Our story
              </Link>
            </div>
          </Reveal>

          <Reveal delay={480}>
            <ul className="mt-12 inline-flex flex-wrap gap-x-7 gap-y-2 rounded-2xl border border-white/15 bg-white/10 px-6 py-3.5 text-sm font-medium text-[#f6f1e4] backdrop-blur-md">
              {CHIPS.map((c) => (
                <li key={c} className="flex items-center gap-2">
                  <svg viewBox="0 0 20 20" className="size-4 text-[#e3a27f]" aria-hidden="true">
                    <path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {c}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="overflow-hidden bg-[#5b2d21] py-4 text-[#f6f1e4]" aria-hidden="true">
        <div className="dh-marquee flex w-max animate-[dh-marquee_30s_linear_infinite]" style={{ animationName: "dh-marquee" }}>
          {[0, 1].map((k) => (
            <ul key={k} className="flex shrink-0 items-center">
              {SPICES.map((s) => (
                <li key={s + k} className="flex items-center font-[family-name:var(--font-bricolage)] text-lg font-semibold tracking-wide">
                  <span className="px-8">{s}</span>
                  {/* <StarMark className="size-5 text-[#f6f1e4]/80" /> */}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* WHY */}
      <section className="relative overflow-hidden bg-[#f6f1e4]">
        <StarMark className="pointer-events-none absolute -left-32 -top-32 size-[420px] text-[#3f4a24] opacity-[0.05]" />
        <div className="relative mx-auto grid max-w-[1200px] gap-14 px-4 py-24 md:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <h2 className="font-[family-name:var(--font-bricolage)] text-4xl font-bold leading-[1.05] tracking-tight text-[#2f381b] sm:text-5xl">
                Why cooks choose Dhavam
              </h2>
              <p className="mt-5 max-w-sm text-lg leading-relaxed text-[#4a5538]">
                Nothing sits between the farm and your kitchen except a clean jar.
              </p>
              <Link
                href="/products"
                className={`mt-8 inline-flex rounded-full bg-[#3f4a24] px-7 py-3.5 font-semibold text-white transition-colors hover:bg-[#2f381b] ${btnFocus}`}
              >
                See the range
              </Link>
            </div>
          </Reveal>

          <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {WHY.map((w) => (
              <li key={w.t} className="border-t-2 border-[#3f4a24]/20 pt-6">
                <StarMark className="size-7 text-[#9a432a]" />
                <h3 className="mt-4 font-[family-name:var(--font-bricolage)] text-xl font-semibold text-[#2f381b]">{w.t}</h3>
                <p className="mt-2 leading-relaxed text-[#4a5538]">{w.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* USES */}
      <section className="bg-[#fcfaf3]">
        <div className="mx-auto grid max-w-[1200px] items-center gap-14 px-4 py-24 md:px-6 lg:grid-cols-2 lg:gap-20">
          <Reveal from="left">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div aria-hidden="true" className="absolute -bottom-4 -right-4 size-full rounded-t-[999px] rounded-b-3xl bg-[#9a432a]/15" />
              <div className="relative overflow-hidden rounded-t-[999px] rounded-b-3xl shadow-2xl shadow-[#2f381b]/20 h-[320px] sm:h-[380px] lg:h-[440px]">
  <Image
    src="/images/home.png"
    alt="Cooking at the stove with Dhavam Spices jars on the counter"
    fill
    sizes="(min-width:1024px) 50vw, 100vw"
    className="object-cover object-center"
  />
</div>
            </div>
          </Reveal>

          <div>
            <h2 className="font-[family-name:var(--font-bricolage)] text-4xl font-bold leading-[1.05] tracking-tight text-[#2f381b] sm:text-5xl">
              Five spices, endless dishes
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-[#4a5538]">
              From the first cup of tea to the last pot of curry, one jar does a lot of work.
            </p>
            <ul className="mt-8 flex flex-wrap gap-3">
              {USES.map((u) => (
                <li
                  key={u}
                  className="rounded-full border border-[#3f4a24]/25 bg-white px-5 py-2.5 font-medium text-[#3f4a24] transition-colors hover:border-[#3f4a24] hover:bg-[#3f4a24] hover:text-white"
                >
                  {u}
                </li>
              ))}
            </ul>
            <Link href="/about" className={`group mt-10 inline-flex items-center gap-2 rounded font-semibold text-[#9a432a] ${btnFocus}`}>
              <span className="group-hover:underline">Read our story</span>
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#fcfaf3] px-4 pb-24 md:px-6">
        <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#3f4a24] to-[#2f381b] px-6 py-16 text-center md:px-12">
          <StarMark className="pointer-events-none absolute -left-10 -top-10 size-48 animate-[spin_100s_linear_infinite] text-white opacity-[0.07] motion-reduce:animate-none" />
          <StarMark className="pointer-events-none absolute -bottom-12 -right-8 size-56 animate-[spin_110s_linear_infinite_reverse] text-white opacity-[0.07] motion-reduce:animate-none" />
          <h2 className="relative font-[family-name:var(--font-bricolage)] text-4xl font-bold tracking-tight text-white sm:text-5xl">Ready to order?</h2>
          <p className="relative mx-auto mt-4 max-w-md text-lg text-[#d3dbbd]">Message us on WhatsApp for prices, sizes and delivery.</p>
          <a
            href={waLink("Hi Dhavam Spices, I'd like to place an order.")}
            target="_blank"
            rel="noopener noreferrer"
            className={`relative mt-9 inline-flex rounded-full bg-[#f6f1e4] px-9 py-4 font-semibold text-[#2f381b] shadow-xl shadow-black/20 transition-all hover:-translate-y-0.5 hover:bg-white ${btnFocus}`}
          >
            Order on WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}