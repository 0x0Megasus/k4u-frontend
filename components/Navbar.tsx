"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Search, Menu } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "مباريات اليوم" },
    { href: "/browse", label: "القنوات" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-[hsl(var(--border))] bg-[hsl(var(--background))/80] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg tracking-tight transition-opacity hover:opacity-80 flex-shrink-0"
        >
  <img
    src="/android-chrome-192x192.png"
    alt=""
    width={32}
    height={32}
    className="h-8 w-8 rounded-full"
  />
          Live Koora
        </Link>

        {/* Desktop nav links */}
        <div className="hidden sm:flex items-center gap-4 ms-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-[2px] text-sm font-medium transition-all ${
                pathname === link.href
                  ? "bg-violet-500/10 text-violet-300 border-2 border-violet-500/30"
                  : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] border-2 border-transparent hover:border-[hsl(var(--border))]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Search link — navigates to /search page */}
        <Link
          href="/search"
          className="ms-auto flex h-8 sm:h-9 items-center gap-1.5 rounded-[2px] border-2 border-[hsl(var(--border))] px-3 text-sm font-medium text-[hsl(var(--muted-foreground))] transition-all hover:border-violet-500/30 hover:text-violet-300"
        >
          <Search className="h-3.5 w-3.5" />
          بحث
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="sm:hidden flex items-center justify-center h-8 w-8 rounded-[2px] border-2 border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]"
          aria-label="القائمة"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="sm:hidden border-t-2 border-[hsl(var(--border))] bg-[hsl(var(--background))/95] backdrop-blur-xl px-4 py-3">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2 rounded-[2px] text-sm font-medium transition-all ${
                  pathname === link.href
                    ? "bg-violet-500/10 text-violet-300 border-2 border-violet-500/30"
                    : "text-[hsl(var(--muted-foreground))] border-2 border-transparent"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
