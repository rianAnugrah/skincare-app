import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import QRCode from "qrcode";
import { fetchAPI, eq, Product, Barcode } from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";
import EditForm from "./EditForm";
import AddBarcodeForm from "./AddBarcodeForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) redirect("/login");

  const [productsResult, barcodesResult] = await Promise.allSettled([
    fetchAPI(`/products${eq({ id })}`, token),
    fetchAPI(`/barcodes${eq({ product_id: id })}`, token),
  ]);

  const product: Product | null =
    productsResult.status === "fulfilled" ? productsResult.value?.[0] ?? null : null;
  const barcodes: Barcode[] =
    barcodesResult.status === "fulfilled" ? barcodesResult.value ?? [] : [];

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <p className="text-gray-500">Product not found.</p>
        <Link href="/dashboard" className="text-sm underline text-gray-900">Back to dashboard</Link>
      </div>
    );
  }

  const qrEntries = await Promise.all(
    barcodes.map(async (b) => ({
      barcode: b,
      svg: await QRCode.toString(b.code, { type: "svg", margin: 1, width: 180 }),
    }))
  );

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Dashboard
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Edit Product</h1>
      </div>

      {/* Edit form (client component for error state + pending) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h2 className="text-sm font-semibold text-gray-700">Product Details</h2>
        <EditForm product={product} />
      </div>

      {/* QR codes — server-rendered SVGs, no client JS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">
            Barcodes & QR Codes
            <span className="ml-2 text-gray-400 font-normal">({barcodes.length})</span>
          </h2>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-medium text-gray-500 mb-3">Generate new QR code</p>
          <AddBarcodeForm productId={product.id} />
        </div>

        {qrEntries.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 text-sm">
            No barcodes linked to this product.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {qrEntries.map(({ barcode, svg }) => (
            <div key={barcode.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4 items-start">
              <div
                className="shrink-0 rounded-xl overflow-hidden border border-gray-100"
                dangerouslySetInnerHTML={{ __html: svg }}
              />
              <div className="space-y-2 min-w-0">
                <p className="font-mono text-sm font-semibold text-gray-900 break-all">{barcode.code}</p>
                {barcode.batch_code && (
                  <p className="text-xs text-gray-400">Batch: {barcode.batch_code}</p>
                )}
                {barcode.status && <StatusBadge status={barcode.status} />}
                <a
                  href={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`}
                  download={`${barcode.code}.svg`}
                  className="inline-block text-xs text-gray-500 underline hover:text-gray-900"
                >
                  Download SVG
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
