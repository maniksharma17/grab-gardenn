"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { cartRefreshState, userState } from "@/store/atoms/user";
import { CartItem } from "@/lib/types";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CheckCircle2, CircleAlert, CreditCard, Mail, MinusCircle, Phone, PlusCircle, Truck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { validateAddress } from "@/lib/utils";
import { DELIVERY_DISCOUNT } from "@/lib/config";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Image from "next/image";

export const CheckoutSheet = ({
  setCart,
}: {
  setCart: (x: boolean) => void;
}) => {
  const user = useRecoilValue(userState);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [deliveryRate, setDeliveryRate] = useState<number>(0);
  const [courierId, setCourierId] = useState(null);
  const [estDelivery, setEstDelivery] = useState("null");
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoName, setPromoName] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [finalAmount, setFinalAmount] = useState(0);
  const [promoCodes, setPromoCodes] = useState([]);

  useEffect(() => {
    const fetchPromos = async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/promo-code/`,
        {
          headers: {
            Authorization: "Bearer " + user.token,
          },
        }
      );
      setPromoCodes(res.data);
    };
    fetchPromos();
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    const fetchDeliveryRate = async () => {
      if (!selectedAddress?.zipCode) return;

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/checkout/delivery-rate`,
          {
            userId: user._id,
            destinationPincode: selectedAddress.zipCode,
            cod: paymentMethod === "cod" ? "1" : "0",
            subtotal: subtotal,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        setDeliveryRate(res.data.deliveryCharge);
        setCourierId(res.data.courierId);
        setEstDelivery(res.data.estimatedDeliveryDays);
        setDeliveryMessage("");
      } catch (err) {
        console.log("Delivery rate fetch error:", err);
        setDeliveryMessage("Incorrect city pincode");
        setDeliveryRate(0);
      }
    };

    fetchDeliveryRate();
  }, [user, subtotal, selectedAddress, paymentMethod]);

  const setCartRefresh = useSetRecoilState(cartRefreshState);
  const cartRefresh = useRecoilValue(cartRefreshState);

  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    street: "",
    streetOptional: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const handleAddNewAddress = () => {
    const result = validateAddress(newAddress);
    if (!result.isValid) {
      toast({ title: result.message, variant: "destructive" });
      return;
    }
    // Everything is valid, so now set the address
    setSelectedAddress(newAddress);
    toast({ title: "New Address Selected", variant: "default" });

    setShowForm(false);
  };

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const discountedDeliveryRate =
    deliveryRate > DELIVERY_DISCOUNT
      ? deliveryRate - DELIVERY_DISCOUNT
      : deliveryRate;

  useEffect(() => {
    if (subtotal >= 1000) {
      setFinalAmount(subtotal);
    } else {
      setFinalAmount(subtotal + discountedDeliveryRate);
    }
  }, [subtotal, discountedDeliveryRate]);


  const removePromoCode = () => {
    setPromoCode("");

    setFinalAmount(prev => prev + discount);
    setDiscount(0);
  }

  useEffect(() => {
    const reapplyPromo = async () => {
      if (!promoCode) return;

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/promo-code/apply`,
          {
            code: promoCode,
            total: subtotal,
            userId: user._id,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if(res.data.error) {
          setPromoError(res.data.error);
          setDiscount(0);
          return;
        }

        setDiscount(res.data.discountAmount);
        setPromoName(res.data.code);

        const amount = Math.max(subtotal - res.data.discountAmount, 0);
        const final =
          subtotal >= 1000 ? amount : amount + discountedDeliveryRate;
        setFinalAmount(final);

        setPromoError("");
      } catch (error) {
        console.log("Promo reapply error", error);
        setDiscount(0);
        const message =
          (error as any)?.response?.data?.error ||
          (error instanceof Error ? error.message : "Something went wrong");
        setPromoError(message);
      }
    };

    reapplyPromo();
  }, [subtotal, promoCode, discountedDeliveryRate, user]);

  useEffect(() => {
    const fetchCart = async () => {
      if (!token || !user?._id) return;
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/${user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCartItems(res.data.cart.items);
      } catch (err) {
        console.log("Cart fetch error", err);
      }
    };
    fetchCart();
  }, [user, token, cartRefresh]);

  useEffect(() => {
    if (user?.address?.length > 0) {
      setSelectedAddress(user.address[0]);
    }
  }, [user]);

  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    if (!selectedAddress) {
      toast({ title: "Please select an address", variant: "destructive" });
      setLoading(false);
      return;
    }

    if (paymentMethod === "razorpay") {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/checkout/create-checkout-session/${user._id}`,
          {
            deliveryRate: discountedDeliveryRate,
            promoCodeDiscount: discount,
          },
          {
            headers: {
              Authorization: "Bearer " + user.token,
            },
            withCredentials: true,
          }
        );

        const { orderId, keyId } = res.data;

        const options = {
          key: keyId,
          currency: "INR",
          name: "Grab Gardenn Healthy Foods",
          description: "Order Payment",
          order_id: orderId,
          handler: async function (response: any) {
            toast({ title: "Payment Successful" });
            const res = await axios.post(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/checkout/verify-payment/${user._id}`,
              {
                ...response,
                shippingAddress: selectedAddress,
                deliveryRate: discountedDeliveryRate,
                promoCode: promoCode,
                promoCodeDiscount: discount,
              },
              { headers: { Authorization: `Bearer ${user.token}` } }
            );

            // SHIPROCKET CONFIG
            if (res.data.success) {
              const shiprocketResponse = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/checkout/place-shiprocket-prepaid-order`,
                {
                  orderId: res.data.order._id,
                  paymentMethod: "Prepaid",
                  courierId: courierId,
                },
                {
                  headers: { Authorization: `Bearer ${user.token}` },
                }
              );

              if (shiprocketResponse.data.success) {
                console.log(shiprocketResponse);

                toast({
                  title: "Order has been placed successfully. 🎉",
                  description:
                    "Order ID: " + shiprocketResponse.data.shiprocketOrderId,
                });
                setCartRefresh((prev) => prev + 1);
              }
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
          },
          theme: {
            color: "#22c55e",
          },
          modal: {
            // 👇 Fix z-index here

            escape: true,
          },
        };
        setOpen(false);
        setCart(false);
        const razor = new (window as any).Razorpay(options);

        razor.open();
      } catch (err) {
        console.log("Razorpay error", err);
        toast({ title: "Payment failed", variant: "destructive" });
      } finally {
        setLoading(false);
        setOpen(false);
        setCart(false);
        setCartRefresh((prev) => prev + 1);
        setCartRefresh((prev) => prev + 1);
        setOpen(false);
        setCart(false);
        setLoading(false);
        setDiscount(0);
        setPromoCode("");
        setPromoName("");
        setFinalAmount((prev) => prev + discount);
      }
    } else {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/checkout/place-shiprocket-cod-order/${user._id}`,
          {
            shippingAddress: selectedAddress,
            deliveryRate: discountedDeliveryRate,
            courierId: courierId,
            promoCode: promoCode,
            promoCodeDiscount: discount,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          toast({
            title: "Order has been placed successfully. 🎉",
            description: "OrderID: " + response.data.shiprocketOrderId,
          });
        }
      } catch (err) {
        console.log("COD error", err);
        toast({ title: "Order failed", variant: "destructive" });
      } finally {
        setCartRefresh((prev) => prev + 1);
        setOpen(false);
        setCart(false);
        setLoading(false);
        setDiscount(0);
        setPromoCode("");
        setPromoName("");
        setFinalAmount((prev) => prev + discount);
      }
    }
  };

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${newAddress.zipCode}`
        );
        const data = await response.json();
        if (data[0].Status === "Success") {
          const postOffice = data[0].PostOffice[0];
          setNewAddress((prev) => ({
            ...prev,
            city: postOffice.Block || postOffice.District,
            state: postOffice.Circle,
            country: postOffice.Country,
          }));
        } else {
          toast({ description: "Invalid Pincode" });
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (newAddress.zipCode.length === 6) {
      fetchLocation();
    }
  }, [newAddress.zipCode, toast]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="w-full">Go to Checkout</Button>
      </SheetTrigger>
      <SheetContent className="font-poppins w-full md:max-w-xl overflow-y-scroll">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Checkout</SheetTitle>
        </SheetHeader>

        <div className="w-full flex flex-col gap-2 my-4">
          {cartItems.map((item) => {
            return (
              <div key={item._id} className="flex items-center gap-4">
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded"
                  width={100}
                  height={100}
                />
                <div className="w-full flex flex-row justify-between items-center">
                  <div className="flex flex-col">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.variant.display}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-semibold text-lg">₹{item.price}</p>
                    <div>QTY: {item.quantity}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Payment Method */}
        <div className="space-y-2 mt-4 pt-4 border-t">
          <h3 className="text-lg font-semibold">Select Payment Method</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
            {[
              {
                value: "razorpay",
                label: "Pay Online",
                icon: <CreditCard className="w-5 h-5" />,
              },
              {
                value: "cod",
                label: "Cash on Delivery",
                icon: <Truck className="w-5 h-5" />,
              },
            ].map((option) => (
              <div
                key={option.value}
                onClick={() => setPaymentMethod(option.value)}
                className={`border rounded-xl p-4 cursor-pointer flex flex-row items-center gap-3 transition-all
        ${
          paymentMethod === option.value
            ? "bg-primary text-white border-none"
            : "border-gray-300 bg-white"
        }
      `}
              >
                {option.icon}
                <span className="font-medium">{option.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-4 mt-4 pb-10">
          <Table className="w-full border rounded-lg text-sm">
            <TableHeader>
              <TableRow>
                <TableHead
                  className="text-left text-base font-semibold"
                  colSpan={2}
                >
                  Order Summary
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-muted-foreground">Items</TableCell>
                <TableCell className="text-right">
                  ₹{subtotal.toFixed(2)}
                </TableCell>
              </TableRow>

              {discount > 0 && (
                <TableRow>
                  <TableCell className="text-green-600">
                    <div className="w-fit p-1 text-center bg-green-50 border border-green-200 rounded-md text-green-800 font-semibold">
                      {promoName}
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-green-600">
                    -₹{discount.toFixed(2)}
                  </TableCell>
                </TableRow>
              )}

              <TableRow>
                <TableCell className="text-muted-foreground">
                  Shipping
                </TableCell>
                <TableCell className="text-right">
                  {subtotal >= 1000 ? "₹0" : `₹${deliveryRate.toFixed(2)}`}
                </TableCell>
              </TableRow>

              {DELIVERY_DISCOUNT>0 && subtotal <= 1000 && (deliveryRate > DELIVERY_DISCOUNT) && (
                <TableRow>
                  <TableCell className="text-green-600">
                    Shipping Discount
                  </TableCell>
                  <TableCell className="text-right text-green-600">
                    -₹{DELIVERY_DISCOUNT}
                  </TableCell>
                </TableRow>
              )}

              <TableRow className="bg-gray-50">
                <TableCell className="font-medium">Total</TableCell>
                <TableCell className="text-right font-medium">
                  ₹{finalAmount.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <PromoCodeSection
            promoCodes={promoCodes}
            setPromoCode={setPromoCode}
            promoCode={promoCode}
            removePromoCode={removePromoCode}
            promoError={promoError}
          />

          {promoError && (
            <p className="px-2 text-xs text-red-500">{promoError}</p>
          )}

          {/* Total Savings */}
          {(discount > 0) && (
            <p className="text-center mx-auto justify-center text-sm text-green-700 font-semibold flex items-center gap-1">
              You saved
              <span className="text-green-800 font-bold">
                ₹
                {(
                  discount +
                  (subtotal < 1000 && deliveryRate > DELIVERY_DISCOUNT
                    ? DELIVERY_DISCOUNT
                    : 0)
                ).toFixed(2)}
              </span>
              on your order! 🎉
            </p>
          )}

          {/* Estimated Delivery */}
          {deliveryMessage.length > 0 ? (
            <div className="flex items-center gap-2 text-sm bg-red-100 border border-red-200 text-red-700 px-3 py-2 rounded-md">
              <CircleAlert className="w-4 h-4" />
              <span>{deliveryMessage}</span>
            </div>
          ) : (
            <div className="text-center flex justify-center items-center gap-2 text-sm bg-green-50 border border-green-300 text-primary font-medium px-3 py-4 rounded-md w-full">
              Estimated Delivery:{" "}
              <span className="font-semibold">{estDelivery}</span>
            </div>
          )}

          {/* Address Selection */}
          <div className="space-y-2 mt-12 pt-8 border-t">
            <h3 className="text-lg font-semibold">Shipping Address</h3>
            <Select
              onValueChange={(val) => {
                try {
                  setSelectedAddress(JSON.parse(val));
                } catch {
                  toast({
                    title: "Invalid address selection",
                    variant: "destructive",
                  });
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an address" />
              </SelectTrigger>
              <SelectContent>
                {user?.address?.map((addr, idx) => (
                  <SelectItem key={idx} value={JSON.stringify(addr)}>
                    {addr.name} - {addr.street}, {addr.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Add New Address */}
          <Button
            variant="outline"
            className="mt-4 w-full text-sm font-medium border-dashed border-gray-300 hover:border-primary hover:text-primary transition"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "Use new address"}
          </Button>

          {showForm && (
            <div className="space-y-2">
              <Input
                placeholder="Name"
                value={newAddress.name}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, name: e.target.value })
                }
              />
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <PhoneInput
                  country={"in"}
                  value={newAddress.phone}
                  onChange={(e) => {
                    setNewAddress({
                      ...newAddress,
                      phone: "+" + e,
                    });
                  }}
                  inputClass="!w-full !h-12 !text-md"
                  inputStyle={{ borderRadius: "8px", width: "100%" }}
                  placeholder="Enter your phone number"
                />
              </div>
              <Input
                placeholder="Street"
                value={newAddress.street}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, street: e.target.value })
                }
              />
              <Input
                placeholder="Street (Optional)"
                value={newAddress.streetOptional}
                onChange={(e) =>
                  setNewAddress({
                    ...newAddress,
                    streetOptional: e.target.value,
                  })
                }
              />

              <Input
                placeholder="Pin Code"
                value={newAddress.zipCode}
                onChange={(e) =>
                  setNewAddress({
                    ...newAddress,
                    zipCode: e.target.value.trim(),
                  })
                }
              />

              <Input
                placeholder="City"
                value={newAddress.city}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, city: e.target.value })
                }
              />
              <Input
                placeholder="State"
                value={newAddress.state}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, state: e.target.value })
                }
              />

              <Input
                placeholder="Country"
                value={newAddress.country}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, country: e.target.value })
                }
              />
              <Button onClick={handleAddNewAddress} className="w-full">
                Use This Address
              </Button>
            </div>
          )}

          {/* Delivery Address */}
          {selectedAddress ? (
            <div className="border border-gray-200 rounded-md p-4 mt-3 text-sm text-gray-700 space-y-1 bg-gray-50">
              <p className="font-medium">{selectedAddress.name}</p>
              <p>
                {selectedAddress.street}
                {selectedAddress.streetOptional
                  ? `, ${selectedAddress.streetOptional}`
                  : ""}
              </p>
              <p>
                {selectedAddress.city}, {selectedAddress.state} -{" "}
                {selectedAddress.zipCode}
              </p>
              <p>{selectedAddress.country}</p>
              <p className="text-xs text-gray-500">
                📞 {selectedAddress.phone}
              </p>
            </div>
          ) : (
            <>No address selected</>
          )}

          <Button
            disabled={deliveryMessage?.length > 0 || loading}
            className="mt-4 w-full h-12 font-semibold text-lg"
            onClick={handleCheckout}
          >
            {loading ? "Processing..." : paymentMethod==="cod" ? "Place Order" : "Pay Now"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

function PromoCodeSection({ promoCodes, promoCode, setPromoCode, setFinalPromoCode, removePromoCode, promoError }: any) {
  const [showCoupons, setShowCoupons] = useState(true)

  const handleApply = (code: string) => {
    setPromoCode(code)
    setFinalPromoCode(code)
  }

  return (
    <div className="w-full space-y-4">

      {showCoupons && (
        <div className="grid grid-cols-1 gap-4">
          {promoCodes.map((item: any) => {
            const isApplied = promoCode === item.code

            return (
              <Card key={item._id} className="border border-gray-300 shadow-sm">
                <CardContent className="py-4 px-5 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{item.code}</span>
                      {isApplied && promoError=="" && (
                        <Badge variant="outline" className="text-green-600 border-green-600 flex items-center gap-1">
                          <CheckCircle2 size={14} />
                          Applied
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                  </div>

                  <div className="ml-4 mt-1">
                    {isApplied ? (
                      <MinusCircle
                        size={20}
                        className="text-red-500 cursor-pointer hover:opacity-80"
                        onClick={removePromoCode}
                      />
                    ) : (
                      <PlusCircle
                        size={20}
                        className="text-primary cursor-pointer hover:opacity-80"
                        onClick={() => handleApply(item.code)}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
