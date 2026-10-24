
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/app/services/productService";
import { shopService } from "@/app/services/shopService";

type Product = {
  _id: string;
  name: string;
  description: string;
  group: string;
  image: string;
  sizes: string[] | string;
};

const categories = [
  { key: "whole", title: "Whole Spices" },
  { key: "powder", title: "Spice Powders" },
  { key: "combo", title: "Spice Combos" },
];


function getProductSizes(product: Product): string[] {
  const name = product.name.trim().toLowerCase();

  const customSizeProducts = [
    "cardamom",
    "black coffee powder",
    "pepper & cardamom whole spice combo",
  ];

  if (customSizeProducts.includes(name)) {
    return ["50 g", "100 g", "150 g", "200 g"];
  }

  return getSizes(product.sizes);
}

function getSizes(sizes: Product["sizes"]): string[] {
  if (Array.isArray(sizes)) {
    return sizes.map(String).filter(Boolean);
  }

  if (typeof sizes === "string" && sizes.trim()) {
    try {
      const parsed = JSON.parse(sizes);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      // Support comma-separated sizes.
    }

    return sizes.split(",").map((s) => s.trim()).filter(Boolean);
  }

  return [];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSizes, setSelectedSizes] =
    useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          throw new Error("Please log in to view products.");
        }

        const data: any = await getProducts(token);
        const list: Product[] = Array.isArray(data)
          ? data
          : data.products ?? [];

        setProducts(list);

        const initial: Record<string, string> = {};
        list.forEach((p) => {
          initial[p._id] = getSizes(p.sizes)[0] ?? "";
        });
        setSelectedSizes(initial);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unable to load products");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  async function addToCart(product: Product) {
    const token = sessionStorage.getItem("token");
    const size = selectedSizes[product._id];

    if (!token) {
      setError("Please log in before adding products to your cart.");
      return;
    }

    if (!size) {
      setError("Please select a size first.");
      return;
    }

    try {
      setBusy(product._id);
      setError("");
      setMessage("");

      await shopService.addToCart(token, product._id, size);
      setMessage(`${product.name} (${size}) added to cart.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not add to cart");
    } finally {
      setBusy("");
    }
  }

  if (loading) {
    return <p className="p-10 text-center">Loading products...</p>;
  }

  if (error && products.length === 0) {
    return <p className="p-10 text-center text-red-600">{error}</p>;
  }

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-12 md:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl font-bold text-[#2f381b]">
          Our Products
        </h1>
        <Link
          href="/cart"
          className="rounded-full border border-[#3f4a24] px-5 py-2.5 font-semibold text-[#3f4a24]"
        >
          View Cart
        </Link>
      </div>

      {message && (
        <p role="status" className="mb-4 text-green-700">{message}</p>
      )}
      {error && <p role="alert" className="mb-4 text-red-600">{error}</p>}

      {categories.map((category) => {
        const items = products.filter(
          (p) => p.group?.trim().toLowerCase() === category.key
        );

        if (!items.length) return null;

        return (
          <section key={category.key} id={category.key} className="mb-14 scroll-mt-24">
            <h2 className="mb-6 border-b border-[#dfe3d0] pb-3 text-2xl font-semibold text-[#2f381b]">
              {category.title}
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((product) => {
const sizes = getProductSizes(product);
                return (
                  <article
                    key={product._id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-[#dfe3d0] bg-white"
                  >
                    <div className="relative aspect-square bg-[#e6ebdc]">
                      {product.image ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/uploads/${product.image}`}
                          alt={product.name}
                          fill
                          unoptimized
                          sizes="(min-width:1024px) 25vw, 50vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[#566049]">
                          Photo coming soon
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-xl font-semibold text-[#2f381b]">
                        {product.name}
                      </h3>

                      <p className="mt-2 flex-1 leading-relaxed text-[#566049]">
                        {product.description}
                      </p>

                      <label className="mt-4 text-sm font-medium text-[#3f4a24]">
                        Select size
                      </label>
                      <select
                        value={selectedSizes[product._id] ?? ""}
                        onChange={(e) =>
                          setSelectedSizes((prev) => ({
                            ...prev,
                            [product._id]: e.target.value,
                          }))
                        }
                        className="mt-2 w-full rounded-lg border border-[#dfe3d0] bg-white p-3 text-sm"
                      >
                        <option value="">Choose a size</option>
                        {sizes.map((size) => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>

                      <button
                        onClick={() => addToCart(product)}
                        disabled={busy === product._id || !sizes.length}
                        className="mt-4 w-full rounded-full bg-[#3f4a24] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2f381b] disabled:opacity-50"
                      >
                        {busy === product._id ? "Adding..." : "Add to Cart"}
                      </button>

                      <Link
                        href={`/order?product=${product._id}&size=${encodeURIComponent(selectedSizes[product._id] ?? "")}`}
                        className="mt-3 inline-flex justify-center rounded-full border border-[#3f4a24] px-5 py-2.5 text-sm font-semibold text-[#3f4a24] hover:bg-[#f3f5ed]"
                      >
                        Order Now
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}

      {products.length === 0 && <p>No products available.</p>}
    </main>
  );
}
