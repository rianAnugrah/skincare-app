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
    <div className="space-y-4 max-w-sm mx-auto">
      {/* Viewfinder */}
      <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-stone-900 shadow-xl border border-white/40">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          muted
          playsInline
        />
        <canvas ref={canvasRef} className="hidden" />

        {state === "scanning" && (
          <>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-52 h-52 relative">
                <span className="absolute top-0 left-0 w-9 h-9 border-t-2 border-l-2 border-white rounded-tl-2xl" />
                <span className="absolute top-0 right-0 w-9 h-9 border-t-2 border-r-2 border-white rounded-tr-2xl" />
                <span className="absolute bottom-0 left-0 w-9 h-9 border-b-2 border-l-2 border-white rounded-bl-2xl" />
                <span className="absolute bottom-0 right-0 w-9 h-9 border-b-2 border-r-2 border-white rounded-br-2xl" />
                <span className="absolute left-0 right-0 h-0.5 bg-[#C49A6C] shadow-[0_0_12px_#C49A6C] animate-scan-line" />
              </div>
            </div>
            <div className="absolute bottom-5 left-0 right-0 flex justify-center">
              <span className="text-[11px] text-white/80 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full tracking-[0.1em] uppercase">
                Point at QR code
              </span>
            </div>
          </>
        )}

        {state === "ready" && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-stone-900">
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#C49A6C]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-amber-700/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative text-center space-y-5 px-6">
              <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center mx-auto">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <button
                type="button"
                onClick={startCamera}
                className="bg-white text-stone-900 rounded-2xl px-6 py-3 text-xs font-bold tracking-[0.12em] uppercase active:bg-stone-200 hover:shadow-lg hover:shadow-white/20 transition-all duration-300 cursor-pointer"
                style={{ touchAction: "manipulation" }}
              >
                Enable Camera
              </button>
              <p className="text-white/40 text-xs tracking-wide">Tap to allow camera access</p>
            </div>
          </div>
        )}

        {state === "starting" && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-stone-900">
            <div className="text-center space-y-3">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
              <p className="text-white/60 text-[11px] tracking-[0.1em] uppercase">Starting camera</p>
            </div>
          </div>
        )}

        {state === "error" && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-stone-900">
            <div className="text-center px-6 space-y-3">
              <svg className="w-10 h-10 text-red-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8.5A1.5 1.5 0 014.5 7h8A1.5 1.5 0 0114 8.5v7a1.5 1.5 0 01-1.5 1.5h-8A1.5 1.5 0 013 15.5v-7z" />
              </svg>
              <p className="text-white/70 text-xs leading-relaxed">{errorMsg}</p>
            </div>
          </div>
        )}
      </div>

      {/* Manual fallback */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-5">
        <p className="text-xs font-medium text-stone-400 uppercase tracking-[0.14em] mb-3">
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
            className="flex-1 rounded-xl bg-white border border-stone-200 px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-300 focus:border-transparent font-mono transition-all"
          />
          <button
            type="submit"
            className="bg-stone-900 text-white rounded-xl px-5 py-2.5 text-xs font-bold tracking-[0.1em] uppercase hover:bg-stone-700 transition-colors"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}
