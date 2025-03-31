"use client"
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // Import icons for mobile menu
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Privacy Policy Section */}
      <section className="py-8 mt-20">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl max-md:text-2xl font-medium text-primary">Privacy Policy</h1>
            <p className="text-gray-700 mt-4">Last updated on Mar 30, 2025</p>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 border border-gray-200">
            <p className="text-gray-700 mb-6 text-md">
              This privacy policy sets out how <strong>GRAB GARDENN HEALTHY FOODS</strong> uses and protects any information that you give us when you visit our website and/or purchase from us.
            </p>
            <p className="text-gray-700 mb-6 text-md">
              We are committed to ensuring that your privacy is protected. Any information you provide will only be used in accordance with this privacy statement.
            </p>

            {/* Information Collection */}
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
            <ul className="text-gray-700 text-sm list-disc pl-6 mb-6">
              <li>Name</li>
              <li>Contact information including email address</li>
              <li>Demographic information such as postcode, preferences, and interests</li>
              <li>Other information relevant to customer surveys and offers</li>
            </ul>

            {/* How We Use the Information */}
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 mb-6 text-sm">
              We require this information to understand your needs and provide better service, including:
            </p>
            <ul className="text-gray-700 list-disc pl-6 mb-6 text-sm">
              <li>Internal record keeping</li>
              <li>Improving our products and services</li>
              <li>Sending promotional emails about new products, special offers, or other relevant updates</li>
              <li>Contacting you for market research purposes via email, phone, fax, or mail</li>
              <li>Customizing the website according to your interests</li>
            </ul>

            {/* Cookies */}
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. How We Use Cookies</h2>
            <p className="text-gray-700 mb-6 text-sm">
              A cookie is a small file stored on your computer that helps analyze web traffic or tailor website interactions to your preferences.
            </p>
            <p className="text-gray-700 mb-6 text-sm">
              You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can modify your browser settings to decline them if preferred.
            </p>

            {/* Controlling Personal Information */}
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Controlling Your Personal Information</h2>
            <p className="text-gray-700 mb-6 text-sm">
              You may choose to restrict the collection or use of your personal information in the following ways:
            </p>
            <ul className="text-gray-700 list-disc pl-6 mb-6 text-sm">
              <li>Look for opt-out checkboxes when filling out website forms.</li>
              <li>If you&apos;ve previously agreed to receive marketing emails, you can opt out anytime by contacting us.</li>
            </ul>

            {/* Contact Information */}
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Contact Us</h2>
            <p className="text-gray-700 mb-6 text-sm">
              If you have any questions regarding this privacy policy, or if you believe any of the information we hold is incorrect, please contact us:
            </p>
            <ul className="text-gray-700 mb-6 text-sm">
              <li><strong>Address:</strong> Grab Gardenn Healthy Foods, Khasra No. 96, Salempur Industrial Area, Haridwar, Uttarakhand 247667</li>
              <li><strong>Phone:</strong> <a href="tel:+919258125550" className="text-primary underline">9258125550</a></li>
              <li><strong>Email:</strong> <a href="mailto:grabgardenn@gmail.com" className="text-primary underline">grabgardenn@gmail.com</a></li>
            </ul>
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

export default PrivacyPolicy;
