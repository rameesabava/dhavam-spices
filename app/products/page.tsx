import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { GROUPS, PRODUCTS } from "@/lib/products";

export const metadata: Metadata = {
  title: "Products",
  description: "Whole spices, ground spices and combo packs from Dhavam Spices. Order online and we'll call to confirm.",
};

const heading = "font-[family-name:var(--font-bricolage)] font-bold tracking-tight text-[#2f381b]";

export default function ProductsPage() {
  return (
    <>
      <section className="bg-[#e6ebdc]">
        <div className="mx-auto max-w-[1200px] px-4 py-14 md:px-6">
          <h1 className={`${heading} text-4xl sm:text-5xl`}>Our products</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#4a5538]">
            Pure spices packed in clear jars. Choose what you need and place your order online. We'll call to confirm the price and delivery.
          </p>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <nav aria-label="Product groups" className="flex flex-wrap gap-2">
              {GROUPS.map((g) => (
                <a
                  key={g.id}
                  href={`#${g.id}`}
                  className="rounded-full border border-[#3f4a24] px-4 py-2 text-sm font-semibold text-[#3f4a24] transition-colors hover:bg-[#3f4a24] hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9a432a]/40"
                >
                  {g.title}
                </a>
              ))}
            </nav>

            <Link
              href="/order"
              className="inline-flex w-fit items-center justify-center rounded-full bg-[#9a432a] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#b4502f] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d9825f]/50"
            >
              Place an order
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] space-y-16 px-4 py-14 md:px-6">
        {GROUPS.map((g) => (
          <section key={g.id} id={g.id} className="scroll-mt-24">
            <h2 className={`${heading} text-2xl`}>{g.title}</h2>
            <p className="mb-6 mt-1 text-[#566049]">{g.intro}</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PRODUCTS.filter((p) => p.group === g.id).map((p) => (
                <ProductCard key={p.slug} p={p} />
              ))}
            </div>
          </section>
        ))}

        <section className="rounded-3xl bg-[#e6ebdc] px-6 py-10 text-center sm:px-10">
          <h2 className={`${heading} text-2xl sm:text-3xl`}>Ready to order?</h2>
          <p className="mx-auto mt-3 max-w-xl text-[#4a5538]">
            Pick several spices in one order and add notes for whole or powder. We'll call you to confirm.
          </p>
          <Link
            href="/order"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#3f4a24] px-7 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-[#2f381b] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9a432a]/40"
          >
            Place an order
          </Link>
        </section>
      </div>
    </>
  );
}
