import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import { GROUPS, PRODUCTS } from "@/lib/products";

export const metadata: Metadata = { title: "Products", description: "Whole spices, ground spices and combo packs from Dhavam Spices." };

export default function ProductsPage() {
  return (
    <>
      <section className="bg-[#e6ebdc]">
        <div className="mx-auto max-w-[1200px] px-4 py-14 md:px-6">
          <h1 className="font-[family-name:var(--font-bricolage)] text-4xl font-bold tracking-tight text-[#2f381b] sm:text-5xl">Our products</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#4a5538]">Pure spices packed in clear jars. Pick a product and message us on WhatsApp for prices and delivery.</p>
          <nav aria-label="Product groups" className="mt-6 flex flex-wrap gap-2">
            {GROUPS.map((g) => (
              <a key={g.id} href={`#${g.id}`} className="rounded-full border border-[#3f4a24] px-4 py-2 text-sm font-semibold text-[#3f4a24] transition-colors hover:bg-[#3f4a24] hover:text-white">{g.title}</a>
            ))}
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] space-y-16 px-4 py-14 md:px-6">
        {GROUPS.map((g) => (
          <section key={g.id} id={g.id} className="scroll-mt-24">
            <h2 className="font-[family-name:var(--font-bricolage)] text-2xl font-bold text-[#2f381b]">{g.title}</h2>
            <p className="mb-6 mt-1 text-[#566049]">{g.intro}</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PRODUCTS.filter((p) => p.group === g.id).map((p) => <ProductCard key={p.slug} p={p} />)}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
