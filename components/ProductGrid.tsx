import { Product } from "@/lib/api";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-stone-400">
        <p>No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {products.map((product, i) => (
        <div
          key={product.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${i * 45}ms` }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
