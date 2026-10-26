
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { shopService } from "@/app/services/shopService";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type CartItem = {
  _id: string;
  productId: string;
  productName: string;
  productImage: string;
  size: string;
  quantity: number;
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  const loadCart = useCallback(async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("Please log in to view your cart.");

      const data = await shopService.getCart(token);
      setItems(Array.isArray(data) ? data : data.items ?? []);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load cart");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  async function updateItem(
    id: string,
    action: "increment" | "decrement" | "remove"
  ) {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setError("Please log in to update your cart.");
      return;
    }

    try {
      setBusyId(id);
      setError("");

      if (action === "increment") {
        await shopService.increment(token, id);
      } else if (action === "decrement") {
        await shopService.decrement(token, id);
      } else {
        await shopService.removeCartItem(token, id);
      }

      await loadCart();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to update cart");
    } finally {
      setBusyId("");
    }
  }

  if (loading) {
    return <p className="p-10 text-center">Loading your cart...</p>;
  }

  return (
    <main className="mx-auto max-w-[1000px] px-4 py-12 md:px-6">
      <h1 className="mb-8 text-4xl font-bold text-[#2f381b]">
        Your Cart
      </h1>

      {error && (
        <p role="alert" className="mb-5 text-red-600">{error}</p>
      )}

      {items.length === 0 ? (
        <div className="rounded-2xl border border-[#dfe3d0] p-10 text-center">
          <p className="text-lg text-[#566049]">Your cart is empty.</p>
          <Link
            href="/products"
            className="mt-5 inline-block rounded-full bg-[#3f4a24] px-6 py-3 font-semibold text-white"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
              <article
                key={item._id}
                className="flex flex-col gap-4 rounded-2xl border border-[#dfe3d0] bg-white p-4 sm:flex-row sm:items-center"
              >
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-[#e6ebdc]">
                  {item.productImage && (
                    <Image
                      src={`${API_URL}/uploads/${item.productImage}`}
                      alt={item.productName}
                      fill
                      unoptimized
                      sizes="112px"
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-[#2f381b]">
                    {item.productName}
                  </h2>
                  <p className="mt-1 text-sm text-[#566049]">
                    Size: {item.size}
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    <button
                      aria-label={`Decrease ${item.productName} quantity`}
                      disabled={busyId === item._id}
                      onClick={() => updateItem(item._id, "decrement")}
                      className="h-9 w-9 rounded-full border border-[#dfe3d0] text-lg"
                    >
                      −
                    </button>

                    <span className="min-w-5 text-center">
                      {item.quantity}
                    </span>

                    <button
                      aria-label={`Increase ${item.productName} quantity`}
                      disabled={busyId === item._id}
                      onClick={() => updateItem(item._id, "increment")}
                      className="h-9 w-9 rounded-full border border-[#dfe3d0] text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  disabled={busyId === item._id}
                  onClick={() => updateItem(item._id, "remove")}
                  className="self-start text-sm font-semibold text-red-600 sm:self-center"
                >
                  Remove
                </button>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/products"
              className="font-semibold text-[#3f4a24] underline"
            >
              Continue Shopping
            </Link>

            <Link
              href="/order?from=cart"
              className="rounded-full bg-[#3f4a24] px-7 py-3 font-semibold text-white hover:bg-[#2f381b]"
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
