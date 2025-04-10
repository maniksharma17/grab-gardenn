"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

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
  const [estDelivery, setEstDelivery] = useState("null");
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const fetchDeliveryRate = async () => {
      if (!selectedAddress?.zipCode) return;

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/checkout/delivery-rate`,
          {
            userId: user._id,
            destinationPincode: selectedAddress.zipCode,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        setDeliveryRate(res.data.deliveryCharge);
        setEstDelivery(res.data.estimatedDeliveryDays);
        setDeliveryMessage("");
      } catch (err) {
        console.log("Delivery rate fetch error:", err);
        setDeliveryMessage("Incorrect city pincode");
        setDeliveryRate(0);
      }
    };

    fetchDeliveryRate();
  }, [user, selectedAddress]);
  const setCartRefresh = useSetRecoilState(cartRefreshState);
  const cartRefresh = useRecoilValue(cartRefreshState)

  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    street: "",
    streetOptional: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  let finalAmount = 0;
  if (subtotal > 1000) {
    finalAmount = subtotal;
  } else {
    finalAmount = subtotal + deliveryRate;
  }

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
      return;
    }

    if (paymentMethod === "razorpay") {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/checkout/create-checkout-session/${user._id}`,
          {
            deliveryRate,
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
          amount: finalAmount*100, 
          currency: "INR",
          name: "Grab Gardenn",
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
      }
    } else {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/checkout/place-shiprocket-cod-order/${user._id}`,
          {
            shippingAddress: selectedAddress,
            deliveryRate,
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

        setOrderId(response.data.shiprocketOrderId);
        setCartRefresh((prev) => prev + 1);
      } catch (err) {
        console.log("COD error", err);
        toast({ title: "Order failed", variant: "destructive" });
      } finally {
        setOpen(false);
        setCart(false);
        setLoading(false);
        setCartRefresh(prev => prev+1)
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
          {/* Order Summary */}
          <div className="space-y-2 border-b pb-4">
            <h3 className="text-lg font-semibold">Order Summary</h3>
            <div className="flex justify-between text-sm">
              <span>Items:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping:</span>
              <span>{(subtotal > 1000) ?  '₹0' : `₹${deliveryRate.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span>Total:</span>
              <span>₹{finalAmount.toFixed(2)}</span>
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

      <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-green-600">
              🎉 Order Confirmed!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <p>Your order has been placed successfully.</p>
            <p>
              <span className="font-semibold">Order ID:</span> {orderId}
            </p>
            <a
              href="/account/orders"
              className="text-green-600 font-medium underline"
            >
              View Orders
            </a>
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
};
