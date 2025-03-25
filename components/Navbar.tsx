"use client";

import Link from "next/link";
import { ShoppingCart, User, Leaf, Menu, Search } from "lucide-react";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import Image from "next/image";
import { products } from "@/lib/data";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const items = [
  { name: "Home", href: "/" },
  { name: "Products", href: "products" },
  { name: "Gifting", href: "gifting" },
  { name: "About", href: "about" },
  { name: "News & Blog", href: "content" },
  { name: "Your Choice", href: "choice" },
  { name: "Contact", href: "contact" },
]

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
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

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-background border-b">
      <div className="z-50 container max-w-full flex h-20 items-center justify-between px-6 md:px-12">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2 text-base font-semibold">
            <Image src="/logo.jpeg" alt="Grab Gardenn" width={30} height={30} className="h-10 w-10" />
            <span className="hidden md:inline-block text-lg text-primary">Grab Gardenn</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {items.map((item) => (
            <Link key={item.name} href={`/${item.href}`} className={pathname === `/${item.href.toLowerCase()}` ? "text-primary" : "text-foreground/60"}>
              {item.name}
            </Link>
          ))}
        </div>

        {/* Search, User and Cart Icons */}
        <div className="hidden md:flex items-center space-x-3 relative">
          <Popover open={searchOpen} >
            <PopoverTrigger asChild>
              <div className="relative w-48">
                <Input
                  type="text"
                  placeholder="Search..."
                  className="border rounded-md px-3 py-1 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  onFocus={() => setSearchOpen(true)}
                  onFocusCapture={()=>setSearchOpen(true)}
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
              className="w-[300px] md:w-[400px] max-h-[300px] overflow-y-auto p-2 mx-2 my-2"
            >
              <h3 className="text-gray-600 font-semibold text-sm mb-2">Products</h3>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                      router.push(`/products/${product.id}`);
                    }}
                    className="cursor-pointer hover:bg-primary/10 p-2 rounded-md transition-all flex gap-4 items-center"
                  >
                    {/* Product Image */}
                    <Image src={product.image} alt={product.name} width={50} height={50} className="w-12 h-12 object-cover rounded-md" />

                    {/* Product Info */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800">{product.name}</h4>
                      <p className="text-xs text-gray-600 line-clamp-2">{product.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm p-2">No results found</p>
              )}
            </PopoverContent>
          </Popover>

          {/* User and Cart Icons */}
          <Link href="/auth">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-background p-4 space-y-3 border-t w-full">
          {items.map((item) => (
            <Link key={item.name} href={`/${item.href.toLowerCase()}`} className="block text-sm" onClick={() => setIsOpen(false)}>
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
