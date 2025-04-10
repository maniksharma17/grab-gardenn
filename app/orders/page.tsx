"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import Image from "next/image";
import { useRecoilValue } from "recoil";
import { userState } from "@/store/atoms/user";

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

//https://shiprocket.co/tracking/AWB_NUMBER

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useRecoilValue(userState);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${user._id}`, {
          withCredentials: true,
          headers: {
            'Authorization': 'Bearer ' + user.token
          }
        }); // Adjust endpoint as needed
        setOrders(res.data.orders);
      } catch (err) {
        console.log("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) return <div className="text-center py-10">Loading orders...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-6 text-center">Your Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-md text-gray-500">No orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="shadow-md rounded-lg border border-gray-200 p-6"
            >
              <div className="mb-4 flex flex-col md:flex-row md:justify-between text-md">
                <div>
                  <p className="font-semibold">Order ID:</p>
                  <p>{order._id}</p>
                </div>
                <div className="mt-2 md:mt-0">
                  <p className="font-semibold">Placed On:</p>
                  <p>{format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")}</p>
                </div>
                <div className="mt-2 md:mt-0">
                  <p className="font-semibold">Total:</p>
                  <p>₹{order.total}</p>
                </div>
                <div className="mt-2 md:mt-0">
                  <p className="font-semibold">Status:</p>
                  <p className="capitalize">{order.status}</p>
                </div>
              </div>

              <div className="text-md mb-4">
                <p className="font-semibold">Shipping To:</p>
                <p>
                  {order.shippingAddress.name}, {order.shippingAddress.street}{" "}
                  {order.shippingAddress.streetOptional}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state} - {order.shippingAddress.zipCode},{" "}
                  {order.shippingAddress.country}. Phone: {order.shippingAddress.phone}
                </p>
              </div>

              <div className="border-t pt-4 space-y-4">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between border-b pb-4"
                  >
                    <div className="flex gap-4">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-md"
                        width={100}
                        height={100}
                      />
                      <div>
                        <p className="font-semibold">{item.product.name}</p>
                        <p className="text-sm text-gray-600">
                          Variant: {item.variant.display}
                        </p>
                        <p className="text-sm">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-md font-semibold">₹{item.price}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
