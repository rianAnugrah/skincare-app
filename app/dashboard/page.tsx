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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">{products.length} products</p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="text-sm text-gray-500 hover:text-gray-900 border border-gray-200 rounded-xl px-4 py-2 transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3">
          Failed to load products. Your session may have expired —{" "}
          <Link href="/login" className="underline font-medium">sign in again</Link>.
        </div>
      )}

      {/* Product table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Product</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden sm:table-cell">Slug</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Created</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <span className="font-medium text-gray-900">{product.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-gray-400 font-mono text-xs hidden sm:table-cell">
                  {product.slug}
                </td>
                <td className="px-5 py-4 text-gray-400 hidden md:table-cell">
                  {product.created_at
                    ? new Date(product.created_at).toLocaleDateString()
                    : "—"}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-xs text-gray-500 hover:text-gray-900 underline"
                    >
                      View
                    </Link>
                    <Link
                      href={`/dashboard/products/${product.id}/edit`}
                      className="text-xs text-gray-900 font-medium hover:underline"
                    >
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}

            {products.length === 0 && !error && (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-gray-400">
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
