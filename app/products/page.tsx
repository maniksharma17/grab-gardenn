"use client";

import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
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
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { cartRefreshState, userState } from "@/store/atoms/user";
import { Grid, List } from "lucide-react";
import { Heart, HeartOff } from "lucide-react";

export default function ProductsPage() {
  const [selectedVariants, setSelectedVariants] = useState<{
    [key: string]: string;
  }>({});
  const { toast } = useToast();
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();
  const [user, setUser] = useRecoilState(userState);
  const setCartRefresh = useSetRecoilState(cartRefreshState);
  const [isHorizontal, setIsHorizontal] = useState(false);

  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    console.log("Google client ID:", clientId);

    const loadGoogleScript = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = () => {
        if (window.google) {
          window.google.accounts.id.initialize({
            client_id: clientId!,
            callback: async (response: any) => {
              setIsLoading(true);
              try {
                const decoded = JSON.parse(
                  atob(response.credential.split(".")[1])
                );
                const { name, email } = decoded;

                const res = await fetch(
                  `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/oauth-login`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name, email }),
                    credentials: "include",
                  }
                );

                const data = await res.json();

                if (!res.ok || data.error) {
                  throw new Error(data.message || "Google login failed");
                }

                const userData = {
                  _id: data.user._id,
                  name: data.user.name,
                  email: data.user.email,
                  phone: data.user.phone,
                  address: data.user.address,
                  token: data.token,
                  isLoggedIn: true,
                  createdAt: data.user.createdAt,
                  updatedAt: data.user.updatedAt,
                };

                setUser({ ...userData, primaryAddress: 0 });
                localStorage.setItem("user", JSON.stringify(userData));
                localStorage.setItem("token", data.token);

                toast({
                  title: "Success",
                  description: "Logged in with Google!",
                });
              } catch (err) {
                toast({
                  title: "Google Sign In Failed",
                  description: "Please try again",
                  variant: "destructive",
                });
              } finally {
                setIsLoading(false);
              }
            },
          });

          window.google.accounts.id.prompt();
        }
      };
      document.body.appendChild(script);
    };

    if (typeof window !== "undefined" && !user?.isLoggedIn) {
      loadGoogleScript();
    }
  }, [user, router, setUser, toast]);

  useEffect(() => {
    if (user?.isLoggedIn && (!user.phone || user.address?.length === 0)) {
      router.push("/complete-profile");
    } else if (user?.isLoggedIn) {
      router.replace("/products");
    }
  }, [user, router]);

  useEffect(() => {
    setTimeout(() => {
      if (user.name === "") return;
      if (user.phone === "" || user.address.length === 0) {
        router.push("/complete-profile");
      }
    }, 3000);
  }, [user, router]);

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
    if (data.wishlist.length == 0) setWishlist([]);
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

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`
      );
      const data = await res.json();

      // Sort categories by createdAt (newest first)
      const sorted = [...data].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setCategories(sorted);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?limit=100`
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
      priceIndex: variantIndex,
      variant,
      dimensions,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(localStorage.getItem("token") && {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }),
          },
          credentials: "include", 
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        const data = await res.json();
        toast({ title: "Added to cart" });
        // optionally: update cart state directly
        // setCart(data.cart)
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

  const handleVariantChange = (productId: string, variant: string) => {
    setSelectedVariants((prev) => ({ ...prev, [productId]: variant }));
  };

  const carouselImages = [
    {
      src: "https://grabgardenn-storage-bucket.s3.ap-south-1.amazonaws.com/millets-banner.png",
      href: "/millets",
    },
    {
      src: "https://grabgardenn-storage-bucket.s3.ap-south-1.amazonaws.com/pulses-banner-2.png",
      href: "/pulses",
    },
    {
      src: "https://grabgardenn-storage-bucket.s3.ap-south-1.amazonaws.com/sweeteners-banner-2.png",
      href: "/sweeteners",
    },
    {
      src: "https://grabgardenn-storage-bucket.s3.ap-south-1.amazonaws.com/seeds-banner.jpeg",
      href: "/seeds",
    },
    {
      src: "https://grabgardenn-storage-bucket.s3.ap-south-1.amazonaws.com/rice-banner-2.png",
      href: "/rice",
    },
    {
      src: "https://grabgardenn-storage-bucket.s3.ap-south-1.amazonaws.com/tea-banner-2.png",
      href: "/tea",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Cleanup
  }, [carouselImages.length]);

  return (
    <div className="max-md:mt-12 min-h-screen bg-white">
      <Navbar />
      <CartHandle />

      <div className="mt-16 max-md:mt-24 w-full h-[130px] sm:h-[500px] relative overflow-hidden">
        <Swiper
          modules={[Pagination, Autoplay]}
          slidesPerView={1}
          loop={true}
          pagination={{ clickable: true, el: ".custom-pagination" }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          className="w-full h-full"
        >
          {carouselImages.map((image, index) => (
            <SwiperSlide key={image.src} className="relative w-full h-full">
              <Link
                href={`products/collection/${image.href}`}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={image.src}
                  alt={`Banner ${index + 1}`}
                  fill
                  unoptimized
                  priority={index === 0}
                  className="object-cover transition-opacity duration-1000 opacity-100"
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom pagination container for dots */}
        <div className="custom-pagination absolute bottom-4 w-full flex justify-center gap-2 z-10" />
      </div>

      {/* Category Bar */}
      <div className="z-10 px-4 max-md:py-2 py-6">
        <h3 className="text-center text-gray-700 max-md:text-sm font-semibold my-2">
          EXPLORE OUR NATURAL CATEGORIES
        </h3>
        <div className="flex md:justify-center py-2 gap-2 max-md:gap-0 overflow-x-scroll relative">
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
                  unoptimized
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
              : "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-6 md:gap-x-4 md:gap-y-8"
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
                className={`rounded-lg border bg-white overflow-hidden hover:shadow-md transition ${
                  isHorizontal ? "flex md:flex-row flex-col" : ""
                } ${product.stock == 0 ? "opacity-50" : "opacity-100"}`}
              >
                <div
                  className={`relative ${
                    isHorizontal
                      ? "w-1/4 max-md:w-full aspect-square"
                      : "aspect-square"
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

                <div
                  className={`${
                    isHorizontal ? "md:w-3/4" : ""
                  } p-4 max-md:p-2 flex flex-col gap-2`}
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
                    className={`flex flex-col justify-center items-center gap-2 mt-2 ${
                      isHorizontal
                        ? "md:w-1/2"
                        : "flex-row w-full"
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
                          isHorizontal ? "w-full" : "w-fit"
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
                      onClick={()=>addToCart(product._id)}
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
