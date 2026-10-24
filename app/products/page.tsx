
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/app/services/productService";

type Product = {
  _id: string;
  name: string;
  description?: string;
  group: "whole" | "powder" | "combo" | string;
  image?: string;
  sizes?: string[] | string;
};

const categories = [
  { key: "whole", title: "Whole Spices" },
  { key: "powder", title: "Spice Powders" },
  { key: "combo", title: "Spice Combos" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const token = sessionStorage.getItem("token");

        if (!token) {
          throw new Error("Please log in to view products.");
        }

        const data = await getProducts(token);
        const result: any = data;

        setProducts(
          Array.isArray(result) ? result : result.products ?? []
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch products"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return <p className="p-10 text-center">Loading products...</p>;
  }

  if (error) {
    return (
      <p className="p-10 text-center text-red-600">{error}</p>
    );
  }

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-12 md:px-6">
      <h1 className="mb-10 text-4xl font-bold text-[#2f381b]">
        Our Products
      </h1>

      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="space-y-14">
          {categories.map((category) => {
            const categoryProducts = products.filter(
              (product) =>
                product.group?.trim().toLowerCase() === category.key
            );

            if (categoryProducts.length === 0) return null;

            return (
              <section
                key={category.key}
                id={category.key}
                className="scroll-mt-24"
              >
                <h2 className="mb-6 border-b border-[#dfe3d0] pb-3 text-2xl font-semibold text-[#3f4a24]">
                  {category.title}
                </h2>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {categoryProducts.map((product) => (
                    <article
                      key={product._id}
                      className="flex flex-col overflow-hidden rounded-2xl border border-[#dfe3d0] bg-white"
                    >
                      <div className="relative aspect-square bg-[#e6ebdc]">
                        {product.image ? (
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${product.image}`}
                            alt={product.name}
                            fill
                            unoptimized
                            className="object-cover"
                            sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-[#566049]">
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

                        <p className="mt-4 text-sm text-[#566049]">
                          {Array.isArray(product.sizes)
                            ? product.sizes.join(" · ")
                            : product.sizes || "Ask us for available sizes"}
                        </p>

                        <Link
                          href={`/order?product=${product._id}`}
                          className="mt-4 inline-flex justify-center rounded-full bg-[#3f4a24] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2f381b]"
                        >
                          Order now
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}
