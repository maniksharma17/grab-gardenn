"use client";

import React from "react";
import { Leaf, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { motion } from "framer-motion";

const HomeKeyFeatures = () => {
  const features = [
    {
      icon: <Leaf className="w-12 h-12 text-green-800" strokeWidth={1} />,
      title: "100% Natural",
      description:
        "All our products are certified healthy and naturally grown.",
    },
    {
      icon: <Truck className="w-12 h-12 text-green-800" strokeWidth={1} />,
      title: "Free Delivery",
      description: "Free shipping on orders above Rs. 1000.",
    },
    {
      icon: (
        <ShieldCheck className="w-12 h-12 text-green-800" strokeWidth={1} />
      ),
      title: "Quality Guaranteed",
      description: "100% satisfaction or money-back guarantee.",
    },
    {
      icon: (
        <ShoppingBag className="w-12 h-12 text-green-800" strokeWidth={1} />
      ),
      title: "Eco-Friendly Packaging",
      description: "Sustainable and zero-waste packaging for a better planet.",
    },
  ];

  // Container variants to stagger children animations
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  // Each feature card animation
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  // Left content animation
  const leftVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-10 max-w-7xl">
        {/* Left Content */}
        <motion.div
          className="w-full md:w-1/2 text-center md:text-left"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={leftVariants}
        >
          <h2 className="text-3xl md:text-5xl font-medium text-primary mb-4">
            What makes us different?
          </h2>
          <p className="text-gray-700 text-lg">
            At Grab Gardenn, we are committed to delivering pure, healthy, and
            ethically sourced products straight from nature.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="w-full md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="bg-gray-50 rounded-xl shadow-md p-6 flex flex-col items-center md:items-start text-center md:text-left transition-all hover:shadow-lg border border-gray-300 duration-300"
            >
              <div className="p-4 bg-green-200 rounded-full mb-3">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-700 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HomeKeyFeatures;
