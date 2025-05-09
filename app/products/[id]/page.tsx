// app/product/[id]/page.tsx
import ProductPage from "@/components/ProductPage"; // your client component

export default function Page({ params }: { params: { id: string } }) {
  return <ProductPage id={params.id} />;
}
