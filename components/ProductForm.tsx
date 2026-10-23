"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { api } from "@/lib/axios";
import { GROUPS } from "@/lib/products";

const label = "mb-1.5 block text-sm font-medium text-[#2f381b]";
const input = "w-full rounded-xl border border-[#cfd5bf] bg-white px-4 py-3 text-[#20261f] placeholder:text-[#9aa28c] transition-shadow focus:outline-none focus:ring-4 focus:ring-[#9a432a]/25";

export default function ProductForm() {
  const [f, setF] = useState({ name: "", group: GROUPS[0]?.id ?? "", price: "", size: "100 g", description: "", inStock: true });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [drag, setDrag] = useState(false);
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file) return setPreview("");
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const set = (k: keyof typeof f) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));
  const pick = (x?: File) => { if (x && x.type.startsWith("image/")) setFile(x); };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (state === "saving") return;
    if (!f.name.trim() || !f.price || !file) return setError("Add a name, a price and a photo to continue.");
    setError("");
    setState("saving");
    try {
      const body = new FormData();
      Object.entries(f).forEach(([k, v]) => body.append(k, String(v)));
      body.append("image", file);
      await api.post("/products", body, { headers: { "Content-Type": "multipart/form-data" } });
      setState("saved");
      setTimeout(() => { setState("idle"); setFile(null); setF((p) => ({ ...p, name: "", price: "", description: "" })); }, 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the product. Please try again.");
      setState("idle");
    }
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
      <form onSubmit={onSubmit} noValidate className="space-y-5 rounded-2xl border border-[#e3e8dc] bg-white p-6 sm:p-8">
        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files[0]); }}
          className={`relative flex h-44 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed text-center transition-all duration-300 ${drag ? "scale-[1.02] border-[#9a432a] bg-[#fbe9dc]" : "border-[#cfd5bf] bg-[#f4f6ee] hover:border-[#3f4a24]"}`}
        >
          <input type="file" accept="image/*" onChange={(e) => pick(e.target.files?.[0])} className="absolute inset-0 cursor-pointer opacity-0" aria-label="Product photo" />
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Selected product" className="h-full w-full animate-[dh-pop_.4s_ease-out] object-contain p-2" />
          ) : (
            <p className="px-4 text-[#566049]"><span className="font-semibold text-[#9a432a]">Choose a photo</span> or drop it here<br /><span className="text-xs">JPG or PNG, a jar on a plain background works best</span></p>
          )}
        </div>

        <div>
          <label htmlFor="name" className={label}>Product name</label>
          <input id="name" value={f.name} onChange={set("name")} maxLength={60} placeholder="Black coffee powder" className={input} />
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label htmlFor="group" className={label}>Group</label>
            <select id="group" value={f.group} onChange={set("group")} className={input}>
              {GROUPS.map((g) => <option key={g.id} value={g.id}>{g.title}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="size" className={label}>Pack size</label>
            <input id="size" value={f.size} onChange={set("size")} placeholder="100 g" className={input} />
          </div>
          <div>
            <label htmlFor="price" className={label}>Price (₹)</label>
            <input id="price" type="number" inputMode="decimal" min="0" value={f.price} onChange={set("price")} placeholder="199" className={input} />
          </div>
        </div>

        <div>
          <label htmlFor="description" className={label}>Description</label>
          <textarea id="description" value={f.description} onChange={set("description")} rows={3} maxLength={300} placeholder="Fine, dark roast ground coffee with a deep aroma." className={input} />
          <p className="mt-1 text-right text-xs text-[#7a8470]">{f.description.length}/300</p>
        </div>

        <button type="button" role="switch" aria-checked={f.inStock} onClick={() => setF((p) => ({ ...p, inStock: !p.inStock }))} className="flex items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9a432a]/30">
          <span className={`relative h-7 w-12 rounded-full transition-colors duration-300 ${f.inStock ? "bg-[#3f4a24]" : "bg-[#cfd5bf]"}`}>
            <span className={`absolute left-1 top-1 size-5 rounded-full bg-white shadow transition-transform duration-300 ${f.inStock ? "translate-x-5" : ""}`} />
          </span>
          <span className="text-sm font-medium text-[#2f381b]">{f.inStock ? "In stock" : "Out of stock"}</span>
        </button>

        {error && <p role="alert" className="animate-[dh-pop_.3s_ease-out] rounded-xl bg-[#fbeae7] px-4 py-3 text-sm text-[#b3341f]">{error}</p>}

        <button type="submit" disabled={state === "saving"} className={`flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9a432a]/40 disabled:translate-y-0 ${state === "saved" ? "bg-[#7d8f3a]" : "bg-[#3f4a24] hover:bg-[#2f381b]"}`}>
          {state === "saving" && <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />}
          {state === "saved" && (
            <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="30" style={{ animation: "dh-draw .5s ease-out both" }} /></svg>
          )}
          <span aria-live="polite">{state === "saving" ? "Saving…" : state === "saved" ? "Product saved" : "Save product"}</span>
        </button>
      </form>

      <aside aria-label="Preview" className="xl:sticky xl:top-8 xl:self-start">
        <p className="mb-3 text-sm font-medium text-[#566049]">How it will look in the shop</p>
        <div className="overflow-hidden rounded-3xl border border-[#e3e8dc] bg-white shadow-xl shadow-[#2f381b]/5 transition-transform duration-500 hover:-rotate-1">
          <div className="flex aspect-[4/5] items-center justify-center bg-[#e6ebdc]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {preview ? <img src={preview} alt="" className="h-full w-full object-cover" /> : <span className="text-sm text-[#7a8470]">Photo appears here</span>}
          </div>
          <div className="p-5">
            <h3 className="font-[family-name:var(--font-bricolage)] text-lg font-bold text-[#2f381b]">{f.name || "Product name"}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-[#566049]">{f.description || "Your description shows here."}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-semibold text-[#9a432a]">{f.price ? `₹${f.price}` : "₹0"} <span className="text-sm font-normal text-[#7a8470]">/ {f.size || "pack"}</span></span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${f.inStock ? "bg-[#e6ebdc] text-[#3f4a24]" : "bg-[#fbeae7] text-[#b3341f]"}`}>{f.inStock ? "In stock" : "Sold out"}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
