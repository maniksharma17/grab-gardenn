"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, RefreshCw } from "lucide-react";
import { Trash2, ShoppingBag, Truck, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CartItem } from "@/lib/types";
import { cart } from "@/lib/data";
import Image from "next/image";

export default function CartPage() {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>(cart);

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== Number(id)));
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart",
    });
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === Number(id) ? { ...item, quantity: newQuantity } : item
    ));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const checkout = () => {
    toast({
      title: "Order placed",
      description: "Thank you for your order! We'll send you a confirmation email shortly.",
    });
    setCartItems([]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="mt-16 container mx-auto py-12">
        <div className="flex px-6 items-center justify-between mb-8 max-md:mb-4">
          <h2 className="text-2xl font-bold max-md:text-xl">Shopping Cart</h2>
          <div className="text-muted-foreground">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
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
                <div key={item.id} className="flex max-md:px-4 gap-4 bg-card p-6 rounded-lg">
                  <Image
                    src={item.image}
                    alt={item.name}
                    height={96}
                    width={96}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg max-md:text-md">{item.name}</h3>
                    <h3 className="font-normal text-primary text-sm max-md:hidden">{item.description}</h3>
                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">₹{(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">₹{item.price} each</p>
                  </div>
                </div>
              ))}

              {/* Shipping Information */}
              <div className="bg-card p-6 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Truck className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Shipping Information</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Free shipping on orders over $50. Standard delivery 3-5 business days.
                </p>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="First Name" />
                    <Input placeholder="Last Name" />
                  </div>
                  <Input placeholder="Address Line 1" />
                  <Input placeholder="Address Line 2 (Optional)" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="City" />
                    <Input placeholder="Postal Code" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Including VAT
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="bg-card p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Payment Method</h3>
                </div>
                <div className="space-y-4">
                  <Input placeholder="Card Number" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="MM/YY" />
                    <Input placeholder="CVC" />
                  </div>
                  <Input placeholder="Name on Card" />
                </div>
              </div>

              <div className="px-4">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={checkout}
                >
                  Complete Order
                </Button>
              </div>

              
              
              <p className="px-4 text-sm text-muted-foreground text-center">
                By completing your order, you agree to our{" "}
                <a href="#" className="text-primary hover:underline">Terms of Service</a>
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
            <p className="text-sm text-muted-foreground">100% secure checkout</p>
          </div>
          <div className="text-center">
            <RefreshCw className="h-8 w-8 text-primary mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Easy Returns</h4>
            <p className="text-sm text-muted-foreground">30-day return policy</p>
          </div>
        </div>
      </div>
    </div>
  );
}