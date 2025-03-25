"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { products } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function ProductPage() {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const { toast } = useToast();
  const params = useParams();
  const id = params.id;

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return <div>Product not found</div>;
  }

  const addToCart = () => {
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} added to your cart`,
    });
  };

  return (
    <div className="mt-20 min-h-screen">
      <Navbar />

      {/* Product Image & Checkout Section */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="overflow-hidden flex justify-center">
            <Image
              src={product.image}
              alt={product.name}
              className="w-full max-h-[450px] object-contain"
              width={600}
              height={450}
              unoptimized
            />
          </div>

          {/* Product Info & Checkout */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            {product.hindiName && <p className="text-lg text-gray-600">{product.hindiName}</p>}

            {/* Price & Variants */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xl font-bold text-primary">
                ₹{product.price[selectedVariant]}
                <span className="text-gray-500 line-through text-lg">₹{product.cutoffPrice[selectedVariant]}</span>
              </div>

              <h3 className="font-semibold">Select Variant:</h3>
              <div className="flex gap-3">
                {product.variants.map((variant, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedVariant(index)}
                    className={`px-4 py-2 rounded-md border ${
                      selectedVariant === index ? "bg-primary text-white" : "border-gray-300 text-gray-700"
                    } hover:bg-primary hover:text-white transition`}
                  >
                    {variant}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-lg font-medium">{quantity}</span>
              <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Add to Cart */}
            <Button className="w-full bg-primary hover:bg-primary/90 text-white text-lg py-3" onClick={addToCart}>
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      {/* Product Details Section - Full Width Below */}
      <div className="bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          {/* Product Details */}
          <div className="border-b pb-6">
            <h3 className="font-semibold text-2xl mb-4">Product Details</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong>Category:</strong> {product.category}</li>
              <li><strong>Storage Instructions:</strong> {product.storage}</li>
            </ul>
          </div>

          {/* Ingredients */}
          <div className="border-b py-6">
            <h3 className="font-semibold text-2xl mb-4">Ingredients</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {product.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div className="py-6">
            <h3 className="font-semibold text-2xl mb-4">Benefits</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {product.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
