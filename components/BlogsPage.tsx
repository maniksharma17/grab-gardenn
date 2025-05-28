"use client"; // important to enable hooks and state

import { Navbar } from "@/components/Navbar";
import Image from "next/image";
import React, { useState } from "react";
import { format } from "date-fns";

interface Blog {
  _id: string;
  title: string;
  urlTitle: string;
  content: string;
  coverImage: string;
  tags: string[];
  createdAt: string;
}

interface BlogsProps {
  blogs: Blog[];
}

const ITEMS_PER_PAGE = 12;

const Blogs: React.FC<BlogsProps> = ({ blogs }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(blogs.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentBlogs = blogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to top on page change
  };

  console.log("Current Blogs:", currentBlogs);

  return (
    <main>
      <Navbar />
      <section className="flex items-center justify-center relative bg-primary mt-20 h-[200px]">
        <div>
          <h1 className="text-4xl font-semibold text-white text-center">
            Blogs & News
          </h1>
          <p className="text-center text-sm text-gray-100 mt-2">
            Stay updated with the latest news and insights from our community.
          </p>
        </div>
      </section>

      <section className="container mx-auto py-12 px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-6">
          {currentBlogs.map((blog) => (
            <div
              key={blog._id}
              className="border rounded-lg shadow-sm bg-white hover:shadow-lg transition-shadow duration-300"
            >
              <div className="overflow-hidden rounded-t-lg h-48">
                <Image
                  src={blog.coverImage}
                  alt={blog.title}
                  width={600}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-medium mb-2 line-clamp-2">
                  {blog.title}
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                  {format(new Date(blog.createdAt), "dd/MM/yyyy")}
                </p>
                <a
                  href={`/content/blog/${blog.urlTitle}`}
                  className="text-primary hover:underline font-medium"
                >
                  Read more
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center space-x-3 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border ${
              currentPage === 1
                ? "cursor-not-allowed text-gray-400 border-gray-300"
                : "hover:bg-primary hover:text-white border-primary text-primary"
            }`}
          >
            Prev
          </button>

          {/* Page Numbers */}
          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-1 rounded border ${
                  currentPage === pageNum
                    ? "bg-primary text-white border-primary"
                    : "hover:bg-primary hover:text-white border-gray-300 text-gray-700"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded border ${
              currentPage === totalPages
                ? "cursor-not-allowed text-gray-400 border-gray-300"
                : "hover:bg-primary hover:text-white border-primary text-primary"
            }`}
          >
            Next
          </button>
        </div>
      </section>
    </main>
  );
};

export default Blogs;
