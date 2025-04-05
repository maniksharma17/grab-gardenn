"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Minus, Plus, ShoppingBagIcon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import axios from "axios";
import { Product } from "@/lib/types";
import { useRecoilValue } from "recoil";
import { userState } from "@/store/atoms/user";

export default function ProductPage() {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const { toast } = useToast();
  const params = useParams();
  const id = params.id;
  const user = useRecoilValue(userState);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${id}`);
        setProduct(res.data.product);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  }

  const addToCart = async () => {
    if (!product) return;
  
    try {
      const payload = {
        productId: product._id,
        quantity,
        price: product.price[selectedVariant],
        variant: product.variants[selectedVariant],
        dimensions: product.dimensions[selectedVariant], 
      };
  
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/add/${user._id}`, payload, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`,
        },

      });
  
      toast({
        title: "Added to cart",
        description: `${quantity} x ${product.name} (${product.variants[selectedVariant].display}) added to your cart.`,
      });
    } catch (error) {
      console.error("Add to cart error:", error);
      toast({
        title: "Failed to add to cart",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };
  

  const original = product.cutoffPrice[selectedVariant];
  const discounted = product.price[selectedVariant];
  const discountPercent = Math.round(((original - discounted) / original) * 100);
  

  return (
    <div className="mt-20 min-h-screen">
      <Navbar />

      {/* Product Section */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="flex gap-4">
            {product.images.length > 1 && (
              <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded border ${selectedImage === idx ? "border-primary" : "border-gray-300"}`}
                  >
                    <Image src={img} alt={`thumb-${idx}`} width={80} height={80} className="object-cover rounded" unoptimized />
                  </button>
                ))}
              </div>
            )}

            <div className="w-full aspect-square overflow-hidden rounded-lg shadow-md">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                width={600}
                height={600}
                unoptimized
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6 relative">
            <h1 className="text-4xl font-medium capitalize leading-tight">{product.name}</h1>
            {product.hindiName && <p className="text-lg text-gray-600">({product.hindiName})</p>}
            <p className="text-md text-gray-700">
              {showFullDesc ? product.description : `${product.description.slice(0, 200)}...`}
              {product.description.length > 200 && (
                <button className="text-primary ml-2 underline" onClick={() => setShowFullDesc(!showFullDesc)}>
                  {showFullDesc ? "Read Less" : "Read More"}
                </button>
              )}
            </p>

            <div className="space-y-2">
              <div className="text-2xl font-normal text-primary flex items-center">
                ₹{discounted}
                <span className="text-gray-500 line-through ml-2 text-lg">₹{original}</span>
                <span className="ml-3 bg-primary rounded-full text-sm text-white font-normal px-2">{discountPercent}% OFF</span>
              </div>

              <div className="flex flex-row gap-2">
              {product.variants.map((variant, idx) => {
                const variantPrice = product.price[idx];
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedVariant(idx)}
                    className={`w-full text-left p-3 rounded-md shadow-xl transition ${
                      selectedVariant === idx ? "border" : ""
                    }`}
                  >
                    <div className="font-medium">{variant.display}</div>
                    <div>₹{variantPrice}</div>
                  </button>
                );
              })}
              </div>
              
            </div>

            <div className="md:absolute bottom-0 left-0 right-0 flex flex-col items-center gap-2 w-full">
              <div className="flex flex-row items-center w-full gap-2">
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-medium">{quantity}</span>
                  <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button className="w-full cursor-pointer border border-primary bg-transparent hover:bg-primary/90 hover:text-white text-primary text-md py-3" onClick={addToCart}>
                 <ShoppingBagIcon className="mr-4" strokeWidth={1.2} /> ADD TO CART
                </Button>

              </div>
              <Button className="w-full cursor-pointer shadow-xl bg-primary hover:bg-primary/90 text-white text-md py-3" onClick={addToCart}>
                BUY IT NOW
              </Button>
            </div>

            
            
            <div className="flex flex-col gap-2 w-1/4">
              
              
            </div>
            
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="bg-gray-50 py-10">
        <div className="container mx-auto px-4 space-y-8">
          <div>
            <h3 className="font-semibold text-2xl mb-4">Product Details</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong>Storage:</strong> {product.storage}</li>
              {product.dimensions.length > 0 && (
                <li><strong>Dimensions:</strong>{`L: ${product.dimensions[selectedVariant].length} in, B: ${product.dimensions[selectedVariant].breadth} in, H: ${product.dimensions[selectedVariant].height} in`}</li>
              )}
            </ul>
          </div>

          {product.ingredients.length > 0 && (
            <div>
              <h3 className="font-semibold text-2xl mb-4">Ingredients</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                {product.ingredients.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {product.benefits.length > 0 && (
            <div>
              <h3 className="font-semibold text-2xl mb-4">Benefits</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                {product.benefits.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {product.instructions.length > 0 && (
            <div>
              <h3 className="font-semibold text-2xl mb-4">Usage Instructions</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                {product.instructions.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}