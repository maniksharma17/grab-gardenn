"use client";

import Link from "next/link";
import { ShoppingCart, User, Menu, Search, PackageSearch } from "lucide-react";
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
import { CartSheet } from "@/components/CartSheet";
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

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/${user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCartItems(response.data.cart.items.length);
      } catch (error) {
        console.log("Error fetching cart:", error);
      }
    };
    fetchCart();
  }, [user]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`,
          { withCredentials: true }
        );
        setProducts(response.data.products);
      } catch (error) {
        console.log("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

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

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isMounted) return <Loading />;

  return (
    <nav className="fixed md:left-20 md:right-20 left-2 right-2 md:top-4 top-1 mx-auto z-40 md:shadow-md rounded-xl bg-white border border-gray-300 max-w-full">
      <div className="px-4 flex h-20 items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <Image
            src="https://grabgardenn-storage.s3.ap-south-1.amazonaws.com/logos/grab-gardenn-logo.png"
            alt="Grab Gardenn"
            width={95}
            height={95}
            className="md:w-24 md:h-24 w-16 h-16"
          />
        </Link>

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

        {/* Desktop Search + Icons */}
        <div className="hidden md:flex items-center space-x-3 relative">
          <Popover open={searchOpen}>
            <PopoverTrigger asChild>
              <div className="relative w-48">
                <Input
                  type="text"
                  placeholder="Search..."
                  className="border bg-white rounded-md px-3 py-1 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  onFocus={() => setSearchOpen(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  value={searchQuery}
                />
                <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </PopoverTrigger>
            <PopoverContent
              ref={searchRef}
              align="start"
              className="bg-white w-[300px] max-h-[300px] overflow-y-auto p-2 mx-2 my-2"
            >
              <h3 className="text-gray-600 font-semibold text-sm mb-2">Products</h3>
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
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={50}
                      height={50}
                      className="w-12 h-12 object-cover rounded-md"
                    />
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

          {!user.isLoggedIn ? (
            <Link href="/auth">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <UserProfileSheet />
          )}

          <CartSheet />
          
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-slate-50 p-4 space-y-3 border rounded-b">
          {/* Mobile Search */}
          <div className="relative">
            <Input
              type="text"
              placeholder="Search products..."
              className="pl-3 pr-8 py-2 text-sm border rounded-md w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            {searchQuery.length > 0 && (
              <div className="absolute top-12 left-0 right-0 bg-white border rounded-md max-h-60 overflow-y-auto z-50 shadow-md">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => {
                        router.push(`/products/${product._id}`);
                        setIsOpen(false);
                        setSearchQuery("");
                      }}
                      className="flex items-center gap-3 p-2 hover:bg-primary/10 cursor-pointer"
                    >
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="rounded-md object-cover w-10 h-10"
                      />
                      <span className="text-sm">{product.name}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm p-2 text-muted-foreground">
                    No results found
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Mobile Nav Links */}
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

          {/* Mobile Icons */}
          <div className="flex space-x-1 mt-3">
            {!user.isLoggedIn ? (
              <Link href="/auth" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <UserProfileSheet />
            )}
            <CartSheet />
            
          </div>
        </div>
      )}
    </nav>
  );
}
