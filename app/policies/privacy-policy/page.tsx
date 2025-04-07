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
            <h1 className="text-4xl max-md:text-2xl font-medium text-primary">Privacy Policy</h1>
            <p className="text-gray-700 mt-4">Last updated on Mar 30, 2025</p>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 border border-gray-200 space-y-6 text-gray-700 text-md">
            <p>
              <strong>Grab Gardenn</strong> recognizes the importance of maintaining the privacy and confidentiality of our users' personal information.
            </p>

            <p>
              By providing your contact details, you consent to the use of this information by Grab Gardenn for the purpose of marketing and promotion. This includes but is not limited to communication via <strong>email, SMS, phone calls, and WhatsApp messages</strong>.
            </p>

            <p>
              These communications will pertain only to the <strong>products and services offered under the brand "Grab Gardenn"</strong> and will not be shared or sold to third parties for their marketing purposes.
            </p>

            <p>
              Your data is handled with strict confidentiality, and we take necessary measures to ensure it is secure and used solely for the intended purposes described in this policy.
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
