"use client";

import React from "react";
import { motion } from "framer-motion";

const HomeVideoSection = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-12 max-w-7xl">
        {/* Left: Video */}
        <motion.div
          className="w-full md:w-1/2 rounded-2xl overflow-hidden shadow-xl"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <video
            src="https://grabgardenn-storage.s3.ap-south-1.amazonaws.com/videos/story.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover rounded-2xl"
          />
        </motion.div>

        {/* Right: Text */}
        <motion.div
          className="w-full md:w-1/2"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <h2 className="text-4xl font-semibold text-primary mb-6 relative inline-block">
            Rooted in Nature
            <span className="block w-20 h-1 bg-primary rounded-full mt-2"></span>
          </h2>
          <p className="text-md text-gray-700 leading-relaxed space-y-6 whitespace-pre-line">
            {`Grab Gardenn brings the freshest organic goods straight from the hills to your home. From ancient grains to herbal infusions, every product is handpicked with care and rooted in tradition.

Our mission is simple — to reconnect people with the purity of nature. We partner with local farmers in the Himalayas who follow sustainable and chemical-free farming practices passed down through generations.

Whether you're sipping our Buransh tea or cooking with heirloom pulses, you're not just eating clean — you're becoming a part of a larger story, one that values wellness, sustainability, and authenticity.`}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeVideoSection;
