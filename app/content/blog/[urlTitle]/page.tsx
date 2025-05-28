import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Facebook, Twitter, Linkedin } from "lucide-react";

interface Blog {
  _id: string;
  title: string;
  urlTitle: string;
  content: string;
  coverImage: string;
  createdAt: string;
}

async function getBlogByUrlTitle(urlTitle: string): Promise<Blog | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs/${urlTitle}`,
    { next: { revalidate: 60 } } // cache for 60 sec, adjust as needed
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}

interface BlogPageProps {
  params: { urlTitle: string };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { urlTitle } = params;
  const article = await getBlogByUrlTitle(urlTitle);

  if (!article) {
    notFound(); // Render Next.js 404 page
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <main className="mt-20 container mx-auto py-12 px-6 max-w-2xl">
        {/* Title */}
        <h1 className="text-3xl max-md:text-xl font-semibold text-gray-900 my-3 text-center">
          {article.title}
        </h1>

        {/* Date & Social Icons */}
        <div className="text-center text-sm text-muted-foreground mt-2 flex items-center justify-center gap-4">
          <span>{new Date(article.createdAt).toLocaleDateString("en-US")}</span>
          <div className="flex gap-3">
            <Link
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                `${process.env.NEXT_PUBLIC_SITE_URL}/content/blog/${article.urlTitle}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500"
            >
              <Facebook className="w-5 h-5" />
            </Link>

            <Link
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                `${process.env.NEXT_PUBLIC_SITE_URL}/content/blog/${article.urlTitle}`
              )}&text=${encodeURIComponent(article.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400"
            >
              <Twitter className="w-5 h-5" />
            </Link>

            <Link
              href={`https://www.linkedin.com/shareArticle?url=${encodeURIComponent(
                `${process.env.NEXT_PUBLIC_SITE_URL}/content/blog/${article.urlTitle}`
              )}&title=${encodeURIComponent(article.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-700"
            >
              <Linkedin className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Featured Image */}
        <Image
          src={article.coverImage}
          alt={article.title}
          width={600}
          height={350}
          className="w-full h-auto rounded-md shadow-md mt-6"
          priority
        />

        {/* Article Content */}
        <div className="mt-6 space-y-4 text-gray-700 leading-relaxed whitespace-pre-line">
          {article.content}
        </div>
      </main>
    </div>
  );
}
