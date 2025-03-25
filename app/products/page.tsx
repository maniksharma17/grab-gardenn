"use client";
import { Navbar } from "@/components/Navbar";
import { products, categories } from "@/lib/data";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Filter,
  Leaf,
  Package,
  ShoppingBag,
  Star,
  Utensils,
} from "lucide-react";
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

const categoryIcons: Record<string, any> = {
  Flour: <Leaf className="w-6 h-6 text-black" />,
  Grains: <Package className="w-6 h-6 text-black" />,
  Pulses: <Utensils className="w-6 h-6 text-black" />,
  Seeds: <ShoppingBag className="w-6 h-6 text-black" />,
  Spices: <Leaf className="w-6 h-6 text-black" />,
  Sweeteners: <Package className="w-6 h-6 text-black" />,
  Tea: <Utensils className="w-6 h-6 text-black" />,
  Beverages: <ShoppingBag className="w-6 h-6 text-black" />,
};

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [selectedVariants, setSelectedVariants] = useState<{
    [key: number]: string;
  }>({});
  const { toast } = useToast();

  const handleVariantChange = (productId: number, variant: string) => {
    setSelectedVariants((prev) => ({ ...prev, [productId]: variant }));
  };

  useEffect(() => {
    const productsList = products.filter((product) =>
      selectedCategory === "All"
        ? true
        : product.category === selectedCategory
    );
    setFilteredProducts(productsList);
  }, [selectedCategory]);

  const handleAddToCart = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const variantIndex = selectedVariants[productId] ?? 0;
    const variant = product.variants[Number(variantIndex)];
    const price = product.price[Number(variantIndex)];

    toast({
      title: "Added to cart",
      description: `${product.name} (${variant}) - ₹${price} added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="mt-16 max-md:mt-12 container mx-auto py-12">
        {/* Categories Filter */}
        <div className="flex justify-center overflow-x-auto px-4 py-3 space-x-6 md:gap-4 mb-6 md:mb-12">
          {/* "All" Category */}
          <div className="flex flex-col items-center">
            <div
              onClick={() => setSelectedCategory("All")}
              className={`cursor-pointer flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full shadow-xs transition-all
      ${
        selectedCategory === "All"
          ? "bg-primary text-white"
          : "bg-secondary text-gray-700 hover:bg-primary hover:text-white"
      }`}
            >
              <Filter className="w-6 h-6 text-black" />
            </div>
            <span
              className={`mt-1 text-xs md:text-sm font-medium ${
                selectedCategory === "All" ? "text-primary" : "text-gray-700"
              }`}
            >
              All
            </span>
          </div>

          {/* Other Categories */}
          {categories.map((category) => (
            <div key={category.name} className="flex flex-col items-center">
              <div
                onClick={() => setSelectedCategory(category.name)}
                className={`cursor-pointer flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full shadow-xs transition-all
        ${
          selectedCategory === category.name
            ? "bg-primary text-white"
            : "bg-secondary text-black hover:bg-primary hover:text-white"
        }`}
              >
                {categoryIcons[category.name] || (
                  <Leaf
                    className={`w-6 h-6`}
                    color={selectedCategory === category.name ? "black" : "red"}
                  />
                )}
              </div>
              <span
                className={`mt-1 text-xs md:text-sm font-medium ${
                  selectedCategory === category.name
                    ? "text-primary"
                    : "text-gray-700"
                }`}
              >
                {category.name}
              </span>
            </div>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 max-md:px-6 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const variantIndex = selectedVariants[product.id] ?? 0;

            return (
              <div
                key={product.id}
                className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md border transition-shadow flex flex-col h-full"
              >
                {/* Product Image */}
                <Link href={`/products/${product.id}`}>
                  <div className="relative cursor-pointer">
                    <Image
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                      width={300}
                      height={200}
                    />
                    <div className="absolute top-2 right-2">
                      <span className="flex flex-row items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm">
                        <p className="font-semibold text-gray-600">
                          {product.rating}
                        </p>
                        <Star
                          className="w-4 h-4 text-yellow-500"
                          fill="currentColor"
                        />
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Product Details */}
                <div className="p-4 flex flex-col flex-grow">
                  {/* Title */}
                  <div className="flex flex-col justify-center min-h-[24px] text-center">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                  </div>

                  {/* Price & Variants */}
                  <div className="flex justify-between items-center px-2 mt-4">
                    <div className="flex items-center gap-2 text-lg font-medium">
                      <p className="text-primary">
                        ₹{product.price[Number(variantIndex)]}
                      </p>
                      <p className="text-gray-500 text-sm line-through">
                        ₹{product.cutoffPrice[Number(variantIndex)]}
                      </p>
                    </div>
                    {/* Variant Selector */}
                    <div className="w-1/2">
                      <Select
                        onValueChange={(value) =>
                          handleVariantChange(product.id, value)
                        }
                        defaultValue="0"
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Variant" />
                        </SelectTrigger>
                        <SelectContent>
                          {product.variants.map((variant, index) => (
                            <SelectItem key={index} value={index.toString()}>
                              {variant}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-4 flex gap-2">
                    <Link href={`/products/${product.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        View Product
                      </Button>
                    </Link>
                    <Button
                      variant="secondary"
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={() => handleAddToCart(product.id)}
                    >
                      Add to Cart
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
