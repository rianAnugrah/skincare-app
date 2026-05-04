import Image from "next/image";
import { fetchAPI, eq, Barcode, Product } from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";

interface Props {
  params: Promise<{ code: string }>;
}

export default async function VerifyPage({ params }: Props) {
  const { code } = await params;

  let barcode: Barcode | null = null;
  let product: Product | null = null;
  let error = false;

  try {
    const barcodes: Barcode[] = await fetchAPI(`/barcodes${eq({ code })}`);
    barcode = barcodes?.[0] ?? null;

    if (barcode?.product_id) {
      const products: Product[] = await fetchAPI(`/products${eq({ id: barcode.product_id })}`);
      product = products?.[0] ?? null;
    }
  } catch {
    error = true;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Service Unavailable</h2>
        <p className="text-gray-500 text-sm">Could not connect to the verification API. Please try again later.</p>
      </div>
    );
  }

  if (!barcode || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Product Not Found</h2>
        <p className="text-gray-500 text-sm">
          No product matches barcode <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">{code}</code>
        </p>
        <StatusBadge status="invalid" />
      </div>
    );
  }

  const status = barcode.status ?? product.status ?? "valid";

  return (
    <div className="max-w-lg mx-auto">
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
            <h1 className="text-xl font-bold text-gray-900">{product.name}</h1>
            <StatusBadge status={status} />
          </div>

          <div className="text-xs text-gray-400 font-mono bg-gray-50 px-3 py-1.5 rounded-lg inline-block">
            {code}
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
