import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">SkinVerify</h1>
        <p className="text-gray-500 text-lg max-w-sm mx-auto">
          Scan a barcode or browse our product catalog to verify authenticity.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <Link
          href="/products"
          className="flex-1 bg-gray-900 text-white rounded-xl py-3 px-6 font-medium hover:bg-gray-700 transition-colors"
        >
          Browse Products
        </Link>
        <Link
          href="/verify/FFY-SERUM-001"
          className="flex-1 border border-gray-200 text-gray-700 rounded-xl py-3 px-6 font-medium hover:bg-white transition-colors"
        >
          Demo Verify
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 w-full max-w-sm text-left shadow-sm">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-3 font-medium">
          How to verify
        </p>
        <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
          <li>Scan the barcode on your product</li>
          <li>Visit <code className="bg-gray-100 px-1 rounded text-xs">/verify/YOUR-CODE</code></li>
          <li>Check the authenticity status</li>
        </ol>
      </div>
    </div>
  );
}
