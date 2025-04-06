"use client";

import { Navbar } from "@/components/Navbar";
import { products } from "@/lib/data";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/lib/types";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { CartHandle } from "@/components/CartHandle";

export default function ProductsPage() {
  const [selectedVariants, setSelectedVariants] = useState<{
    [key: string]: string;
  }>({});
  const { toast } = useToast();
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`
      );
      const data = await res.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`
      );
      const data = await res.json();
      setProducts(data.products);
    };
    fetchProducts();
  }, []);

  const handleVariantChange = (productId: string, variant: string) => {
    setSelectedVariants((prev) => ({ ...prev, [productId]: variant }));
  };

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return;

    const variantIndex = selectedVariants[productId] ?? 0;
    const variant = product.variants[Number(variantIndex)];
    const price = product.price[Number(variantIndex)];

    toast({
      title: "Added to cart",
      description: `${product.name} (${variant}) - ₹${price} added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <CartHandle />

      {/* Category Bar */}
      <div className="mt-20 z-10 px-4 max-md:py-2 py-6">
        <div className="flex md:justify-center py-2 gap-6 max-md:gap-1 overflow-x-scroll relative">
          {categories.map((category) => (
            <Link
              href={`products/collection/${category.name.toLowerCase()}`}
              key={category.name}
              className="flex flex-col items-center group px-2"
            >
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-muted hover:bg-gray-100 transition-all duration-200 overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full rounded-full object-cover"
                  width={80}
                  height={80}
                />
              </div>
              <span className="text-xs mt-2 font-medium text-center text-muted-foreground group-hover:text-primary transition-colors">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-4 md:px-8 py-8 max-md:py-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {products.map((product) => {
            const variantIndex = Number.isNaN(
              Number(selectedVariants[product._id])
            )
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
                className="max-md:flex max-md:flex-row max-md:justify-between bg-white border md:overflow-hidden hover:shadow-md transition"
              >
                <div
                  onClick={() => router.push(`/products/${product._id}`)}
                  className="flex-1 relative w-full aspect-square cursor-pointer"
                >
                  {/* Default Image */}
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition-opacity duration-300 hover:opacity-0"
                    unoptimized
                  />

                  {/* Hover Image */}
                  {product.images[1] && (
                    <Image
                      src={product.images[1]}
                      alt={`${product.name} Hover`}
                      fill
                      className="object-cover transition-opacity duration-300 opacity-0 hover:opacity-100"
                      unoptimized
                    />
                  )}
                </div>

                <div className="max-md:w-1/2 p-4 flex flex-col gap-2">
                  <h3 className="text-lg font-medium flex-wrap">
                    {product.name}
                  </h3>

                  {/* Variant Info Box */}
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
                    {/* Variant Select */}
                    <Select
                      defaultValue="0"
                      onValueChange={(value) =>
                        handleVariantChange(product._id, value)
                      }
                    >
                      <SelectTrigger className="w-full h-10 text-sm">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.variants.map((variant, index) => (
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
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
