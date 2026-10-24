
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { adminService } from "@/app/services/adminService";

type Product = {
  _id: string;
  name: string;
  description: string;
  group?: string;
  image: string;
  sizes?: string[] | string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function formatSizes(value?: Product["sizes"]) {
  if (Array.isArray(value)) return value.join(" · ");
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.join(" · ");
    } catch {
      // Display plain string sizes.
    }
    return value;
  }
  return "No sizes";
}

export default function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("Please log in as an admin.");

      const data = await adminService.getProducts(token);

      setProducts(
        Array.isArray(data) ? data : data.products ?? []
      );
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Unable to fetch products"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query);

      const matchesGroup =
        group === "all" ||
        (product.group || "whole").toLowerCase() === group;

      return matchesSearch && matchesGroup;
    });
  }, [products, search, group]);

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#2f381b]">
            Products
          </h1>
          <p className="mt-1 text-sm text-[#566049]">
            Manage your Dhavam Spices inventory.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="rounded-full bg-[#3f4a24] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2f381b]"
        >
          + Add Product
        </Link>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_200px]">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="rounded-xl border border-[#dfe3d0] bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#9a432a]/40"
        />

        <select
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          className="rounded-xl border border-[#dfe3d0] bg-white px-4 py-3"
        >
          <option value="all">All categories</option>
          <option value="whole">Whole Spices</option>
          <option value="powder">Spice Powders</option>
          <option value="combo">Spice Combos</option>
        </select>
      </div>

      <div className="mb-4 text-sm text-[#566049]">
        {filteredProducts.length} product
        {filteredProducts.length !== 1 ? "s" : ""} found
      </div>

      {loading ? (
        <p className="rounded-2xl border border-[#e3e8dc] bg-white p-10 text-center">
          Loading products...
        </p>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-white p-6">
          <p className="text-red-600">{error}</p>
          <button
            onClick={loadProducts}
            className="mt-4 rounded-full bg-[#3f4a24] px-5 py-2 text-white"
          >
            Try again
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-[#e3e8dc] bg-white p-10 text-center text-[#566049]">
          No products found.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#e3e8dc] bg-white">
          <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <article
                key={product._id}
                className="overflow-hidden rounded-xl border border-[#e3e8dc] transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[4/3] bg-[#e6ebdc]">
                  {product.image ? (
                    <Image
                      src={`${API_URL}/uploads/${product.image}`}
                      alt={product.name}
                      fill
                      unoptimized
                      sizes="(min-width:1280px) 33vw, (min-width:640px) 50vw, 100vw"
                      className="object-contain p-3"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-[#566049]">
                      No product image
                    </div>
                  )}
                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold capitalize text-[#3f4a24]">
                    {product.group || "whole"}
                  </span>
                </div>

                <div className="p-4">
                  <h2 className="text-lg font-bold text-[#2f381b]">
                    {product.name}
                  </h2>

                  <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-relaxed text-[#566049]">
                    {product.description}
                  </p>

                  <div className="mt-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#7a8470]">
                      Available sizes
                    </p>
                    <p className="mt-1 text-sm text-[#3f4a24]">
                      {formatSizes(product.sizes)}
                    </p>
                  </div>

                  <p className="mt-3 break-all text-xs text-[#7a8470]">
                    ID: {product._id}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
