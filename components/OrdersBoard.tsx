"use client";

import { useState } from "react";

const STATUSES = ["To confirm", "Packed", "Delivered"] as const;
type Status = (typeof STATUSES)[number];
type Order = { id: string; who: string; phone: string; city: string; date: string; items: { name: string; qty: number }[]; total: number; status: Status; note?: string };

// Swap this for data from your API (GET /orders)
const SAMPLE: Order[] = [
  { id: "#1048", who: "Anita R.", phone: "9876543210", city: "Chennai", date: "Today, 10:42", items: [{ name: "Green cardamom, 100 g", qty: 2 }, { name: "Cloves, 50 g", qty: 1 }], total: 1180, status: "To confirm", note: "Please call after 5 pm." },
  { id: "#1047", who: "Karthik S.", phone: "9123456780", city: "Kochi", date: "Today, 09:15", items: [{ name: "Black pepper powder, 250 g", qty: 1 }], total: 340, status: "Packed" },
  { id: "#1046", who: "Meera J.", phone: "9988776655", city: "Coimbatore", date: "Yesterday", items: [{ name: "Cinnamon sticks, 100 g", qty: 3 }], total: 720, status: "Delivered" },
  { id: "#1045", who: "Faizal K.", phone: "9012345678", city: "Bengaluru", date: "Yesterday", items: [{ name: "Cloves, 50 g", qty: 2 }], total: 560, status: "To confirm" },
];
const PILL: Record<Status, string> = { "To confirm": "bg-[#fbe9dc] text-[#9a432a]", Packed: "bg-[#e6ebdc] text-[#3f4a24]", Delivered: "bg-[#3f4a24] text-white" };

export default function OrdersBoard() {
  const [orders, setOrders] = useState<Order[]>(SAMPLE);
  const [tab, setTab] = useState<"All" | Status>("All");
  const [open, setOpen] = useState<string | null>(SAMPLE[0].id);

  const shown = orders.filter((o) => tab === "All" || o.status === tab);
  const count = (s: "All" | Status) => (s === "All" ? orders.length : orders.filter((o) => o.status === s).length);
  const setStatus = (id: string, status: Status) => setOrders((os) => os.map((o) => (o.id === id ? { ...o, status } : o))); // + api.patch

  return (
    <>
      <style>{`@keyframes dh-rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } } @media (prefers-reduced-motion: reduce) { .dh-card { animation: none !important; } .dh-acc { transition: none !important; } }`}</style>
      <h1 className="font-[family-name:var(--font-bricolage)] text-3xl font-bold tracking-tight text-[#2f381b]">Orders</h1>
      <p className="mt-1 text-[#566049]">Call new orders to confirm the price and delivery, then update the status.</p>

      <div role="tablist" aria-label="Order status" className="mt-6 flex flex-wrap gap-2">
        {(["All", ...STATUSES] as const).map((s) => (
          <button key={s} role="tab" aria-selected={tab === s} onClick={() => setTab(s)} className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9a432a]/30 ${tab === s ? "border-[#3f4a24] bg-[#3f4a24] text-white" : "border-[#cfd5bf] text-[#3f4a24] hover:border-[#3f4a24]"}`}>
            {s} <span className={tab === s ? "text-white/70" : "text-[#7a8470]"}>{count(s)}</span>
          </button>
        ))}
      </div>

      <ul className="mt-6 space-y-3">
        {shown.map((o, i) => {
          const isOpen = open === o.id;
          return (
            <li key={o.id} className="dh-card overflow-hidden rounded-2xl border border-[#e3e8dc] bg-white" style={{ animation: `dh-rise 400ms ease-out ${i * 60}ms both` }}>
              <button onClick={() => setOpen(isOpen ? null : o.id)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#9a432a]/30">
                <span className="min-w-0">
                  <span className="block truncate font-medium text-[#2f381b]">{o.who} <span className="text-[#7a8470]">{o.id}</span></span>
                  <span className="block text-sm text-[#566049]">{o.date} · {o.city} · ₹{o.total}</span>
                </span>
                <span className="flex shrink-0 items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors duration-300 ${PILL[o.status]}`}>{o.status}</span>
                  <svg viewBox="0 0 20 20" className={`size-4 text-[#566049] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} aria-hidden="true"><path d="M5 8l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              </button>

              <div className={`dh-acc grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <div className="border-t border-[#edf0e4] px-5 py-4">
                    <ul className="space-y-1 text-[#2f381b]">
                      {o.items.map((it) => <li key={it.name} className="flex justify-between"><span>{it.name}</span><span className="text-[#566049]">× {it.qty}</span></li>)}
                    </ul>
                    {o.note && <p className="mt-3 rounded-xl bg-[#f6f1e4] px-4 py-2 text-sm text-[#566049]">Note: {o.note}</p>}
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <a href={`tel:+91${o.phone}`} className="rounded-full bg-[#3f4a24] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#2f381b] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9a432a]/40">Call {o.phone}</a>
                      <a href={`https://wa.me/91${o.phone}`} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#3f4a24] px-5 py-2 text-sm font-semibold text-[#3f4a24] transition-colors hover:bg-[#3f4a24] hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9a432a]/40">WhatsApp</a>
                      <label className="ml-auto flex items-center gap-2 text-sm text-[#566049]">
                        Status
                        <select value={o.status} onChange={(e) => setStatus(o.id, e.target.value as Status)} className="rounded-xl border border-[#cfd5bf] bg-white px-3 py-2 text-[#20261f] focus:outline-none focus:ring-4 focus:ring-[#9a432a]/25">
                          {STATUSES.map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {shown.length === 0 && <p className="mt-10 text-center text-[#566049]">No orders with this status yet.</p>}
    </>
  );
}
