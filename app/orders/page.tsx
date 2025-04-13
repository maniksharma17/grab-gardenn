"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import Image from "next/image";
import { useRecoilValue } from "recoil";
import { userState } from "@/store/atoms/user";
import { Navbar } from "@/components/Navbar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface Order {
  _id: string;
  total: number;
  type: string;
  status: string;
  createdAt: string;
  shippingAddress: {
    name: string;
    phone: string;
    street: string;
    streetOptional?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: {
    product: {
      _id: string;
      name: string;
      images: string[];
    };
    quantity: number;
    price: number;
    variant: {
      display: string;
      value: number;
    };
  }[];
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useRecoilValue(userState);

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${user._id}`,
          {
            withCredentials: true,
            headers: {
              Authorization: "Bearer " + user.token,
            },
          }
        );
        setOrders(res.data.orders);
      } catch (err) {
        console.log("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleCancelOrder = async () => {
    if (!selectedOrderId || !cancelReason) return;
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${selectedOrderId}/cancel`,
        { reason: cancelReason },
        {
          withCredentials: true,
          headers: {
            Authorization: "Bearer " + user.token,
          },
        }
      );
      setOrders((prev) =>
        prev.map((o) =>
          o._id === selectedOrderId ? { ...o, status: "cancelled" } : o
        )
      );
    } catch (err) {
      console.error("Cancellation failed", err);
    } finally {
      setShowCancelDialog(false);
      setCancelReason("");
      setSelectedOrderId(null);
    }
  };

  if (loading)
    return (
      <div className="text-center py-10 text-gray-600">Loading orders...</div>
    );

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container w-full px-4 md:px-10 pt-32 py-12">
        <h1 className="text-4xl max-md:text-2xl font-medium mb-12 text-left text-primary">
          Your Orders
        </h1>

        {orders.length === 0 ? (
          <p className="text-center text-md text-gray-500">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border border-gray-200 rounded-lg bg-white p-4 shadow-sm hover:shadow-md transition"
              >
                {/* Order Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6 text-sm md:text-base">
                  <div>
                    <p className="font-medium text-gray-700">Order ID</p>
                    <p className="truncate text-gray-600">{order._id}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Placed On</p>
                    <p className="text-gray-600">
                      {format(
                        new Date(order.createdAt),
                        "dd MMM yyyy, hh:mm a"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Total</p>
                    <p className="text-gray-600">₹{order.total}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Status</p>
                    <p
                      className={`capitalize font-semibold ${
                        order.status === "cancelled"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {order.status}
                    </p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="text-sm text-gray-700 mb-6">
                  <p className="font-semibold text-gray-800 mb-1">
                    Shipping Address:
                  </p>
                  <p>
                    {order.shippingAddress.name}, {order.shippingAddress.street}{" "}
                    {order.shippingAddress.streetOptional &&
                      order.shippingAddress.streetOptional + ","}{" "}
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    - {order.shippingAddress.zipCode},{" "}
                    {order.shippingAddress.country}. Phone:{" "}
                    {order.shippingAddress.phone}
                  </p>
                </div>

                {/* Products */}
                <div className="space-y-4 mb-4">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4"
                    >
                      <div className="flex gap-4 items-start">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-md"
                          width={80}
                          height={80}
                        />
                        <div>
                          <p className="font-semibold text-gray-800">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Variant: {item.variant.display}
                          </p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-md font-semibold text-gray-800 sm:ml-auto">
                        ₹{item.price}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center mt-4 flex-wrap gap-4">
                  <a
                    href={`/track-order/${order._id}`}
                    className="text-sm text-blue-600 hover:underline font-medium"
                  >
                    Track Order
                  </a>
                  {order.status !== "cancelled" && (
                    <Button
                      variant="outline"
                      className="text-sm"
                      onClick={() => {
                        setSelectedOrderId(order._id);
                        setShowCancelDialog(true);
                      }}
                    >
                      Cancel Order
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Please provide a reason for cancellation.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter your reason..."
            rows={3}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
          <DialogFooter className="mt-4">
            <Button
              variant="ghost"
              onClick={() => {
                setShowCancelDialog(false);
                setCancelReason("");
              }}
            >
              Close
            </Button>
            <Button onClick={handleCancelOrder} disabled={!cancelReason.trim()}>
              Confirm Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default OrdersPage;
