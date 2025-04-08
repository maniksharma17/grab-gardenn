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
import { Product } from "@/lib/types";
import {CartSheet} from "@/components/CartSheet";
import { UserProfileSheet } from "./UserProfileSheet";
import Loading from "./Loading";

const items = [
  { name: "Home", href: "/" },
  { name: "Products", href: "products" },
  { name: "About", href: "about" },
  { name: "News & Blog", href: "content" },
  { name: "Your Choice", href: "choice" },
  { name: "Contact", href: "contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const [cartItems, setCartItems] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>([]);
  const user = useRecoilValue(userState);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);


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

        setCartItems(response.data.cart.items.length);
      } catch (error) {
        console.log("Error fetching cart:", error);
      }
    };
    fetchCart();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`,
          {
            withCredentials: true,
          }
        );

        setProducts(response.data.products);
      } catch (error) {
        console.log("Error fetching cart:", error);
      }
    };
    fetchProducts();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isMounted) return <Loading/>;

  return (
    <nav className="fixed left-20 right-20 top-2 mx-16 z-50 shadow-sm rounded-xl bg-white border border-gray-300">
      <div className="z-50 px-2 max-w-full flex h-[70px] items-center justify-between md:px-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/grab-gardenn-logo.png"
              alt="Grab Gardenn"
              width={80}
              height={80}
              className="w-20 h-20"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {items.map((item) => (
            <Link
              key={item.name}
              href={`/${item.href}`}
              className={
                pathname === `/${item.href.toLowerCase()}`
                  ? "text-primary"
                  : "text-foreground/70"
              }
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Search, User and Cart Icons */}
        <div className="hidden md:flex items-center space-x-3 relative">
          <Popover open={searchOpen}>
            <PopoverTrigger asChild>
              <div className="relative w-48">
                <Input
                  type="text"
                  placeholder="Search..."
                  className="border bg-white rounded-md px-3 py-1 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  onFocus={() => setSearchOpen(true)}
                  onFocusCapture={() => setSearchOpen(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  value={searchQuery}
                />
                <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </PopoverTrigger>

            {/* Search Results */}
            <PopoverContent
              ref={searchRef}
              align="start"
              className="bg-white w-[300px] md:w-[300px] max-h-[300px] overflow-y-auto p-2 mx-2 my-2"
            >
              <h3 className="text-gray-600 font-semibold text-sm mb-2">
                Products
              </h3>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                      router.push(`/products/${product._id}`);
                    }}
                    className="cursor-pointer hover:bg-primary/10 p-2 rounded-md transition-all flex gap-4 items-center"
                  >
                    {/* Product Image */}
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={50}
                      height={50}
                      className="w-12 h-12 object-cover rounded-md"
                    />

                    {/* Product Info */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">
                        {product.name}
                      </h4>
                      
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm p-2">
                  No results found
                </p>
              )}
            </PopoverContent>
          </Popover>

          {/* User and Cart Icons */}
          {!user.isLoggedIn ? 
          <Link href="/auth">
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </Link>
        : <UserProfileSheet />}
          
          <CartSheet />
          </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-background p-4 space-y-3 border-t w-full">
          {items.map((item) => (
            <Link
              key={item.name}
              href={`/${item.href.toLowerCase()}`}
              className="block text-sm"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="flex space-x-3 mt-3">
            <Link href="/auth" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/cart" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      )}

    </nav>

  );
}
