import { Suspense } from "react";
import EditProductClient from "./EditProductClient";

export default function EditProductPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[300px] items-center justify-center">
          <p className="text-sm text-gray-500">
            Loading edit product...
          </p>
        </div>
      }
    >
      <EditProductClient />
    </Suspense>
  );
}