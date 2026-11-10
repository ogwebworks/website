import { Suspense } from "react";
import ShopGrid from "@/components/demos/fashion/ShopGrid";
import { productImages } from "@/components/demos/fashion/images";

export const metadata = { title: "Shop all" };

export default function ShopPage() {
  const imgs = productImages();
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Suspense fallback={<div className="h-96" />}>
        <ShopGrid images={imgs} />
      </Suspense>
    </div>
  );
}
