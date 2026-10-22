"use client";
import { useState } from "react";
import { waLink } from "@/lib/site";

const field = "w-full rounded-xl border border-[#cfd5bf] bg-white px-4 py-3 text-[#20261f] focus:outline-none focus:ring-4 focus:ring-[#9a432a]/30";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="cf-name" className="mb-1.5 block text-sm font-medium">Your name</label>
        <input id="cf-name" value={name} onChange={(e) => setName(e.target.value)} className={field} autoComplete="name" />
      </div>
      <div>
        <label htmlFor="cf-msg" className="mb-1.5 block text-sm font-medium">What would you like to order or ask?</label>
        <textarea id="cf-msg" rows={5} value={msg} onChange={(e) => setMsg(e.target.value)} className={field} placeholder="e.g. 200 g whole pepper and 100 g cardamom powder" />
      </div>
      <a href={waLink(`Hi Dhavam Spices, I'm ${name || "a customer"}. ${msg}`.trim())} target="_blank" rel="noopener noreferrer"
         className="inline-flex rounded-full bg-[#9a432a] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#7e3520] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9a432a]/40">
        Send on WhatsApp
      </a>
      <p className="text-sm text-[#566049]">This opens WhatsApp with your message ready to send.</p>
    </div>
  );
}
