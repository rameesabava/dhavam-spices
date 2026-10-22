"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
    { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Our story", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

function Logo() {
  return (
    <Link
      href="/"
      aria-label="Dhavam Spices, home"
      className="flex items-center gap-2.5 rounded-lg text-[#3f4a24] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9a432a] py-5"
    >
      <Image width={200} height={50} src='/images/logo.png' alt="logo"></Image>
     
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Shadow + border once the page scrolls
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on route change or Escape
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const focusRing =
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9a432a]";
  const ghostBtn = `inline-flex items-center justify-center rounded-full border-[1.5px] border-[#3f4a24] px-5 py-2.5 text-[0.93rem] font-semibold text-[#3f4a24] transition-colors hover:bg-[#3f4a24] hover:text-white ${focusRing}`;
  const solidBtn = `inline-flex items-center justify-center rounded-full border-[1.5px] border-[#9a432a] bg-[#9a432a] px-5 py-2.5 text-[0.93rem] font-semibold text-white transition-colors hover:border-[#7e3520] hover:bg-[#7e3520] ${focusRing}`;

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-[#fbfcf8] font-[family-name:var(--font-dm-sans)] text-[#20261f] transition-[border-color,box-shadow] motion-reduce:transition-none ${
        scrolled
          ? "border-[#e3e8dc] shadow-[0_6px_20px_-14px_rgba(29,59,42,0.35)]"
          : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-10 px-4 md:h-[72px] md:px-6">
        <Logo />

        {/* Navigation: inline on desktop, dropdown panel on mobile */}
        <nav
          id="main-nav"
          aria-label="Main"
          className={`${
            open ? "block" : "hidden"
          } absolute inset-x-0 top-full border-b border-[#e3e8dc] bg-[#fbfcf8] px-4 pb-5 pt-2 md:static md:block md:flex-1 md:border-0 md:bg-transparent md:p-0`}
        >
          <ul className="flex flex-col gap-0.5 md:flex-row md:gap-1.5">
            {NAV_LINKS.map(({ label, href }) => {
              const active = !href.includes("#") && (pathname === href || pathname.startsWith(`${href}/`));
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-[10px] px-3 py-3.5 text-[1.05rem] font-medium transition-colors md:rounded-full md:px-3.5 md:py-2 md:text-[0.95rem] ${focusRing} ${
                      active
                        ? "bg-[#3f4a24] text-white"
                        : "text-[#20261f] hover:bg-[#e6ebdc]"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Auth buttons inside the mobile menu */}
          <div className="mt-4 flex flex-col gap-2.5 md:hidden">
            <Link href="/login" className={ghostBtn}>Log in</Link>
            <Link href="/register" className={solidBtn}>Create account</Link>
          </div>
        </nav>

        {/* Auth buttons on desktop */}
        <div className="hidden items-center gap-2.5 md:flex">
          <Link href="/login" className={ghostBtn}>Log in</Link>
          <Link href="/register" className={solidBtn}>Register</Link>
        </div>

        {/* Hamburger */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen((v) => !v)}
          className={`ml-auto flex size-11 flex-col items-center justify-center gap-[5px] rounded-[10px] md:hidden ${focusRing}`}
        >
          <span className={`h-0.5 w-[22px] rounded bg-[#3f4a24] transition-transform motion-reduce:transition-none ${open ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`h-0.5 w-[22px] rounded bg-[#3f4a24] transition-opacity motion-reduce:transition-none ${open ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-[22px] rounded bg-[#3f4a24] transition-transform motion-reduce:transition-none ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
      </div>
    </header>
  );
}
