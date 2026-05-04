import { fetchAPI, Product } from "@/lib/api";
import ProductGrid from "@/components/ProductGrid";

export default async function ProductsPage() {
  let products: Product[] = [];
  let error = false;

  try {
    products = await fetchAPI("/products");
  } catch {
    error = true;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <p className="text-sm text-gray-500 mt-1">Browse our skincare catalog</p>
      </div>

      {error ? (
        <div className="text-center py-12 text-gray-400">
          <p>Failed to load products. Please try again later.</p>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
