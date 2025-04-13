"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import Image from "next/image";
import { useRecoilValue } from "recoil";
import { userState } from "@/store/atoms/user";
import { Navbar } from "@/components/Navbar";

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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${user._id}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setOrders(res.data.orders);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };

    if (user._id) fetchOrders();
  }, [user]);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="w-full max-w-6xl mx-auto px-4 pt-32 pb-20">
        <h1 className="text-3xl max-md:text-2xl font-medium px-4 mb-10 text-primary">Your Orders</h1>

        {loading ? (
          <p className="text-center text-gray-500 text-md">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-md text-gray-500">No orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border border-gray-200 rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition-all"
              >
                {/* Order Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6 text-sm md:text-base">
                  <div>
                    <p className="font-medium text-gray-700">Order ID</p>
                    <p className="truncate text-gray-600">{order._id}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Placed On</p>
                    <p className="text-gray-600">
                      {format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Total</p>
                    <p className="text-gray-600 font-semibold">₹{order.total}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Status</p>
                    <p className="capitalize text-green-600 font-semibold">{order.status}</p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="text-sm text-gray-700 mb-6">
                  <p className="font-semibold text-gray-800 mb-1">Shipping Address:</p>
                  <p>
                    {order.shippingAddress.name}, {order.shippingAddress.street}{" "}
                    {order.shippingAddress.streetOptional && `${order.shippingAddress.streetOptional}, `}
                    {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                    {order.shippingAddress.zipCode}, {order.shippingAddress.country}. Phone:{" "}
                    {order.shippingAddress.phone}
                  </p>
                </div>

                {/* Items */}
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4"
                    >
                      <div className="flex gap-4 items-start">
                        <div className="w-20 h-20 relative rounded-md overflow-hidden border">
                          <Image
                            src={item.product.images?.[0] || "/placeholder.png"}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{item.product.name}</p>
                          <p className="text-sm text-gray-600">Variant: {item.variant.display}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-md font-semibold text-gray-800 sm:ml-auto">
                        ₹{item.price}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default OrdersPage;
