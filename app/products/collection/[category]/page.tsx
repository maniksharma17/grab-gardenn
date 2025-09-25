"use client";

import { CartHandle } from "@/components/CartHandle";
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
import { Product } from "@/lib/types";
import { cartRefreshState, userState } from "@/store/atoms/user";
import { Heart, PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Grid, List } from "lucide-react";

export default function ProductsPage() {
  const [selectedVariants, setSelectedVariants] = useState<{
    [key: string]: string;
  }>({});
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();
  const user = useRecoilValue(userState);
  const [isHorizontal, setIsHorizontal] = useState(false);

  const [wishlist, setWishlist] = useState<string[]>([]);

  const fetchWishlist = async () => {
    if (!user.isLoggedIn) return;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wishlist/${user._id}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const data = await res.json();
    if (data.wishlist.items.length == 0) setWishlist([]);
    else setWishlist(data.wishlist.items);
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const toggleWishlist = async (productId: string) => {
    if (!user.isLoggedIn) {
      router.push("/auth");
      return;
    }

    const isWished = wishlist.includes(productId);

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wishlist/${
      isWished ? "remove" : "add"
    }/${user._id}`;
    const method = "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ productId }),
      });

      if (res.ok) {
        setWishlist((prev) =>
          isWished
            ? prev.filter((id) => id !== productId)
            : [...prev, productId]
        );
        toast({
          title: isWished ? "Removed from wishlist" : "Added to wishlist",
        });
      } else {
        toast({ title: "Failed", variant: "destructive" });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      fetchWishlist();
    }
  };

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);
  const category = capitalize(params.category as string);

  const [categoryData, setCategoryData] = useState<any>(null);
  const setCartRefresh = useSetRecoilState(cartRefreshState);

  useEffect(() => {
    const fetchCategoryData = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/${decodeURI(category)}`
      );
      const data = await res.json();
      setCategoryData(data.category[0]);
    };

    fetchCategoryData();
  }, [category]);

  const handleVariantChange = (productId: string, variantIndex: string) => {
    setSelectedVariants((prev) => ({ ...prev, [productId]: variantIndex }));
  };

  const addToCart = async (productId: string) => {
    const product = categoryData.products.find(
      (p: Product) => p._id === productId
    );
    if (!product) return;
    const variantIndex = selectedVariants[productId] ?? 0;
    const variant = product.variants[Number(variantIndex)];
    const price = product.price[Number(variantIndex)];
    const dimensions = product.dimensions[Number(variantIndex)];
    const payload = {
      productId,
      quantity: 1,
      priceIndex: variantIndex,
      variant,
      dimensions,
    };

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
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
          title: errorData.message,
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

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <CartHandle />

      {/* Category Header */}
      <div className="mt-12 relative bg-green-700 shadow-sm overflow-hidden h-[250px]">
        {/* Overlay with Text */}
        {categoryData && (
          <div className="absolute mt-6 inset-0 flex flex-col items-center justify-center text-center px-4">
            <p className="text-sm text-white mb-2">
              <Link href="/products" className="hover:underline text-white">
                All Products
              </Link>{" "}
              &gt;{" "}
              <span className="capitalize text-white">{categoryData.name}</span>
            </p>
            <h1 className="text-4xl max-md:text-2xl font-bold capitalize text-white">
              {categoryData.name}
            </h1>
            <p className="text-md max-md:text-sm text-white mt-3 max-w-2xl">
              {categoryData.description}
            </p>
          </div>
        )}
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
      <div className="container mx-auto md:px-8 py-4">
        <div
          className={
            isHorizontal
              ? "max-md:px-2 flex flex-col justify-center gap-6"
              : "max-md:px-2 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 md:gap-x-4 gap-x-2 gap-y-6 md:gap-y-8"
          }
        >
          {categoryData?.products?.map((product: any) => {
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
                  isHorizontal ? "flex flex-col md:flex-row" : ""
                } ${product.stock == 0 ? "opacity-50" : "opacity-100"}`}
              >
                <div
                  className={`relative aspect-square ${
                    isHorizontal ? "md:w-1/4" : ""
                  } cursor-pointer`}
                  onClick={() => {
                    router.push(`/products/${product._id}`);
                  }}
                >
                  <div
                    className="absolute top-2 right-2 z-10 bg-white p-1 rounded-full shadow hover:scale-110 transition cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent routing to product detail
                      toggleWishlist(product._id);
                    }}
                  >
                    {wishlist.includes(product._id) ? (
                      <Heart className="text-red-500 fill-red-500 w-5 h-5" />
                    ) : (
                      <Heart className="text-gray-400 w-5 h-5" />
                    )}
                  </div>

                  {product.stock == 0 && (
                    <div className="absolute left-2 top-2 z-10 text-xs px-2 bg-red-500 text-white shadow rounded-full w-fit">
                      Out of stock
                    </div>
                  )}

                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className={`object-cover ${
                      product.images.length > 1 && "hover:opacity-0"
                    } transition-all duration-300`}
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

                <div
                  className={`${
                    isHorizontal ? "md:w-3/4 p-4" : ""
                  } md:p-4 p-2 flex flex-col gap-2`}
                >
                  <h3
                    className={`text-gray-800 line-clamp-2 font-semibold ${
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
                    className={`flex flex-col items-center gap-2 mt-2 ${
                      isHorizontal
                        ? "md:w-1/2"
                        : "flex-row"
                    }`}
                  >
                    <Select
                      defaultValue="0"
                      onValueChange={(value) =>
                        handleVariantChange(product._id, value)
                      }
                    >
                      <SelectTrigger
                        className={`h-10 w-full text-sm ${
                          isHorizontal ? "w-full" : "w-full"
                        }`}
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="w-full">
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
