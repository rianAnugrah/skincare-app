import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import NewProductForm from "./NewProductForm";

export default async function NewProductPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) redirect("/login");

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Dashboard
        </Link>
        <h1 className="text-xl font-bold text-gray-900">New Product</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h2 className="text-sm font-semibold text-gray-700">Product Details</h2>
        <NewProductForm />
      </div>
    </div>
  );
}
