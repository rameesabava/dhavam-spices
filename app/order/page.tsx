
import type { Metadata } from "next";
import { Suspense } from "react";
import OrderForm from "@/components/OrderForm";

export const metadata: Metadata = {
  title: "Place your order",
  description:
    "Order pure farm spices from Dhavam Spices. We confirm every order by phone.",
};

type OrderPageProps = {
  searchParams: Promise<{ product?: string }>;
};

async function OrderContent({ searchParams }: OrderPageProps) {
  const { product } = await searchParams;

  return <OrderForm initialSlug={product} />;
}

export default function OrderPage(props: OrderPageProps) {
  return (
    <section className="bg-[#e6ebdc]">
      <div className="mx-auto max-w-[760px] px-4 py-14 md:px-6">
        <Suspense
          fallback={
            <p className="py-10 text-center text-[#3f4a24]">
              Loading order form...
            </p>
          }
        >
          <OrderContent searchParams={props.searchParams} />
        </Suspense>
      </div>
    </section>
  );
}
