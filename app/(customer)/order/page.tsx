
"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/app/services/productService";
import { shopService } from "@/app/services/shopService";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Product = {
  _id: string;
  name: string;
  description?: string;
  image: string;
  sizes: string[] | string;
};

type OrderItem = {
  productId: string;
  productName: string;
  productImage: string;
  size: string;
  quantity: number;
};

type CartItem = OrderItem & {
  _id: string;
};

function parseSizes(value: Product["sizes"]): string[] {
  if (Array.isArray(value)) {
    return value
      .map(String)
      .map((size) => size.trim())
      .filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);

      if (Array.isArray(parsed)) {
        return parsed
          .map(String)
          .map((size) => size.trim())
          .filter(Boolean);
      }
    } catch {
      // Fall back to comma-separated sizes.
    }

    return value
      .split(",")
      .map((size) => size.trim())
      .filter(Boolean);
  }

  return [];
}

export default function OrderPage() {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [fromCart, setFromCart] = useState(false);

  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState("Cash on Delivery");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Require login before loading the checkout page.
  useEffect(() => {
    let active = true;

    async function initialize() {
      const token = sessionStorage.getItem("token");

      if (!token) {
        const currentUrl =
          window.location.pathname + window.location.search;

        router.replace(
          `/login?redirect=${encodeURIComponent(currentUrl)}`
        );

        return;
      }

      try {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get("product");
        const requestedSize = params.get("size") || "";
        const cartCheckout = params.get("from") === "cart";

        if (!active) return;

        setAuthorized(true);
        setFromCart(cartCheckout);

        if (cartCheckout) {
          const data: any = await shopService.getCart(token);

          const cart: CartItem[] = Array.isArray(data)
            ? data
            : data?.items ?? [];

          if (!cart.length) {
            throw new Error("Your cart is empty.");
          }

          if (!active) return;

          setItems(
            cart.map((item) => ({
              productId: item.productId,
              productName: item.productName,
              productImage: item.productImage,
              size: item.size,
              quantity: item.quantity,
            }))
          );
        } else if (productId) {
          // Product viewing is public; checkout remains protected.
          const data: any = await getProducts();

          const products: Product[] = Array.isArray(data)
            ? data
            : data?.products ?? [];

          const selected = products.find(
            (item) => item._id === productId
          );

          if (!selected) {
            throw new Error("Product not found.");
          }

          const sizes = parseSizes(selected.sizes);

          if (!active) return;

          setProduct(selected);

          const size = sizes.includes(requestedSize)
            ? requestedSize
            : sizes[0] ?? "";

          setSelectedSize(size);

          setItems([
            {
              productId: selected._id,
              productName: selected.name,
              productImage: selected.image,
              size,
              quantity: 1,
            },
          ]);
        } else {
          throw new Error(
            "Select a product or proceed from your cart to checkout."
          );
        }
      } catch (e) {
        if (!active) return;

        setError(
          e instanceof Error
            ? e.message
            : "Unable to load checkout."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    initialize();

    return () => {
      active = false;
    };
  }, [router]);

  function changeSize(size: string) {
    setSelectedSize(size);

    if (product) {
      setItems((previous) =>
        previous.map((item) => ({
          ...item,
          size,
        }))
      );
    }
  }

  async function submitOrder(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const token = sessionStorage.getItem("token");

    if (!token) {
      const currentUrl =
        window.location.pathname + window.location.search;

      router.replace(
        `/login?redirect=${encodeURIComponent(currentUrl)}`
      );

      return;
    }

    if (!username.trim() || !phone.trim() || !address.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    if (!/^\d{10}$/.test(phone.trim())) {
      setError("Enter a valid 10-digit phone number.");
      return;
    }

    if (
      items.length === 0 ||
      items.some(
        (item) =>
          !item.productId ||
          !item.size ||
          !Number.isInteger(item.quantity) ||
          item.quantity < 1
      )
    ) {
      setError("Please select a valid product size.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await shopService.placeOrder(token, {
        username: username.trim(),
        phone: Number(phone),
        items,
        address: address.trim(),
        paymentMethod,
      });

      let confirmation =
        "Your order has been placed successfully!";

      if (fromCart) {
        try {
          await shopService.clearCart(token);
        } catch {
          confirmation +=
            " Your order was placed, but the cart could not be cleared.";
        }
      }

      setSuccess(confirmation);
      setItems([]);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Failed to place order."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !authorized) {
    return (
      <p className="p-10 text-center text-[#566049]">
        {authorized ? "Loading checkout..." : "Checking login..."}
      </p>
    );
  }

  if (success) {
    return (
      <main className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="rounded-2xl border border-[#dfe3d0] bg-white p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e6ebdc] text-3xl text-[#3f4a24]">
            ✓
          </div>

          <h1 className="mt-5 text-3xl font-bold text-[#2f381b]">
            Order Confirmed!
          </h1>

          <p className="mt-4 leading-relaxed text-[#566049]">
            {success}
          </p>

          <Link
            href="/products"
            className="mt-7 inline-block rounded-full bg-[#3f4a24] px-6 py-3 font-semibold text-white transition hover:bg-[#2f381b]"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1000px] px-4 py-12 md:px-6">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#9a432a]">
          Dhavam Spices
        </p>

        <h1 className="text-3xl font-bold text-[#2f381b] sm:text-4xl">
          Checkout
        </h1>

        <p className="mt-2 text-[#566049]">
          Confirm your products and enter your delivery details.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <div className="grid items-start gap-8 md:grid-cols-2">
        {/* Order summary */}
        <section className="rounded-2xl border border-[#dfe3d0] bg-white p-5 sm:p-6">
          <h2 className="mb-5 text-xl font-semibold text-[#2f381b]">
            Order Summary
          </h2>

          {product && (
            <div className="mb-5">
              <label
                htmlFor="product-size"
                className="mb-2 block text-sm font-medium text-[#3f4a24]"
              >
                Select size
              </label>

              <select
                id="product-size"
                value={selectedSize}
                onChange={(e) => changeSize(e.target.value)}
                required
                className="w-full rounded-lg border border-[#dfe3d0] bg-white p-3 outline-none focus:border-[#3f4a24] focus:ring-2 focus:ring-[#3f4a24]/20"
              >
                <option value="" disabled>
                  Choose a size
                </option>

                {parseSizes(product.sizes).map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>

              {parseSizes(product.sizes).length === 0 && (
                <p className="mt-2 text-sm text-red-600">
                  No sizes are available for this product. Please contact us.
                </p>
              )}
            </div>
          )}

          {items.length > 0 ? (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={`${item.productId}-${item.size}-${index}`}
                  className="flex items-center gap-4 border-b border-[#dfe3d0] pb-4 last:border-b-0"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#e6ebdc]">
                    {item.productImage && (
                      <Image
                        src={`${API_URL}/uploads/${item.productImage}`}
                        alt={item.productName}
                        fill
                        unoptimized
                        sizes="80px"
                        className="object-cover"
                      />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-semibold text-[#2f381b]">
                      {item.productName}
                    </h3>

                    <p className="mt-1 text-sm text-[#566049]">
                      Size: {item.size}
                    </p>

                    <p className="text-sm text-[#566049]">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-4 text-sm text-[#566049]">
              No items available to display.
            </p>
          )}

          <div className="mt-5 rounded-xl bg-[#f3f5ed] p-4">
            <p className="text-sm leading-relaxed text-[#566049]">
              Product prices are not displayed because your current
              product schema does not include a price field. Your order
              can be confirmed according to your existing backend flow.
            </p>
          </div>
        </section>

        {/* Delivery form */}
        <form
          onSubmit={submitOrder}
          className="space-y-5 rounded-2xl border border-[#dfe3d0] bg-white p-5 sm:p-6"
        >
          <h2 className="text-xl font-semibold text-[#2f381b]">
            Delivery Details
          </h2>

          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium text-[#3f4a24]"
            >
              Full Name
            </label>

            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="name"
              className="w-full rounded-lg border border-[#dfe3d0] p-3 outline-none focus:border-[#3f4a24] focus:ring-2 focus:ring-[#3f4a24]/20"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-[#3f4a24]"
            >
              Phone Number
            </label>

            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              required
              autoComplete="tel"
              maxLength={10}
              className="w-full rounded-lg border border-[#dfe3d0] p-3 outline-none focus:border-[#3f4a24] focus:ring-2 focus:ring-[#3f4a24]/20"
              placeholder="10-digit phone number"
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="mb-2 block text-sm font-medium text-[#3f4a24]"
            >
              Delivery Address
            </label>

            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              rows={4}
              autoComplete="street-address"
              className="w-full resize-y rounded-lg border border-[#dfe3d0] p-3 outline-none focus:border-[#3f4a24] focus:ring-2 focus:ring-[#3f4a24]/20"
              placeholder="House name, street, city, PIN code"
            />
          </div>

          <div>
            <label
              htmlFor="payment"
              className="mb-2 block text-sm font-medium text-[#3f4a24]"
            >
              Payment Method
            </label>

            <select
              id="payment"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full rounded-lg border border-[#dfe3d0] bg-white p-3 outline-none focus:border-[#3f4a24] focus:ring-2 focus:ring-[#3f4a24]/20"
            >
              <option value="Cash on Delivery">
                Cash on Delivery
              </option>
            </select>
          </div>

          <button
            type="submit"
            disabled={
              submitting ||
              items.length === 0 ||
              items.some((item) => !item.size)
            }
            className="w-full rounded-full bg-[#3f4a24] px-6 py-3 font-semibold text-white transition hover:bg-[#2f381b] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Placing Order..." : "Place Order"}
          </button>

          <Link
            href="/cart"
            className="block text-center text-sm font-medium text-[#3f4a24] underline underline-offset-4"
          >
            Back to Cart
          </Link>
        </form>
      </div>
    </main>
  );
}
