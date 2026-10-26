
import AdminHeader from "@/components/AdminHeader";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#f7f8f3]">
      <AdminHeader />
      <main>{children}</main>
    </div>
  );
}