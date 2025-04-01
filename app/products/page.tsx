"use client";
import { Navbar } from "@/components/Navbar";
import { products, categories } from "@/lib/data";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
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
  Millets: <Leaf className="w-6 h-6 text-black" />,
  Rice: <Package className="w-6 h-6 text-black" />,
  Sweetners: <Utensils className="w-6 h-6 text-black" />,
  Pulses: <ShoppingBag className="w-6 h-6 text-black" />,
  Seeds: <Leaf className="w-6 h-6 text-black" />,
  Beverages: <Package className="w-6 h-6 text-black" />,
  Tea: <Utensils className="w-6 h-6 text-black" />,
  Salt: <ShoppingBag className="w-6 h-6 text-black" />,
};

const images = [
  '/products-banners/products-banner-1.jpeg',
  '/products-banners/products-banner-2.jpeg',
  '/products-banners/products-banner-3.jpg',
  '/products-banners/products-banner-4.jpg',
];

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
      selectedCategory === "All" ? true : product.category === selectedCategory
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

      {/* Carousal */}
      <div className="mt-20 relative md:px-16 hidden">
      <Carousel
      opts={{
        loop: true,
      }}>
        <CarouselContent>
        {images.map((src, index) => (
          <CarouselItem key={index}>
            <Image
              src={src}
              alt={`Hero Banner ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
              width={1000}
              height={200}
            />
          </CarouselItem>
        ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      </div>
      

      <div className="md:flex md:flex-row md:gap-12 max-md:mt-12 md:px-16 pt-4 pb-12">
        

        {/* Categories Filter */}
        <div className="border-r md:w-[500px] flex md:flex-col justify-center md:justify-start md:items-flex-start overflow-x-auto pl-4 py-3 mb-6 md:mb-12">
          {/* "All" Category */}
          <div className="w-full cursor-pointer flex flex-col md:flex-row items-center gap-1"
          onClick={() => setSelectedCategory("All")}>
            <div
              className={`cursor-pointer flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full shadow-xs transition-all ${
                selectedCategory === "All" ? "text-primary" : "text-black"
              }`}
            >
              <Filter className="w-6 h-6" />
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
            <div
              key={category.name}
              className="w-full cursor-pointer flex flex-col items-center justify-start md:flex-row"
              onClick={() => setSelectedCategory(category.name)}
            >
              <div
                className={`flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full shadow-xs transition-all ${
                  selectedCategory === category.name
                    ? "text-primary"
                    : "text-black"
                }`}
              >
                {categoryIcons[category.name] || <Leaf className="w-6 h-6" />}
              </div>
              <span
                className={`cursor-pointer text-xs md:text-sm font-medium ${
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
        <div className="flex flex-col overflow-scroll max-h-screen gap-4">
          <h3 className="px-4 text-xl md:text-2xl font-medium mb-4">
            {selectedCategory}
          </h3>
          <div className="grid grid-cols-1 max-md:px-6 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const variantIndex = selectedVariants[product.id] ?? 0;

              return (
                <div
                  key={product.id}
                  className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md border transition-shadow flex md:flex-col flex-row h-full"
                >
                  {/* Product Image */}
                  <Link href={`/products/${product.id}`}>
                    <div className="relative cursor-pointer">
                      <Image
                        src={product.image}
                        alt={product.name}
                        className="w-full h-56 object-cover"
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
                  <div className="p-4 flex flex-col max-md:justify-between flex-grow">
                    {/* Title */}
                    <div className="flex flex-col justify-center md:min-h-[24px] text-center">
                      <h3 className="font-medium max-md:text-md max-md:text-left text-lg">
                        {product.name}
                      </h3>
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
                          View
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
    </div>
  );
}
