import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
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
      <body className="min-h-full flex flex-col bg-gray-50">
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-6">
            <Link href="/" className="font-bold text-gray-900 text-lg">
              SkinVerify
            </Link>
            <Link
              href="/products"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Products
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto w-full px-4 py-8 flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
