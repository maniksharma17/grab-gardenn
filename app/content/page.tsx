"use client";

import { Navbar } from "@/components/Navbar";
import { news, blogs } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function NewsAndBlogsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="mt-20 text-center py-12 px-6">
        <h1 className="text-3xl md:text-4xl font-medium text-black mb-4">
          News & Blogs
        </h1>
        <p className="text-sm max-md:text-lg text-muted-foreground max-w-2xl mx-auto">
          Stay updated with the latest news and insightful blogs about organic
          farming, health, and sustainability.
        </p>
      </section>

      {/* News Section */}
      <div className="container mx-auto py-12 px-6">
        <h2 className="text-3xl max-md:text-xl font-normal text-gray-700 mb-4">Latest News</h2>
        <div className="overflow-x-auto scrollbar-hide pb-2">
          <div className="flex gap-6">
            {news.map((item) => (
              <Link key={item.id} href={`content/news/${item.id}`}>
                <div className="min-w-[280px] md:min-w-[350px] bg-card shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-all">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.summary}
                    </p>
                    <Button
                      variant="link"
                      size="sm"
                      className="px-0 mt-3 text-primary flex items-center"
                    >
                      Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Section (Vertical Layout) */}
      <div className="container mx-auto pt-4 pb-12 px-6">
        <h2 className="text-3xl max-md:text-xl font-normal text-gray-700 mb-4">Latest Blogs</h2>
        <div className="flex flex-col gap-8">
          {blogs.map((blog) => (
            <Link key={blog.id} href={`content/blog/${blog.id}`}>
              <div className="flex flex-col md:flex-row bg-card shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-all">
                {/* Blog Image (Left on larger screens) */}
                <Image
                  src={blog.image}
                  alt={blog.title}
                  width={350}
                  height={250}
                  className="w-full md:w-1/3 h-48 object-cover"
                />
                
                {/* Blog Content (Right) */}
                <div className="p-6 flex flex-col items-start justify-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {blog.summary}
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    className="px-0 mt-3 text-primary flex items-center"
                  >
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
