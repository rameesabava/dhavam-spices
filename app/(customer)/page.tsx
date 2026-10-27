import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import StarMark from "@/components/StarMark";
import { waLink } from "@/lib/site";

const HERO_IMG = "/images/hero-banner.jpg";

const WHY = [
  {
    t: "Direct from the farm",
    d: "We source our spices at the farm, so what reaches you is fresh and traceable.",
  },
  {
    t: "Pure and unadulterated",
    d: "100% natural spices with no artificial flavours and nothing added.",
  },
  {
    t: "Hygienically packed",
    d: "Sealed in clear jars that lock in aroma and show you exactly what you're getting.",
  },
  {
    t: "Whole or ground",
    d: "Choose whole spices to grind fresh, or finely ground powders ready to use.",
  },
];

const USES = [
  "Tea & beverages",
  "Rice & curries",
  "Desserts & baking",
  "Sauces & spice blends",
];

const CHIPS = [
  "100% natural",
  "No artificial flavours",
  "Hygienically packed",
];

const SPICES = [
  "Cardamom",
  "Black pepper",
  "Cloves",
  "Cinnamon",
  "Star anise",
  "Black coffee powder",
];

const btnFocus =
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#e3a27f]/60";

export default function Home() {
  return (
    <main className="w-full overflow-x-clip bg-[#fcfaf3]">
      <style>{`
        @keyframes dh-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .dh-marquee {
          animation: dh-marquee 30s linear infinite;
          will-change: transform;
        }

        @media (hover: hover) {
          .dh-marquee-container:hover .dh-marquee {
            animation-play-state: paused;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .dh-marquee {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* HERO */}
      <section className="relative isolate flex min-h-[650px] items-end overflow-hidden bg-[#1f2612] sm:min-h-[700px] md:min-h-[740px] lg:min-h-[min(850px,88svh)]">
        <Image
          src={HERO_IMG}
          alt="Dhavam Spices jars of pepper, cardamom, cinnamon, star anise and cloves"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-[60%_center] sm:object-center"
        />

        {/* Image overlays */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-[#1f2612]/90 via-[#1f2612]/65 to-[#1f2612]/25"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-t from-[#1f2612]/85 via-[#1f2612]/20 to-[#1f2612]/30"
        />

        <StarMark className="pointer-events-none absolute -right-24 -top-20 -z-10 size-64 text-white opacity-[0.08] motion-safe:animate-[spin_140s_linear_infinite] motion-reduce:animate-none sm:-right-32 sm:-top-32 sm:size-96 lg:size-[520px]" />

        <div className="relative mx-auto w-full max-w-[1200px] px-5 pb-12 pt-32 sm:px-6 sm:pb-16 md:pb-20 lg:px-8 lg:pb-24">
          <Reveal>
            <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-2 text-xs font-medium text-[#f6f1e4] backdrop-blur-md sm:px-4 sm:text-sm">
              <span className="size-2 shrink-0 rounded-full bg-[#c29177]" />
              <span>Farm-direct spices from Chennai</span>
            </span>
          </Reveal>

          <Reveal delay={120}>
            <h1 className="mt-6 max-w-4xl break-words font-[family-name:var(--font-bricolage)] text-[clamp(2.65rem,7vw,5.5rem)] font-bold leading-[1.04] tracking-tight text-white">
              Pure spices, straight from the farm.
            </h1>
          </Reveal>

          <Reveal delay={240}>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#f6f1e4]/90 sm:mt-6 sm:text-lg sm:leading-8 md:text-xl">
              Premium, unadulterated spices and masalas. Cardamom, pepper,
              cloves, cinnamon and star anise, whole or freshly ground.
            </p>
          </Reveal>

          <Reveal delay={360}>
            <div className="mt-8 flex flex-col items-stretch gap-3 min-[420px]:flex-row min-[420px]:flex-wrap min-[420px]:items-center sm:mt-9">
              <Link
                href="/products"
                className={`group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f6f1e4] px-6 py-3.5 text-sm font-semibold text-[#2f381b] shadow-xl shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white sm:px-8 sm:py-4 sm:text-base ${btnFocus}`}
              >
                Browse products
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>

              <Link
                href="/about"
                className={`inline-flex min-h-12 items-center justify-center rounded-full border border-white/60 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors duration-300 hover:bg-white/15 sm:px-8 sm:py-4 sm:text-base ${btnFocus}`}
              >
                Our story
              </Link>
            </div>
          </Reveal>

          <Reveal delay={480}>
            <ul className="mt-9 flex max-w-3xl flex-wrap gap-x-5 gap-y-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-xs font-medium text-[#f6f1e4] backdrop-blur-md sm:mt-12 sm:gap-x-7 sm:px-6 sm:py-4 sm:text-sm">
              {CHIPS.map((chip) => (
                <li key={chip} className="flex items-center gap-2">
                  <svg
                    viewBox="0 0 20 20"
                    className="size-4 shrink-0 text-[#e3a27f]"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 10.5l4 4 8-9"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <span>{chip}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* SPICE MARQUEE */}
      <div
        className="dh-marquee-container overflow-hidden bg-[#5b2d21] py-3.5 text-[#f6f1e4] sm:py-4"
        aria-label="Our spices"
      >
        <div className="dh-marquee flex w-max">
          {[0, 1].map((group) => (
            <ul
              key={group}
              className="flex shrink-0 items-center"
              aria-hidden={group === 1 ? true : undefined}
            >
              {SPICES.map((spice) => (
                <li
                  key={`${spice}-${group}`}
                  className="flex shrink-0 items-center font-[family-name:var(--font-bricolage)] text-base font-semibold tracking-wide sm:text-lg"
                >
                  <span className="whitespace-nowrap px-5 sm:px-8">
                    {spice}
                  </span>

                  <StarMark className="size-4 shrink-0 text-[#f6f1e4]/70 sm:size-5" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* WHY CHOOSE DHAVAM */}
      <section className="relative overflow-hidden bg-[#f6f1e4]">
        <StarMark className="pointer-events-none absolute -left-24 -top-24 size-64 text-[#3f4a24] opacity-[0.05] sm:-left-32 sm:-top-32 sm:size-[420px]" />

        <div className="relative mx-auto grid max-w-[1200px] gap-10 px-5 py-16 sm:px-6 sm:py-20 md:gap-12 md:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a432a] sm:text-sm">
                The Dhavam difference
              </span>

              <h2 className="mt-4 max-w-xl font-[family-name:var(--font-bricolage)] text-3xl font-bold leading-[1.08] tracking-tight text-[#2f381b] sm:text-4xl md:text-5xl">
                Why cooks choose Dhavam
              </h2>

              <p className="mt-5 max-w-md text-base leading-7 text-[#4a5538] sm:text-lg sm:leading-8">
                Nothing sits between the farm and your kitchen except a clean
                jar.
              </p>

              <Link
                href="/products"
                className={`mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-[#3f4a24] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#2f381b] sm:mt-8 sm:text-base ${btnFocus}`}
              >
                See the range
              </Link>
            </div>
          </Reveal>

          <ul className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-10">
            {WHY.map((item, index) => (
              <Reveal key={item.t} delay={index * 100}>
                <li className="h-full border-t-2 border-[#3f4a24]/20 pt-5 sm:pt-6">
                  <StarMark className="size-7 text-[#9a432a]" />

                  <h3 className="mt-4 font-[family-name:var(--font-bricolage)] text-lg font-semibold leading-snug text-[#2f381b] sm:text-xl">
                    {item.t}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-[#4a5538] sm:text-base sm:leading-relaxed">
                    {item.d}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* HOW TO USE OUR SPICES */}
      <section className="overflow-hidden bg-[#fcfaf3]">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-5 py-16 sm:px-6 sm:py-20 md:gap-14 md:py-24 lg:grid-cols-2 lg:gap-20 lg:px-8">
          <Reveal from="left">
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div
                aria-hidden="true"
                className="absolute -bottom-3 -right-3 h-full w-full rounded-t-[999px] rounded-b-3xl bg-[#9a432a]/15 sm:-bottom-4 sm:-right-4"
              />

              <div className="relative h-[300px] overflow-hidden rounded-t-[999px] rounded-b-3xl shadow-2xl shadow-[#2f381b]/20 sm:h-[380px] md:h-[440px] lg:h-[min(500px,55vw)]">
                <Image
                  src="/images/home.png"
                  alt="Cooking at the stove with Dhavam Spices jars on the counter"
                  fill
                  sizes="(min-width: 1024px) 50vw, (min-width: 640px) 80vw, 100vw"
                  className="object-cover object-center"
                />
              </div>
            </div>
          </Reveal>

          <Reveal from="right">
            <div className="min-w-0">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a432a] sm:text-sm">
                Made for your kitchen
              </span>

              <h2 className="mt-4 max-w-xl font-[family-name:var(--font-bricolage)] text-3xl font-bold leading-[1.08] tracking-tight text-[#2f381b] sm:text-4xl md:text-5xl">
                Five spices, endless dishes
              </h2>

              <p className="mt-5 max-w-md text-base leading-7 text-[#4a5538] sm:text-lg sm:leading-8">
                From the first cup of tea to the last pot of curry, one jar
                does a lot of work.
              </p>

              <ul className="mt-7 flex flex-wrap gap-2.5 sm:mt-8 sm:gap-3">
                {USES.map((use) => (
                  <li
                    key={use}
                    className="rounded-full border border-[#3f4a24]/25 bg-white px-4 py-2.5 text-sm font-medium text-[#3f4a24] transition-colors hover:border-[#3f4a24] hover:bg-[#3f4a24] hover:text-white sm:px-5 sm:text-base"
                  >
                    {use}
                  </li>
                ))}
              </ul>

              <Link
                href="/about"
                className={`group mt-8 inline-flex min-h-12 items-center gap-2 rounded sm:mt-10 ${btnFocus}`}
              >
                <span className="font-semibold text-[#9a432a] group-hover:underline">
                  Read our story
                </span>

                <span
                  aria-hidden="true"
                  className="text-[#9a432a] transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="bg-[#fcfaf3] px-5 pb-16 sm:px-6 sm:pb-20 md:pb-24 lg:px-8">
        <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#3f4a24] to-[#2f381b] px-5 py-12 text-center sm:rounded-[2rem] sm:px-10 sm:py-16 md:px-12 md:py-20">
          <StarMark className="pointer-events-none absolute -left-8 -top-8 size-32 text-white opacity-[0.07] motion-safe:animate-[spin_100s_linear_infinite] motion-reduce:animate-none sm:-left-10 sm:-top-10 sm:size-48" />

          <StarMark className="pointer-events-none absolute -bottom-8 -right-8 size-36 text-white opacity-[0.07] motion-safe:animate-[spin_110s_linear_infinite_reverse] motion-reduce:animate-none sm:-bottom-12 sm:-right-8 sm:size-56" />

          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-[family-name:var(--font-bricolage)] text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              Ready to order?
            </h2>

            <p className="mx-auto mt-4 max-w-md text-base leading-7 text-[#d3dbbd] sm:text-lg sm:leading-8">
              Message us on WhatsApp for prices, sizes and delivery.
            </p>

            <a
              href={waLink(
                "Hi Dhavam Spices, I'd like to place an order."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-7 inline-flex min-h-12 max-w-full items-center justify-center rounded-full bg-[#f6f1e4] px-6 py-3.5 text-sm font-semibold text-[#2f381b] shadow-xl shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white sm:mt-9 sm:px-9 sm:py-4 sm:text-base ${btnFocus}`}
            >
              Order on WhatsApp
              <span aria-hidden="true" className="ml-2">
                →
              </span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
