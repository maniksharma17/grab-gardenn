"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

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

/**
 * Client-only entry for Christmas discount UI
 * Handles both desktop (Dialog) and mobile (Drawer)
 */
export default function ChristmasDiscountEntry() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  // Auto-open once per session
  useEffect(() => {
    const seen = sessionStorage.getItem("christmas_offer_seen");
    if (!seen) {
      setOpen(true);
      sessionStorage.setItem("christmas_offer_seen", "true");
    }
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: `${code} Copied`,
    });
    setOpen(false);
  };

  return (
    <>
      {/* -------------------- DESKTOP (Dialog) -------------------- */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="
    hidden md:block sm:max-w-[450px]
    bg-white
    shadow-xl
    data-[state=open]:animate-in
  "
        >
          <DialogHeader>
            <DialogTitle className="text-xl">
              🎄 CHRISTMAS MEGA SALE 🎄
            </DialogTitle>

            <DialogDescription className="space-y-3 text-sm">
              <p>
                Celebrate Christmas with pure, natural & healthy goodness 🌿
              </p>

              {/* Eligible products */}
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-2">
                  Eligible Products
                </p>
                <div className="flex flex-wrap gap-2">
                  {ELIGIBLE_PRODUCTS.map((product) => (
                    <span
                      key={product}
                      className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 border"
                    >
                      {product}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <p className="font-semibold text-green-800">🎁 CHRISTMAS3</p>
                <p>
                  Buy any <strong>3 products</strong> for just{" "}
                  <strong>₹599</strong>
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <p className="font-semibold text-green-800">🎁 CHRISTMAS4</p>
                <p>
                  Buy any <strong>4 products</strong> for just{" "}
                  <strong>₹699</strong>
                </p>
              </div>

              <p className="text-xs text-muted-foreground">
                Valid on selected products · Limited-time Christmas offer
              </p>
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-3 mt-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => copyCode("CHRISTMAS3")}
            >
              COPY CHRISTMAS3
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => copyCode("CHRISTMAS4")}
            >
              COPY CHRISTMAS4
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* -------------------- MOBILE (Drawer) -------------------- */}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="md:hidden p-4">
          <DrawerHeader>
            <DrawerTitle>🎄 CHRISTMAS MEGA SALE 🎄</DrawerTitle>
            <DrawerDescription className="space-y-3 text-sm">
              <p>Stock up on healthy goodness this Christmas 🌿</p>

              {/* Eligible products */}
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-2">
                  Eligible Products
                </p>
                <div className="flex flex-wrap gap-2">
                  {ELIGIBLE_PRODUCTS.map((product) => (
                    <span
                      key={product}
                      className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 border"
                    >
                      {product}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <p className="font-semibold text-green-800">CHRISTMAS3</p>
                <p>Buy any 3 products for ₹599</p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <p className="font-semibold text-green-800">CHRISTMAS4</p>
                <p>Buy any 4 products for ₹699</p>
              </div>

              <p className="text-xs text-muted-foreground">
                Limited-time Christmas offer
              </p>
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-2">
            <Button variant="outline" onClick={() => copyCode("CHRISTMAS3")}>
              COPY CHRISTMAS3
            </Button>
            <Button variant="outline" onClick={() => copyCode("CHRISTMAS4")}>
              COPY CHRISTMAS4
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
