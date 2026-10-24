
"use client";

import { useCallback, useEffect, useState } from "react";
import { adminService } from "@/app/services/adminService";

type OrderItem = {
  productId: string;
  productName: string;
  productImage: string;
  size: string;
  quantity: number;
};

type Order = {
  _id: string;
  username: string;
  userMail: string;
  phone: number | string;
  address: string;
  items: OrderItem[];
  paymentMethod: string;
  orderStatus: string;
  createdAt: string;
};

const STATUS_STYLE: Record<string, string> = {
  Placed: "bg-[#fbe9dc] text-[#9a432a]",
  Shipped: "bg-[#e6ebdc] text-[#3f4a24]",
};

export default function OrdersBoard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [filter, setFilter] = useState("all");

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("Please log in as an admin.");

      const data = await adminService.getOrders(token);
      setOrders(Array.isArray(data) ? data : data.orders ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  async function markShipped(orderId: string) {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setError("Please log in as an admin.");
      return;
    }

    try {
      setBusyId(orderId);
      setError("");

      await adminService.markOrderShipped(token, orderId);
      await loadOrders();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to update order");
    } finally {
      setBusyId("");
    }
  }

  const filtered = orders.filter((order) => {
    if (filter === "all") return true;
    return order.orderStatus?.toLowerCase() === filter;
  });

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2f381b]">Orders</h1>
          <p className="mt-1 text-sm text-[#566049]">
            View customer orders and update shipping status.
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="rounded-full border border-[#dfe3d0] bg-white px-5 py-2.5 text-sm font-semibold text-[#3f4a24]"
        >
          Refresh
        </button>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {[
          { label: "All orders", value: "all" },
          { label: "Placed", value: "placed" },
          { label: "Shipped", value: "shipped" },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              filter === option.value
                ? "bg-[#3f4a24] text-white"
                : "border border-[#dfe3d0] bg-white text-[#566049]"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-xl bg-red-50 p-4 text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="rounded-2xl border border-[#e3e8dc] bg-white p-10 text-center">
          Loading orders...
        </p>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-[#e3e8dc] bg-white p-10 text-center text-[#566049]">
          No orders found.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <article
              key={order._id}
              className="rounded-2xl border border-[#e3e8dc] bg-white p-5 md:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-[#7a8470]">Order ID</p>
                  <h2 className="mt-1 break-all font-semibold text-[#2f381b]">
                    {order._id}
                  </h2>
                  <p className="mt-2 text-sm text-[#566049]">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : "Date unavailable"}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    STATUS_STYLE[order.orderStatus] ??
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.orderStatus || "Placed"}
                </span>
              </div>

              <div className="mt-5 grid gap-5 border-t border-[#edf0e4] pt-5 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold text-[#2f381b]">
                    Customer details
                  </h3>
                  <p className="mt-2 text-sm text-[#566049]">
                    {order.username}
                  </p>
                  <p className="text-sm text-[#566049]">{order.userMail}</p>
                  <p className="text-sm text-[#566049]">{order.phone}</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-[#566049]">
                    {order.address}
                  </p>
                  <p className="mt-2 text-sm text-[#566049]">
                    Payment: {order.paymentMethod || "Cash on Delivery"}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#2f381b]">
                    Items ordered
                  </h3>
                  <ul className="mt-2 space-y-3">
                    {order.items?.map((item, index) => (
                      <li
                        key={`${item.productId}-${item.size}-${index}`}
                        className="rounded-xl bg-[#f4f6ee] p-3"
                      >
                        <p className="font-medium text-[#2f381b]">
                          {item.productName}
                        </p>
                        <p className="mt-1 text-sm text-[#566049]">
                          Size: {item.size} · Qty: {item.quantity}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {order.orderStatus !== "Shipped" && (
                <div className="mt-5 border-t border-[#edf0e4] pt-4">
                  <button
                    onClick={() => markShipped(order._id)}
                    disabled={busyId === order._id}
                    className="rounded-full bg-[#3f4a24] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2f381b] disabled:opacity-50"
                  >
                    {busyId === order._id ? "Updating..." : "Mark as Shipped"}
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
