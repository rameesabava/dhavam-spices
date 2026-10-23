"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, UserRound, LogOut, ChevronRight } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Our Products", href: "/products" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="Dhavam Spices home"
      className="flex shrink-0 items-center"
    >
      <Image
        src="/images/logo.png"
        alt="Dhavam Spices"
        width={220}
        height={60}
        priority
        className="h-auto w-[160px] object-contain sm:w-[175px] md:w-[190px]"
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

  useEffect(() => {
    const updateUser = () => {
      setUsername(sessionStorage.getItem("username") || "");
    };

    updateUser();
    window.addEventListener("authChanged", updateUser);

    return () => {
      window.removeEventListener("authChanged", updateUser);
    };
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");

    setUsername("");
    setOpen(false);

    window.dispatchEvent(new Event("authChanged"));
    router.push("/");
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-[#e5e8dc] transition-all duration-300 ${
        scrolled
          ? "bg-[#fffdf6]/95 shadow-[0_5px_24px_rgba(35,48,24,0.08)] backdrop-blur-xl"
          : "bg-[#fffdf6]"
      }`}
    >
      <div className="mx-auto flex h-[64px] w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 md:h-[70px] lg:px-8">
        {/* Logo */}
        <Logo onClick={() => setOpen(false)} />

        {/* Desktop navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 lg:flex"
        >
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`relative rounded-full px-4 py-2 text-[13px] font-semibold transition-colors duration-200 ${
                isActive(item.href)
                  ? "bg-[#edf0e4] text-[#3f4a24]"
                  : "text-[#5d6252] hover:bg-[#f0f1e9] hover:text-[#3f4a24]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop account actions */}
        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          {username ? (
            <>
              <span className="flex max-w-[150px] items-center gap-2 truncate text-sm font-medium text-[#3f4a24]">
                <UserRound size={17} />
                <span className="truncate">Hi, {username}</span>
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full border border-[#dce1d1] px-4 py-2 text-sm font-semibold text-[#3f4a24] transition hover:border-[#3f4a24] hover:bg-[#edf0e4]"
              >
                <LogOut size={15} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-semibold text-[#3f4a24] transition hover:bg-[#edf0e4]"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full bg-[#3f4a24] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#303a1b] hover:shadow-md"
              >
                Get Started
                <ChevronRight size={16} />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setOpen((previous) => !previous)}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e2e5d9] text-[#3f4a24] transition hover:bg-[#edf0e4] lg:hidden"
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {/* Mobile navigation */}
      <div
        id="mobile-navigation"
        className={`overflow-hidden border-t border-[#e8eadf] bg-[#fffdf6] transition-all duration-300 ease-in-out lg:hidden ${
          open
            ? "max-h-[480px] translate-y-0 opacity-100"
            : "pointer-events-none max-h-0 -translate-y-1 opacity-0"
        }`}
        aria-hidden={!open}
      >
        <nav
          aria-label="Mobile navigation"
          className="mx-auto max-w-7xl px-4 py-3 sm:px-6"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                tabIndex={open ? 0 : -1}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive(item.href)
                    ? "bg-[#edf0e4] text-[#3f4a24]"
                    : "text-[#555d49] hover:bg-[#f0f1e9]"
                }`}
              >
                {item.label}
                <ChevronRight size={16} className="opacity-60" />
              </Link>
            ))}
          </div>

          <div className="mt-3 border-t border-[#e8eadf] pt-3">
            {username ? (
              <div className="flex items-center justify-between gap-3 rounded-xl bg-[#f3f4ec] p-3">
                <div className="flex min-w-0 items-center gap-2 text-sm font-semibold text-[#3f4a24]">
                  <UserRound size={18} className="shrink-0" />
                  <span className="truncate">Welcome, {username}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  tabIndex={open ? 0 : -1}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#dce1d1] bg-white px-3 py-2 text-sm font-semibold text-[#3f4a24] transition hover:bg-[#edf0e4]"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  tabIndex={open ? 0 : -1}
                  className="flex items-center justify-center rounded-full border border-[#dce1d1] px-4 py-3 text-sm font-semibold text-[#3f4a24] transition hover:bg-[#edf0e4]"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  tabIndex={open ? 0 : -1}
                  className="flex items-center justify-center gap-1 rounded-full bg-[#3f4a24] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#303a1b]"
                >
                  Register
                  <ChevronRight size={16} />
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
