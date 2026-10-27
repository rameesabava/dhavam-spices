import { ReactNode } from "react";
import ProtectedRoute from "@/components/protectedRoute";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      {children}
    </ProtectedRoute>
  );
}