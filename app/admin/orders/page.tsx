
import type { Metadata } from "next";
import OrdersBoard from "@/components/OrdersBoard";

export const metadata: Metadata = {
  title: "Orders",
};

export default function AdminOrdersPage() {
  return (
    <div className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-10 xl:px-12">
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-[#2f381b] sm:text-3xl">
            Orders
          </h1>
          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            View and manage customer orders and their statuses.
          </p>
        </div>

        <OrdersBoard />
      </div>
    </div>
  );
}
