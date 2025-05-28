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
    </div>
  );
}


// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// const DiscountBox = ({
//   open,
//   setOpen,
// }: {
//   open: boolean;
//   setOpen: (x: boolean) => void;
// }) => {
//   const { toast } = useToast();
//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>CONGRATULATIONS 🎉</DialogTitle>
//           <DialogDescription>
//             We are offering an extra 5% OFF for this summer. ORDER NOW with
//             promo code <strong>LAUNCH5</strong>.
//           </DialogDescription>
//         </DialogHeader>
//         <Button
//           variant={"outline"}
//           onClick={() => {
//             window.navigator.clipboard.writeText("LAUNCH5");
//             toast({ title: "Copied.", description: "LAUNCH5" });
//             setOpen(false);
//           }}
//         >
//           COPY LAUNCH5
//         </Button>
//       </DialogContent>
//     </Dialog>
//   );
// };

// import {
//   Drawer,
//   DrawerContent,
//   DrawerDescription,
//   DrawerHeader,
// } from "@/components/ui/drawer";
// import { useToast } from "@/hooks/use-toast";

// const DiscountBoxMobile = ({
//   open,
//   setOpen,
// }: {
//   open: boolean;
//   setOpen: (x: boolean) => void;
// }) => {
//   const { toast } = useToast();
//   return (
//     <Drawer open={open} onOpenChange={setOpen}>
//       <DrawerContent className="">
//         <DrawerHeader>
//           <DrawerHeader>CONGRATULATIONS 🎉</DrawerHeader>
//           <DrawerDescription>
//             We are offering an extra 5% OFF for this summer. ORDER NOW with
//             promo code <strong>LAUNCH5</strong>.
//           </DrawerDescription>
//         </DrawerHeader>
//         <Button
//           variant={"outline"}
//           onClick={() => {
//             window.navigator.clipboard.writeText("LAUNCH5");
//             toast({ title: "Copied.", description: "LAUNCH5" });
//             setOpen(false);
//           }}
//         >
//           COPY LAUNCH5
//         </Button>
//       </DrawerContent>
//     </Drawer>
//   );
// };
