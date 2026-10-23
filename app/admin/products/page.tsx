import type { Metadata } from "next";
import ProductsTable from "@/components/ProductsTable";

export const metadata: Metadata = { title: "Products" };

export default function AdminProductsPage() {
  return <ProductsTable />;
}
