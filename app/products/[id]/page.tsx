"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Heart, Minus, Plus, ShoppingBagIcon, Weight } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Product } from "@/lib/types";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { cartRefreshState, userState } from "@/store/atoms/user";
import { Trash2 } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import ImageMagnifier from "@/components/ImageMagnifier";

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
  const [zipCode, setZipCode] = useState("");
  const [deliveryRateCod, setDeliveryRateCod] = useState(0);
  const [deliveryRatePrepaid, setDeliveryRatePrepaid] = useState(0);
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [estDelivery, setEstDelivery] = useState("");
  const router = useRouter();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [reviews, setReviews] = useState<
    { rating: number; comment: string; user?: { name: string } }[]
  >([]);
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews/${product?._id}`
        );
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchReviews();
  }, [product]);

  const fetchWishlist = async () => {
    if (!user.isLoggedIn) return;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wishlist/${user._id}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const data = await res.json();
    if (data.wishlist.length == 0) setWishlist([]);
    else setWishlist(data.wishlist.items);
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user.isLoggedIn) return;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wishlist/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const data = await res.json();
      if (data.wishlist.length == 0) setWishlist([]);
      else setWishlist(data.wishlist.items);
    };
    fetchWishlist();
  }, [user]);

  const toggleWishlist = async (productId: string) => {
    if (!user.isLoggedIn) {
      router.push("/auth");
      return;
    }

    const isWished = wishlist.includes(productId);

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wishlist/${
      isWished ? "remove" : "add"
    }/${user._id}`;
    const method = "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ productId }),
      });

      if (res.ok) {
        setWishlist((prev) =>
          isWished
            ? prev.filter((id) => id !== productId)
            : [...prev, productId]
        );
        toast({
          title: isWished ? "Removed from wishlist" : "Added to wishlist",
        });
      } else {
        toast({ title: "Failed", variant: "destructive" });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      fetchWishlist();
    }
  };

  const fetchDeliveryRateCOD = async () => {
    if (!zipCode) return;
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/checkout/direct-delivery-rate`,
        {
          userId: user._id,
          destinationPincode: zipCode,
          weight:
            (product?.variants[selectedVariant].value as number) * quantity,
          cod: "1",
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if ((product?.price[selectedVariant] as number) * quantity >= 1000) {
        setDeliveryRateCod(0);
      }
      setDeliveryRateCod(res.data.deliveryCharge);
      setEstDelivery(res.data.estimatedDeliveryDays);
      setDeliveryMessage("");
    } catch (err) {
      console.log("Delivery rate fetch error:", err);
      setDeliveryMessage("Incorrect city pincode");
    }
  };

  const fetchDeliveryRatePrepaid = async () => {
    if (!zipCode) return;
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/checkout/direct-delivery-rate`,
        {
          userId: user._id,
          destinationPincode: zipCode,
          weight:
            (product?.variants[selectedVariant].value as number) * quantity,
          cod: "0",
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if ((product?.price[selectedVariant] as number) * quantity >= 1000) {
        setDeliveryRatePrepaid(0);
      }
      setDeliveryRatePrepaid(res.data.deliveryCharge);
      setDeliveryMessage("");
    } catch (err) {
      console.log("Delivery rate fetch error:", err);
      setDeliveryMessage("Incorrect city pincode");
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

    fetchProduct();
  }, [id]);

  if (!product) {
    return <Loading />;
  }

  const addToCart = async () => {
    if (!product) return;

    try {
      const payload = {
        productId: product._id,
        quantity,
        priceIndex: selectedVariant,
        variant: product.variants[selectedVariant],
        dimensions: product.dimensions[selectedVariant],
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/add/${user._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        toast({
          title: "Added to cart",
        });
      } else {
        const errorData = await res.json();
        toast({
          title: errorData.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Add to cart error:", error);
      toast({
        title: "Failed to add to cart",
        description: error.message,
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

  return (
    <div className="min-h-screen bg-primary/5">
      <Navbar />
      <CartHandle />

      {/* Product Section */}
      <div className="container mt-20 max-md:mt-12 mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-12 max-md:gap-4">
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

            <div
              className="relative w-full max-h-[500px] aspect-square overflow-hidden rounded-xl"
              onMouseEnter={() => setIsHoveringImage(true)}
              onMouseLeave={() => setIsHoveringImage(false)}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                setZoomPosition({ x, y });
              }}
            >
              <Image
                src={product.images[selectedImage]}
                alt="Product"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="relative overflow-y-scroll top-2 max-md:space-y-8 md:space-y-12">
            {!isHoveringImage || window.innerWidth < 768 ? (
              // Product Section
              <>
                <div
                  className="md:hidden w-fit z-10 bg-white p-2 rounded-full shadow transition cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent routing to product detail
                    toggleWishlist(product._id);
                  }}
                >
                  {wishlist.includes(product._id) ? (
                    <Heart className="text-red-500 fill-red-500 w-7 h-7" />
                  ) : (
                    <Heart className="text-gray-400 w-7 h-7" />
                  )}
                </div>

                <h1 className="text-4xl max-md:text-2xl font-medium capitalize leading-tight">
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

                <div className="space-y-4">
                  <div className="flex items-center gap-4 w-fit px-1">
                    <Input
                      placeholder="City Pincode"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        fetchDeliveryRateCOD();
                        fetchDeliveryRatePrepaid();
                      }}
                    >
                      Check Delivery
                    </Button>
                  </div>

                  {(deliveryRateCod > 0 ||
                    deliveryRatePrepaid > 0 ||
                    estDelivery ||
                    deliveryMessage) && (
                    <Table className="w-fit text-sm border border-muted rounded-md">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {deliveryRateCod > 0 && (
                          <TableRow>
                            <TableCell>Shipping Cost (COD)</TableCell>
                            <TableCell>₹{deliveryRateCod}</TableCell>
                          </TableRow>
                        )}
                        {deliveryRatePrepaid > 0 && (
                          <TableRow>
                            <TableCell>Shipping Cost (Prepaid)</TableCell>
                            <TableCell>₹{deliveryRatePrepaid}</TableCell>
                          </TableRow>
                        )}
                        {estDelivery && (
                          <TableRow>
                            <TableCell>Estimated Delivery</TableCell>
                            <TableCell>{estDelivery}</TableCell>
                          </TableRow>
                        )}
                        {deliveryMessage && (
                          <TableRow>
                            <TableCell className="text-red-600 font-medium">
                              Error
                            </TableCell>
                            <TableCell className="text-red-600">
                              {deliveryMessage}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
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
                        if (user.isLoggedIn) {
                          addToCart();
                        } else {
                          router.push("/auth");
                        }
                      }}
                    >
                      <ShoppingBagIcon className="mr-4" strokeWidth={1.2} /> ADD
                      TO CART
                    </Button>
                  </div>
                  {product.stock == 0 ? (
                    <Button
                      disabled
                      className="w-full bg-red-700 text-white hover:bg-red-600 hover:text-white"
                    >
                      OUT OF STOCK
                    </Button>
                  ) : (
                    <BuyNowSheet
                      open={buyNowOpen}
                      setOpen={setBuyNowOpen}
                      product={product}
                      selectedVariant={product.variants[selectedVariant]}
                      dimensions={product.dimensions[selectedVariant]}
                      quantity={quantity}
                      price={product.price[selectedVariant]}
                    />
                  )}
                </div>
              </>
            ) : (
              // Zoomed Image Section
              <div className="max-md:hidden w-full h-[400px] relative overflow-hidden">
              <div
                className="absolute w-[100%] h-[200%] border-dashed border-gray-500 border shadow-lg" 
                style={{
                  backgroundImage: `url(${product.images[selectedImage]})`,
                  backgroundSize: "cover",
                  backgroundPosition: `${zoomPosition.x * 100}% ${zoomPosition.y * 60}%`,  
                  transform: "translate(-25%, -25%)",
                  transition: "background-position 0.2s ease-out",  // Smooth transition for better effect
                }}
              />
            </div>

            )}

            <ProductDetails
              product={product}
              selectedVariant={selectedVariant}
            />
          </div>
        </div>
      </div>
      {/* Reviews Section */}
      <ReviewSection
        reviews={reviews}
        currentUser={user}
        productId={product._id}
      />
    </div>
  );
}

const ReviewSection = ({ reviews, currentUser, productId }: any) => {
  const [userReview, setUserReview] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [allReviews, setAllReviews] = useState(reviews);
  const { toast } = useToast();
  const user = useRecoilValue(userState);
  const router = useRouter();

  const currentUserReview = allReviews.find(
    (rev: any) => rev.user?._id === currentUser?._id
  );
  const otherReviews = allReviews.filter(
    (rev: any) => rev.user?._id !== currentUser?._id
  );

  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews/${productId}`
      );
      setAllReviews(res.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews/${productId}`
        );
        setAllReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchReviews();
  }, [productId]);

  const submitReview = async () => {
    if (!user.isLoggedIn) {
      router.push("/auth");
      return;
    }

    if (userRating === 0 || userReview.trim() === "") {
      toast({
        title: "Please give a rating and write a review",
        variant: "destructive",
      });
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews/${user._id}`,
        {
          productId: productId,
          rating: userRating,
          comment: userReview.trim(),
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      toast({ title: "Review submitted!" });
      setUserRating(0);
      setUserReview("");
    } catch (err) {
      console.error("Submit review error:", err);
      let errorMessage = "Failed to submit review";

      if (err && typeof err === "object" && "response" in err) {
        const response = (err as any).response;
        if (response?.data?.message) {
          errorMessage = response.data.message;
        }
      }

      toast({ title: errorMessage, variant: "destructive" });
    } finally {
      fetchReviews();
    }
  };

  const deleteReview = async () => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews/${productId}/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setAllReviews(otherReviews);
      toast({ title: "Review deleted!" });
    } catch (err) {
      console.error("Delete review error:", err);
      const errorMessage =
        (err as any)?.response?.data?.message || "Failed to delete review";
      toast({ title: errorMessage, variant: "destructive" });
    } finally {
      fetchReviews();
    }
  };

  return (
    <div className="mx-auto container md:px-20 px-6 md:mt-20 mt-6 border-t py-10">
      <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>

      {/* Review Input */}
      <div className="space-y-4 mb-10">
        <div className="flex gap-2 items-center">
          <span className="text-md text-gray-700 font-medium">RATE NOW</span>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setUserRating(star)}
              className={`text-xl ${
                userRating >= star ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        <Textarea
          placeholder="Write your review here..."
          className="w-full border-gray-300 focus:border-primary focus:ring focus:ring-primary rounded-md"
          maxLength={500}
          value={userReview}
          rows={3}
          onChange={(e) => setUserReview(e.target.value)}
        />
        <Button onClick={submitReview}>Submit Review</Button>
      </div>

      {/* All Reviews */}
      <div className="space-y-2">
        {allReviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <>
            {/* User's Review */}
            {currentUserReview && (
              <div className="bg-white p-4 rounded-md shadow-sm border relative">
                <div className="flex items-center gap-1 text-yellow-400">
                  {"★".repeat(currentUserReview.rating)}
                  <span className="text-sm text-gray-500 ml-2">
                    {currentUserReview.user?.name || "You"}
                  </span>
                  <Trash2
                    className="ml-auto text-gray-500 hover:text-red-500 cursor-pointer"
                    size={18}
                    onClick={deleteReview}
                    strokeWidth={1.2}
                  />
                </div>
                <p className="text-md max-md:text-sm mt-2 text-gray-700">
                  {currentUserReview.comment}
                </p>
              </div>
            )}

            {/* Other Reviews */}
            {otherReviews.map((rev: any, i: number) => (
              <div key={i} className="bg-white p-4 rounded-md shadow-sm border">
                <div className="flex items-center gap-1 text-yellow-400">
                  {"★".repeat(rev.rating)}
                  <span className="text-sm text-gray-500 ml-2">
                    {rev.user?.name || "Anonymous"}
                  </span>
                </div>
                <p className="text-md max-md:text-sm mt-2 text-gray-700">
                  {rev.comment}
                </p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

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
