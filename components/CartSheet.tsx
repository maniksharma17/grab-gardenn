"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, Plus, Minus, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { CartItem, Product } from "@/lib/types";
import Image from "next/image";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { cartRefreshState, userState } from "@/store/atoms/user";
import Link from "next/link";
import { CheckoutSheet } from "./CheckoutSheet";
const FREE_SHIPPING_THRESHOLD = 1000;

export const CartSheet = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const { toast } = useToast();
  const user = useRecoilValue(userState);
  const [cartRefresh, setCartRefresh] = useRecoilState(cartRefreshState);
  const [open, setOpen] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchCart = async () => {
      if (!token || !user?._id) return;
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/${user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCartItems(res.data.cart.items);
        const items = res.data.cart.items;

        // Extract unique category IDs
        const categoryIds = [
          ...new Set(items.map((item: CartItem) => item.product.category)),
        ];

        // Fetch products from all categories in parallel
        const suggestedProductsPromises = categoryIds.map((id) =>
          axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/id/${id}`
          )
        );

        const responses = await Promise.all(suggestedProductsPromises);
        let allSuggestions: any[] = [];

        responses.forEach((res) => {
          allSuggestions.push(...res.data.category.products);
        });

        // Remove already added products
        const cartProductIds = new Set(
          items.map((item: CartItem) => item.product._id)
        );
        const filteredSuggestions = allSuggestions.filter(
          (prod: Product) => !cartProductIds.has(prod._id)
        );

        setSuggestions(filteredSuggestions);
      } catch (err) {
        console.log(err)
      }
    };

    fetchCart();
  }, [user, token, toast, cartRefresh]);

  const addToCart = async (product: Product) => {
    if (!token || !user?._id) {
      toast({ title: "Please login to add items", variant: "destructive" });
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/add/${user._id}`,
        {
          productId: product._id,
          variant: product.variants[0], 
          quantity: 1,
          dimensions: product.dimensions[0], 
          price: product.price[0], 
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

    } catch (err) {
      console.log("Add to cart failed:", err);
      toast({ title: "Failed to add", variant: "destructive" });
    } finally {
      setCartRefresh((prev) => prev + 1);
    }
  };

  const removeItem = async (id: string) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));

    try {
      if (!token) return;
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/${user._id}/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.log("Remove failed:", error);
    } finally {
      setCartRefresh((prev) => prev + 1);
    }
  };

  const updateQuantity = async (id: string, type: "inc" | "dec") => {
    const updated = cartItems.map((item) => {
      if (item._id === id) {
        const newQty =
          type === "inc" ? item.quantity + 1 : Math.max(1, item.quantity - 1);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCartItems(updated);

    try {
      if (!token) return;
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/${user._id}/${id}`,
        {
          action: type,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.log("Quantity update failed", err);
    } finally {
      setCartRefresh(prev => prev+1)
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {cartItems.length > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
              {cartItems.length}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className={`w-[90vw] overflow-y-auto transition-all duration-300 ${suggestions.length > 0
          ? "sm:max-w-[700px]"
          : "sm:max-w-[400px]"}`}
      >
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-center py-16">
            <ShoppingCart className="w-12 h-12 mb-4 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">Your cart is empty</p>
          </div>
        ) : (
          <div className={`grid gap-6 h-full py-4 transition-all duration-300 ${suggestions.length > 0
            ? "lg:grid-cols-[2fr_1.5fr]"
            : "lg:grid-cols-1"}`}>
            {/* Cart Items */}
            <div className="flex flex-col justify-between h-full pr-2">
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-start gap-3 bg-muted/20 p-3 rounded-lg"
                  >
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      width={60}
                      height={60}
                      className="rounded-md object-cover w-16 h-16"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-semibold">
                            {item.product.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {item.variant.display}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item._id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>

                      <div className="text-xs text-muted-foreground mt-1">
                        Price per unit: ₹{item.price.toFixed(2)}
                      </div>

                      <div className="flex flex-row justify-between items-center text-xs text-muted-foreground mt-1">
                        <div className="text-sm text-gray-800 font-medium mt-1">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item._id, "dec")}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="text-sm">{item.quantity}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item._id, "inc")}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4 mt-4 space-y-2">
                <div className="mt-4">
                  {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                    <div className="text-green-600 text-sm font-medium mb-1">
                      🎉 You’ve unlocked free shipping!
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground mb-1">
                      Add ₹{(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(0)}{" "}
                      more to unlock free shipping
                    </div>
                  )}

                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        subtotal >= FREE_SHIPPING_THRESHOLD
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div>
                <CheckoutSheet setCart={setOpen}/>


                </div>
              </div>
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="mt-2 max-md:py-4 lg:mt-0 border-t lg:border-t-0 lg:border-l lg:pl-4 overflow-y-auto max-h-[75vh]">
                <h4 className="text-sm font-semibold mb-3">
                  You may also like
                </h4>
                <div className="flex flex-col gap-3">
                  {suggestions.slice(0, 5).map((product) => (
                    <Link
                      key={product._id}
                      href={`/products/${product._id}`}
                      className="text-xs"
                    >
                      <div className="flex items-center gap-2 hover:bg-muted/40 p-2 rounded-md transition">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={70}
                          height={70}
                          className="rounded object-cover"
                        />
                        <div className="flex flex-col flex-1 gap-2">
                          <div className="flex-1 flex flex-col gap-1">
                            <h4 className="text-sm font-medium">
                              {product.name}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              ₹{product.price[0]} •{" "}
                              {product.variants[0].display}
                            </p>
                          </div>

                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              addToCart(product);
                            }}
                            size="sm"
                            className="text-xs"
                          >
                            ADD
                            <PlusCircle
                              className="text-white ml-2 h-4 w-4"
                              strokeWidth={1.2}
                            />
                          </Button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
