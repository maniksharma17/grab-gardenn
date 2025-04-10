"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import Image from "next/image";
import { useRecoilValue } from "recoil";
import { userState } from "@/store/atoms/user";
import { Navbar } from "@/components/Navbar";
import { ChevronDown, ChevronUp } from "lucide-react";

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
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const user = useRecoilValue(userState);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${user._id}`, {
          withCredentials: true,
          headers: {
            'Authorization': 'Bearer ' + user.token
          }
        });
        setOrders(res.data.orders);
      } catch (err) {
        console.log("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const toggleAccordion = (id: string) => {
    setExpandedOrder((prev) => (prev === id ? null : id));
  };

  if (loading) return <div className="text-center py-10 text-gray-600">Loading orders...</div>;

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-28 py-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-green-700">Your Orders</h1>

        {orders.length === 0 ? (
          <p className="text-center text-md text-gray-500">No orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="shadow-sm rounded-xl border border-gray-200 bg-white overflow-hidden"
              >
                <button
                  onClick={() => toggleAccordion(order._id)}
                  className="w-full text-left px-5 py-4 flex justify-between items-center hover:bg-gray-100 transition"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full text-sm sm:text-base">
                    <div>
                      <p className="font-medium text-gray-700">Order ID</p>
                      <p className="truncate text-gray-600">{order._id}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Placed On</p>
                      <p className="text-gray-600">{format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Total</p>
                      <p className="text-gray-600">₹{order.total}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Status</p>
                      <p className="capitalize text-green-600 font-semibold">{order.status}</p>
                    </div>
                  </div>
                  {expandedOrder === order._id ? <ChevronUp className="ml-4 shrink-0" /> : <ChevronDown className="ml-4 shrink-0" />}
                </button>

                {expandedOrder === order._id && (
                  <div className="px-5 pt-2 pb-6 bg-gray-50">
                    <div className="text-sm text-gray-700 mb-4">
                      <p className="font-semibold mb-1 text-gray-800">Shipping To:</p>
                      <p>
                        {order.shippingAddress.name}, {order.shippingAddress.street}{" "}
                        {order.shippingAddress.streetOptional && order.shippingAddress.streetOptional + ","}{" "}
                        {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                        {order.shippingAddress.zipCode}, {order.shippingAddress.country}.{" "}
                        Phone: {order.shippingAddress.phone}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row sm:items-start sm:justify-between border-b pb-4"
                        >
                          <div className="flex gap-4 mb-4 sm:mb-0">
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-20 h-20 object-cover rounded-md"
                              width={80}
                              height={80}
                            />
                            <div>
                              <p className="font-semibold text-gray-800">{item.product.name}</p>
                              <p className="text-sm text-gray-600">
                                Variant: {item.variant.display}
                              </p>
                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <div className="text-md font-semibold text-gray-800 sm:ml-auto">₹{item.price}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default OrdersPage;
