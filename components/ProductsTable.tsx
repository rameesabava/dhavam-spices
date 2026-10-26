
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pencil, Trash2, Search, RefreshCw } from "lucide-react";
import { adminService } from "@/app/services/adminService";

type Product = {
  _id: string;
  name: string;
  description: string;
  group?: string;
  image: string;
  sizes?: string[] | string;
};

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

function formatSizes(value?: Product["sizes"]) {
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(" · ") : "No sizes";
  }

  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value);

      if (Array.isArray(parsed)) {
        return parsed.join(" · ") || "No sizes";
      }
    } catch {
      // The size value may be a plain string.
    }

    return value || "No sizes";
  }

  return "No sizes";
}

export default function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch products from the backend.
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = sessionStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in as an admin.");
      }

      const data = await adminService.getProducts(token);

      const productList = Array.isArray(data)
        ? data
        : Array.isArray(data?.products)
          ? data.products
          : null;

      if (!productList) {
        throw new Error("The server returned an invalid product list.");
      }

      setProducts(productList);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Unable to fetch products."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  // Search and category filtering.
  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        (product.name || "").toLowerCase().includes(query) ||
        (product.description || "").toLowerCase().includes(query);

      const matchesGroup =
        group === "all" ||
        (product.group || "whole").toLowerCase() === group;

      return matchesSearch && matchesGroup;
    });
  }, [products, search, group]);

  // Delete a product after confirmation.
  const handleDelete = async (product: Product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(product._id);
      setError("");

      const token = sessionStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in as an admin.");
      }

      await adminService.deleteProduct(token, product._id);

      // Remove the product from the UI after successful deletion.
      setProducts((currentProducts) =>
        currentProducts.filter((item) => item._id !== product._id)
      );
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : "Unable to delete product.";

      window.alert(message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="mx-auto w-full">
      {/* Page heading */}
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
          className="inline-flex items-center justify-center rounded-full bg-[#3f4a24] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2f381b]"
        >
          + Add Product
        </Link>
      </div>

      {/* Search and category filter */}
      <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_200px]">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a8470]"
          />

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
            className="w-full rounded-xl border border-[#dfe3d0] bg-white py-3 pl-11 pr-4 outline-none transition focus:border-[#9a432a] focus:ring-2 focus:ring-[#9a432a]/20"
          />
        </div>

        <select
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          aria-label="Filter by category"
          className="rounded-xl border border-[#dfe3d0] bg-white px-4 py-3 text-sm text-[#3f4a24] outline-none focus:ring-2 focus:ring-[#9a432a]/30"
        >
          <option value="all">All categories</option>
          <option value="whole">Whole Spices</option>
          <option value="powder">Spice Powders</option>
          <option value="combo">Spice Combos</option>
        </select>
      </div>

      {/* Product count and refresh */}
      <div className="mb-4 flex items-center justify-between gap-3 text-sm text-[#566049]">
        <p>
          {filteredProducts.length} product
          {filteredProducts.length !== 1 ? "s" : ""} found
        </p>

        <button
          type="button"
          onClick={() => void loadProducts()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full border border-[#dfe3d0] bg-white px-3 py-2 font-medium transition hover:bg-[#edf0e4] disabled:opacity-50"
        >
          <RefreshCw
            size={15}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="rounded-2xl border border-[#e3e8dc] bg-white p-10 text-center text-[#566049]">
          <RefreshCw size={24} className="mx-auto mb-3 animate-spin" />
          Loading products...
        </div>
      ) : error ? (
        /* Error */
        <div className="rounded-2xl border border-red-200 bg-white p-6">
          <p className="font-medium text-red-600">{error}</p>

          <button
            type="button"
            onClick={() => void loadProducts()}
            className="mt-4 rounded-full bg-[#3f4a24] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#2f381b]"
          >
            Try again
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        /* Empty state */
        <div className="rounded-2xl border border-[#e3e8dc] bg-white p-10 text-center">
          <p className="font-semibold text-[#3f4a24]">
            {search || group !== "all"
              ? "No matching products found."
              : "No products added yet."}
          </p>

          <p className="mt-2 text-sm text-[#7a8470]">
            {search || group !== "all"
              ? "Try changing your search or category."
              : "Add your first product to get started."}
          </p>

          {!search && group === "all" && (
            <Link
              href="/admin/products/new"
              className="mt-5 inline-flex rounded-full bg-[#3f4a24] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2f381b]"
            >
              + Add Product
            </Link>
          )}
        </div>
      ) : (
        /* Product cards */
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <article
              key={product._id}
              className="overflow-hidden rounded-2xl border border-[#e3e8dc] bg-white transition duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              {/* Product image */}
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

                <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold capitalize text-[#3f4a24] shadow-sm">
                  {product.group || "whole"}
                </span>
              </div>

              {/* Product details */}
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

                {/* Edit and Delete actions */}
                <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-[#e3e8dc] pt-4">
                  <Link
                    href={`/admin/products/${product._id}/edit`}
                    className="inline-flex items-center gap-2 rounded-full bg-[#3f4a24] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2f381b]"
                  >
                    <Pencil size={16} />
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => void handleDelete(product)}
                    disabled={deletingId !== null}
                    className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Trash2 size={16} />

                    {deletingId === product._id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
