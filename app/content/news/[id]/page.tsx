"use client";

import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { news, blogs } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Facebook, Twitter, Linkedin } from "lucide-react";

export default function ArticlePage() {
  const { id } = useParams();

  // Find article in news or blogs
  const article =
    news.find((item) => item.id === Number(id)) ||
    blogs.find((item) => item.id === Number(id));

  if (!article) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-primary">Article Not Found</h2>
        <p className="text-muted-foreground">The article you are looking for does not exist.</p>
        <Link href="/content">
          <Button className="mt-4">Back to News & Blogs</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="mt-20 container mx-auto py-12 px-6 max-w-2xl">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-900 text-center">{article.title}</h1>

        {/* Date & Social Icons */}
        <div className="text-center text-sm text-muted-foreground mt-2 flex items-center justify-center gap-4">
          <span>{article.date}</span>
          <div className="flex gap-3">
            <Link href="#" className="hover:text-blue-500">
              <Facebook className="w-5 h-5" />
            </Link>
            <Link href="#" className="hover:text-blue-400">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="#" className="hover:text-blue-700">
              <Linkedin className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Featured Image */}
        <Image
          src={article.image}
          alt={article.title}
          width={600}
          height={350}
          className="w-full h-auto rounded-md shadow-md mt-6"
        />

        {/* Article Content */}
        <div className="mt-6 space-y-4 text-gray-700 leading-relaxed">
          {article.content.split("\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {/* Back Button */}
        <div className="mt-10 text-center">
          <Link href="/content">
            <Button variant="outline" size="lg" className="flex items-center">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to News & Blogs
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
