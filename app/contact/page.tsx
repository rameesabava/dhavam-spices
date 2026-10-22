import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Contact", description: "Order or ask a question. Call, WhatsApp or email Dhavam Spices in Chennai." };

const link = "font-medium text-[#3f4a24] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9a432a]/30 rounded";

export default function ContactPage() {
  return (
    <>
      <section className="bg-[#e6ebdc]">
        <div className="mx-auto max-w-[1200px] px-4 py-14 md:px-6">
          <h1 className="font-[family-name:var(--font-bricolage)] text-4xl font-bold tracking-tight text-[#2f381b] sm:text-5xl">Contact us</h1>
          <p className="mt-4 max-w-xl text-lg text-[#4a5538]">Want to order, check sizes or ask about prices? Reach out any way you like.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1200px] gap-12 px-4 py-14 md:px-6 lg:grid-cols-[1fr_1.2fr]">
        <address className="space-y-8 not-italic">
          <div>
            <h2 className="mb-2 font-[family-name:var(--font-bricolage)] text-xl font-semibold text-[#2f381b]">Call or WhatsApp</h2>
            <p className="mb-1">{SITE.owner}</p>
            <ul className="space-y-1">
              {SITE.phones.map((p) => <li key={p.tel}><a href={`tel:${p.tel}`} className={link}>{p.display}</a></li>)}
            </ul>
          </div>
          <div>
            <h2 className="mb-2 font-[family-name:var(--font-bricolage)] text-xl font-semibold text-[#2f381b]">Email</h2>
            <a href={`mailto:${SITE.email}`} className={`${link} break-all`}>{SITE.email}</a>
          </div>
          <div>
            <h2 className="mb-2 font-[family-name:var(--font-bricolage)] text-xl font-semibold text-[#2f381b]">Address</h2>
            <p className="leading-relaxed">{SITE.address[0]}<br />{SITE.address[1]}</p>
          </div>
        </address>

        <div className="rounded-2xl border border-[#dfe3d0] bg-[#f4f6ee] p-6 md:p-8">
          <h2 className="mb-5 font-[family-name:var(--font-bricolage)] text-xl font-semibold text-[#2f381b]">Send us a message</h2>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
