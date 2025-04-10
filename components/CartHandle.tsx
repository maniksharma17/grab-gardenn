"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { cartRefreshState, userState } from "@/store/atoms/user";
import { CartItem } from "@/lib/types";
import { CartSheet } from "./CartSheet";

const FREE_SHIPPING_THRESHOLD = 1000;

export function CartHandle() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const user = useRecoilValue(userState);
  const cartRefresh = useRecoilValue(cartRefreshState);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !user?._id) return;

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
      }
    };

    fetchCart();
  }, [user, cartRefresh]);

  if (cartItems.length === 0) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  return (
    <>
      {/* Main floating cart handle */}
      <div className="w-[500px] max-md:w-[300px] z-40 bg-white border text-black shadow-2xl rounded-xl px-6 py-3 fixed bottom-2 right-24 flex flex-row gap-2 items-center justify-between">
        <div className="max-md:hidden text-sm font-medium">
          🛒 {cartItems.length} item{cartItems.length > 1 ? "s" : ""} in your cart
        </div>

        <div className="flex flex-col gap-1 items-center">
        <div className="w-[200px] bg-gray-700 rounded-full h-1 relative overflow-hidden">
          <div
            className="bg-green-400 h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
          
        </div>
        <div className="text-xs text-gray-800">
          {subtotal >= FREE_SHIPPING_THRESHOLD
            ? "🎉 You're eligible for free shipping!"
            : `₹${FREE_SHIPPING_THRESHOLD - subtotal} away from free shipping`}
        </div>
        </div>
        

        <CartSheet />
      </div>

      
    </>
  );
}
