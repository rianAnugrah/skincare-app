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
          href="/scan"
          className="flex-1 bg-gray-900 text-white rounded-xl py-3 px-6 font-medium hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          Scan QR Code
        </Link>
        <Link
          href="/products"
          className="flex-1 border border-gray-200 text-gray-700 rounded-xl py-3 px-6 font-medium hover:bg-white transition-colors"
        >
          Browse Products
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 w-full max-w-sm text-left shadow-sm">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-3 font-medium">
          How to verify
        </p>
        <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
          <li>Tap <strong>Scan QR Code</strong> and allow camera access</li>
          <li>Point your camera at the QR code on the product</li>
          <li>Check the authenticity status instantly</li>
        </ol>
      </div>
    </div>
  );
}
