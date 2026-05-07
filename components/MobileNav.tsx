"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/products", label: "Products" },
  { href: "/scan", label: "Scan" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Hamburger button */}
      <button
        aria-label="Menu"
        onClick={() => setOpen(true)}
        className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition-all duration-200"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 6h16M4 12h16M4 18h10"
          />
        </svg>
      </button>

      {/* Full-screen drawer — only mounted when open */}
      {open && (
        <div
          style={{ backgroundColor: "#EDE5DC" }}
          className="absolute inset-0 w-full h-screen  animate-fade-in"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 h-14">
            <span className="text-xs font-bold tracking-[0.22em] text-stone-900 uppercase">
              PixiGlow
            </span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="w-9 h-9 flex items-center justify-center rounded-full text-stone-500 hover:bg-white/50 transition-all"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Links */}
          <nav className="flex flex-col flex-1 justify-center px-8 gap-2">
            {links.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                style={{ animationDelay: `${i * 60}ms` }}
                className={`animate-fade-in-up py-4 text-4xl font-black tracking-tight transition-colors ${
                  pathname === link.href
                    ? "text-stone-900"
                    : "text-stone-400 hover:text-stone-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Bottom */}
          <div className="px-8 pb-10 text-xs text-stone-400 tracking-[0.18em] uppercase">
            PixiGlow
          </div>
        </div>
      )}
    </>
  );
}
