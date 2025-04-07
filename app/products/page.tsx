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
import { PlusCircle } from "lucide-react";
import { CartHandle } from "@/components/CartHandle";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { cartRefreshState, userState } from "@/store/atoms/user";
import { Grid, List } from "lucide-react";

export default function ProductsPage() {
  const [selectedVariants, setSelectedVariants] = useState<{
    [key: string]: string;
  }>({});
  const { toast } = useToast();
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();
  const user = useRecoilValue(userState);
  const setCartRefresh = useSetRecoilState(cartRefreshState);
  const [isHorizontal, setIsHorizontal] = useState(false);

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

  const addToCart = async (productId: string) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return;
    const variantIndex = selectedVariants[productId] ?? 0;
    const variant = product.variants[Number(variantIndex)];
    const price = product.price[Number(variantIndex)];
    const dimensions = product.dimensions[Number(variantIndex)];
    const payload = {
      productId,
      quantity: 1,
      price,
      variant,
      dimensions,
    };
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/add/${user._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (res.ok) {
        const data = await res.json();
        toast({
          title: "Added to cart",
        });
      } else {
        const errorData = await res.json();
        toast({
          title: "Failed to add to cart",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Failed to add to cart",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCartRefresh((prev) => prev + 1);
    }
  };

  const handleVariantChange = (productId: string, variant: string) => {
    setSelectedVariants((prev) => ({ ...prev, [productId]: variant }));
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <CartHandle />

      {/* Category Bar */}
      <div className="z-10 px-4 max-md:py-2 py-6">
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

      {/* Header Bar */}
      <div className="mx-auto mt-2 w-full">
        <p className="text-center text-lg font-medium text-gray-700">
          All Products
        </p>
      </div>

      <div className="container mx-auto flex justify-start px-8 py-2 items-center gap-2 mb-2">
        <Button
          variant={isHorizontal ? "outline" : "default"}
          onClick={() => setIsHorizontal(false)}
        >
          <Grid />
        </Button>
        <Button
          variant={isHorizontal ? "default" : "outline"}
          onClick={() => setIsHorizontal(true)}
        >
          <List />
        </Button>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 md:px-8 py-6 pt-2 max-md:py-2">
        <div
          className={
            isHorizontal
              ? "flex flex-col justify-center gap-6"
              : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12"
          }
        >
          {" "}
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
                className={`rounded-lg bg-white border overflow-hidden hover:shadow-md transition ${
                  isHorizontal ? "flex flex-row" : ""
                }`}
              >
                <div
                  className={`relative ${
                    isHorizontal ? "w-1/4 aspect-square" : "aspect-square"
                  } cursor-pointer`}
                  onClick={() => {
                    router.push(`/products/${product._id}`);
                  }}
                >
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover hover:opacity-0 transition-all duration-300"
                  />

                  {product.images.length > 1 && (
                    <Image
                      src={product.images[1]}
                      alt={product.name}
                      fill
                      className="object-cover opacity-0 hover:opacity-100 transition-all duration-300"
                    />
                  )}
                </div>

                <div className={`${isHorizontal?"w-3/4":""} p-4 flex flex-col gap-2`}>
                  <h3
                    className={`text-gray-800 font-semibold ${
                      isHorizontal ? "text-xl" : "text-md"
                    }`}
                  >
                    {product.name}
                  </h3>
                  {isHorizontal && (
                    <p className="text-sm text-gray-600">
                      {product.description
                        .split(".")
                        .slice(0, 2)
                        .join(".")
                        .trim() + "."}
                    </p>
                  )}

                  <div
                    className={`text-gray-700 ${
                      isHorizontal ? "text-lg" : "text-md"
                    }`}
                  >
                    <div
                      className={`text-primary font-semibold ${
                        isHorizontal ? "text-xl" : "text-md"
                      }`}
                    >
                      ₹{price}
                      <span className="text-gray-400 line-through text-xs ml-1">
                        ₹{cutoffPrice}
                      </span>
                      <span className="text-green-600 text-xs ml-2">
                        ({discount}% OFF)
                      </span>
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-2 mt-2 ${
                      isHorizontal ? "w-1/2 flex-col justify-start" : "flex-row"
                    }`}
                  >
                    <Select
                      defaultValue="0"
                      onValueChange={(value) =>
                        handleVariantChange(product._id, value)
                      }
                    >
                      <SelectTrigger
                        className={`h-10 text-sm ${
                          isHorizontal ? "w-full" : "w-24"
                        }`}
                      >
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
                      className={`w-full text-sm`}
                      onClick={() => addToCart(product._id)}
                    >
                      Add <PlusCircle className="h-4 w-4 ml-2" />
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
