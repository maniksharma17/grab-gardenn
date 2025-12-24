import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { ScrollingBanner } from "@/components/ScrollingBanner";
import axios from "axios";
import HomeSlider from "@/components/HomeSlider";
import HomeCategories from "@/components/HomeCategories";
import HomeFeatured1 from "@/components/HomeFeatured1";
import HomeFeatured2 from "@/components/HomeFeatured2";
import HomeKeyFeatures from "@/components/HomeKeyFeatures";
import HomeVideoSection from "@/components/HomeVideo";
import HomeTestimonials from "@/components/HomeTestimonials";
import HomeBlogSection from "@/components/HomeBlogSection";
import HomeImpactSection from "@/components/HomeImpactSection";
import HomeInstagramSection from "@/components/HomeInstagramSection";
import Certifications from "@/components/HomeCertificationsSection";

async function fetchCategories() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`
    );
    return response.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

async function fetchBlogs() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs`
    );
    return response.data || [];
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export default async function Home() {
  const categories = await fetchCategories();
  const blogs = await fetchBlogs();

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollingBanner />
      <Navbar />

      {/* Hero Section */}
      <HomeSlider />

      {/* Categories */}
      <HomeCategories categories={categories} />

      {/* Featured Products */}
      <HomeFeatured1 />
      <HomeFeatured2 />

      {/* Key Features Section */}
      <HomeKeyFeatures />

      {/* VIDEO */}
      <HomeVideoSection />

      {/* Testimonials Section */}
      <HomeTestimonials />

      {/* Blogs Section */}
      <HomeBlogSection blogs={blogs} />

      {/* Impact Section */}
      <HomeImpactSection />

      {/* Instagram Section */}
      <HomeInstagramSection />

      {/* Certifications Section */}
      <Certifications />

      <DiscountBox open={true} setOpen={function (x: boolean): void {
        throw new Error("Function not implemented.");
      } } />
      <DiscountBoxMobile open={true} setOpen={function (x: boolean): void {
        throw new Error("Function not implemented.");
      } } />
    </div>
  );
}



import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const DiscountBox = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (x: boolean) => void;
}) => {
  const { toast } = useToast();

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied 🎉",
      description: `${code} copied to clipboard`,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            🎄 CHRISTMAS MEGA SALE 🎄
          </DialogTitle>
          <DialogDescription className="space-y-3 text-sm">
            <p>
              Celebrate Christmas with pure, natural & healthy goodness 🌿
            </p>

            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="font-semibold text-green-800">
                🎁 Offer 1
              </p>
              <p>
                <strong>CHRISTMAS3</strong> — Buy any <strong>3 products</strong>{" "}
                for just <strong>₹599</strong>
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="font-semibold text-green-800">
                🎁 Offer 2
              </p>
              <p>
                <strong>CHRISTMAS4</strong> — Buy any <strong>4 products</strong>{" "}
                for just <strong>₹699</strong>
              </p>
            </div>

            <p className="text-xs text-muted-foreground">
              Valid on selected products only · Limited-time Christmas offer
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
  );
};


import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";

export const DiscountBoxMobile = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (x: boolean) => void;
}) => {
  const { toast } = useToast();

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied 🎉",
      description: `${code} copied to clipboard`,
    });
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="p-4">
        <DrawerHeader>
          <DrawerTitle>🎄 CHRISTMAS MEGA SALE 🎄</DrawerTitle>
          <DrawerDescription className="space-y-3 text-sm">
            <p>
              Stock up on healthy goodness this Christmas 🌿
            </p>

            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="font-semibold text-green-800">
                🎁 CHRISTMAS3
              </p>
              <p>Buy any 3 products for ₹599</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="font-semibold text-green-800">
                🎁 CHRISTMAS4
              </p>
              <p>Buy any 4 products for ₹699</p>
            </div>

            <p className="text-xs text-muted-foreground">
              Limited-time Christmas offer
            </p>
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            onClick={() => copyCode("CHRISTMAS3")}
          >
            COPY CHRISTMAS3
          </Button>
          <Button
            variant="outline"
            onClick={() => copyCode("CHRISTMAS4")}
          >
            COPY CHRISTMAS4
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
