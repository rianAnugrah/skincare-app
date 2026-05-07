import Link from "next/link";

export default function Home() {
  return (
    <div className="animate-fade-in space-y-4">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-stone-900 min-h-[76vh] flex flex-col justify-between p-8 md:p-12">
        {/* Ambient blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-700/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
        <div className="absolute top-1/2 right-1/3 w-56 h-56 bg-stone-600/30 rounded-full blur-2xl pointer-events-none" />

        {/* Top badge */}
        <div className="relative z-10 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/8 backdrop-blur-sm border border-white/10 text-white/50 text-xs tracking-[0.16em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Luxury Verification
          </span>
        </div>

        {/* Main hero text + CTAs */}
        <div className="relative z-10 space-y-7">
          <div className="space-y-3">
            <h1
              className="text-5xl md:text-7xl font-black text-white leading-[1.04] tracking-tight animate-fade-in-up"
              style={{ animationDelay: "80ms" }}
            >
              Your Skin<br />
              Routine in<br />
              Safe Hands
            </h1>
            <p
              className="text-stone-400 text-sm max-w-xs leading-relaxed animate-fade-in-up"
              style={{ animationDelay: "160ms" }}
            >
              Professional and luxury skin care product verification.
            </p>
          </div>

          {/* CTAs */}
          <div
            className="flex items-center gap-3 animate-fade-in-up"
            style={{ animationDelay: "240ms" }}
          >
            <Link
              href="/products"
              className="inline-flex flex-col items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 text-white rounded-2xl px-5 py-3 text-xs font-medium hover:bg-white/20 transition-all duration-300"
            >
              <span className="tracking-[0.14em] uppercase">new arrivals</span>
              <svg
                className="w-3 h-3 animate-bounce-arrow"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>

            <Link
              href="/scan"
              className="inline-flex items-center gap-2 bg-white text-stone-900 rounded-2xl px-5 py-3.5 text-xs font-bold tracking-[0.1em] uppercase hover:bg-stone-100 transition-all duration-300 shadow-lg shadow-black/20"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              Scan Product
            </Link>
          </div>
        </div>
      </div>

      {/* How to verify */}
      <div
        className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 p-6 shadow-sm animate-fade-in-up"
        style={{ animationDelay: "360ms" }}
      >
        <p className="text-xs text-stone-400 uppercase tracking-[0.18em] mb-5 font-medium">
          How to verify
        </p>
        <ol className="space-y-4">
          {[
            { n: "01", text: "Tap Scan Product and allow camera access" },
            { n: "02", text: "Point your camera at the QR code on the product" },
            { n: "03", text: "Check the authenticity status instantly" },
          ].map((step) => (
            <li key={step.n} className="flex items-start gap-4">
              <span className="text-xs font-bold text-stone-300 tabular-nums mt-0.5 flex-shrink-0">
                {step.n}
              </span>
              <span className="text-sm text-stone-600 leading-snug">{step.text}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
