"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Minus, Plus, ShoppingBagIcon, Weight } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Product } from "@/lib/types";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { cartRefreshState, userState } from "@/store/atoms/user";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CartHandle } from "@/components/CartHandle";
import Link from "next/link";
import Loading from "@/components/Loading";
import { Input } from "@/components/ui/input";
import { BuyNowSheet } from "@/components/BuyNowSheet";

export default function ProductPage() {
  const [quantity, setQuantity] = useState(1);
  const [buyNowOpen, setBuyNowOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const { toast } = useToast();
  const params = useParams();
  const id = params.id;
  const user = useRecoilValue(userState);
  const setCartRefresh = useSetRecoilState(cartRefreshState);
  const [zipCode, setZipCode] = useState("")
  const [deliveryRate, setDeliveryRate] = useState(0)
  const [deliveryMessage, setDeliveryMessage] = useState("")
  const [estDelivery, setEstDelivery] = useState("")
console.log(zipCode)
  const fetchDeliveryRate = async () => {
      if (!zipCode) return;
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/checkout/direct-delivery-rate`, {
            userId: user._id,
            destinationPincode: zipCode,
            weight: product?.variants[selectedVariant].value
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
  
        setDeliveryRate(res.data.deliveryCharge); 
        setEstDelivery(res.data.estimatedDeliveryDays)
        setDeliveryMessage("")
      } catch (err) {
        console.log("Delivery rate fetch error:", err);
        setDeliveryMessage("Incorrect city pincode")
      }
    };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${id}`
        );
        setProduct(res.data.product);
        return res.data.product.category;

      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    
    fetchProduct()
  }, [id]);


  if (!product) {
    return (
      <Loading/>
    );
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

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/add/${user._id}`,
        payload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      toast({
        title: "Added to cart",
      });
    } catch (error) {
      console.error("Add to cart error:", error);
      toast({
        title: "Failed to add to cart",
        variant: "destructive",
      });
    } finally {
      setCartRefresh((prev) => prev + 1);
    }
  };

  const original = product.cutoffPrice[selectedVariant];
  const discounted = product.price[selectedVariant];
  const discountPercent = Math.round(
    ((original - discounted) / original) * 100
  );
  const router = useRouter();

  return (
    <div className="min-h-screen bg-primary/5">
      <Navbar />
      <CartHandle />
  
      {/* Product Section */}
      <div className="container mt-20 max-md:mt-12 mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="md:sticky md:top-32 max-h-[70vh] flex md:flex-row flex-col-reverse gap-4 overflow-hidden">
            {product.images.length > 1 && (
              <div className="flex md:flex-col flex-row gap-2 md:min-w-[100px] md:max-h-[500px] overflow-auto">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`${
                      selectedImage === idx
                        ? "border-primary"
                        : "border-gray-300"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`thumb-${idx}`}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover aspect-square"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
  
            <div className="w-full max-h-[500px] shadow-sm aspect-square overflow-hidden rounded-xl">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                width={500}
                height={500}
                unoptimized
              />
            </div>
          </div>
  
          {/* Product Info */}
          <div className="overflow-y-scroll top-2 space-y-12">
            <h1 className="text-4xl font-medium capitalize leading-tight">
              {/* Breadcrumbs */}
              <div className="text-sm flex flex-wrap gap-2">
                <Link className="hover:underline" href={"/products"}>
                  <p>All Products</p>
                </Link>
                {">"}
                <Link
                  className="hover:underline"
                  href={`/products/collection/${product.category?.name.toLowerCase()}`}
                >
                  <p>{product.category?.name}</p>
                </Link>
                {">"}
                <p>{product.name}</p>
              </div>
              {product.name}{" "}
              {product.hindiName && (
                <p className="text-lg text-gray-600">
                  ({product.hindiName})
                </p>
              )}
            </h1>
  
            <div className="space-y-2">
              <div className="text-3xl font-normal text-primary flex items-center flex-wrap gap-2">
                ₹{discounted}
                <span className="text-gray-500 line-through ml-2 text-lg">
                  ₹{original}
                </span>
                <span className="bg-gray-700 rounded-full text-sm text-white font-normal px-2 py-1">
                  {discountPercent}% OFF
                </span>
                <p className="text-sm text-gray-700">
                  MRP (Inclusive of all taxes)
                </p>
              </div>
  
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant, idx) => {
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedVariant(idx)}
                      className={`w-fit text-left px-8 py-2 rounded-full shadow-sm transition duration-200 ${
                        selectedVariant === idx
                          ? "bg-primary text-white"
                          : "bg-white"
                      }`}
                    >
                      <div className="font-medium">{variant.display}</div>
                    </button>
                  );
                })}
              </div>
            </div>
              
            <div>
              <div className="flex flex-row gap-4 w-fit px-1">
                <Input onChange={(e)=>{
                  setZipCode(e.target.value)
                }} placeholder="City Pincode"/>
                <Button onClick={()=>{fetchDeliveryRate()}} variant={"outline"}>Check Delivery</Button>
              </div>
              <div className="mt-1">
              {(deliveryMessage.length==0 && deliveryRate>0) && <p className="w-fit font-normal text-gray-900 rounded-md">Est. Shipping Cost: ₹{deliveryRate}</p>}
              {(deliveryMessage.length==0 && estDelivery.length>0) && <p className="w-fit font-normal text-gray-900 rounded-md">Est. Delivery by {estDelivery}</p>}
              {deliveryMessage.length>0 && <p className="text-red-600">{deliveryMessage}</p>}
            </div>

            </div>
  
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="flex flex-row items-center w-full gap-4">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  className="w-full cursor-pointer border border-primary bg-transparent hover:bg-primary/90 hover:text-white text-primary text-md py-5"
                  onClick={() => {
                    if(user.isLoggedIn){
                      addToCart()
                    } else {
                      router.push('/auth')
                    }
                  }}
                >
                  <ShoppingBagIcon className="mr-4" strokeWidth={1.2} /> ADD TO
                  CART
                </Button>
              </div>
              <BuyNowSheet
                open={buyNowOpen}
                setOpen={setBuyNowOpen}
                product={product}
                selectedVariant={product.variants[selectedVariant]}
                dimensions={product.dimensions[selectedVariant]}
                quantity={quantity}
                price={product.price[selectedVariant]}
              />
            </div>
  
            <ProductDetails
              product={product}
              selectedVariant={selectedVariant}
            />
          </div>
        </div>
      </div>
    </div>
  );
  
}

const ProductDetails = ({
  product,
  selectedVariant,
}: {
  product: Product;
  selectedVariant: number;
}) => {
  return (
    <div className="bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <Accordion type="multiple" className="w-full space-y-4">
          {/* Description */}
          <AccordionItem value="description">
            <AccordionTrigger className="text-xl font-semibold">
              Description
            </AccordionTrigger>
            <AccordionContent className="text-gray-700 text-md w-full">
              {product.description}
            </AccordionContent>
          </AccordionItem>

          {/* Product Details */}
          <AccordionItem value="product-details">
            <AccordionTrigger className="text-xl font-semibold">
              Product Details
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>
                  <strong>Storage:</strong> {product.storage}
                </li>
                {product.dimensions.length > 0 && (
                  <li>
                    <strong>Dimensions:</strong>
                    {` L: ${product.dimensions[selectedVariant].length} in, B: ${product.dimensions[selectedVariant].breadth} in, H: ${product.dimensions[selectedVariant].height} in`}
                  </li>
                )}
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Ingredients */}
          {product.ingredients.length > 0 && (
            <AccordionItem value="ingredients">
              <AccordionTrigger className="text-xl font-semibold">
                Ingredients
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {product.ingredients.map((item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Benefits */}
          {product.benefits.length > 0 && (
            <AccordionItem value="benefits">
              <AccordionTrigger className="text-xl font-semibold">
                Benefits
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {product.benefits.map((item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Usage Instructions */}
          {product.instructions.length > 0 && (
            <AccordionItem value="instructions">
              <AccordionTrigger className="text-xl font-semibold">
                Usage Instructions
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {product.instructions.map((item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </div>
    </div>
  );
};
