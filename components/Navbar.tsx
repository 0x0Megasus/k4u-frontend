"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Search, Menu } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { href: "/", label: "المباريات" },
    { href: "/browse", label: "تصفح" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-[hsl(var(--border))] bg-[hsl(var(--background))/80] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg tracking-tight transition-opacity hover:opacity-80 flex-shrink-0"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-[2px] border-2 border-violet-500 bg-violet-500/10">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4 text-violet-400">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3a9 9 0 0 1 9 9" />
              <path d="M12 3a9 9 0 0 0-9 9" />
              <path d="M3 12h18" />
              <path d="M12 3v18" />
            </svg>
          </div>
          koora4you
        </Link>

        {/* Desktop nav links */}
        <div className="hidden sm:flex items-center gap-1 ms-6">
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

        {/* Search */}
        <div className="ms-auto">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute end-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن القنوات..."
              className="h-9 w-40 rounded-[2px] border-2 border-[hsl(var(--border))] bg-[hsl(var(--card))] ps-8 pe-3 text-sm outline-none transition-all placeholder:text-[hsl(var(--muted-foreground))] focus:w-48 focus:border-violet-500/40 lg:w-48"
            />
          </form>
        </div>

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
