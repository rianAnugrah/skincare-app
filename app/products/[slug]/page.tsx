import Image from "next/image";
import Link from "next/link";
import { fetchAPI, eq, Product } from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  let product: Product | null = null;
  let error = false;

  try {
    const products: Product[] = await fetchAPI(`/products${eq({ slug })}`);
    product = products?.[0] ?? null;
  } catch {
    error = true;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-4 animate-fade-in">
        <p className="text-stone-500 text-sm">Failed to load product. Please try again later.</p>
        <Link href="/products" className="text-xs text-stone-900 underline underline-offset-4 tracking-wide">
          Back to catalog
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-4 animate-fade-in">
        <h2 className="text-xl font-bold text-stone-800">Product Not Found</h2>
        <Link
          href="/products"
          className="text-xs text-stone-500 hover:text-stone-900 transition-colors underline underline-offset-4"
        >
          Back to catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Back */}
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-xs text-stone-400 hover:text-stone-900 transition-colors mb-7 group"
      >
        <span className="w-7 h-7 rounded-full border border-stone-200 flex items-center justify-center group-hover:border-stone-400 group-hover:bg-white transition-all duration-200 shadow-sm">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </span>
        <span className="tracking-[0.1em] uppercase">Back</span>
      </Link>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Image panel */}
        <div
          className="bg-white rounded-3xl overflow-hidden border border-white/60 shadow-sm animate-fade-in-up"
          style={{ animationDelay: "50ms" }}
        >
          <div className="px-6 pt-6 pb-2 flex items-center justify-between">
            <p className="text-xs text-stone-400 tracking-[0.16em] uppercase">Skin care</p>
            <div className="flex gap-1">
              <span className="text-xs text-stone-300 font-medium">01</span>
              <span className="text-xs text-stone-200">/</span>
              <span className="text-xs text-stone-300 font-medium">02</span>
            </div>
          </div>

          {/* Product image */}
          <div className="relative aspect-square mx-6 mb-5 bg-[#F5EFE9] rounded-2xl overflow-hidden">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-contain p-8"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <svg className="w-20 h-20 text-stone-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center items-center gap-1.5 pb-6">
            <span className="w-5 h-1 rounded-full bg-stone-900" />
            <span className="w-1.5 h-1.5 rounded-full bg-stone-200" />
            <span className="w-1.5 h-1.5 rounded-full bg-stone-200" />
          </div>
        </div>

        {/* Info panel */}
        <div className="flex flex-col gap-5 py-1">
          {/* Name + status */}
          <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <h1 className="text-3xl font-black text-stone-900 leading-tight tracking-tight">
              {product.name}
            </h1>
            {product.status && (
              <div className="mt-3">
                <StatusBadge status={product.status} />
              </div>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="animate-fade-in-up" style={{ animationDelay: "150ms" }}>
              <p className="text-xs text-stone-400 uppercase tracking-[0.14em] mb-2 font-medium">About</p>
              <p className="text-sm text-stone-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Ingredients */}
          {product.ingredients && (
            <div className="animate-fade-in-up" style={{ animationDelay: "190ms" }}>
              <p className="text-xs text-stone-400 uppercase tracking-[0.14em] mb-2 font-medium">Ingredients</p>
              <p className="text-sm text-stone-500 leading-relaxed line-clamp-4">{product.ingredients}</p>
            </div>
          )}

          {/* Rating — decorative */}
          <div
            className="flex items-center gap-3 animate-fade-in-up"
            style={{ animationDelay: "230ms" }}
          >
            <div className="flex gap-0.5">
              {[1, 2, 3, 4].map((i) => (
                <svg key={i} className="w-3.5 h-3.5 fill-[#C49A6C]" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
              <svg className="w-3.5 h-3.5 fill-stone-200" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <span className="text-xs text-stone-400">4.7 / 5</span>
          </div>

          {/* CTA */}
          <div
            className="mt-auto animate-fade-in-up"
            style={{ animationDelay: "280ms" }}
          >
            <Link
              href="/scan"
              className="flex items-center justify-center gap-2.5 w-full bg-stone-900 text-white rounded-2xl py-4 text-xs font-bold tracking-[0.12em] uppercase hover:bg-stone-700 transition-all duration-300 hover:shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              Verify Authenticity
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
