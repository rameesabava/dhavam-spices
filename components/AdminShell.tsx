"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import StarMark from "@/components/StarMark";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/products/new", label: "Add product" },
  { href: "/admin/orders", label: "Orders" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  // The longest matching href wins, so "Products" isn't highlighted on "Add product"
  const current = NAV.filter((n) => path === n.href || (n.href !== "/admin" && path.startsWith(n.href + "/"))).sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <div className="min-h-screen bg-[#f4f6ee] lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="relative overflow-hidden bg-[#2f381b] text-[#e3e8d3] lg:sticky lg:top-0 lg:h-screen">
        <StarMark className="pointer-events-none absolute -bottom-16 -left-16 size-56 animate-[spin_120s_linear_infinite] text-white opacity-[0.06] motion-reduce:animate-none" />
        <div className="relative flex items-center gap-3 px-5 py-4 lg:py-6">
          <StarMark className="size-6 text-[#e3a27f]" />
          <span className="font-[family-name:var(--font-bricolage)] text-lg font-bold text-white">Dhavam Admin</span>
        </div>
        <nav aria-label="Admin" className="relative flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:pb-0">
          {NAV.map((n) => {
            const on = n.href === current;
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={on ? "page" : undefined}
                className={`relative whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e3a27f] ${on ? "bg-white/10 text-white" : "hover:translate-x-1 hover:bg-white/5 hover:text-white"}`}
              >
                <span className={`absolute inset-y-2 left-0 w-1 rounded-full bg-[#e3a27f] transition-transform duration-300 ${on ? "scale-y-100" : "scale-y-0"}`} />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <Link href="/" className="relative mt-6 hidden px-8 text-sm text-[#a9b48f] transition-colors hover:text-white lg:block">View website</Link>
      </aside>
      <main className="min-w-0 px-4 py-8 md:px-8">{children}</main>
    </div>
  );
}
