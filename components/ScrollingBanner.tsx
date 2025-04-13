"use client";

import { useEffect, useState } from "react";

const messages = [
  "Limited-time Fresh discounts – Shop Now!",
  "Free Shipping on Orders Above ₹1000!",
  "100% Fresh & Natural – Quality Guaranteed",
];

export function ScrollingBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY < 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`fixed z-50 top-0 left-0 right-0 w-full h-5 bg-primary text-primary-foreground flex items-center justify-center overflow-hidden transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
      }`}
    >
      <div key={currentIndex} className="font-bold text-xs uppercase whitespace-nowrap">
        {messages[currentIndex]}
      </div>
    </div>
  );
}
