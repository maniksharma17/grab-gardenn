"use client";

import Link from "next/link";
import { ShoppingCart, User, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { userState } from "@/store/atoms/user";
import { CartItem, Product } from "@/lib/types";


export function CartHandle() {

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const user = useRecoilValue(userState);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
  
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setCartItems(response.data.cart.items); 
      } catch (error) {
        console.log("Error fetching cart:", error);
      }
    }
    fetchCart();
  }, []);

  if(cartItems.length === 0) {
    return null;
  }

  return (
    <div className="w-1/3 z-50 animate-bounce bg-slate-50 border shadow-xl rounded-lg px-8 py-4 fixed bottom-2 right-10 flex flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-2">
        <div className="text-black">{cartItems.length} Items are waiting in your cart</div>
      </div>
      
      <div>
        <Link href="/cart">
          <Button className=" border-primary border hover:text-white text-primary bg-transparent">View Cart</Button>
        </Link>
      </div>
    </div>
    
  );
}
