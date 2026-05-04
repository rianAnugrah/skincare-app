"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type ScanState = "ready" | "starting" | "scanning" | "error";

export default function QRScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const router = useRouter();

  const [state, setState] = useState<ScanState>("ready");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  async function startCamera() {
    setState("starting");

    if (!navigator.mediaDevices?.getUserMedia) {
      setState("error");
      setErrorMsg("Camera API not supported on this browser/connection. Must be HTTPS.");
      return;
    }

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
    } catch (err) {
      const name = (err as Error).name;
      const message = (err as Error).message;
      setState("error");
      setErrorMsg(`${name}: ${message}`);
      return;
    }

    streamRef.current = stream;
    const video = videoRef.current!;
    video.srcObject = stream;
    await video.play();

    setState("scanning");

    const { default: jsQR } = await import("jsqr");
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

    let cancelled = false;

    function tick() {
      if (cancelled || video.readyState < video.HAVE_ENOUGH_DATA) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (code?.data) {
        cancelled = true;
        stream.getTracks().forEach((t) => t.stop());
        router.push(`/verify/${encodeURIComponent(code.data)}`);
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
  }

  return (
    <div className="space-y-4">
      {/* Viewfinder */}
      <div className="relative w-full max-w-sm mx-auto aspect-square rounded-2xl overflow-hidden bg-black shadow-lg">
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover pointer-events-none" muted playsInline />
        {/* Off-screen canvas used for jsqr processing */}
        <canvas ref={canvasRef} className="hidden" />

        {state === "scanning" && (
          <>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 relative">
                <span className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white rounded-tl-lg" />
                <span className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white rounded-tr-lg" />
                <span className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white rounded-bl-lg" />
                <span className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white rounded-br-lg" />
                <span className="absolute left-0 right-0 h-0.5 bg-green-400/80 animate-scan-line" />
              </div>
            </div>
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <span className="text-xs text-white/70 bg-black/40 px-3 py-1 rounded-full">
                Point at QR code
              </span>
            </div>
          </>
        )}

        {state === "ready" && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900">
            <div className="text-center space-y-4 px-6">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <button
                type="button"
                onClick={startCamera}
                className="bg-white text-gray-900 rounded-xl px-6 py-3 text-sm font-semibold active:bg-gray-200 cursor-pointer"
                style={{ touchAction: "manipulation" }}
              >
                Enable Camera
              </button>
              <p className="text-white/40 text-xs">Tap to allow camera access</p>
            </div>
          </div>
        )}

        {state === "starting" && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900">
            <div className="text-center space-y-2">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
              <p className="text-white/60 text-xs">Starting camera…</p>
            </div>
          </div>
        )}

        {state === "error" && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900">
            <div className="text-center px-6 space-y-2">
              <svg className="w-10 h-10 text-red-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8.5A1.5 1.5 0 014.5 7h8A1.5 1.5 0 0114 8.5v7a1.5 1.5 0 01-1.5 1.5h-8A1.5 1.5 0 013 15.5v-7z" />
              </svg>
              <p className="text-white/70 text-xs">{errorMsg}</p>
            </div>
          </div>
        )}
      </div>

      {/* Manual fallback */}
      <div className={`bg-white rounded-2xl border shadow-sm p-5 max-w-sm mx-auto ${state === "error" ? "border-gray-300" : "border-gray-100"}`}>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Enter code manually
        </p>
        <form action="/api/verify" method="get" className="flex gap-2">
          <input
            type="text"
            name="code"
            placeholder="e.g. FFY-SERUM-001"
            required
            autoComplete="off"
            autoCapitalize="characters"
            className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-mono"
          />
          <button
            type="submit"
            className="bg-gray-900 text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}
