import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = { title: "Our story", description: "Dhavam Spices sells premium, pure, unadulterated spices directly from the farm." };

const VALUES = [
  { t: "Straight from the farm", d: "We buy directly from farms, so the spices on your shelf are as fresh and honest as possible." },
  { t: "Nothing added", d: "Every spice is 100% natural, with no artificial flavours or fillers." },
  { t: "Packed with care", d: "Hygienically packed in clear jars so you can see the quality before you open the lid." },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-[#e6ebdc]">
        <div className="mx-auto max-w-[1200px] px-4 py-14 md:px-6">
          <h1 className="max-w-3xl font-[family-name:var(--font-bricolage)] text-4xl font-bold leading-tight tracking-tight text-[#2f381b] sm:text-5xl">Spices the way they should taste.</h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1200px] items-center gap-10 px-4 py-16 md:px-6 lg:grid-cols-2">
        <div className="max-w-xl space-y-4 text-lg leading-relaxed text-[#3d4733]">
          <p>Dhavam Spices is a Chennai-based spice brand founded by Shiyas A. We sell premium, pure and unadulterated spices and masalas, sourced directly from the farm.</p>
          <p>Our range covers the spices every kitchen reaches for: cardamom, pepper, cloves, cinnamon, star anise and black coffee powder. Most are available whole or as freshly ground powders, so you can cook the way you like.</p>
          <p>We make them for everyone who cooks, from a weekday chai to a festival biryani.</p>
        </div>
        <div className="relative aspect-[1404/650] overflow-hidden rounded-3xl">
          <Image src="/images/kitchen.jpg" alt="Dhavam Spices jars in a home kitchen" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
        </div>
      </section>

      <section className="bg-[#2f381b] text-[#e9edd9]">
        <div className="mx-auto max-w-[1200px] px-4 py-16 md:px-6">
          <h2 className="font-[family-name:var(--font-bricolage)] text-3xl font-bold text-white">What we stand for</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.t} className="border-t border-[#6b7747] pt-5">
                <h3 className="text-lg font-semibold text-white">{v.t}</h3>
                <p className="mt-2 leading-relaxed text-[#c9d1b2]">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-[1200px] flex-col items-start gap-4 px-4 py-14 md:px-6">
        <h2 className="font-[family-name:var(--font-bricolage)] text-2xl font-bold text-[#2f381b]">Taste the difference</h2>
        <Link href="/products" className="rounded-full bg-[#3f4a24] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#2f381b] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9a432a]/40">Browse products</Link>
      </section>
    </>
  );
}
