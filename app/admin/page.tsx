
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { adminService } from "@/app/services/adminService";

type Order = {
  _id: string;
  username: string;
  items: {
    productName: string;
    size: string;
    quantity: number;
  }[];
  orderStatus: string;
  createdAt: string;
};

type Product = {
  _id: string;
  name: string;
};

const heading =
  "font-[family-name:var(--font-bricolage)] font-bold tracking-tight text-[#2f381b]";

const PILL: Record<string, string> = {
  Placed: "bg-[#fbe9dc] text-[#9a432a]",
  Shipped: "bg-[#e6ebdc] text-[#3f4a24]",
};

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("Please log in as an admin.");

      const [productData, orderData] = await Promise.all([
        adminService.getProducts(token),
        adminService.getOrders(token),
      ]);

      setProducts(
        Array.isArray(productData)
          ? productData
          : productData.products ?? []
      );

      setOrders(
        Array.isArray(orderData) ? orderData : orderData.orders ?? []
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  startOfWeek.setHours(0, 0, 0, 0);

  const thisWeek = orders.filter(
    (order) => new Date(order.createdAt) >= startOfWeek
  );

  const placedCount = orders.filter(
    (order) => order.orderStatus === "Placed"
  ).length;

  const stats = [
    { label: "Orders this week", value: thisWeek.length },
    { label: "Total orders", value: orders.length },
    { label: "Products listed", value: products.length },
    { label: "Orders to confirm", value: placedCount },
  ];

  const week = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + index);

    return {
      d: day.toLocaleDateString("en", { weekday: "short" }),
      v: thisWeek.filter(
        (order) =>
          new Date(order.createdAt).toDateString() === day.toDateString()
      ).length,
    };
  });

  const max = Math.max(1, ...week.map((day) => day.v));

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className={`${heading} text-3xl`}>Good to see you</h1>
          <p className="mt-1 text-[#566049]">
            Here is how Dhavam Spices is doing this week.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={loadDashboard}
            className="rounded-full border border-[#dfe3d0] bg-white px-5 py-2.5 font-semibold text-[#3f4a24]"
          >
            Refresh
          </button>
          <Link
            href="/admin/products/new"
            className="rounded-full bg-[#3f4a24] px-6 py-2.5 font-semibold text-white hover:bg-[#2f381b]"
          >
            Add product
          </Link>
        </div>
      </header>

      {error && (
        <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="mt-8 rounded-2xl border border-[#e3e8dc] bg-white p-10 text-center">
          Loading dashboard...
        </p>
      ) : (
        <>
          <section
            aria-label="Summary"
            className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`rounded-2xl p-5 ${
                  index === 3
                    ? "bg-[#9a432a] text-white"
                    : "border border-[#e3e8dc] bg-white"
                }`}
              >
                <p className={`text-sm ${index === 3 ? "text-white/80" : "text-[#566049]"}`}>
                  {stat.label}
                </p>
                <p className={`mt-2 text-3xl font-bold ${index === 3 ? "text-white" : "text-[#2f381b]"}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </section>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_1fr]">
            <section className="rounded-2xl border border-[#e3e8dc] bg-white p-6">
              <h2 className={`${heading} text-xl`}>Orders by day</h2>

              <div
                className="mt-6 flex h-52 items-end gap-3"
                role="img"
                aria-label={`Orders per day: ${week.map((day) => `${day.d}: ${day.v}`).join(", ")}`}
              >
                {week.map((day) => (
                  <div
                    key={day.d}
                    className="group flex h-full flex-1 flex-col justify-end text-center"
                  >
                    <span className="mb-1 text-xs font-semibold text-[#3f4a24]">
                      {day.v}
                    </span>
                    <div
                      className="rounded-t-lg bg-[#3f4a24] transition-colors group-hover:bg-[#9a432a]"
                      style={{ height: `${(day.v / max) * 100}%`, minHeight: day.v ? "4px" : "0" }}
                    />
                    <span className="mt-2 text-xs text-[#566049]">
                      {day.d}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[#e3e8dc] bg-white p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className={`${heading} text-xl`}>Latest orders</h2>
                <Link
                  href="/admin/orders"
                  className="text-sm font-semibold text-[#9a432a] hover:underline"
                >
                  See all
                </Link>
              </div>

              {orders.length === 0 ? (
                <p className="py-8 text-sm text-[#566049]">
                  No orders have been placed yet.
                </p>
              ) : (
                <ul className="mt-4 divide-y divide-[#edf0e4]">
                  {[...orders]
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    )
                    .slice(0, 5)
                    .map((order) => (
                      <li
                        key={order._id}
                        className="flex items-center justify-between gap-3 py-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-medium text-[#2f381b]">
                            {order.username}
                          </p>
                          <p className="truncate text-sm text-[#566049]">
                            {order.items
                              ?.map((item) => `${item.productName} (${item.size})`)
                              .join(", ") || "No items"}
                          </p>
                          <p className="mt-1 text-xs text-[#7a8470]">
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleDateString()
                              : ""}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                            PILL[order.orderStatus] ??
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </li>
                    ))}
                </ul>
              )}
            </section>
          </div>
        </>
      )}
    </>
  );
}
