import Link from "next/link";
import QRScannerLoader from "@/components/QRScannerLoader";

export default function ScanPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs text-stone-400 hover:text-stone-900 transition-colors group"
      >
        <span className="w-7 h-7 rounded-full border border-stone-200 flex items-center justify-center group-hover:border-stone-400 group-hover:bg-white transition-all duration-200 shadow-sm">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </span>
        <span className="tracking-[0.1em] uppercase">Back</span>
      </Link>

      {/* Header */}
      <div className="space-y-2 animate-fade-in-up">
        <p className="text-xs text-stone-400 tracking-[0.16em] uppercase">Verification</p>
        <h1 className="text-3xl md:text-4xl font-black text-stone-900 leading-tight tracking-tight">
          Scan QR Code
        </h1>
        <p className="text-sm text-stone-500 max-w-sm">
          Hold your camera up to the product QR code to verify authenticity instantly.
        </p>
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: "120ms" }}>
        <QRScannerLoader />
      </div>
    </div>
  );
}
