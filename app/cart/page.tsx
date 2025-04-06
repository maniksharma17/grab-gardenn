"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, RefreshCw } from "lucide-react";
import { Trash2, ShoppingBag, Truck, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CartItem } from "@/lib/types";
import Image from "next/image";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { userState } from "@/store/atoms/user";

export default function CartPage() {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const user = useRecoilValue(userState);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCartItems(response.data.cart.items);
      } catch (error) {
        console.error("Error fetching cart:", error);
        toast({
          title: "Error",
          description: "Failed to load cart items.",
          variant: "destructive",
        });
      }
    };

    fetchCart();
  }, []);

  const removeItem = (id: string) => {
    setCartItems(cartItems?.filter((item) => item._id !== id));
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart",
    });
  };

  const updateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/update`,
        {
          itemId: id,
          quantity: newQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartItems((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating cart item:", error);
      toast({
        title: "Error",
        description: "Could not update quantity.",
        variant: "destructive",
      });
    }
  };

  const subtotal = cartItems?.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const checkout = () => {
    toast({
      title: "Order placed",
      description:
        "Thank you for your order! We'll send you a confirmation email shortly.",
    });
    setCartItems([]);
  };

  console.log(cartItems);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="mt-16 container mx-auto py-12">
        <div className="flex px-6 items-center justify-between mb-8 max-md:mb-4">
          <h2 className="text-2xl font-bold max-md:text-xl">Shopping Cart</h2>
          <div className="text-muted-foreground">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-lg">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">
              Looks like you haven&apos;`t added any items to your cart yet
            </p>
            <Button variant="outline" size="lg">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex max-md:px-4 gap-4 bg-card p-6 rounded-lg"
                >
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    height={96}
                    width={96}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg max-md:text-md">
                      {item.product.name}
                    </h3>
                    <p className="text-md text-muted-foreground">
                      ₹{item.variant.display}
                    </p>
                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                        >
                          +
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ₹{item.price} each
                    </p>
                  </div>
                </div>
              ))}

              {/* Shipping Information */}
              <div className="bg-card p-4 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-base">
                      Shipping Address
                    </h3>
                  </div>
                  <select
                    className="border p-2 rounded-md text-sm"
                    onChange={(e) =>
                      console.log("Selected address:", e.target.value)
                    }
                  >
                    <option disabled selected>
                      Select saved address
                    </option>
                    {user.address?.map((addr: any, i: number) => (
                      <option key={i} value={addr._id}>
                        {addr.line1}, {addr.city}
                      </option>
                    ))}
                  </select>
                </div>

                <p className="text-muted-foreground text-sm">
                  Or enter a new address:
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="First Name" />
                  <Input placeholder="Last Name" />
                </div>
                <Input placeholder="Address Line 1" />
                <Input placeholder="Address Line 2 (Optional)" />
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="City" />
                  <Input placeholder="Postal Code" />
                </div>
                <Button size="sm" className="w-full mt-2">
                  Save New Address
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Including all applicable taxes
                    </p>
                  </div>
                </div>
              </div>

              {/* Razorpay Payment */}
              <div className="bg-card p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-base">Payment</h3>
                </div>
                <Button
                  className="w-full"
                  onClick={() => {
                    // trigger Razorpay here
                    console.log("Pay with Razorpay");
                  }}
                >
                  Pay with Razorpay
                </Button>
              </div>

              <p className="px-4 text-sm text-muted-foreground text-center">
                By completing your order, you agree to our{" "}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>
              </p>
            </div>
          </div>
        )}

        {/* Trust Badges */}
        <div className="border-t pt-10 mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <Truck className="h-8 w-8 text-primary mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Free Shipping</h4>
            <p className="text-sm text-muted-foreground">On orders over $50</p>
          </div>
          <div className="text-center">
            <ShieldCheck className="h-8 w-8 text-primary mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Secure Payment</h4>
            <p className="text-sm text-muted-foreground">
              100% secure checkout
            </p>
          </div>
          <div className="text-center">
            <RefreshCw className="h-8 w-8 text-primary mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Easy Returns</h4>
            <p className="text-sm text-muted-foreground">
              30-day return policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
