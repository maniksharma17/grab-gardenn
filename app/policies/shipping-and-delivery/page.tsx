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
              <strong>Grab Gardenn</strong> commits to dispatching orders within <strong>5 business days</strong> of order confirmation. However, delivery timelines may vary based on your location and the prevailing logistical circumstances.
            </p>

            <p>
              The estimated delivery window is up to <strong>30 business days</strong> from the date of dispatch. Once the order is handed over to our logistics partner, any delays in transit are beyond our control and shall not be attributed to Grab Gardenn.
            </p>

            <p>
              In case of multiple unsuccessful delivery attempts where the order is returned to our warehouse, we will arrange for <strong>one-time free reshipment</strong> to the customer’s address.
            </p>

            <p>
              If your products are <strong>lost or damaged during shipment</strong>, we will either replace the product or offer a refund as per our refund policy.
            </p>

            <p>
              To claim a refund or replacement for damaged/lost goods, customers must follow the procedure detailed in our Refund Policy, which includes submitting an <strong>unboxing video</strong> and relevant <strong>photographic evidence</strong>.
            </p>
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
