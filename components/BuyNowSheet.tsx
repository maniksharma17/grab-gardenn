"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRecoilValue } from "recoil";
import { userState } from "@/store/atoms/user";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { Product } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { CircleAlert } from "lucide-react";

interface Variant {
  display: string;
  value: number;
}

interface Dimensions {
  length: number;
  breadth: number;
  height: number;
}

interface BuyNowSheetProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  product: Product;
  selectedVariant: Variant;
  dimensions: Dimensions;
  quantity: number;
  price: number;
}

export const BuyNowSheet = ({
  open,
  setOpen,
  product,
  selectedVariant,
  dimensions,
  quantity,
  price,
}: BuyNowSheetProps) => {
  const user = useRecoilValue(userState);
  const [selectedAddress, setSelectedAddress] = useState<{
    name: string;
    phone: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    street: string;
    streetOptional: string;
  }>(user.address[0]);
  const [paymentMode, setPaymentMode] = useState<"COD" | "Prepaid">("COD");
  const [deliveryRate, setDeliveryRate] = useState<number>(0);
  const [estDelivery, setEstDelivery] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const selectedIndex = product.variants.findIndex(
    (v) => v.value === selectedVariant.value
  );

  
  const total = price * quantity;
  const cutoffPrice = product.cutoffPrice?.[selectedIndex];

  let finalAmount = 0;
  if(total > 1000) {
    finalAmount = total;
  } else {
    finalAmount = total + deliveryRate
  }

  useEffect(() => {
    if (selectedAddress) {
      fetchDeliveryRate();
    }
  }, [selectedAddress]);
  const [deliveryMessage, setDeliveryMessage] = useState("");

  const fetchDeliveryRate = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/checkout/direct-delivery-rate`,
        {
          destinationPincode: selectedAddress.zipCode,
          weight: selectedVariant.value || "1",
        },
        {
          headers: {
            Authorization: "Bearer " + user.token,
            "Content-Type": "application/json",
          },
        }
      );
      setDeliveryRate(res.data.deliveryCharge);
      setEstDelivery(res.data.estimatedDeliveryDays);
      setDeliveryMessage("");
    } catch (err) {
      setDeliveryMessage("Incorrect Pincode");
      console.log(err);
    }
  };

  const { toast } = useToast();

  const handleCheckout = async () => {
    setLoading(true);
    if (!selectedAddress) {
      toast({ title: "Please select an address", variant: "destructive" });
      return;
    }

    if (paymentMode === "Prepaid") {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/checkout/create-direct-checkout-session/${user._id}`,
          {
            deliveryRate,
            price: total,
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
          keyId,
          amount: finalAmount * 100,
          currency: "INR",
          name: "Grab Gardenn",
          description: "Order Payment",
          order_id: orderId,
          handler: async function (response: any) {
            toast({ title: "Payment Successful" });
            const res = await axios.post(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/checkout/verify-direct-payment/${user._id}`,
              {
                ...response,
                shippingAddress: selectedAddress,
                deliveryRate,
                price: total,
                variant: selectedVariant,
                product: product._id,
                quantity,
                dimensions: dimensions,
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
            ondismiss: () => {
              console.log("Razorpay closed");
            },
          },
        };
        setOpen(false);
        const razor = new (window as any).Razorpay(options);

        razor.open();
      } catch (err) {
        console.log("Razorpay error", err);
        toast({ title: "Payment failed", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/checkout/place-direct-shiprocket-cod-order/${user._id}`,
          {
            shippingAddress: selectedAddress,
            deliveryRate: (total>1000) ? 0 : deliveryRate,
            price: total,
            variant: selectedVariant,
            product: product._id,
            quantity,
            dimensions: dimensions,
          },
          {
            headers: { Authorization: `Bearer ${user.token}` },
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
        setOpen(false);
        setLoading(false);
      }
    }
  };

  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    street: "",
    streetOptional: "",
  });
  const handleAddNewAddress = () => {
    const { name, phone, city, state, country, zipCode, street } = newAddress;

    if (!name || !phone || !city || !state || !country || !zipCode || !street) {
      toast({ title: "Please fill in all required fields." });
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      toast({ title: "Invalid Phone Number", variant: "destructive" });
    }

    setSelectedAddress(newAddress);
    toast({ title: "New Address Selected" });
  };

  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const router = useRouter();
  if (!user) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        onClick={() => {
          if (!user.isLoggedIn) router.push("/auth");
        }}
        className="bg-primary p-4 w-full rounded-md text-white text-lg font-medium hover:bg-primary/90"
      >
        BUY IT NOW
      </SheetTrigger>
      <SheetContent className="w-full max-w-md overflow-y-scroll">
        <SheetHeader>
          <SheetTitle className="text-xl">Buy Now</SheetTitle>
        </SheetHeader>

        <div className="py-4 space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-20 h-20 object-cover rounded"
            />
            <div>
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-gray-500">{selectedVariant.display}</p>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-lg">₹{total}</p>
                {cutoffPrice && (
                  <p className="line-through text-sm text-gray-400">
                    ₹{cutoffPrice}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Choose Address</Label>
            <Select
              value={JSON.stringify(selectedAddress)}
              onValueChange={(val) => {
                const parsed = JSON.parse(val);
                setSelectedAddress(parsed);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder="Select Address"
                  defaultValue={JSON.stringify(user.address[0])}
                />
              </SelectTrigger>
              <SelectContent>
                {user.address.map((addr, index) => {
                  const stringified = JSON.stringify(addr);
                  return (
                    <SelectItem key={index} value={stringified}>
                      {addr.name}, {addr.street}, {addr.city}, {addr.state} -{" "}
                      {addr.zipCode}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="mt-4 w-full text-sm font-medium border-dashed border-gray-300 hover:border-primary hover:text-primary transition"
              onClick={() => setShowNewAddressForm(true)}
            >
              ➕ Add a New Address
            </Button>
          </div>

          {selectedAddress && (
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
          )}

          {showNewAddressForm && (
            <div className="border-t pt-4 mt-4 space-y-3">
              <Label className="text-base font-medium">New Address</Label>

              {[
                { label: "Name", key: "name" },
                { label: "Phone", key: "phone", type: "tel" },
                { label: "Street", key: "street" },
                { label: "Street (Optional)", key: "streetOptional" },
                { label: "City", key: "city" },
                { label: "State", key: "state" },
                { label: "Country", key: "country" },
                { label: "Pin Code", key: "zipCode", type: "number" },
              ].map((field) => (
                <div key={field.key} className="grid gap-1">
                  <Label className="text-sm">{field.label}</Label>
                  <input
                    type={field.type || "text"}
                    className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary border-gray-200"
                    value={newAddress[field.key as keyof typeof newAddress]}
                    onChange={(e) =>
                      setNewAddress((prev) => ({
                        ...prev,
                        [field.key]: e.target.value,
                      }))
                    }
                  />
                </div>
              ))}

              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleAddNewAddress}
                  className="w-full"
                >
                  Use This Address
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewAddressForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div>
            <Label className="mb-2 block">Payment Mode</Label>
            <RadioGroup
              value={paymentMode}
              onValueChange={(val) => setPaymentMode(val as "COD" | "Prepaid")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="COD" id="cod" />
                <Label htmlFor="cod">Cash on Delivery</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Prepaid" id="prepaid" />
                <Label htmlFor="prepaid">Pay with Razorpay</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Order Summary */}
          <div className="space-y-2 border-b pb-4">
            <h3 className="text-lg font-semibold">Order Summary</h3>
            <div className="flex justify-between text-sm">
              <span>Items:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping:</span>
              <span>₹{deliveryRate.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span>Total:</span>
              <span>{(total>1000) ? `₹${total.toFixed(2)}` : `₹${(total + deliveryRate).toFixed(2)}`}</span>
            </div>
            {deliveryMessage.length > 0 && (
              <div className="bg-red-100 p-1 text-sm rounded-md flex flex-row gap-1 items-center">
                <CircleAlert className="text-red-500 w-4 h-4 inline" />{" "}
                <p>{deliveryMessage}</p>
              </div>
            )}
            {deliveryMessage.length == 0 && (
              <p className="text-sm bg-slate-100 text-gray-700 font-medium rounded-lg w-fit p-1">
                Estimated Delivery: {estDelivery}
              </p>
            )}
          </div>

          <Button
            className="w-full"
            disabled={loading}
            onClick={handleCheckout}
          >
            {loading
              ? "Processing..."
              : paymentMode === "COD"
              ? "Place Order"
              : "Pay Now"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
