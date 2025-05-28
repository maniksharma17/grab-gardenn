"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import Link from "next/link";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const reels = [
  "https://www.instagram.com/reel/DIjmr3_yGet",
  "https://www.instagram.com/reel/DJw4dXSSnN-",
  "https://www.instagram.com/reel/DJBT3VzJTck",
  "https://www.instagram.com/reel/DILaWsPpJnx",
  "https://www.instagram.com/reel/DICT4UpT17r",
  "https://www.instagram.com/reel/DHdUxzRJEFy",
];

const InstagramReelsCarousel = () => {
  return (
    <section className="relative bg-gradient-to-b from-gray-100 to-green-800 py-20 px-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="container mx-auto text-center"
      >
        <h2 className="text-4xl max-md:text-2xl font-bold text-primary mb-6 leading-tight tracking-tight">
          Connect with us on Instagram
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-6">
          Get a closer look at our work, behind-the-scenes, and more on Instagram!
        </p>

        {/* Follow Button */}
        <Link
          href="https://www.instagram.com/grabgardenn/"
          target="_blank"
          className="inline-block mb-10"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="bg-black text-white px-6 py-2 rounded-full text-lg shadow-md hover:bg-gray-900 transition-all"
          >
            Follow @grabgardenn
          </motion.button>
        </Link>

        <style jsx global>{`
          .swiper-button-next,
          .swiper-button-prev {
            color: white !important;
            font-weight: bold;
            text-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
          }
        `}</style>

        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={10} // tighter spacing
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            768: { slidesPerView: 2, spaceBetween: 4 },
            1024: { slidesPerView: 4, spaceBetween: 4 },
          }}
        >
          {reels.map((url) => (
            <SwiperSlide key={url}>
              <motion.div
                whileInView={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="flex justify-center w-fit mx-auto"
              >
                <iframe
                  src={`${url}/embed`}
                  width="300"
                  height="540"
                  className="rounded-xl w-fit shadow-lg"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </section>
  );
};

export default InstagramReelsCarousel;
