"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useRecoilValue } from "recoil";
import { userState } from "@/store/atoms/user";
import { Navbar } from "@/components/Navbar";
import { Heart } from "lucide-react";
import Image from "next/image";

const WishlistPage = () => {
  const router = useRouter();
  const user = useRecoilValue(userState);

  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);

  useEffect(() => {
    if (user.isLoggedIn) {
      fetchWishlist();
      fetchAllProducts();
    }
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
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.ok) {
      setWishlistIds((prev) => prev.filter((id) => id !== productId));
    }
  };

  const clearWishlist = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wishlist/${user._id}`,
      { method: "DELETE" }
    );

    if (response.ok) {
      setWishlistIds([]);
    }
  };

  return (
    <main className="min-h-screen py-16">
      <Navbar />
      <div className="mt-20 container">
        <h2 className="text-4xl text-center">Your Wishlist</h2>

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
            <div
              className={
                "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-6 md:gap-x-4 md:gap-y-12"
              }
            >
              {" "}
              {wishlistProducts.map((product) => {
                const price = product.price[0];
                const cutoffPrice = product.cutoffPrice[0];
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
                      className={`relative aspect-square cursor-pointer`}
                      onClick={() => {
                        router.push(`/products/${product._id}`);
                      }}
                    >
                      <div
                        className="absolute top-2 right-2 z-10 bg-white p-1 rounded-full shadow hover:scale-110 transition cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent routing to product detail
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

                    <div className={`p-4 max-md:p-2 flex flex-col gap-2`}>
                      {product.stock == 0 && (
                        <p className="text-red-500 text-left">Out of stock</p>
                      )}
                      <h3 className={`text-gray-800 text-md font-semibold`}>
                        {product.name}
                      </h3>

                      <div className={`text-gray-700 text-lg`}>
                        <div className={`text-primary font-semibold tetx-xl`}>
                          ₹{price}
                          <span className="text-gray-400 line-through text-xs ml-1">
                            ₹{cutoffPrice}
                          </span>
                          <span className="text-green-600 text-xs ml-2">
                            ({discount}% OFF)
                          </span>
                        </div>
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
