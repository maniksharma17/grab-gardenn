import React from "react";
import Blogs from "@/components/BlogsPage";

interface Blog {
  _id: string;
  title: string;
  urlTitle: string;
  content: string;
  coverImage: string;
  tags: string[];
  createdAt: string;
}

async function getBlogs(): Promise<Blog[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch blogs");
  }

  return res.json();
}

const BlogsPage = async () => {
  const blogs = await getBlogs();

  return <Blogs blogs={blogs} />;
};

export default BlogsPage;
