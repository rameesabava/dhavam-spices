
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
  placed: "bg-[#fbe9dc] text-[#9a432a]",
  shipped: "bg-[#e6ebdc] text-[#3f4a24]",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
};

const FILTER_OPTIONS = [
  { label: "All orders", value: "all" },
  { label: "Placed", value: "placed" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

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

      if (!token) {
        throw new Error("Please log in as an admin.");
      }

      const data = await adminService.getOrders(token);

      setOrders(
        Array.isArray(data) ? data : data?.orders ?? []
      );
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  async function updateStatus(
    orderId: string,
    status: "Shipped" | "Delivered"
  ) {
    const token = sessionStorage.getItem("token");

    if (!token) {
      setError("Please log in as an admin.");
      return;
    }

    try {
      setBusyId(orderId);
      setError("");

      await adminService.updateOrderStatus(
        token,
        orderId,
        status
      );

      await loadOrders();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Unable to update order."
      );
    } finally {
      setBusyId("");
    }
  }

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;

    return order.orderStatus?.toLowerCase() === filter;
  });

  const countByStatus = (status: string) =>
    orders.filter(
      (order) => order.orderStatus?.toLowerCase() === status
    ).length;

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-bricolage)] text-3xl font-bold tracking-tight text-[#2f381b]">
            Orders
          </h1>

          <p className="mt-1 text-sm text-[#566049]">
            Manage customer orders and update their delivery status.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadOrders()}
          disabled={loading}
          className="rounded-full border border-[#dfe3d0] bg-white px-5 py-2.5 text-sm font-semibold text-[#3f4a24] transition hover:bg-[#e6ebdc] disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh orders"}
        </button>
      </header>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {/* Order counts */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {[
          { label: "Total orders", value: orders.length },
          { label: "Placed", value: countByStatus("placed") },
          { label: "Shipped", value: countByStatus("shipped") },
          { label: "Delivered", value: countByStatus("delivered") },
          { label: "Cancelled", value: countByStatus("cancelled") },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[#e3e8dc] bg-white p-4"
          >
            <p className="text-sm text-[#566049]">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold text-[#2f381b]">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setFilter(option.value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              filter === option.value
                ? "bg-[#3f4a24] text-white"
                : "border border-[#dfe3d0] bg-white text-[#566049] hover:bg-[#e6ebdc]"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rounded-2xl border border-[#e3e8dc] bg-white p-10 text-center text-[#566049]">
          Loading orders...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-[#e3e8dc] bg-white p-10 text-center text-[#566049]">
          No orders found for this status.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const status = order.orderStatus || "Placed";
            const normalizedStatus = status.toLowerCase();
            const isBusy = busyId === order._id;

            return (
              <article
                key={order._id}
                className="rounded-2xl border border-[#e3e8dc] bg-white p-5 md:p-6"
              >
                {/* Order heading */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs text-[#7a8470]">
                      Order ID
                    </p>

                    <h2 className="mt-1 break-all font-semibold text-[#2f381b]">
                      {order._id}
                    </h2>

                    <p className="mt-2 text-sm text-[#566049]">
                      {order.createdAt &&
                      !Number.isNaN(new Date(order.createdAt).getTime())
                        ? new Date(order.createdAt).toLocaleString(
                            "en-IN"
                          )
                        : "Date unavailable"}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                      STATUS_STYLE[normalizedStatus] ??
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {status}
                  </span>
                </div>

                {/* Customer and item details */}
                <div className="mt-5 grid gap-6 border-t border-[#edf0e4] pt-5 md:grid-cols-2">
                  <div>
                    <h3 className="font-semibold text-[#2f381b]">
                      Customer details
                    </h3>

                    <p className="mt-2 text-sm text-[#566049]">
                      {order.username}
                    </p>

                    <p className="break-all text-sm text-[#566049]">
                      {order.userMail}
                    </p>

                    <p className="text-sm text-[#566049]">
                      {order.phone}
                    </p>

                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#566049]">
                      {order.address}
                    </p>

                    <p className="mt-3 text-sm text-[#566049]">
                      Payment: {order.paymentMethod || "Cash on Delivery"}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#2f381b]">
                      Items ordered
                    </h3>

                    {order.items?.length ? (
                      <ul className="mt-3 space-y-3">
                        {order.items.map((item, index) => (
                          <li
                            key={`${item.productId}-${item.size}-${index}`}
                            className="rounded-xl bg-[#f4f6ee] p-3"
                          >
                            <p className="font-medium text-[#2f381b]">
                              {item.productName}
                            </p>

                            <p className="mt-1 text-sm text-[#566049]">
                              Size: {item.size} · Quantity: {item.quantity}
                            </p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-sm text-[#566049]">
                        No items found.
                      </p>
                    )}
                  </div>
                </div>

                {/* Allowed admin status actions */}
                {normalizedStatus === "placed" && (
                  <div className="mt-5 border-t border-[#edf0e4] pt-4">
                    <button
                      type="button"
                      onClick={() =>
                        void updateStatus(order._id, "Shipped")
                      }
                      disabled={isBusy}
                      className="rounded-full bg-[#3f4a24] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2f381b] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isBusy ? "Updating..." : "Mark as Shipped"}
                    </button>
                  </div>
                )}

                {normalizedStatus === "shipped" && (
                  <div className="mt-5 border-t border-[#edf0e4] pt-4">
                    <button
                      type="button"
                      onClick={() =>
                        void updateStatus(order._id, "Delivered")
                      }
                      disabled={isBusy}
                      className="rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isBusy ? "Updating..." : "Mark as Delivered"}
                    </button>
                  </div>
                )}

                {(normalizedStatus === "delivered" ||
                  normalizedStatus === "cancelled") && (
                  <p className="mt-5 border-t border-[#edf0e4] pt-4 text-sm text-[#7a8470]">
                    {normalizedStatus === "delivered"
                      ? "This order has been delivered. No further status changes are available."
                      : "This order was cancelled. No further status changes are available."}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
