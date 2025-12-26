
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
import ChristmasDiscountEntry from "@/components/DiscountPopUp";

async function fetchCategories() {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`
  );
  return res.data || [];
}

async function fetchBlogs() {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs`
  );
  return res.data || [];
}

export default async function Home() {
  const categories = await fetchCategories();
  const blogs = await fetchBlogs();

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollingBanner />
      <Navbar />

      <HomeSlider />
      <HomeCategories categories={categories} />
      <HomeFeatured1 />
      <HomeFeatured2 />
      <HomeKeyFeatures />
      <HomeVideoSection />
      <HomeTestimonials />
      <HomeBlogSection blogs={blogs} />
      <HomeImpactSection />
      <HomeInstagramSection />
      <Certifications />

      {/* Client-side promo UI */}
    </div>
  );
}
