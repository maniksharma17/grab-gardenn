"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react'

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
}

const HomeCategories = ({categories}: {categories: Category[]}) => {
  const router = useRouter();
  return (
    <section className="relative py-16 max-md:py-10 bg-secondary/10">
      <div className="container mx-auto px-6 relative z-10">
        {/* Heading */}
        <div className="mb-10 max-w-xl relative z-10">
          <h2 className="text-4xl max-md:text-2xl font-semibold text-gray-800 mb-3">
            EXPLORE OUR DIVERSE COLLECTION
          </h2>
          <p className="text-gray-700 text-md">
            Discover our diverse range of natural products, carefully
            categorized for your convenience.
          </p>
        </div>

        {/* Category Cards */}
        <div className="flex gap-6 overflow-x-auto scrollbar-thin scrollbar-thumb-primary py-2 relative z-10">
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() => {
                router.push(
                  "products/collection/" + category.name.toLowerCase()
                );
              }}
              className="min-w-[200px] cursor-pointer flex-shrink-0 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="w-[200px] h-[140px] rounded-t-xl overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={200}
                  height={140}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 bg-gray-800 text-primary-foreground rounded-b-xl">
                <h3 className="text-md font-medium">{category.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeCategories;