"use client";
import React, { useState, useEffect } from "react";
import { Product } from "@/lib/types";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const featuredIds2 = ["67f104031676d55d895ba8ac", "67f104031676d55d895ba8a7"];

const HomeFeatured2 = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [slidesPerView, setSlidesPerView] = useState(3);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`
        );
        const allProducts: Product[] = response.data.products || [];

        const filtered = allProducts.filter((product) =>
          featuredIds2.includes(product._id)
        );
        setFeaturedProducts(filtered);
      } catch (err) {
        console.log("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const updateSlides = () => {
      const width = window.innerWidth;
      if (width < 640) setSlidesPerView(2);
      else if (width < 768) setSlidesPerView(3);
      else if (width < 1024) setSlidesPerView(4);
      else setSlidesPerView(5);
    };

    updateSlides();
    window.addEventListener("resize", updateSlides);
    return () => window.removeEventListener("resize", updateSlides);
  }, []);

  // Motion variants for product cards
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  };

  // Motion variant for heading
  const headingVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="relative py-8 bg-gray-100/30">
      <div className="z-0 absolute bottom-0 left-0 w-full h-full bg-primary/5 clip-right"></div>

      <div className="relative container mx-auto px-6">
        <motion.h2
          className="z-50 text-4xl max-md:text-2xl w-fit font-medium text-left mb-12"
          initial="hidden"
          animate="visible"
          variants={headingVariants}
        >
          Healthy Sweeteners
        </motion.h2>

        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          spaceBetween={20}
          slidesPerView={slidesPerView}
          className="w-full"
        >
          {featuredProducts.map((product) => (
            <SwiperSlide key={product._id} className="text-center z-50">
              <motion.div
                className="relative bg-card rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-200 flex flex-col"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={cardVariants}
              >
                <Link href={`/products/${product._id}`} className="block">
                  <div className="w-full aspect-square relative">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      className="object-cover opacity-100 hover:opacity-0 transition-all duration-300 hover:scale-105"
                      fill
                      sizes="100%"
                    />

                    {product.images.length > 1 && (
                      <Image
                        src={product.images[1]}
                        alt={product.name}
                        className="object-cover opacity-0 hover:opacity-100 transition-all duration-300 hover:scale-105"
                        fill
                        sizes="100%"
                      />
                    )}
                  </div>
                </Link>
                <div className="py-4 text-center flex flex-col flex-grow px-2">
                  <h3 className="h-16 text-wrap text-lg font-semibold text-gray-800">
                    {product.name}
                  </h3>
                  <div className="flex flex-row gap-4 justify-center items-center">
                    <p className="text-lg font-medium text-primary text-gray-600 mt-1">
                      ₹{product.price?.[0]?.toLocaleString() ?? "—"}
                    </p>
                    <p className="text-lg font-medium text-gray-800  mt-1">
                      {product.variants?.[0].display?.toLocaleString() ?? "—"}
                    </p>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default HomeFeatured2;
