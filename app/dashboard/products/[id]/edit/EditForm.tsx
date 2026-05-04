"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Product } from "@/lib/api";
import { updateProductAction } from "./actions";

interface Props {
  product: Product;
}

export default function EditForm({ product }: Props) {
  const boundAction = updateProductAction.bind(null, product.id);
  const [state, formAction, pending] = useActionState(boundAction, null);

  return (
    <form action={formAction} className="space-y-4">
      <Field label="Name" name="name" defaultValue={product.name} required />
      <Field label="Slug" name="slug" defaultValue={product.slug} required />
      <Field label="Image URL" name="image_url" defaultValue={product.image_url ?? ""} type="url" />
      <Field label="Description" name="description" defaultValue={product.description ?? ""} multiline />
      <Field label="Ingredients" name="ingredients" defaultValue={product.ingredients ?? ""} multiline />

      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{state.error}</p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-gray-900 text-white rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
        <Link
          href="/dashboard"
          className="border border-gray-200 text-gray-600 rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

function Field({
  label, name, defaultValue, required, type = "text", multiline,
}: {
  label: string;
  name: string;
  defaultValue: string;
  required?: boolean;
  type?: string;
  multiline?: boolean;
}) {
  const base = "w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent";
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {multiline ? (
        <textarea name={name} defaultValue={defaultValue} rows={3} className={`${base} resize-none`} />
      ) : (
        <input name={name} type={type} defaultValue={defaultValue} required={required} className={base} />
      )}
    </div>
  );
}
