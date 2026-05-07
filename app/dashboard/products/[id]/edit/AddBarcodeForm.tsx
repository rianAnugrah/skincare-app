"use client";

import { useActionState } from "react";
import { addBarcodeAction } from "./actions";

interface Props {
  productId: number;
}

export default function AddBarcodeForm({ productId }: Props) {
  const boundAction = addBarcodeAction.bind(null, productId);
  const [state, formAction, pending] = useActionState(boundAction, null);

  return (
    <form action={formAction} className="flex flex-col sm:flex-row gap-3">
      <input
        name="code"
        type="text"
        required
        placeholder="Barcode / QR code value"
        className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
      />
      <input
        name="batch_code"
        type="text"
        placeholder="Batch code (optional)"
        className="w-40 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
      />
      <button
        type="submit"
        disabled={pending}
        className="bg-gray-900 text-white rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {pending ? "Generating…" : "Generate QR"}
      </button>
      {state?.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}
    </form>
  );
}
