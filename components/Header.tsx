
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

function Logo() {
  return (
    <Link
      href="/"
      aria-label="Dhavam Spices, home"
      className="flex items-center gap-2.5 rounded-lg py-5 text-[#3f4a24] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9a432a]"
    >
      <Image
        width={200}
        height={50}
        src="/images/logo.png"
        alt="Dhavam Spices logo"
      />
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [username, setUsername] = useState("");

  // Read the logged-in user from sessionStorage
  useEffect(() => {
    const updateUser = () => {
      setUsername(sessionStorage.getItem("username") || "");
    };

    updateUser();

    // Listen for login/logout updates in this tab
    window.addEventListener("authChanged", updateUser);

    return () => {
      window.removeEventListener("authChanged", updateUser);
    };
  }, [pathname]);

  // Shadow + border once the page scrolls
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close menu on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKey);

    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleLogout = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("username");

  setUsername("");
  setOpen(false);

  window.dispatchEvent(new Event("authChanged"));

  router.push("/"); // Redirect to Home page
  router.refresh();
};

  const focusRing =
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9a432a]";

  const ghostBtn =
    `inline-flex items-center justify-center rounded-full border-[1.5px] border-[#3f4a24] px-5 py-2.5 text-[0.93rem] font-semibold text-[#3f4a24] transition-colors hover:bg-[#3f4a24] hover:text-white ${focusRing}`;

  const solidBtn =
    `inline-flex items-center justify-center rounded-full border-[1.5px] border-[#9a432a] bg-[#9a432a] px-5 py-2.5 text-[0.93rem] font-semibold text-white transition-colors hover:border-[#7e3520] hover:bg-[#7e3520] ${focusRing}`;

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

        {/* Navigation */}
        <nav
          id="main-nav"
          aria-label="Main"
          className={`${
            open ? "block" : "hidden"
          } absolute inset-x-0 top-full border-b border-[#e3e8dc] bg-[#fbfcf8] px-4 pb-5 pt-2 md:static md:block md:flex-1 md:border-0 md:bg-transparent md:p-0`}
        >
          <ul className="flex flex-col gap-0.5 md:flex-row md:gap-1.5">
            {NAV_LINKS.map(({ label, href }) => {
              const active =
                pathname === href || pathname.startsWith(`${href}/`);

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

          {/* Mobile authentication */}
          <div className="mt-4 flex flex-col gap-2.5 md:hidden">
            {username ? (
              <>
                <p className="px-3 py-2 font-semibold text-[#3f4a24]">
                  Welcome, {username}
                </p>
                <button
                  type="button"
                  onClick={handleLogout}
                  className={ghostBtn}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={ghostBtn}>
                  Log in
                </Link>
                <Link href="/register" className={solidBtn}>
                  Create account
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Desktop authentication */}
        <div className="hidden items-center gap-2.5 md:flex">
          {username ? (
            <>
              <span className="max-w-[180px] truncate font-semibold text-[#3f4a24]">
                Hi, {username}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className={ghostBtn}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={ghostBtn}>
                Log in
              </Link>
              <Link href="/register" className={solidBtn}>
                Register
              </Link>
            </>
          )}
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
          <span
            className={`h-0.5 w-[22px] rounded bg-[#3f4a24] transition-transform motion-reduce:transition-none ${
              open ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-[22px] rounded bg-[#3f4a24] transition-opacity motion-reduce:transition-none ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-0.5 w-[22px] rounded bg-[#3f4a24] transition-transform motion-reduce:transition-none ${
              open ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>
    </header>
  );
}
