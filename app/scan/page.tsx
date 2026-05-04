import Link from "next/link";
import QRScannerLoader from "@/components/QRScannerLoader";

export default function ScanPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Scan QR Code</h1>
          <p className="text-xs text-gray-400 mt-0.5">Hold your camera up to the product QR code</p>
        </div>
      </div>

      <QRScannerLoader />
    </div>
  );
}
