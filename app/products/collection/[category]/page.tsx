"use client";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [selectedVariants, setSelectedVariants] = useState<{
    [key: string]: string;
  }>({});
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);
  const category = capitalize(params.category as string);

  const [categoryData, setCategoryData] = useState<any>(null);
  console.log(categoryData);

  useEffect(() => {
    const fetchCategoryData = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/${category}`
      );
      const data = await res.json();
      setCategoryData(data.category[0]);
    };

    fetchCategoryData();
  }, [category]);

  const handleVariantChange = (productId: string, variantIndex: string) => {
    setSelectedVariants((prev) => ({ ...prev, [productId]: variantIndex }));
  };

  const handleAddToCart = (productId: string) => {
    const product = categoryData.products.find((p: any) => p._id === productId);
    if (!product) return;

    const variantIndex = selectedVariants[productId] ?? "0";
    const variant = product.variants[Number(variantIndex)];
    const price = product.price[Number(variantIndex)];

    toast({
      title: "Added to cart",
      description: `${product.name} (${variant.display}) - ₹${price} added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Category Header */}
      <div className="bg-secondary py-12 mt-20 text-center px-4 md:px-8 rounded-lg shadow-sm">
        {categoryData && (
          <div className="max-w-3xl mx-auto">
            <p className="text-sm text-gray-800 mb-2">
              <Link href="/" className="hover:underline text-gray-800">
                Home
              </Link>{" "}
              &gt;{" "}
              <span className="capitalize text-gray-800">
                {categoryData.name}
              </span>
            </p>
            <h1 className="text-4xl font-bold capitalize text-black">
              {categoryData.name}
            </h1>
            <p className="text-md text-gray-700 mt-3">
              {categoryData.description}
            </p>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryData?.products?.map((product: any) => {
            const variantIndex = Number.isNaN(Number(selectedVariants[product._id]))
            ? 0
            : Number(selectedVariants[product._id]);
            const price = product.price[variantIndex];
            const cutoffPrice = product.cutoffPrice[variantIndex];
            const discount = Math.round(
              ((cutoffPrice - price) / cutoffPrice) * 100
            );
            return (
              <div
                key={product._id}
                className="max-md:flex max-md:flex-row bg-white border overflow-hidden hover:shadow-md transition"
              >
                <div className="relative aspect-square"
                onClick={()=>{router.push(`/products/${product._id}`)}}
                >
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="max-md:w-1/2 p-4 flex flex-col gap-2">
                  <h3 className="text-lg font-medium">{product.name}</h3>

                  <div className="text-md text-gray-700">
                    <div className="font-semibold text-primary">
                      ₹{price}
                      <span className="text-gray-400 line-through text-xs ml-1">
                        ₹{cutoffPrice}
                      </span>
                      <span className="text-green-600 text-xs ml-2">
                        ({discount}% OFF)
                      </span>
                    </div>
                    
                  </div>

                  <div className="flex flex-row items-center gap-2 mt-2">
                    <Select
                      defaultValue="0"
                      onValueChange={(value) =>
                        handleVariantChange(product._id, value)
                      }
                    >
                      <SelectTrigger className="w-24 h-10 text-sm">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.variants.map((variant: any, index: number) => (
                          <SelectItem key={index} value={index.toString()}>
                            {variant.display}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      className="w-full text-sm"
                      onClick={() => handleAddToCart(product._id)}
                    >
                      Add
                    </Button>
                  </div>

                  <div className="flex gap-2 mt-2"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
