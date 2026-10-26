
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
  if (Array.isArray(value)) return value.map(String);

  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      return value.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }

  return [];
}

export default function OrderPage() {
  const router = useRouter();

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

  useEffect(() => {
    async function initialize() {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          throw new Error("Please log in before placing an order.");
        }

        const params = new URLSearchParams(window.location.search);
        const productId = params.get("product");
        const requestedSize = params.get("size") || "";
        const cartCheckout = params.get("from") === "cart";

        setFromCart(cartCheckout);

        if (cartCheckout) {
          const data: any = await shopService.getCart(token);
          const cart: CartItem[] = Array.isArray(data)
            ? data
            : data.items ?? [];

          if (!cart.length) {
            throw new Error("Your cart is empty.");
          }

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
          const data: any = await getProducts(token);
          const products: Product[] = Array.isArray(data)
            ? data
            : data.products ?? [];

          const selected = products.find(
            (p) => p._id === productId
          );

          if (!selected) {
            throw new Error("Product not found.");
          }

          setProduct(selected);

          const sizes = parseSizes(selected.sizes);
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
        setError(e instanceof Error ? e.message : "Unable to load checkout");
      } finally {
        setLoading(false);
      }
    }

    initialize();
  }, []);

  function changeSize(size: string) {
    setSelectedSize(size);

    if (product) {
      setItems((previous) =>
        previous.map((item) => ({ ...item, size }))
      );
    }
  }

  async function submitOrder(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const token = sessionStorage.getItem("token");
    if (!token) {
      setError("Please log in before placing an order.");
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
      items.some((item) => !item.size || !item.productId)
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

      if (fromCart) {
        try {
          await shopService.clearCart(token);
        } catch {
          // The order was placed; report cart cleanup separately.
        }
      }

      setSuccess("Your order has been placed successfully!");
      setItems([]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className="p-10 text-center">Loading checkout...</p>;
  }

  if (success) {
    return (
      <main className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="rounded-2xl border border-[#dfe3d0] p-10">
          <h1 className="text-3xl font-bold text-[#2f381b]">
            Order Confirmed!
          </h1>
          <p className="mt-4 text-[#566049]">{success}</p>
          <Link
            href="/products"
            className="mt-7 inline-block rounded-full bg-[#3f4a24] px-6 py-3 font-semibold text-white"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1000px] px-4 py-12 md:px-6">
      <h1 className="mb-8 text-4xl font-bold text-[#2f381b]">
        Checkout
      </h1>

      {error && (
        <p role="alert" className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        <section className="rounded-2xl border border-[#dfe3d0] p-6">
          <h2 className="mb-5 text-xl font-semibold text-[#2f381b]">
            Order Summary
          </h2>

          {product && (
            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-[#3f4a24]">
                Select size
              </label>
              <select
                value={selectedSize}
                onChange={(e) => changeSize(e.target.value)}
                className="w-full rounded-lg border border-[#dfe3d0] p-3"
              >
                {parseSizes(product.sizes).map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={`${item.productId}-${item.size}-${index}`}
                className="flex items-center gap-4 border-b border-[#dfe3d0] pb-4"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[#e6ebdc]">
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

                <div>
                  <h3 className="font-semibold text-[#2f381b]">
                    {item.productName}
                  </h3>
                  <p className="text-sm text-[#566049]">
                    Size: {item.size}
                  </p>
                  <p className="text-sm text-[#566049]">
                    Quantity: {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-5 text-sm text-[#566049]">
            Product prices are not included because the current backend
            product schema has no price field.
          </p>
        </section>

        <form
          onSubmit={submitOrder}
          className="space-y-5 rounded-2xl border border-[#dfe3d0] p-6"
        >
          <h2 className="text-xl font-semibold text-[#2f381b]">
            Delivery Details
          </h2>

          <div>
            <label htmlFor="username" className="mb-2 block text-sm font-medium">
              Full Name
            </label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="name"
              className="w-full rounded-lg border border-[#dfe3d0] p-3"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-medium">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              autoComplete="tel"
              maxLength={10}
              className="w-full rounded-lg border border-[#dfe3d0] p-3"
              placeholder="10-digit phone number"
            />
          </div>

          <div>
            <label htmlFor="address" className="mb-2 block text-sm font-medium">
              Delivery Address
            </label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              rows={4}
              autoComplete="street-address"
              className="w-full rounded-lg border border-[#dfe3d0] p-3"
              placeholder="House name, street, city, PIN code"
            />
          </div>

          <div>
            <label htmlFor="payment" className="mb-2 block text-sm font-medium">
              Payment Method
            </label>
            <select
              id="payment"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full rounded-lg border border-[#dfe3d0] p-3"
            >
              <option value="Cash on Delivery">Cash on Delivery</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting || items.length === 0}
            className="w-full rounded-full bg-[#3f4a24] px-6 py-3 font-semibold text-white hover:bg-[#2f381b] disabled:opacity-50"
          >
            {submitting ? "Placing Order..." : "Place Order"}
          </button>

          <Link
            href="/cart"
            className="block text-center text-sm font-medium text-[#3f4a24] underline"
          >
            Back to Cart
          </Link>
        </form>
      </div>
    </main>
  );
}
