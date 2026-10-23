import Link from "next/link";
import CountUp from "@/components/CountUp";

const heading = "font-[family-name:var(--font-bricolage)] font-bold tracking-tight text-[#2f381b]";

// Replace these with data from your API
const STATS = [
  { label: "Orders this week", value: 48, prefix: "" },
  { label: "Revenue this week", value: 36450, prefix: "₹" },
  { label: "Products listed", value: 14, prefix: "" },
  { label: "Orders to confirm", value: 6, prefix: "" },
];
const WEEK = [
  { d: "Mon", v: 5 }, { d: "Tue", v: 8 }, { d: "Wed", v: 6 }, { d: "Thu", v: 11 }, { d: "Fri", v: 9 }, { d: "Sat", v: 14 }, { d: "Sun", v: 7 },
];
const ORDERS = [
  { id: "#1048", who: "Anita R.", item: "Green cardamom, 100 g", status: "To confirm" },
  { id: "#1047", who: "Karthik S.", item: "Black pepper powder, 250 g", status: "Packed" },
  { id: "#1046", who: "Meera J.", item: "Cinnamon sticks, 100 g", status: "Delivered" },
  { id: "#1045", who: "Faizal K.", item: "Cloves, 50 g", status: "Delivered" },
];
const PILL: Record<string, string> = {
  "To confirm": "bg-[#fbe9dc] text-[#9a432a]",
  Packed: "bg-[#e6ebdc] text-[#3f4a24]",
  Delivered: "bg-[#3f4a24] text-white",
};

export default function AdminDashboard() {
  const max = Math.max(...WEEK.map((w) => w.v));
  return (
    <>
      <style>{`
        @keyframes dh-grow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        @keyframes dh-rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .dh-bar, .dh-row { animation: none !important; } }
      `}</style>

      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className={`${heading} text-3xl`}>Good to see you</h1>
          <p className="mt-1 text-[#566049]">Here is how Dhavam Spices is doing this week.</p>
        </div>
        <Link href="/admin/products/new" className="rounded-full bg-[#3f4a24] px-6 py-2.5 font-semibold text-white shadow-lg shadow-[#3f4a24]/20 transition-all hover:-translate-y-0.5 hover:bg-[#2f381b] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9a432a]/40">
          Add product
        </Link>
      </header>

      <section aria-label="Summary" className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((s, i) => (
          <div key={s.label} className={`rounded-2xl p-5 ${i === 3 ? "bg-[#9a432a] text-white" : "border border-[#e3e8dc] bg-white"}`}>
            <p className={`text-sm ${i === 3 ? "text-white/80" : "text-[#566049]"}`}>{s.label}</p>
            <p className={`mt-2 font-[family-name:var(--font-bricolage)] text-3xl font-bold ${i === 3 ? "text-white" : "text-[#2f381b]"}`}><CountUp to={s.value} prefix={s.prefix} /></p>
          </div>
        ))}
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_1fr]">
        <section className="rounded-2xl border border-[#e3e8dc] bg-white p-6">
          <h2 className={`${heading} text-xl`}>Orders by day</h2>
          <div className="mt-6 flex h-52 items-end gap-3" role="img" aria-label={`Orders per day: ${WEEK.map((w) => `${w.d} ${w.v}`).join(", ")}`}>
            {WEEK.map((w, i) => (
              <div key={w.d} className="group flex h-full flex-1 flex-col justify-end text-center">
                <span className="mb-1 text-xs font-semibold text-[#3f4a24] opacity-0 transition-opacity group-hover:opacity-100">{w.v}</span>
                <div
                  className="dh-bar origin-bottom rounded-t-lg bg-[#3f4a24] transition-colors group-hover:bg-[#9a432a]"
                  style={{ height: `${(w.v / max) * 100}%`, animation: `dh-grow 700ms cubic-bezier(.2,.8,.2,1) ${i * 70}ms both` }}
                />
                <span className="mt-2 text-xs text-[#566049]">{w.d}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#e3e8dc] bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className={`${heading} text-xl`}>Latest orders</h2>
            <Link href="/admin/orders" className="text-sm font-semibold text-[#9a432a] hover:underline">See all</Link>
          </div>
          <ul className="mt-4 divide-y divide-[#edf0e4]">
            {ORDERS.map((o, i) => (
              <li key={o.id} className="dh-row flex items-center justify-between gap-3 py-3" style={{ animation: `dh-rise 450ms ease-out ${500 + i * 90}ms both` }}>
                <div className="min-w-0">
                  <p className="truncate font-medium text-[#2f381b]">{o.who} <span className="text-[#7a8470]">{o.id}</span></p>
                  <p className="truncate text-sm text-[#566049]">{o.item}</p>
                </div>
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${PILL[o.status]}`}>{o.status}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
