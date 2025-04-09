"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";

const ShippingAndDelivery = () => {
  return (
    <>
      <Navbar />

      <section className="py-8 mt-20">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl max-md:text-2xl font-medium text-primary">
              Shipping and Delivery
            </h1>
            <p className="text-gray-700 mt-4">Last updated on Mar 30, 2025</p>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 border border-gray-200 space-y-6 text-gray-700 text-md">
            <p>
            Grab Gardenn commits to dispatching orders within 5 business days of order confirmation.
            The estimated delivery period may extend up to 30 business days, depending on the logistical circumstances and the location of delivery.            </p>

            <p>
            Once the Goods are dispatched, Grab Gardenn shall no longer bear responsibility for any delay in delivery, as such delays shall be attributable to the logistics partner. In the event of multiple unsuccessful delivery attempts, whereby the Goods are returned to our warehouse, Grab Gardenn will arrange for One reshipment without additional cost to the customer.            </p>

            <p>
            If products are lost or damaged during shipment, Grab Gardenn will offer a replacement or refund, as per the refund policy. Claims for damaged or lost shipments must be made in accordance with the procedure set forth in our Refund Policy, which includes submitting an unboxing video and photographic evidence.            </p>

           
          </div>

          {/* Back to Home Button */}
          <div className="text-center mt-12">
            <Link href="/">
              <Button variant={"outline"}>Back to Home</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShippingAndDelivery;
