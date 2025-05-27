"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />

      <section className="py-8 mt-20">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl max-md:text-2xl font-medium text-primary">
              Privacy Policy
            </h1>
            <p className="text-gray-700 mt-4">Last updated on Mar 30, 2025</p>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 border border-gray-200 space-y-6 text-gray-700 text-md">
            <p>
              Grab Gardenn recognize the importance of maintaining the privacy
              and confidentiality of our users&apos; personal information. By
              providing the contact details, you give us the consent to use this
              information for marketing and promotional purposes, including the
              sending of emails, SMS, phone calls, and messages via WhatsApp.
              These communications pertain only to the products and services
              offered under the &quot;Grab Gardenn&quot;. Your contact information shall
              not be disclosed to third parties for marketing purposes.
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

export default PrivacyPolicy;
