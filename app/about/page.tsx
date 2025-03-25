"use client";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Leaf, Heart, Globe, Users, CheckCircle } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* About Section */}
      <div className="mt-16 container mx-auto py-16 px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl max-md:text-2xl font-medium text-black mb-6">
            About Grab Gardenn
          </h2>
          <p className="text-md max-md:text-sm text-muted-foreground">
            Founded with a passion for healthy living and sustainable practices,
            Grab Gardenn has been your trusted source for premium organic
            products since 2020.
          </p>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {[
            {
              icon: Leaf,
              title: "100% Organic",
              desc: "We carefully select only the finest organic products, ensuring everything meets strict quality standards.",
            },
            {
              icon: Heart,
              title: "Health First",
              desc: "Your health is our priority. We believe in providing products that nourish both body and mind.",
            },
            {
              icon: Globe,
              title: "Sustainable Practices",
              desc: "We're committed to environmental sustainability in every aspect of our business.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="text-center bg-card p-6 rounded-lg shadow-md"
            >
              <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Our Mission Section */}
        <section className="relative bg-primary/10 rounded-xl flex flex-col md:flex-row items-center gap-10 md:gap-16 mb-16">
          {/* Left Side - Text Content */}
          <div className="w-full md:w-1/2 space-y-6 p-6">
            <h3 className="text-4xl font-bold text-primary">Our Mission</h3>
            <p className="text-lg leading-relaxed">
              At{" "}
              <span className="text-primary font-semibold">Grab Gardenn</span>,
              we believe everyone deserves access to high-quality organic
              products. Our mission is to make organic living{" "}
              <strong>accessible</strong>,<strong> enjoyable</strong>, and{" "}
              <strong>sustainable</strong>.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We work directly with certified organic farmers and producers to
              bring you the finest products while supporting{" "}
              <strong>sustainable agricultural practices</strong>.
            </p>

            {/* Key Points */}
            <ul className="space-y-4">
              {[
                "Certified organic products",
                "Direct farmer partnerships",
                "Eco-friendly packaging",
                "Community support programs",
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <CheckCircle className="text-primary w-6 h-6" />
                  <span className="text-lg text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side - Image */}
          <div className="w-full md:w-1/2 relative">
            <Image
              src="hero/IMG_5860.jpg"
              alt="Organic Farming"
              width={500}
              height={500}
              className="w-full h-[500px] rounded-r-lg object-cover"
            />
          </div>
        </section>

        {/* Join Our Journey */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-primary mb-6">
            Join Our Journey
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Be part of our mission to promote healthy living and sustainable
            practices. Start your organic journey with us today.
          </p>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white"
          >
            Shop Our Products
          </Button>
        </div>
      </div>
    </div>
  );
}
