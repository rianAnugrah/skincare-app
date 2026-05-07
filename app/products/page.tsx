import { fetchAPI, Product } from "@/lib/api";
import ProductsContent from "@/components/ProductsContent";

export default async function ProductsPage() {
  let products: Product[] = [];
  let error = false;

  try {
    products = await fetchAPI("/products");
  } catch {
    error = true;
  }

  return <ProductsContent products={products} error={error} />;
}
