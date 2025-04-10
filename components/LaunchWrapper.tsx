"use client";
import React, { useEffect, useState } from "react";

const LaunchWrapper = ({ children }: { children: React.ReactNode }) => {
  const [showCountdown, setShowCountdown] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    // Create launch time as UTC timestamp (12 PM IST = 6:30 AM UTC)
    const launchTime = new Date(Date.UTC(2025, 3, 10, 5, 36)); // April = 3 (0-indexed)

    const updateCountdown = () => {
      const now = new Date();
      const diff = launchTime.getTime() - now.getTime();

      if (diff <= 0) {
        setShowCountdown(false);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      const formatted = `${days > 0 ? days + "d " : ""}${String(hours).padStart(
        2,
        "0"
      )}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

      setTimeLeft(formatted);
    };

    updateCountdown(); // Initial run
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval); // Clean up
  }, []);

  if (showCountdown) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white font-mono text-center px-4">
        <p className="mb-4 text-xl">Launching on 10th April, 1 PM IST</p>
        <p className="text-5xl tracking-widest min-h-[3rem]">{timeLeft}</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default LaunchWrapper;
