import { ReactNode } from "react";
import ProtectedRoute from "@/components/protectedRoute";

export default function ProductsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["user", "admin"]}>
      {children}
    </ProtectedRoute>
  );
}