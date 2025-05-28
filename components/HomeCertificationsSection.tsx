"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const Certifications = () => {
  const images = [
    "https://grabgardenn-storage.s3.ap-south-1.amazonaws.com/logos/fssai.png",
    "https://grabgardenn-storage.s3.ap-south-1.amazonaws.com/logos/msme.png",
    "https://grabgardenn-storage.s3.ap-south-1.amazonaws.com/logos/swach-bharat.png",
    "https://grabgardenn-storage.s3.ap-south-1.amazonaws.com/logos/make-in-india.webp",
  ];

  // Animation variants for container and items
  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section className="relative py-20 bg-white">
      {/* Background blur circle */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-100 rounded-full mix-blend-multiply blur-3xl opacity-30 -z-10"></div>

      <motion.div
        className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        {/* Left Side - Text */}
        <motion.div
          className="lg:w-1/2 text-left"
          variants={itemVariants}
        >
          <h2 className="text-4xl max-md:text-2xl font-medium text-primary mb-6 leading-tight tracking-tight">
            Our Certifications: A Promise of Quality and Trust
          </h2>
          <p className="text-md text-black leading-relaxed mt-2">
            At Grab Gardenn, we believe in transparency and excellence. Our products
            are proudly certified by leading government and quality assurance
            bodies in India, ensuring you always receive safe, ethical, and
            high-quality organic goods.
          </p>
        </motion.div>

        {/* Right Side - Certification Logos */}
        <motion.div
          className="lg:w-1/2 grid grid-cols-2 sm:grid-cols-2 gap-6"
          variants={containerVariants}
        >
          {images.map((src) => (
            <motion.div
              key={src}
              className="p-6 rounded-xl border shadow-sm flex items-center justify-center hover:shadow-md transition-all duration-300"
              variants={itemVariants}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.12)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image
                src={src}
                alt="Certification logo"
                width={200}
                height={200}
                className="object-contain max-h-32 w-auto"
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Certifications;
