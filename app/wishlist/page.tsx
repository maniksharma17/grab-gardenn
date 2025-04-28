"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useRecoilState, useRecoilValue } from "recoil";
import { cartRefreshState, userState } from "@/store/atoms/user";
import { Navbar } from "@/components/Navbar";
import { Heart, PlusCircle } from "lucide-react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const WishlistPage = () => {
  const router = useRouter();
  const user = useRecoilValue(userState);

  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<{
    [key: string]: string;
  }>({});
  const { toast } = useToast();
  const [cartRefresh, setCartRefresh] = useRecoilState(cartRefreshState);

  const handleVariantChange = (productId: string, value: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  const addToCart = async (productId: string) => {
    const product = wishlistProducts.find((p) => p._id === productId);
    if (!product) return;
    const variantIndex = selectedVariants[productId] ?? 0;
    const variant = product.variants[Number(variantIndex)];
    const dimensions = product.dimensions[Number(variantIndex)];
    const payload = {
      productId,
      quantity: 1,
      priceIndex: variantIndex,
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

  useEffect(() => {
    if (user.isLoggedIn) {
      fetchWishlist();
      fetchAllProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchWishlist = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wishlist/${user._id}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const data = await res.json();
    if (data?.wishlist?.items?.length > 0) {
      setWishlistIds(data.wishlist.items);
    } else {
      setWishlistIds([]);
    }
  };

  const fetchAllProducts = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`
    );
    const data = await res.json();
    setAllProducts(data.products || []);
  };

  useEffect(() => {
    if (allProducts.length > 0 && wishlistIds.length > 0) {
      const matched = allProducts.filter((product: any) =>
        wishlistIds.includes(product._id)
      );
      setWishlistProducts(matched);
    } else {
      setWishlistProducts([]);
    }
  }, [allProducts, wishlistIds]);

  const removeFromWishlist = async (productId: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wishlist/remove/${user._id}`,
      {
        method: "POST",
        body: JSON.stringify({ productId }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user.token,
        },
      }
    );

    if (response.ok) {
      setWishlistIds((prev) => prev.filter((id) => id !== productId));
    }
  };

  return (
    <main className="min-h-screen py-16 bg-gray-50">
      <Navbar />
      <div className="md:mt-16 mt-10 container mx-auto">
        {wishlistProducts.length === 0 ? (
          <div className="text-center mt-10">
            <p className="text-xl">Your wishlist is empty.</p>
            <Button
              variant="outline"
              onClick={() => router.push("/products")}
              className="mt-4"
            >
              Go to Products
            </Button>
          </div>
        ) : (
          <div className="container mx-auto px-4 md:px-8 py-6 pt-2 max-md:py-2">
            <h2 className="text-4xl my-6 max-md:text-2xl px-4 font-medium text-primary text-left">
              Your Wishlist
            </h2>
            {/** Products grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-6 md:gap-x-4 md:gap-y-12">
              {wishlistProducts.map((product) => {
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
                      product.stock == 0 ? "opacity-50" : "opacity-100"
                    }`}
                  >
                    <div
                      className="relative aspect-square cursor-pointer"
                      onClick={() => {
                        router.push(`/products/${product._id}`);
                      }}
                    >
                      <div
                        className="absolute top-2 right-2 z-10 bg-white p-1 rounded-full shadow hover:scale-110 transition cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent routing
                          removeFromWishlist(product._id);
                        }}
                      >
                        {wishlistIds.includes(product._id) ? (
                          <Heart className="text-red-500 fill-red-500 w-5 h-5" />
                        ) : (
                          <Heart className="text-gray-400 w-5 h-5" />
                        )}
                      </div>

                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        unoptimized
                        className={`object-cover ${
                          product.images.length > 1 && "hover:opacity-0"
                        } transition-all duration-300`}
                      />
                      {product.images.length > 1 && (
                        <Image
                          src={product.images[1]}
                          alt={product.name}
                          fill
                          unoptimized
                          className="object-cover opacity-0 hover:opacity-100 transition-all duration-300"
                        />
                      )}
                    </div>

                    <div className="p-4 max-md:p-2 flex flex-col gap-2">
                      {product.stock == 0 && (
                        <p className="text-red-500 text-left">Out of stock</p>
                      )}
                      <h3 className="text-gray-800 text-md font-semibold">
                        {product.name}
                      </h3>

                      <div className="text-gray-700 text-lg">
                        <div className="text-primary font-semibold tetx-xl">
                          ₹{price}
                          <span className="text-gray-400 line-through text-xs ml-1">
                            ₹{cutoffPrice}
                          </span>
                          <span className="text-green-600 text-xs ml-2">
                            ({discount}% OFF)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <Select
                          defaultValue="0"
                          onValueChange={(value) =>
                            handleVariantChange(product._id, value)
                          }
                        >
                          <SelectTrigger className="h-10 text-sm w-fit">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {product.variants.map(
                              (variant: any, index: number) => (
                                <SelectItem
                                  key={index}
                                  value={index.toString()}
                                >
                                  {variant.display}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>

                        <Button
                          className="w-full text-sm"
                          onClick={() => {
                            if (user.isLoggedIn) {
                              addToCart(product._id);
                            } else {
                              router.push("/auth");
                            }
                          }}
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
        )}
      </div>
    </main>
  );
};

export default WishlistPage;
