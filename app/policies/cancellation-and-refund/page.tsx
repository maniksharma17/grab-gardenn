"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";

const CancellationAndRefund = () => {
  return (
    <>
      <Navbar />

      <section className="py-8 mt-20">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl max-md:text-2xl font-medium text-primary">
              Cancellation and Refund
            </h1>
            <p className="text-gray-700 mt-4">Last updated on Mar 30, 2025</p>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 border border-gray-200 space-y-6 text-gray-700 text-md">
            <p>
              If the item is found damaged or defective after receipt, the customer shall be entitled to an exchange subject to the specified claim process.
            </p>

            <p>
              Only those customers will be eligible for replacement who submit an <strong>unboxing video</strong> and <strong>clear photo evidence</strong> showing the damage or defects <strong>within 24 hours</strong> of delivery.
            </p>

            <p>
              This proof must be sent to <a href="mailto:grabgardenn@gmail.com" className="text-primary underline">grabgardenn@gmail.com</a> within the specified time frame.
            </p>

            <p>
              Claims not filed as per the defined procedure or within the specified time period will be classified as invalid, and the customer will not be entitled to an exchange.
            </p>

            <p>
              <strong>Grab Gardenn</strong> reserves the right to examine and confirm the claim before determining whether a replacement is warranted.
            </p>

            <p>
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

export default CancellationAndRefund;
