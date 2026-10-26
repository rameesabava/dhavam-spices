import Link from "next/link";

const PHONES = [
  { display: "+91 63830 73503", tel: "+916383073503" },
  { display: "+91 81481 23417", tel: "+918148123417" },
];

const SHOP_LINKS = [
  { label: "Cardamom", href: "/products" },
  { label: "Pepper", href: "/products" },
  { label: "Cloves", href: "/products" },
  { label: "Cinnamon", href: "/products" },
  { label: "Star anise", href: "/products" },
  { label: "Black coffee powder", href: "/products" },
  { label: "Spice powders", href: "/products" },
];

const COMPANY_LINKS = [
  { label: "Our story", href: "/about" },
  { label: "Contact us", href: "/contact" },
  { label: "Our Products", href: "/products" },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e3a27f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#2f381b] rounded-sm";

const linkClass = `text-[#c9d1b2] transition-colors hover:text-white ${focusRing}`;

function ColumnHeading({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <h3 className="mb-4 font-[family-name:var(--font-bricolage)] text-lg font-semibold text-white">
      {children}
    </h3>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#2f381b] font-[family-name:var(--font-dm-sans)] text-[#c9d1b2]">
      <div className="mx-auto max-w-[1200px] px-4 pb-8 pt-14 md:px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          {/* Brand */}
          <div>
            <Link
              href="/"
              aria-label="Dhavam Spices, home"
              className={`inline-flex items-center gap-3 ${focusRing}`}
            >
              <span className="flex flex-col leading-none text-[#e9edd9]">
                <span className="font-[family-name:var(--font-bricolage)] text-2xl font-bold tracking-tight">
                  Dhavam
                </span>
                <span className="mt-1 text-sm font-medium tracking-wide text-[#b3bd98]">
                  Spices
                </span>
              </span>
            </Link>

            <p className="mt-5 max-w-xs leading-relaxed">
              Premium, pure and unadulterated spices and masalas, brought
              directly from the farm to your kitchen.
            </p>
          </div>

          {/* Shop */}
          <nav aria-label="Shop">
            <ColumnHeading>Shop</ColumnHeading>

            <ul className="space-y-2.5">
              {SHOP_LINKS.map((link, index) => (
                <li key={`${link.label}-${index}`}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company">
            <ColumnHeading>Dhavam Spices</ColumnHeading>

            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <ColumnHeading>Contact</ColumnHeading>

            <address className="space-y-3 not-italic">
              <p className="text-white">Dhavam Spices</p>

              <p className="leading-relaxed">
                Casagrand Northern Star,
                <br />
                Madhavaram, Chennai 600110
              </p>

              <ul className="space-y-1.5">
                {PHONES.map((phone) => (
                  <li key={phone.tel}>
                    <a href={`tel:${phone.tel}`} className={linkClass}>
                      {phone.display}
                    </a>
                  </li>
                ))}
              </ul>

              <a
                href="mailto:dhavamspices@gmail.com"
                className={`inline-block break-all ${linkClass}`}
              >
                dhavamspices@gmail.com
              </a>
            </address>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 flex flex-col gap-2 border-t border-[#4a5530] pt-6 text-sm text-[#a9b48d] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Dhavam Spices. All rights reserved.</p>
          <p>Pure spices, straight from the farm.</p>
        </div>
      </div>
    </footer>
  );
}