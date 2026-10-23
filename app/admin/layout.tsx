import type { Metadata } from "next";
import AdminShell from "@/components/AdminShell";

export const metadata: Metadata = { title: { default: "Admin", template: "%s | Dhavam Admin" }, robots: { index: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
