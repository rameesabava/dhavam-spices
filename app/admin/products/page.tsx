
import type { Metadata } from "next";
import ProductsTable from "@/components/ProductsTable";

export const metadata: Metadata = {
  title: "Products",
};

export default function AdminProductsPage() {
  return (
    <div className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-10 xl:px-12">
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-[#2f381b] sm:text-3xl">
            Products
          </h1>
          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Manage your spice products, images, and available sizes.
          </p>
        </div>

        <ProductsTable />
      </div>
    </div>
  );
}
