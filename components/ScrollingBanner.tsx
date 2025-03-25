"use client";

import { useEffect, useState } from "react";

const messages = [
  "🔥 Limited-time organic discounts – Shop Now! 🔥",
  "🚛 Free Shipping on Orders Above $50 🚛",
  "🌿 100% Fresh & Organic – Quality Guaranteed 🌿",
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
      className={`w-full mt-20 h-8 bg-primary text-primary-foreground flex items-center justify-center overflow-hidden transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
      }`}
    >
      <div key={currentIndex} className="font-semibold text-xs uppercase whitespace-nowrap">
        {messages[currentIndex]}
      </div>
    </div>
  );
}
