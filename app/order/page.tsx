import type { Metadata } from "next";
import OrderForm from "@/components/OrderForm";

export const metadata: Metadata = {
  title: "Place your order",
  description: "Order pure farm spices from Dhavam Spices. We confirm every order by phone.",
};

export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product } = await searchParams;

  return (
    <section className="bg-[#e6ebdc]">
      <div className="mx-auto max-w-[760px] px-4 py-14 md:px-6">
        <OrderForm initialSlug={product} />
      </div>
    </section>
  );
}
