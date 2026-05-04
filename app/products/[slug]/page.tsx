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
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <p className="text-gray-500">Failed to load product. Please try again later.</p>
        <Link href="/products" className="text-sm text-gray-900 underline">Back to catalog</Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Product Not Found</h2>
        <Link href="/products" className="text-sm text-gray-900 underline">Back to catalog</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/products" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to catalog
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {product.image_url ? (
          <div className="relative aspect-video w-full bg-gray-50">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        ) : (
          <div className="aspect-video w-full bg-gray-50 flex items-center justify-center">
            <svg className="w-20 h-20 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            {product.status && <StatusBadge status={product.status} />}
          </div>

          {product.description && (
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Description</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          )}

          {product.ingredients && (
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Ingredients</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{product.ingredients}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
