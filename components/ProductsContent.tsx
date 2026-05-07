"use client";

import { useState } from "react";
import { Product } from "@/lib/api";
import ProductGrid from "./ProductGrid";

const BRANDS = ["All", "Charlotte Tilbury", "Chanel", "Dior", "Givenchy", "La Mer"];

export default function ProductsContent({
  products,
  error,
}: {
  products: Product[];
  error: boolean;
}) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("All");

  const filtered = products.filter((p) => {
    const matchesQuery = !query || p.name.toLowerCase().includes(query.toLowerCase());
    const matchesBrand =
      brand === "All" || p.name.toLowerCase().includes(brand.toLowerCase().split(" ")[0]);
    return matchesQuery && matchesBrand;
  });

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Search bar */}
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="What are you looking for?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-full bg-white/80 backdrop-blur-sm border border-white/60 py-3 pl-11 pr-4 text-sm text-stone-900 placeholder:text-[#B0A098] shadow-sm focus:outline-none focus:ring-2 focus:ring-white/80 focus:border-transparent transition-all duration-200"
        />
      </div>

      {/* Brand filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
        {BRANDS.map((b) => (
          <button
            key={b}
            onClick={() => setBrand(b)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              brand === b
                ? "bg-stone-900 text-white shadow-sm"
                : "bg-white/70 border border-white/60 text-stone-600 hover:bg-white hover:text-stone-900"
            }`}
          >
            {b}
          </button>
        ))}
      </div>

      {/* Header row */}
      <div className="flex items-baseline justify-between">
        <h1 className="text-xl font-bold text-stone-900 tracking-tight">Products</h1>
        {!error && (
          <span className="text-xs text-stone-400">
            {filtered.length} {filtered.length === 1 ? "item" : "items"}
          </span>
        )}
      </div>

      {error ? (
        <div className="text-center py-16 text-stone-400">
          <p>Failed to load products. Please try again later.</p>
        </div>
      ) : (
        <ProductGrid products={filtered} />
      )}
    </div>
  );
}
