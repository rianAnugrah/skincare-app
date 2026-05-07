import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { fetchAPI, Product } from "@/lib/api";
import { logoutAction } from "@/app/login/actions";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) redirect("/login");

  let products: Product[] = [];
  let error = false;

  try {
    products = await fetchAPI("/products", token);
  } catch {
    error = true;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 animate-fade-in-up">
        <div className="space-y-1">
          <p className="text-xs text-stone-400 tracking-[0.16em] uppercase">Admin</p>
          <h1 className="text-3xl md:text-4xl font-black text-stone-900 leading-tight tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-stone-500">
            {products.length} {products.length === 1 ? "product" : "products"} in catalog
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/products/new"
            className="inline-flex items-center gap-2 bg-stone-900 text-white rounded-2xl px-4 py-2.5 text-xs font-bold tracking-[0.1em] uppercase hover:bg-stone-700 transition-all duration-300 hover:shadow-lg"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add product
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-xs text-stone-500 hover:text-stone-900 bg-white/70 backdrop-blur-sm border border-white/60 rounded-2xl px-4 py-2.5 font-medium tracking-[0.1em] uppercase transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-2xl px-5 py-4 animate-fade-in-up">
          Failed to load products. Your session may have expired —{" "}
          <Link href="/login" className="underline font-semibold">
            sign in again
          </Link>
          .
        </div>
      )}

      {/* Product table */}
      <div
        className="bg-white rounded-3xl border border-white/60 shadow-sm overflow-hidden animate-fade-in-up"
        style={{ animationDelay: "100ms" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100 text-left">
              <th className="px-5 py-4 text-[11px] font-semibold text-stone-400 uppercase tracking-[0.14em]">
                Product
              </th>
              <th className="px-5 py-4 text-[11px] font-semibold text-stone-400 uppercase tracking-[0.14em] hidden sm:table-cell">
                Slug
              </th>
              <th className="px-5 py-4 text-[11px] font-semibold text-stone-400 uppercase tracking-[0.14em] hidden md:table-cell">
                Created
              </th>
              <th className="px-5 py-4 text-[11px] font-semibold text-stone-400 uppercase tracking-[0.14em] text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-stone-50/60 transition-colors group"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-[#F5EFE9] shrink-0">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <span className="font-semibold text-stone-900">{product.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-stone-400 font-mono text-xs hidden sm:table-cell">
                  {product.slug}
                </td>
                <td className="px-5 py-4 text-stone-400 text-xs hidden md:table-cell">
                  {product.created_at
                    ? new Date(product.created_at).toLocaleDateString()
                    : "—"}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3 justify-end">
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-xs text-stone-500 hover:text-stone-900 transition-colors tracking-wide"
                    >
                      View
                    </Link>
                    <Link
                      href={`/dashboard/products/${product.id}/edit`}
                      className="text-xs text-stone-900 font-semibold hover:underline underline-offset-4 tracking-wide"
                    >
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}

            {products.length === 0 && !error && (
              <tr>
                <td colSpan={4} className="px-5 py-16 text-center text-stone-400 text-sm">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
