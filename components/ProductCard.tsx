import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/api";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-square bg-[#F5EFE9]">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg className="w-12 h-12 text-stone-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Status dot */}
        {product.status && (
          <span
            className={`absolute top-2.5 left-2.5 w-2 h-2 rounded-full ${
              product.status === "valid" ? "bg-emerald-400" : "bg-red-400"
            }`}
          />
        )}
      </div>

      {/* Info row */}
      <div className="p-3.5 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs text-stone-400 mb-0.5">Skincare</p>
          <h3 className="font-semibold text-stone-900 text-sm leading-snug line-clamp-2">
            {product.name}
          </h3>
        </div>
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center text-white group-hover:bg-stone-700 transition-colors duration-200 shadow-sm">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
