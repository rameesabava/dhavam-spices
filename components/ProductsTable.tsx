"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { GROUPS, PRODUCTS } from "@/lib/products";

type Row = { slug: string; name: string; group: string; image?: string; price?: number | string; inStock: boolean };

// Swap this for data from your API (GET /products)
const initial: Row[] = (PRODUCTS as any[]).map((p) => ({
  slug: p.slug, name: p.name, group: p.group, image: p.image ?? p.images?.[0], price: p.price, inStock: p.inStock ?? true,
}));

export default function ProductsTable() {
  const [rows, setRows] = useState<Row[]>(initial);
  const [q, setQ] = useState("");
  const [group, setGroup] = useState("all");
  const [confirm, setConfirm] = useState<string | null>(null);

  const shown = useMemo(
    () => rows.filter((r) => (group === "all" || r.group === group) && r.name.toLowerCase().includes(q.trim().toLowerCase())),
    [rows, q, group]
  );
  const toggle = (slug: string) => setRows((r) => r.map((x) => (x.slug === slug ? { ...x, inStock: !x.inStock } : x))); // + api.patch
  const remove = (slug: string) => { setRows((r) => r.filter((x) => x.slug !== slug)); setConfirm(null); }; // + api.delete

  const chip = (on: boolean) => `rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9a432a]/30 ${on ? "border-[#3f4a24] bg-[#3f4a24] text-white" : "border-[#cfd5bf] text-[#3f4a24] hover:border-[#3f4a24]"}`;

  return (
    <>
      <style>{`@keyframes dh-rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } } @media (prefers-reduced-motion: reduce) { .dh-row { animation: none !important; } }`}</style>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-bricolage)] text-3xl font-bold tracking-tight text-[#2f381b]">Products</h1>
          <p className="mt-1 text-[#566049]">{rows.length} products in your shop.</p>
        </div>
        <Link href="/admin/products/new" className="rounded-full bg-[#3f4a24] px-6 py-2.5 font-semibold text-white shadow-lg shadow-[#3f4a24]/20 transition-all hover:-translate-y-0.5 hover:bg-[#2f381b] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9a432a]/40">Add product</Link>
      </div>

      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" aria-label="Search products" className="w-full rounded-full border border-[#cfd5bf] bg-white px-5 py-2.5 text-[#20261f] placeholder:text-[#9aa28c] transition-shadow focus:outline-none focus:ring-4 focus:ring-[#9a432a]/25 lg:max-w-xs" />
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setGroup("all")} className={chip(group === "all")}>All</button>
          {GROUPS.map((g) => <button key={g.id} onClick={() => setGroup(g.id)} className={chip(group === g.id)}>{g.title}</button>)}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-[#e3e8dc] bg-white">
        <table className="w-full min-w-[640px] text-left">
          <thead className="bg-[#f4f6ee] text-sm text-[#566049]">
            <tr><th className="px-5 py-3 font-medium">Product</th><th className="px-5 py-3 font-medium">Group</th><th className="px-5 py-3 font-medium">Price</th><th className="px-5 py-3 font-medium">Stock</th><th className="px-5 py-3 text-right font-medium">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-[#edf0e4]">
            {shown.map((r, i) => (
              <tr key={r.slug} className="dh-row transition-colors hover:bg-[#f9faf5]" style={{ animation: `dh-rise 400ms ease-out ${Math.min(i, 10) * 40}ms both` }}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="size-12 shrink-0 overflow-hidden rounded-xl bg-[#e6ebdc]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {r.image && <img src={r.image} alt="" className="size-full object-cover" />}
                    </span>
                    <span className="font-medium text-[#2f381b]">{r.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-[#566049]">{GROUPS.find((g) => g.id === r.group)?.title ?? r.group}</td>
                <td className="px-5 py-3 text-[#2f381b]">{r.price ? `₹${r.price}` : "Not set"}</td>
                <td className="px-5 py-3">
                  <button role="switch" aria-checked={r.inStock} aria-label={`${r.name} in stock`} onClick={() => toggle(r.slug)} className="rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9a432a]/30">
                    <span className={`relative block h-6 w-11 rounded-full transition-colors duration-300 ${r.inStock ? "bg-[#3f4a24]" : "bg-[#cfd5bf]"}`}>
                      <span className={`absolute left-1 top-1 size-4 rounded-full bg-white shadow transition-transform duration-300 ${r.inStock ? "translate-x-5" : ""}`} />
                    </span>
                  </button>
                </td>
                <td className="px-5 py-3 text-right text-sm font-semibold">
                  {confirm === r.slug ? (
                    <span className="inline-flex animate-[dh-rise_.25s_ease-out] items-center gap-3">
                      <span className="text-[#b3341f]">Delete?</span>
                      <button onClick={() => remove(r.slug)} className="rounded-full bg-[#b3341f] px-3 py-1 text-white hover:bg-[#962b19]">Yes</button>
                      <button onClick={() => setConfirm(null)} className="text-[#566049] hover:underline">No</button>
                    </span>
                  ) : (
                    <span className="inline-flex gap-4">
                      <Link href={`/admin/products/${r.slug}/edit`} className="text-[#3f4a24] hover:underline">Edit</Link>
                      <button onClick={() => setConfirm(r.slug)} className="text-[#9a432a] hover:underline">Delete</button>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {shown.length === 0 && <p className="px-5 py-12 text-center text-[#566049]">No products match. Try a different search or group.</p>}
      </div>
    </>
  );
}
