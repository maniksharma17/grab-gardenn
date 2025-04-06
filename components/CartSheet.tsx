"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { useEffect, useState } from "react";
import { CartItem, Product } from "@/lib/types";
import Image from "next/image";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRecoilValue } from "recoil";
import { userState } from "@/store/atoms/user";
import Link from "next/link";

export const CartSheet = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const { toast } = useToast();
  const user = useRecoilValue(userState);

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
      const categoryIds = [...new Set(items.map((item: CartItem) => item.product.category))];

      // Fetch products from all categories in parallel
      const suggestedProductsPromises = categoryIds.map((id) =>
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/id/${id}`)
      );

      const responses = await Promise.all(suggestedProductsPromises);
      let allSuggestions: any[] = [];

      responses.forEach((res) => {
        allSuggestions.push(...res.data.category.products);
      });

      // Remove already added products
      const cartProductIds = new Set(items.map((item: CartItem) => item.product._id));
      const filteredSuggestions = allSuggestions.filter(
        (prod: Product) => !cartProductIds.has(prod._id)
      );

      setSuggestions(filteredSuggestions);
      } catch (err) {
        toast({
          title: "Error loading cart",
          variant: "destructive",
        });
      }
    };

    fetchCart();
  }, [user]);

  const removeItem = async (id: string) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
    toast({ title: "Removed", description: "Item removed from cart" });

    try {
      if (!token) return;
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/remove/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Remove failed:", error);
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
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/update/${id}`,
        {
          type,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("Quantity update failed", err);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
              {cartItems.length}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[90vw] sm:min-w-[700px] overflow-y-auto"
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
          <div className="flex flex-row gap-10 justify-between h-full py-4">

            {/* Suggestions */}
            <div className="p-4 border-r">
            {suggestions.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-3">
                  You may also like
                </h4>
                <div className="flex flex-col gap-3">
                  {suggestions.slice(0, 5).map((product) => (
                    <Link
                      key={product._id}
                      href={`/products/${product._id}`}
                      className="text-xs text-center"
                    >
                      <div className="flex flex-row items-center gap-2">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={80}
                          height={80}
                          className="rounded-md w-full h-20 object-cover"
                        />
                        <div className="flex flex-col gap-1 justify-start">
                          <h4 className="text-sm font-semibold">
                            {product.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            ₹{product.price[0]}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {product.variants[0].display}
                          </p>
                          <Button>Add</Button>
                        </div>

                      </div>
                      
                      <p className="mt-1 line-clamp-2">{product.name}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            </div>

            {/* Cart Items */}
            <div className="flex flex-col justify-between h-full">
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
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <Link href="/cart">
                <Button className="w-full mt-2">Go to Checkout</Button>
              </Link>
            </div>
            </div>

            
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
