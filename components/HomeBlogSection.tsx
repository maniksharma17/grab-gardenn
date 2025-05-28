"use client";

import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { motion } from "framer-motion";

const HomeBlogSection = ({ blogs }: any) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative py-16 border-t">
      <div className="z-0 absolute bottom-0 left-0 w-full h-full bg-secondary clip-top"></div>

      <div className="relative container mx-auto px-6">
        <motion.h2
          className="text-4xl max-md:text-2xl w-fit font-semibold text-left mb-12 relative"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          Blogs
          <span className="block h-1 w-24 bg-primary rounded-full mt-2"></span>
        </motion.h2>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left Big Blog Card */}
          <motion.div
            className="flex-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            variants={cardVariants}
          >
            {blogs[0] && (
              <div className="bg-card rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-200 flex flex-col h-full">
                <Link href={`/content/blog/${blogs[0].urlTitle}`} className="block">
                  <Image
                    src={blogs[0].coverImage}
                    alt={blogs[0].title}
                    className="w-full h-full object-cover transition-transform duration-300"
                    width={800}
                    height={400}
                  />
                </Link>
                <div className="flex items-center justify-center py-4 px-6 text-left">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                      {blogs[0].title}
                    </h3>
                    <p className="max-lg:hidden">
                      {blogs[0].content.length > 400
                        ? `${blogs[0].content.slice(0, 400)}...`
                        : blogs[0].content}
                      {blogs[0].content.length > 400 && (
                        <Link
                          href={`/content/blog/${blogs[0].urlTitle}`}
                          className="text-primary hover:underline"
                        >
                          Read more
                        </Link>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Right 3 Smaller Blogs Vertically */}
          <div className="flex flex-col gap-4 w-full lg:w-1/3">
            {blogs.slice(1, 4).map((blog: any, index: number) => (
              <motion.div
                key={blog.id}
                className="bg-card rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-200 flex flex-col"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.2 }}
                variants={cardVariants}
              >
                <Link href={`/content/blog/${blog.urlTitle}`} className="block">
                  <Image
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-32 object-cover transition-transform duration-300"
                    width={400}
                    height={200}
                  />
                </Link>
                <div className="py-4 px-4 text-left">
                  <h3 className="text-lg font-medium text-gray-800">
                    {blog.title.slice(0, 100)}
                    {blog.title.length > 100 ? "..." : ""}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href="/content">
            <Button
              variant="outline"
              size="lg"
              className="bg-black text-white hover:bg-black/90 hover:text-white"
            >
              View More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeBlogSection;
