
import type { Metadata } from "next";
import OrdersBoard from "@/components/OrdersBoard";

export const metadata: Metadata = {
  title: "Orders",
};

export default function AdminOrdersPage() {
  return (
    <div className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-10 xl:px-12">
      <div className="mx-auto w-full max-w-[1600px]">
       

        <OrdersBoard />
      </div>
    </div>
  );
}
