"use client";
import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { motion } from "framer-motion";

const HomeImpactSection = () => {
  return (
    <section className="relative py-24 bg-white overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-100 rounded-full mix-blend-multiply blur-3xl opacity-30 -z-10"></div>

      <div className="container mx-auto px-6 flex flex-col-reverse lg:flex-row items-center gap-16">
        {/* Left Side - Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="lg:w-1/2 text-left"
        >
          <h2 className="text-4xl max-md:text-2xl font-bold text-primary mb-6 leading-tight tracking-tight">
            Every Sale at <span className="text-green-600">Grab Gardenn</span>{" "}
            Changes a Life
          </h2>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            Your small choice makes a{" "}
            <span className="font-semibold text-black">big impact</span>. Every
            product you buy helps support local{" "}
            <span className="text-green-700">Himalayan farmers</span> and
            contributes to the education of
            <span className="text-green-700"> underprivileged girls</span> in
            remote villages.
          </p>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            At Grab Gardenn, commerce is a{" "}
            <span className="font-semibold">force for good</span>. We reinvest a
            portion of every sale into initiatives like classroom construction,
            school supplies, and mentorship programs.
          </p>

          <p className="text-lg text-gray-800 leading-relaxed">
            Together, we’re not just promoting{" "}
            <span className="text-green-700">organic living</span> — we’re
            cultivating
            <span className="font-semibold"> hope, opportunity</span>, and a
            future where every child has the
            <span className="font-semibold"> chance to dream big</span>.
          </p>

          <div className="mt-8">
            <Button
              onClick={() => {}}
              className="w-fit px-4 py-5 bg-black text-white text-lg font-medium rounded-xl hover:bg-black/90 transition-all duration-300 shadow-sm"
            >
              Join the Movement
            </Button>
          </div>
        </motion.div>

        {/* Right Side - Image */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="lg:w-1/2 w-full flex justify-center"
        >
          <div className="relative w-full max-w-xl rounded-3xl overflow-hidden shadow-lg ring-4 ring-green-100">
            <Image
              src="/Orphans.png"
              alt="Educating Orphan Girls"
              width={1000}
              height={800}
              className="object-cover w-full h-full"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeImpactSection;
