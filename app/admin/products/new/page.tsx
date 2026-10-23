import type { Metadata } from "next";
import ProductForm from "@/components/ProductForm";

export const metadata: Metadata = { title: "Add product" };

export default function NewProductPage() {
  return (
    <>
      <style>{`
        @keyframes dh-pop { from { opacity: 0; transform: scale(.94); } to { opacity: 1; transform: none; } }
        @keyframes dh-draw { from { stroke-dashoffset: 30; } to { stroke-dashoffset: 0; } }
        @media (prefers-reduced-motion: reduce) { * { animation-duration: 1ms !important; } }
      `}</style>
      <h1 className="font-[family-name:var(--font-bricolage)] text-3xl font-bold tracking-tight text-[#2f381b]">Add a product</h1>
      <p className="mb-8 mt-1 text-[#566049]">Fill in the details and check the preview on the right.</p>
      <ProductForm />
    </>
  );
}
