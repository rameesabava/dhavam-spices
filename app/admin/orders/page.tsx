import type { Metadata } from "next";
import OrdersBoard from "@/components/OrdersBoard";

export const metadata: Metadata = { title: "Orders" };

export default function AdminOrdersPage() {
  return <OrdersBoard />;
}
