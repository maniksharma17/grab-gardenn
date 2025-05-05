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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
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
import { CircleAlert, CreditCard, Phone, Truck } from "lucide-react";
import Image from "next/image";
import { validateAddress } from "@/lib/utils";
import { DELIVERY_DISCOUNT } from "@/lib/config";
import { Input } from "./ui/input";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";


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
  const [courierId, setCourierId] = useState(null);
  const [estDelivery, setEstDelivery] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [finalAmount, setFinalAmount] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoName, setPromoName] = useState("");
  const [promoError, setPromoError] = useState("");
  const [finalPromoCode, setFinalPromoCode] = useState("");

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
    const applyPromo = async () => {
      if (!finalPromoCode) return;

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/promo-code/apply`,
          {
            code: finalPromoCode,
            total: total,
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

        const amount = Math.max(total - res.data.discountAmount, 0);
        const final = total >= 1000 ? amount : amount + discountedDeliveryRate;
        setFinalAmount(final);
      } catch (err: any) {
        if (err.response && err.response.status === 400) {
          setPromoError(err.response.data.error);
        } else {
          setPromoError("Something went wrong. Please try again.");
        }

        setDiscount(0);
      }
    };

    applyPromo();
  }, [total, finalPromoCode, discountedDeliveryRate, user]);

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
            deliveryRate: discountedDeliveryRate,
            total: total,
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
          keyId,
          currency: "INR",
          name: "Grab Gardenn Healthy Foods",
          description: "Order Payment",
          order_id: orderId,
          handler: async function (response: any) {
            toast({ title: "Payment Successful" });
            const res = await axios.post(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/checkout/verify-direct-payment/${user._id}`,
              {
                ...response,
                shippingAddress: selectedAddress,
                deliveryRate: discountedDeliveryRate,
                promoCode: finalPromoCode,
                promoCodeDiscount: discount,
                total: total,
                price: price,
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
        setOpen(false);
        setLoading(false);
        setFinalPromoCode("");
        setPromoCode("");
        setFinalAmount((prev) => prev + discount);
        setDiscount(0);
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
            promoCode: promoCode,
            promoCodeDiscount: discount,
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
        setFinalPromoCode("");
        setPromoCode("");
        setFinalAmount((prev) => prev + discount);
        setDiscount(0);
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
    const result = validateAddress(newAddress);
    if (!result.isValid) {
      toast({ title: result.message, variant: "destructive" });
      return;
    }
    // Everything is valid, so now set the address
    setSelectedAddress(newAddress);
    toast({ title: "New Address Selected", variant: "default" });

    setShowNewAddressForm(false); // Optional: hide the form after adding
  };

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${newAddress.zipCode}`);
        const data = await response.json();
        if (data[0].Status === "Success") {
          const postOffice = data[0].PostOffice[0];
          setNewAddress(prev => ({
            ...prev,
            city: postOffice.Block || postOffice.District,
            state: postOffice.Circle,
            country: postOffice.Country
          }));
        } else {
          toast({description: "Invalid Pincode"})
        }
      } catch (err) {
        console.log(err);
      }
    };
  
    if (newAddress.zipCode.length === 6) {
      fetchLocation();
    }
  }, [newAddress.zipCode, toast]);

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
      <SheetContent className="font-poppins w-full md:max-w-xl overflow-y-scroll">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Checkout</SheetTitle>
        </SheetHeader>

        <div className="py-4 space-y-4">

          {/** Product Info */}
          <div className="w-full flex items-center gap-4">
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
                <p className="font-semibold text-lg">₹{price}</p>
                
              </div>
              <div>QTY: {quantity}</div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2 my-8">
            <h3 className="text-lg font-semibold">Select Payment Method</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
              {[
                {
                  value: "Prepaid",
                  label: "Pay with Razorpay",
                  icon: <CreditCard className="w-5 h-5" />,
                },
                {
                  value: "COD",
                  label: "Cash on Delivery",
                  icon: <Truck className="w-5 h-5" />,
                },
              ].map((option) => (
                <div
                  key={option.value}
                  onClick={() => setPaymentMode(option.value as 'Prepaid'|'COD')}
                  className={`border rounded-xl p-4 cursor-pointer flex items-center gap-3 transition-all
        ${
          paymentMode === option.value
            ? "border-primary bg-primary/10"
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

                {total < 1000 && deliveryRate > DELIVERY_DISCOUNT && (
                  <TableRow>
                    <TableCell className="text-sm text-primary">
                      Shipping Discount
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-muted-foreground mr-1">
                        -₹{DELIVERY_DISCOUNT.toFixed(2)}
                      </span>
                    </TableCell>
                  </TableRow>
                )}

                <TableRow>
                  <TableCell className="text-sm font-semibold">Total</TableCell>
                  <TableCell className="text-right font-semibold text-primary">
                    ₹{finalAmount.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Promo Input */}
          <div className="flex items-center gap-2 mt-2">
            <Input
              placeholder="Enter promo code"
              value={promoCode}
              disabled={discount > 0}
              autoFocus={false}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <Button
              variant="outline"
              disabled={discount > 0}
              onClick={(e) => {
                setFinalPromoCode(promoCode);
              }}
            >
              Apply
            </Button>
          </div>

          <div className="flex flex-row gap-2 flex-wrap w-full">
            {promoCodes.map((item: any) => {
              return (
                <div
                  onClick={() => {
                    setPromoCode(item.code);
                    setFinalPromoCode(item.code);
                  }}
                  key={item._id}
                  className="cursor-pointer text-sm px-3 py-1 font-semibold text-gray-500 bg-slate-50 border border-gray-300 rounded-md w-fit flex-wrap"
                >
                  {item.code}
                </div>
              );
            })}
          </div>

          {promoError && (
            <p className="px-2 text-xs text-red-500">{promoError}</p>
          )}

          {/* Total Savings */}
          {(discount > 0 || total <= 1000) && (
            <p className="text-center mx-auto justify-center text-sm text-green-700 font-semibold flex items-center gap-1">
              You saved
              <span className="text-green-800 font-bold">
                ₹
                {(
                  discount +
                  (total < 1000 && deliveryRate > DELIVERY_DISCOUNT
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
            <div className="text-center flex items-center gap-2 text-sm bg-green-50 border border-green-300 text-primary font-medium px-3 py-4 rounded-md w-full">
              Estimated Delivery:{" "}
              <span className="font-semibold">{estDelivery}</span>
            </div>
          )}

          {/** Shipping Address */}
          <div className="space-y-2 mt-12 pt-8 border-t">
            <h3 className="text-lg font-semibold">Shipping Address</h3>
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
              Use new address
            </Button>

            {showNewAddressForm && (
            <div className="border-t pt-4 mt-4 space-y-3">
              <Label className="text-base font-medium">New Address</Label>

              {[
                { label: "Name", key: "name" },
                { label: "Phone", key: "phone", type: "tel" },
                { label: "Street", key: "street" },
                { label: "Street (Optional)", key: "streetOptional" },
                { label: "Pin Code", key: "zipCode", type: "number" },
                { label: "City", key: "city" },
                { label: "State", key: "state" },
                { label: "Country", key: "country" },
                
              ].map((field) =>
                (field.label === "Phone") ? (
                  <div key={field.key} className="relative">
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
                ) : (
                  <div key={field.key}>
                    <Input
                      type={field.type || "text"}
                      placeholder={field.label}
                      value={newAddress[field.key as keyof typeof newAddress]}
                      onChange={(e) =>
                        setNewAddress((prev) => ({
                          ...prev,
                          [field.key]: e.target.value,
                        }))
                      }
                    />
                  </div>
                )
              )}

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
            ) : <>No Address Selected</>
            }

            
          </div>

          
          <Button
            className="mt-4 w-full h-12 font-semibold text-lg"
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
