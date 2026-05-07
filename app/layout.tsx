import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import MobileNav from "@/components/MobileNav";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkinVerify",
  description: "Verify your skincare product authenticity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#EDE5DC]">
        <nav className="relative bg-white/80 backdrop-blur-md border-b border-stone-100 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-5 h-14 flex items-center justify-between">
            {/* Brand */}
            <Link
              href="/"
              className="text-xs font-bold tracking-[0.22em] text-stone-900 uppercase"
            >
              PixiGlow
            </Link>

            {/* Center links — desktop only */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/products"
                className="text-xs text-stone-400 hover:text-stone-900 transition-colors tracking-[0.12em] uppercase"
              >
                Products
              </Link>
              <Link
                href="/scan"
                className="text-xs text-stone-400 hover:text-stone-900 transition-colors tracking-[0.12em] uppercase"
              >
                Scan
              </Link>
              <Link
                href="/dashboard"
                className="text-xs text-stone-400 hover:text-stone-900 transition-colors tracking-[0.12em] uppercase"
              >
                Dashboard
              </Link>
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-1">
              <Link
                href="/scan"
                aria-label="Scan product"
                className="w-9 h-9 flex items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition-all duration-200"
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
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                  />
                </svg>
              </Link>
              <MobileNav />
            </div>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto w-full px-4 py-6 flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
