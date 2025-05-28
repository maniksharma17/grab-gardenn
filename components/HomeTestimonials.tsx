"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

const HomeTestimonials = () => {
  return (
    <section className="relative py-20 bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.h2
          className="text-4xl max-md:text-2xl text-primary font-semibold mb-8 w-fit relative"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          What Our Customers Say
          <span className="block w-44 h-1 bg-primary rounded-full mt-2"></span>
        </motion.h2>

        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          loop
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
          }}
          className="w-full"
        >
          {customerReviews.map((testimonial, index) => (
            <SwiperSlide key={index} className="z-50">
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.12)" }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col justify-between h-full cursor-pointer"
              >
                <p className="text-gray-700 text-base leading-relaxed mb-5 min-h-[90px]">
                  “{testimonial.review}”
                </p>
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      fill={i < testimonial.rating ? "currentColor" : "none"}
                      stroke="currentColor"
                      className={`w-5 h-5 ${
                        i < testimonial.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-primary font-semibold text-lg">{testimonial.name}</p>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

const customerReviews = [
  {
    name: "Amit Kumar",
    review:
      "Exceptional quality! The freshness of these natural products is unmatched. You can truly taste the difference compared to store-bought options.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    review:
      "The jaggery powder is pure and has a rich, caramel-like sweetness. It dissolves beautifully in tea and is perfect for making homemade sweets.",
    rating: 4.8,
  },
  {
    name: "Rohan Verma",
    review:
      "Super fast delivery and eco-friendly packaging! Everything arrived fresh and well-sealed, which shows great care in handling and quality control.",
    rating: 5,
  },
  {
    name: "Neha Patel",
    review:
      "These pulses cook perfectly and have an amazing natural flavor. The texture is great, and I love knowing that they’re free from pesticides.",
    rating: 4.9,
  },
  {
    name: "Vikram Joshi",
    review:
      "Finally found truly natural and fresh products that are both healthy and delicious! The flavors are rich, and I feel great knowing I’m eating clean ingredients.",
    rating: 4.7,
  },
  {
    name: "Anjali Mehta",
    review:
      "The black rice has a nutty aroma and a wonderfully chewy texture. It's packed with nutrients and makes a fantastic alternative to white rice.",
    rating: 5,
  },
  {
    name: "Rajesh Sharma",
    review:
      "Loved the thoughtful, biodegradable packaging. It’s great to see a brand committed to sustainability while maintaining top-quality products.",
    rating: 4.8,
  },
  {
    name: "Sonia Kapoor",
    review:
      "The spices are incredibly fresh, fragrant, and full of flavor! I used the turmeric and cumin in my dishes, and the taste was noticeably better.",
    rating: 5,
  },
  {
    name: "Kunal Singh",
    review:
      "Hands down the best natural food products store online! The quality, taste, and freshness exceeded my expectations, and the variety of products is fantastic.",
    rating: 4.9,
  },
  {
    name: "Divya Reddy",
    review:
      "Customer support was friendly and helpful, guiding me to choose the best products. The overall experience, from shopping to delivery, was smooth.",
    rating: 4.7,
  },
];

export default HomeTestimonials;
