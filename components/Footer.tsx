import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-green-100 to-white pt-16">
      {/* Illustration */}
      <div className="flex justify-center">
        
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-gray-700">
          {/* Brand Info */}
          <div>
            <Image
              src="/grab-gardenn-logo.png"
              alt="Organic Haven Logo"
              width={100}
              height={100}
              className="mb-4"
            />
            <p className="mt-2 text-sm">
              Fresh, natural, and eco-friendly products delivered with love.  
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-green-600 transition">Home</Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-green-600 transition">Products</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-green-600 transition">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-green-600 transition">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Customer Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/policies/faq" className="hover:text-green-600 transition">FAQ</Link>
              </li>
              <li>
                <Link href="/policies/shipping-and-delivery" className="hover:text-green-600 transition">Shipping & Delivery</Link>
              </li>
              <li>
                <Link href="/policies/cancellation-and-refund" className="hover:text-green-600 transition">Cancellation & Refund</Link>
              </li>
              <li>
                <Link href="/policies/privacy-policy" className="hover:text-green-600 transition">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/policies/terms-and-conditions" className="hover:text-green-600 transition">Terms & Conditions</Link>
              </li>
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Follow Us</h4>
            <div className="flex space-x-4">
              <Link href="https://facebook.com" target="_blank">
                <Facebook className="h-5 w-5 text-gray-600 hover:text-green-600 transition" />
              </Link>
              <Link href="https://www.instagram.com/grabgardenn/" target="_blank">
                <Instagram className="h-5 w-5 text-gray-600 hover:text-green-600 transition" />
              </Link>
              <Link href="https://youtube.com/@grabgardenn?si=QBKa8gfdN5ZtHf5f" target="_blank">
                <Youtube className="h-5 w-5 text-gray-600 hover:text-green-600 transition" />
              </Link>
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mt-6">Subscribe</h4>
            <p className="text-sm text-gray-600 mt-1">Get updates on new arrivals & offers</p>
            <div className="mt-3 flex">
              <input
                type="email"
                placeholder="Your email"
                className="w-full p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <button className="bg-green-600 text-white px-4 rounded-r-md hover:bg-green-700 transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="text-center text-sm text-gray-500 mt-12 border-t pt-4 pb-4">
          © {new Date().getFullYear()} GRAB GARDENN HEALTHY FOODS. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
