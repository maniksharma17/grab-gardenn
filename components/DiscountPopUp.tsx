"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

const ELIGIBLE_PRODUCTS = [
  "Chamomile Tea",
  "Herbal Tea",
  "Tea Masala",
  "Blue Pea Tea",
  "Moringa Powder",
  "Finger Millet",
  "Hand Grounded Salt",
  "Litchi Honey",
  "Sundarban Honey",
];

export default function ChristmasDiscountEntry() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  // Show once per session
  useEffect(() => {
    const seen = sessionStorage.getItem("christmas_offer_seen");
    if (!seen) {
      setOpen(true);
      sessionStorage.setItem("christmas_offer_seen", "true");
    }
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: `${code} copied 🎉` });
    setOpen(false);
  };

  if (!open) return null;

  return (
    <>
      {/* ---------------- DESKTOP POPUP ---------------- */}
      <div className="hidden md:block fixed bottom-6 right-6 z-[999] w-[420px]">
        <div className="bg-white rounded-xl shadow-2xl border p-5 space-y-4 relative">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-3 right-3 text-gray-400 hover:text-black"
          >
            <X size={18} />
          </button>

          <h3 className="text-lg font-bold">
            🎄 Christmas Mega Sale
          </h3>

          <p className="text-sm text-gray-600">
            Celebrate Christmas with pure, natural & healthy goodness 🌿
          </p>

          {/* Eligible products */}
          <div>
            <p className="text-xs font-semibold mb-2">
              Eligible Products
            </p>
            <div className="flex flex-wrap gap-2">
              {ELIGIBLE_PRODUCTS.map((p) => (
                <span
                  key={p}
                  className="text-xs px-2 py-1 rounded-full bg-gray-100 border"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Offers */}
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <p className="font-semibold text-green-800">
              🎁 CHRISTMAS3
            </p>
            <p className="text-sm">
              Buy any 3 products for ₹599
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <p className="font-semibold text-green-800">
              🎁 CHRISTMAS4
            </p>
            <p className="text-sm">
              Buy any 4 products for ₹699
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => copyCode("CHRISTMAS3")}
            >
              Copy CHRISTMAS3
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => copyCode("CHRISTMAS4")}
            >
              Copy CHRISTMAS4
            </Button>
          </div>
        </div>
      </div>

      {/* ---------------- MOBILE POPUP ---------------- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[999]">
        <div className="bg-white rounded-t-2xl shadow-2xl border-t p-4 space-y-4 relative">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-3 right-4 text-gray-400"
          >
            <X size={18} />
          </button>

          <h3 className="font-bold">
            🎄 Christmas Mega Sale
          </h3>

          <div className="flex flex-wrap gap-2">
            {ELIGIBLE_PRODUCTS.map((p) => (
              <span
                key={p}
                className="text-xs px-2 py-1 rounded-full bg-gray-100 border"
              >
                {p}
              </span>
            ))}
          </div>

          <div className="bg-green-50 border rounded-md p-3">
            <p className="font-semibold">CHRISTMAS3</p>
            <p className="text-sm">3 items for ₹599</p>
          </div>

          <div className="bg-green-50 border rounded-md p-3">
            <p className="font-semibold">CHRISTMAS4</p>
            <p className="text-sm">4 items for ₹699</p>
          </div>

          <Button onClick={() => copyCode("CHRISTMAS3")}>
            Copy CHRISTMAS3
          </Button>
        </div>
      </div>
    </>
  );
}
