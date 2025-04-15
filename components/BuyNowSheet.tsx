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
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRecoilValue } from "recoil";
import { userState } from "@/store/atoms/user";
import { useEffect, useState } from "react";
import axios from "axios";
import { Product } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { CircleAlert } from "lucide-react";
import Image from "next/image";
import { validateAddress } from "@/lib/utils";
import { DELIVERY_DISCOUNT } from "@/lib/config";

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
  }>({
    name: "",
    phone: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    street: "",
    streetOptional: "",
  });
  const [paymentMode, setPaymentMode] = useState<"COD" | "Prepaid">("COD");
  const [deliveryRate, setDeliveryRate] = useState<number>(0);
  const [courierId, setCourierId] = useState(null);
  const [estDelivery, setEstDelivery] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [finalAmount, setFinalAmount] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");

  const selectedIndex = product.variants.findIndex(
    (v) => v.value === selectedVariant.value
  );

  const total = price * quantity;
  const cutoffPrice = product.cutoffPrice?.[selectedIndex];

  const discountedDeliveryRate =
    deliveryRate > DELIVERY_DISCOUNT
      ? deliveryRate - DELIVERY_DISCOUNT
      : deliveryRate;

  useEffect(() => {
    if (total >= 1000) {
      setFinalAmount(total);
    } else {
      setFinalAmount(total + discountedDeliveryRate);
    }
  }, [total, discountedDeliveryRate]);

  useEffect(() => {
    if (!selectedAddress) return;
    const fetchDeliveryRate = async () => {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/checkout/direct-delivery-rate`,
          {
            destinationPincode: selectedAddress.zipCode,
            weight: ((selectedVariant.value as number) || 1) * quantity,
            cod: paymentMode == "COD" ? "1" : "0",
          },
          {
            headers: {
              Authorization: "Bearer " + user.token,
              "Content-Type": "application/json",
            },
          }
        );
        setDeliveryRate(res.data.deliveryCharge);
        setCourierId(res.data.courierId);
        setEstDelivery(res.data.estimatedDeliveryDays);
        setDeliveryMessage("");
      } catch (err) {
        setDeliveryMessage("Incorrect Pincode");
        console.log(err);
      }
    };

    fetchDeliveryRate();
  }, [selectedAddress, quantity, selectedVariant, user, paymentMode]);

  const [deliveryMessage, setDeliveryMessage] = useState("");

  const { toast } = useToast();

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
            deliveryRate: discountedDeliveryRate,
            price: price,
            variant: selectedVariant,
            product: product._id,
            quantity,
            dimensions: dimensions,
            courierId: courierId,
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
        } else {
          toast({
            title: response.data.message,
            variant: "destructive",
          });
        }
      } catch (err: any) {
        console.log("COD error", err);
        toast({
          title: "Order failed",
          description: err.message,
          variant: "destructive",
        });
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
      toast({
        title: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      toast({ title: "Invalid Phone Number", variant: "destructive" });
      return;
    }

    // Everything is valid, so now set the address
    setSelectedAddress(newAddress);
    toast({ title: "New Address Selected", variant: "default" });

    setShowNewAddressForm(false); // Optional: hide the form after adding
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
            <Image
              src={product.images[0]}
              alt={product.name}
              className="w-20 h-20 object-cover rounded"
              width={100}
              height={100}
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

          {/* Order Summary */}
          <div className="shadow-sm space-y-4">

            <Table className="w-full border rounded-lg text-sm">
              <TableBody>
                <TableRow>
                  <TableHead
                    className="text-left text-base font-semibold"
                    colSpan={2}
                  >
                    Order Summary
                  </TableHead>
                </TableRow>
                <TableRow>
                  <TableCell className="text-sm text-muted-foreground">
                    Items
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ₹{total.toFixed(2)}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="text-sm text-muted-foreground">
                    Shipping
                  </TableCell>
                  <TableCell className="text-right">
                    {total >= 1000 ? (
                      <>
                        <span className="line-through text-muted-foreground mr-1">
                          ₹{deliveryRate.toFixed(2)}
                        </span>
                        <span className="text-green-600 font-medium">₹0</span>
                        <Badge
                          variant="outline"
                          className="ml-2 text-green-700 border-green-300 bg-green-50"
                        >
                          Free Shipping
                        </Badge>
                      </>
                    ) : (
                      <>₹{deliveryRate.toFixed(2)}</>
                    )}
                  </TableCell>
                </TableRow>

                {total < 1000 && 
                <TableRow>
                  <TableCell className="text-sm text-primary">
                    Shipping Discount
                  </TableCell>
                  <TableCell className="text-right">
                      <span className="text-muted-foreground mr-1">
                        -₹{DELIVERY_DISCOUNT.toFixed(2)}
                      </span>
                  </TableCell>
                </TableRow>}

                <TableRow>
                  <TableCell className="text-sm font-semibold">Total</TableCell>
                  <TableCell className="text-right font-semibold text-primary">
                    ₹{finalAmount.toFixed(2)}
                  </TableCell>
                </TableRow>
              
              </TableBody>
            </Table>
          </div>

          {/* Estimated Delivery */}
          {deliveryMessage.length > 0 ? (
              <div className="flex items-center gap-2 text-sm bg-red-100 border border-red-200 text-red-700 px-3 py-2 rounded-md">
                <CircleAlert className="w-4 h-4" />
                <span>{deliveryMessage}</span>
              </div>
            ) : (
              <div className="text-center flex items-center gap-2 text-sm bg-green-50 border border-green-300 text-primary font-medium px-3 py-4 rounded-md w-full">
                Estimated Delivery: <span className="font-semibold">{estDelivery}</span>
              </div>
            )}

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
                <RadioGroupItem disabled value="Prepaid" id="prepaid" />
                <Label htmlFor="prepaid">
                  Pay with Razorpay (NOT AVAILABLE FOR NOW)
                </Label>
              </div>
            </RadioGroup>
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
