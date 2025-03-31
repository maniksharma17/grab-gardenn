"use client";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";

const ShippingAndDelivery = () => {
  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Shipping and Delivery Section */}
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
          <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 border border-gray-200">
            <p className="text-gray-700 mb-6 text-md">
              <strong>GRAB GARDENN HEALTHY FOODS</strong> believes in helping its customers as far as possible and has a liberal cancellation policy.
            </p>

            {/* Cancellation Policy */}
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Order Cancellations</h2>
            <p className="text-gray-700 mb-6 text-sm">
              Cancellations will be considered only if requested within <strong>7 days</strong> of placing the order. However, cancellations may not be accepted if the order has already been shipped.
            </p>
            <p className="text-gray-700 mb-6 text-sm">
              Orders for perishable items like flowers and eatables are not eligible for cancellation. However, if the delivered product is of poor quality, a refund or replacement may be provided upon verification.
            </p>

            {/* Damaged or Defective Items */}
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Damaged or Defective Products</h2>
            <p className="text-gray-700 mb-6 text-sm">
              If you receive a damaged or defective item, please report it to our Customer Service within <strong>7 days</strong> of receiving the product. The request will be processed after verification.
            </p>

            {/* Product Not as Expected */}
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Product Not as Expected</h2>
            <p className="text-gray-700 mb-6 text-sm">
              If you believe the received product does not match its description or your expectations, contact our Customer Service within <strong>7 days</strong> of receiving it. Our team will review your complaint and take appropriate action.
            </p>

            {/* Refund Policy */}
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Refund Policy</h2>
            <p className="text-gray-700 mb-6 text-sm">
              If a refund is approved by <strong>GRAB GARDENN HEALTHY FOODS</strong>, it will be processed within <strong>6-8 business days</strong> and credited to the original payment method.
            </p>
          </div>

          {/* Back to Home Button */}
          <div className="text-center mt-12">
            <Link href="/">
              <Button variant={"outline"}>
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShippingAndDelivery;
