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

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { cartRefreshState, userState } from "@/store/atoms/user";
import { CartItem } from "@/lib/types";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CircleAlert, CreditCard, Truck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { validateAddress } from "@/lib/utils";
import { DELIVERY_DISCOUNT } from "@/lib/config";

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
  const [promoName, setPromoName] = useState("")
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [finalAmount, setFinalAmount] = useState(0);
  const [promoCodes, setPromoCodes] = useState([]);

  useEffect(()=>{
    const fetchPromos = async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/promo-code/`, {
        headers: {
          'Authorization': 'Bearer ' + user.token
        }
      });
      setPromoCodes(res.data);
    }
    fetchPromos()
  }, [])

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
            subtotal: subtotal
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

  const handleApplyPromo = async () => {
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
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if(res.data.error){
        setPromoError(res.data.message);
        return;
      }

      setDiscount(res.data.discountAmount);
      setPromoName(res.data.code)

      const amount = Math.max(subtotal - res.data.discountAmount, 0)
      const final = subtotal>=1000 ? amount : amount + discountedDeliveryRate
      setFinalAmount(final);

      toast({
        title: "Promo code applied 🎉",
        description: `You saved ₹${res.data.discountAmount}`,
      });
      setPromoError("");
    } catch (err: any) {
      console.log("Promo code error", err);
      setPromoError(
        err?.response?.data?.message || "Invalid or expired promo code"
      );
      setDiscount(0);
    }
  };

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
  
        setDiscount(res.data.discountAmount);
        setPromoName(res.data.code);

        const amount = Math.max(subtotal - res.data.discountAmount, 0)
        const final = subtotal>=1000 ? amount : amount + discountedDeliveryRate
        setFinalAmount(final);

        setPromoError("");
      } catch (err: any) {
        console.log("Promo reapply error", err);
        setDiscount(0);
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

    const result = validateAddress(selectedAddress);
    if (!result.isValid) {
      toast({ title: result.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    if (paymentMethod === "razorpay") {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/checkout/create-checkout-session/${user._id}`,
          {
            deliveryRate: discountedDeliveryRate,
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
          amount: finalAmount * 100,
          currency: "INR",
          name: "Grab Gardenn Healthy Foods",
          description: "Order Payment",
          order_id: orderId,
          handler: async function (response: any) {
            console.log("✅ Payment Handler Called", response);
            toast({ title: "Payment Successful" });
            const res = await axios.post(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/checkout/verify-payment/${user._id}`,
              { ...response, shippingAddress: selectedAddress, deliveryRate },
              { headers: { Authorization: `Bearer ${user.token}` } }
            );

            // SHIPROCKET CONFIG
            if (res.data.success) {
              const shiprocketResponse = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/checkout/place-shiprocket-prepaid-order`,
                {
                  orderId: res.data.order._id,
                  paymentMethod: "Prepaid",
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
        setCartRefresh((prev) => prev + 1);
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
            promoCodeDiscount: discount
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
      }
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="w-full">Go to Checkout</Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-scroll">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Checkout</SheetTitle>
        </SheetHeader>

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

              {subtotal <= 1000 && (
                <TableRow>
                  <TableCell className="text-green-600">
                    Shipping Discount
                  </TableCell>
                  <TableCell className="text-right text-green-600">
                    -₹{DELIVERY_DISCOUNT}
                  </TableCell>
                </TableRow>
              )}

              <TableRow className="bg-gray-100">
                <TableCell className="font-medium">Total</TableCell>
                <TableCell className="text-right font-medium">
                  ₹{finalAmount.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          {/* Promo Input */}
          <div className="flex items-center gap-2 mt-2">
            <Input
              placeholder="Enter promo code"
              value={promoCode}
              disabled={discount>0}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <Button
              variant="outline"
              onClick={handleApplyPromo}
              disabled={discount > 0}
            >
              Apply
            </Button>
          </div>

          <div>
            {promoCodes.map((item: any) => {
              return <div onClick={()=>{
                setPromoCode(item.code)
              }}
              key={item._id} className="px-4 py-2 text-semibold text-gray-700 bg-green-50 border border-green-300 flex-wrap">
                {item.code}
              </div>
            })}
          </div>

          {promoError && <p className="px-2 text-xs text-red-500">{promoError}</p>}

          {/* Total Savings */}
          {(discount > 0 || subtotal <= 1000) && (
            <p className="text-center mx-auto justify-center text-sm text-green-700 font-semibold flex items-center gap-1">
              You saved
              <span className="text-green-800 font-bold">
                ₹
                {(
                  discount + (subtotal <= 1000 ? DELIVERY_DISCOUNT : 0)
                ).toFixed(2)}
              </span>
              on your order! 🎉
            </p>
          )}

          {/* Delivery Info */}
          {deliveryMessage.length > 0 ? (
            <div className="bg-red-100 text-center text-red-700 mt-4 p-3 rounded-md flex items-start gap-2 text-sm">
              <CircleAlert className="w-4 h-4 mt-0.5" />
              <p>{deliveryMessage}</p>
            </div>
          ) : (
            <div className="mt-4 p-3 text-center bg-green-50 border border-green-200 rounded-md text-green-800 text-sm font-medium">
              Estimated Delivery:{" "}
              <span className="font-semibold">{estDelivery}</span>
            </div>
          )}

          {/* Address Selection */}
          <div className="space-y-2">
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

          {/* Delivery Address */}
          <h2 className="text-xl font-semibold">Delivery Address</h2>
          {selectedAddress ? (
            <div className="border rounded-xl p-4 space-y-1 bg-gray-50 text-sm">
              <p className="font-medium">{selectedAddress.name}</p>
              <p>{selectedAddress.phone}</p>
              <p>{selectedAddress.street}</p>
              <p>{selectedAddress.streetOptional ?? "--"}</p>
              <p>
                {selectedAddress.city}, {selectedAddress.state} -{" "}
                {selectedAddress.zipCode}
              </p>
              <p>{selectedAddress.country}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No address selected</p>
          )}

          {/* Add New Address */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "Add New Address"}
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
              <Input
                placeholder="Phone"
                value={newAddress.phone}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, phone: e.target.value })
                }
              />
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
                placeholder="Zip Code"
                value={newAddress.zipCode}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, zipCode: e.target.value })
                }
              />
              <Input
                placeholder="Country"
                value={newAddress.country}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, country: e.target.value })
                }
              />
              <Button
                onClick={() => {
                  setSelectedAddress(newAddress);
                  setShowForm(false);
                  toast({ title: "Address added" });
                }}
                className="w-full"
              >
                Use This Address
              </Button>
            </div>
          )}

          {/* Payment Method */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Payment Method</h3>
            <RadioGroup
              defaultValue={paymentMethod}
              onValueChange={setPaymentMethod}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem disabled value="razorpay" id="razorpay" />
                <Label htmlFor="razorpay" className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Pay with Razorpay (NOT AVAILABLE FOR NOW)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cod" id="cod" />
                <Label htmlFor="cod" className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  Cash on Delivery
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button
            disabled={deliveryMessage?.length > 0 || loading}
            className="w-full mt-2"
            onClick={handleCheckout}
          >
            {loading ? "Processing..." : "Place Order"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
