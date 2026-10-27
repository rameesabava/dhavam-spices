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

type Notification = {
  type: "success" | "error";
  message: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const DEFAULT_SIZES = ["50 g", "100 g", "150 g", "200 g"];

const categories = [
  { key: "whole", title: "Whole Spices" },
  { key: "powder", title: "Spice Powders" },
  { key: "combo", title: "Spice Combos" },
];

function getSizes(sizes: Product["sizes"]): string[] {
  if (Array.isArray(sizes)) {
    return sizes
      .map(String)
      .map((size) => size.trim())
      .filter(Boolean);
  }

  if (typeof sizes === "string" && sizes.trim()) {
    try {
      const parsed = JSON.parse(sizes);

      if (Array.isArray(parsed)) {
        return parsed
          .map(String)
          .map((size) => size.trim())
          .filter(Boolean);
      }
    } catch {
      // Support comma-separated sizes.
    }

    return sizes
      .split(",")
      .map((size) => size.trim())
      .filter(Boolean);
  }

  return [];
}

function getProductSizes(product: Product): string[] {
  const existingSizes = getSizes(product.sizes);

  // Use default sizes if the product has no sizes.
  return existingSizes.length > 0 ? existingSizes : DEFAULT_SIZES;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSizes, setSelectedSizes] =
    useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [notification, setNotification] =
    useState<Notification | null>(null);

 
useEffect(() => {
  let active = true;

  async function loadProducts() {
    try {
      // No login required to view products
      const data: any = await getProducts();

      const list: Product[] = Array.isArray(data)
        ? data
        : data.products ?? [];

      if (!active) return;

      setProducts(list);

      const initial: Record<string, string> = {};

      list.forEach((product) => {
        const sizes = getProductSizes(product);
        initial[product._id] = sizes[0] ?? "";
      });

      setSelectedSizes(initial);
    } catch (e) {
      if (!active) return;

      setNotification({
        type: "error",
        message:
          e instanceof Error
            ? e.message
            : "Unable to load products.",
      });
    } finally {
      if (active) {
        setLoading(false);
      }
    }
  }

  loadProducts();

  return () => {
    active = false;
  };
}, []);


  
async function addToCart(product: Product) {
  const token = sessionStorage.getItem("token");
  const size = selectedSizes[product._id];

  // Require login only for cart operations
  if (!token) {
    window.location.href =
      `/login?redirect=${encodeURIComponent("/products")}`;
    return;
  }

  if (!size) {
    setNotification({
      type: "error",
      message: "Please select a size first.",
    });
    return;
  }

  try {
    setBusy(product._id);
    setNotification(null);

    const result = await shopService.addToCart(
      token,
      product._id,
      size
    );

    const isUpdated =
      result?.message === "Cart quantity updated";

    setNotification({
      type: "success",
      message: isUpdated
        ? `${product.name} (${size}) quantity updated in your cart.`
        : `${product.name} (${size}) added to your cart.`,
    });
  } catch (e) {
    setNotification({
      type: "error",
      message:
        e instanceof Error
          ? e.message
          : "Could not add the item to your cart.",
    });
  } finally {
    setBusy("");
  }
}


  useEffect(() => {
    if (!notification) return;

    const timeout = window.setTimeout(() => {
      setNotification(null);
    }, notification.type === "success" ? 3000 : 5000);

    return () => window.clearTimeout(timeout);
  }, [notification]);

  if (loading) {
    return (
      <p className="p-10 text-center text-[#566049]">
        Loading products...
      </p>
    );
  }

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-12 md:px-6">
      {/* Notification */}
      {notification && (
        <div
          key={`${notification.type}-${notification.message}`}
          role={notification.type === "error" ? "alert" : "status"}
          aria-live={
            notification.type === "error" ? "assertive" : "polite"
          }
          className={`fixed right-4 top-24 z-50 flex max-w-[calc(100vw-2rem)] items-start gap-3 rounded-xl border bg-white px-5 py-4 shadow-xl sm:right-6 sm:max-w-md ${
            notification.type === "success"
              ? "border-green-200"
              : "border-red-200"
          }`}
        >
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg font-bold ${
              notification.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {notification.type === "success" ? "✓" : "!"}
          </span>

          <div className="flex-1">
            <p
              className={`font-semibold ${
                notification.type === "success"
                  ? "text-green-800"
                  : "text-red-800"
              }`}
            >
              {notification.type === "success"
                ? "Added to cart!"
                : "Something went wrong"}
            </p>

            <p className="mt-1 text-sm leading-relaxed text-gray-600">
              {notification.message}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setNotification(null)}
            aria-label="Dismiss notification"
            className="ml-1 text-xl leading-none text-gray-400 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Page heading */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl font-bold text-[#2f381b]">
          Our Products
        </h1>

        <Link
          href="/cart"
          className="rounded-full border border-[#3f4a24] px-5 py-2.5 font-semibold text-[#3f4a24] transition-colors hover:bg-[#f3f5ed]"
        >
          View Cart
        </Link>
      </div>

      {/* Product categories */}
      {categories.map((category) => {
        const items = products.filter(
          (product) =>
            product.group?.trim().toLowerCase() === category.key
        );

        if (!items.length) return null;

        return (
          <section
            key={category.key}
            id={category.key}
            className="mb-14 scroll-mt-24"
          >
            <h2 className="mb-6 border-b border-[#dfe3d0] pb-3 text-2xl font-semibold text-[#2f381b]">
              {category.title}
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((product) => {
                const sizes = getProductSizes(product);

                return (
                  <article
                    key={product._id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-[#dfe3d0] bg-white transition-shadow duration-300 hover:shadow-lg"
                  >
                    {/* Product image */}
                    <div className="relative aspect-square bg-[#e6ebdc]">
                      {product.image ? (
                        <Image
                          src={`${API_URL}/uploads/${product.image}`}
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

                    {/* Product details */}
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-xl font-semibold text-[#2f381b]">
                        {product.name}
                      </h3>

                      <p className="mt-2 flex-1 leading-relaxed text-[#566049]">
                        {product.description}
                      </p>

                      {/* Size selection */}
                      <label
                        htmlFor={`size-${product._id}`}
                        className="mt-4 text-sm font-medium text-[#3f4a24]"
                      >
                        Select size
                      </label>

                      <select
                        id={`size-${product._id}`}
                        value={selectedSizes[product._id] ?? ""}
                        onChange={(e) =>
                          setSelectedSizes((prev) => ({
                            ...prev,
                            [product._id]: e.target.value,
                          }))
                        }
                        className="mt-2 w-full rounded-lg border border-[#dfe3d0] bg-white p-3 text-sm outline-none focus:border-[#3f4a24] focus:ring-2 focus:ring-[#3f4a24]/20"
                      >
                        <option value="">Choose a size</option>

                        {sizes.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>

                      {/* Add to cart */}
                      <button
                        type="button"
                        onClick={() => addToCart(product)}
                        disabled={busy === product._id || !sizes.length}
                        className="mt-4 w-full rounded-full bg-[#3f4a24] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2f381b] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {busy === product._id
                          ? "Adding..."
                          : "Add to Cart"}
                      </button>

                      {/* Order now */}
                     
<button
  type="button"
  onClick={() => {
    const token = sessionStorage.getItem("token");

    const orderUrl = `/order?product=${product._id}&size=${encodeURIComponent(
      selectedSizes[product._id] ?? ""
    )}`;

    if (!token) {
      window.location.href = `/login?redirect=${encodeURIComponent(
        orderUrl
      )}`;
      return;
    }

    window.location.href = orderUrl;
  }}
  className="mt-3 inline-flex w-full justify-center rounded-full border border-[#3f4a24] px-5 py-2.5 text-sm font-semibold text-[#3f4a24] transition-colors hover:bg-[#f3f5ed]"
>
  Order Now
</button>

                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}

      {products.length === 0 && (
        <p className="py-10 text-center text-[#566049]">
          No products available.
        </p>
      )}
    </main>
  );
}