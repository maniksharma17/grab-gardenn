"use client";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Leaf, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import Link from "next/link";
import { blogs, news, categories } from "@/lib/data";
import Image from "next/image";
import { ScrollingBanner } from "@/components/ScrollingBanner";
import { Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import InstagramEmbed from "@/components/InstagramEmbed";
import { useEffect, useState } from "react";


// Images for the carousel
const images = [
  "/hero/IMG_5860.JPG",
  "/hero/IMG_5858.JPG",
  "/hero/IMG_5855.JPG",
  "/hero/IMG_5897.JPG",
];

export default function Home() {
  const features = [
    {
      icon: <Leaf className="w-12 h-12 text-green-800" strokeWidth={1} />,
      title: "100% Organic",
      description:
        "All our products are certified organic and naturally grown.",
    },
    {
      icon: <Truck className="w-12 h-12 text-green-800" strokeWidth={1} />,
      title: "Free Delivery",
      description: "Free shipping on orders above Rs. 500.",
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

  const useScreenWidth = () => {
    const [screenWidth, setScreenWidth] = useState(
      typeof window !== "undefined" ? window.innerWidth : 0
    );
  
    useEffect(() => {
      const handleResize = () => setScreenWidth(window.innerWidth);
      
      window.addEventListener("resize", handleResize);
      
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  
    return screenWidth;
  };

  const screenWidth = useScreenWidth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <ScrollingBanner />
      {/* Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center text-center overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/story.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Dark Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/70"></div>

        {/* Hero Content */}
        <div className="relative z-10 text-white max-w-3xl px-6">
          <h1 className="text-3xl md:text-5xl text-white font-bold mb-6 leading-tight">
            Elevate Your Lifestyle with Pure Organic Goodness
          </h1>
          <p className="text-lg md:text-xl text-secondary mb-8 leading-relaxed">
            Experience the richness of nature with our carefully sourced organic
            products. Sustainably grown, ethically produced, and delivered fresh
            to your doorstep.
          </p>
          <Link href="/products">
            <Button
              size="lg"
              className="text-lg rounded-full bg-primary hover:bg-primary/90"
            >
              Explore Our Collection
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
          {/* Left Content */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-medium text-primary mb-4">
              What makes us different?
            </h2>
            <p className="text-gray-700 text-lg">
              At Grab Gardenn, we are committed to delivering pure, organic, and
              ethically sourced products straight from nature.
            </p>
          </div>

          {/* Features Grid */}
          <div className="w-full md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl shadow-md p-6 flex flex-col items-center md:items-start text-center md:text-left transition-all hover:shadow-lg border border-gray-300 duration-300"
              >
                <div className="p-4 bg-green-200 rounded-full mb-3">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-700 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="relative py-12 max-md:py-8 bg-secondary/10">
        <div className="container flex flex-row max-md:flex-col gap-4 justify-between items-center mx-auto px-6">
          <div className="z-40 absolute bottom-0 left-0 w-full h-full bg-primary/40 clip-top"></div>

          <div className="mb-8 md:w-1/3 p-4 z-40">
            <h2 className="text-4xl max-md:text-2xl font-medium text-left text-primary mb-4">
              Diverse Collection
            </h2>
            <p className="text-light text-left text-gray-700">
              Discover our diverse range of organic products, carefully
              categorized for your convenience.
            </p>
          </div>

          <div className="z-40 md:w-2/3 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-xl flex flex-col items-start text-left transition-all hover:shadow-lg duration-300"
              >
                <div className="w-full h-full rounded-md rounded-b-none overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={200}
                    height={200}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div className="w-full p-2 rounded-b-md bg-primary text-primary-foreground">
                  <h3 className="text-md font-medium">{category.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="relative py-16 border-t">
        <div className="z-0 absolute bottom-0 left-0 w-full h-full bg-secondary clip-bottom-left"></div>

        <div className="relative container mx-auto px-6">
          <h2 className="z-50 text-4xl max-md:text-2xl w-fit font-medium text-left mb-12">
            We recomment you these
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-2">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="relative bg-card rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-200 flex flex-col"
              >
                <Link href={`/products/${product.id}`} className="block">
                  <Image
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    width={200}
                    height={200}
                  />
                  <div className="absolute bg-black px-4 py-1 rounded-full top-2 right-2 flex items-center text-left justify-center">
                    <p className="font-normal text-white text-sm">
                      {product.rating}
                    </p>
                    <Star
                      className="w-4 h-4 text-yellow-500 ml-1"
                      fill="currentColor"
                    />
                  </div>
                </Link>
                <div className="py-4 text-center flex flex-col flex-grow">
                  <h3 className="text-wrap text-lg font-semibold text-gray-800">
                    {product.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/products">
              <Button
                variant="outline"
                size="lg"
                className="bg-black text-white hover:bg-black/90 hover:text-white"
              >
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-16 bg-white">
        <div className="z-auto container mx-auto px-6">
          <h2 className="text-4xl max-md:text-2xl  text-primary w-fit font-medium text-left mb-4">
            What Our Customers Say
          </h2>
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop
            spaceBetween={20}
            slidesPerView={screenWidth < 768 ? 1 : 3}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 5 },
            }}
            className="w-full"
          >
            {customerReviews.map((testimonial, index) => (
              <SwiperSlide key={index} className="text-center z-50">
                <div className="h-auto text-left border-l flex flex-col justify-between bg-white p-4 border-gray-200">
                  <p className="text-gray-800 text-sm">{testimonial.review}</p>
                  <div className="flex justify-start mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        fill="currentColor"
                        className={`w-4 h-4 ${
                          i < testimonial.rating
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-primary text-sm font-medium">
                    {testimonial.name}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>


      {/* Featured Blogs */}
      <section className="relative py-16 border-t">
        <div className="z-0 absolute bottom-0 left-0 w-full h-full bg-secondary clip-top"></div>

        <div className="relative container mx-auto px-6">
          <h2 className="z-50 text-4xl max-md:text-2xl w-fit font-medium text-left mb-12">
            Blogs
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {blogs.slice(0,4).map((blog) => (
              <div
                key={blog.id}
                className="relative bg-card rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-200 flex flex-col"
              >
                <Link href={`/content/blog/${blog.id}`} className="block">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-32 object-cover transition-transform duration-300 hover:scale-105"
                    width={200}
                    height={200}
                  />
                  
                </Link>
                <div className="py-4 text-left px-4 flex flex-col flex-grow">
                  <h3 className="text-wrap text-lg font-normal text-gray-800">
                    {blog.title}
                  </h3>
                </div>
              </div>
            ))}
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

      {/* Featured News */}
      <section className="relative py-16 border-t bg-primary/10">
        <div className="z-0 absolute bottom-0 left-0 w-full h-full bg-primary/50 clip-bottom"></div>

        <div className="relative container mx-auto px-6">
          <h2 className="z-50 text-4xl max-md:text-2xl w-fit font-medium text-left mb-12">
            News
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {news.slice(0,4).map((news) => (
              <div
                key={news.id}
                className="relative bg-card rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-200 flex flex-col"
              >
                <Link href={`/content/news/${news.id}`} className="block">
                  <Image
                    src={news.image}
                    alt={news.title}
                    className="w-full h-32 object-cover transition-transform duration-300 hover:scale-105"
                    width={200}
                    height={200}
                  />
                  
                </Link>
                <div className="py-4 text-left px-4 flex flex-col flex-grow">
                  <h3 className="text-wrap text-lg font-normal text-gray-800">
                    {news.title}
                  </h3>
                </div>
              </div>
            ))}
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

      {/* Impact Section */}
      <section className="relative py-20 bg-white">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
          {/* Left Side - Text */}
          <div className="lg:w-1/2 text-left">
            <h2 className="text-3xl max-md:text-2xl font-medium text-primary mb-6 leading-snug">
              Every Sale at Grab Gardenn Changes a Life
            </h2>

            <p className="text-md text-black leading-relaxed mt-2">
              Your small choice makes a big impact. Together, we can create a
              world where every girl gets an education and a chance to dream.
            </p>

            {/* CTA Button */}
            <div className="mt-4">
              <Button className="px-6 py-3 bg-primary text-white font-medium text-lg rounded-lg hover:bg-green-700 transition-all duration-300">
                Join the Movement
              </Button>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="relative w-full lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-lg">
              <Image
                src="/Orphans.png" // Use an impactful image
                alt="Educating Orphan Girls"
                width={600}
                height={500}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="relative border-t py-8 bg-white">
        <div className="container flex flex-row max-md:flex-col justify-center items-center mx-auto px-6 text-center">
          <div className="z-0 absolute bottom-0 left-0 w-full h-full bg-secondary clip-bottom-left"></div>
          <div className="md:w-1/3 text-left z-40">
            <h2 className="text-3xl max-md:text-2xl font-medium text-black mb-4">
              Follow Us on Instagram
            </h2>
            <p className="text-gray-800 mb-8 max-md:text-md">
              Stay updated with our latest products, news and behind-the-scenes
              moments!
            </p>
            {/* CTA Button */}
            <div className="mt-6">
              <Link
                href="https://www.instagram.com/grabgardenn/"
                target="_blank"
              >
                <Button variant={"outline"}>Follow Now</Button>
              </Link>
            </div>
          </div>

          {/* Instagram Embed */}
          <div className="w-2/3 z-40 flex max-md:flex-col justify-center">
            <div className="max-md:hidden">
              <InstagramEmbed url={"DHdUxzRJEFy"}/>
            </div>
            
            <InstagramEmbed url={"DHl5c19yUbc"} />
          </div>
        </div>
      </section>

      
    </div>
  );
}

const featuredProducts = [
  {
    id: 1,
    name: "Finger Millet Flour",
    image: "/product/IMG_6281.jpg",
    price: [120],
    cutoffPrice: [150],
    rating: 4.8,
    variants: ["1kg"],
  },

  {
    id: 3,
    name: "Naurangi Dal",
    image: "/product/IMG_6273.jpg",
    price: [160],
    cutoffPrice: [200],
    rating: 4.6,
    variants: ["1kg"],
  },

  {
    id: 5,
    name: "Wild Mustard",
    image: "/product/IMG_6264.jpg",
    price: [190],
    cutoffPrice: [230],
    rating: 4.7,
    variants: ["250g"],
  },
  {
    id: 6,
    name: "Barnyard Millet",
    image: "/product/IMG_6286.jpg",
    price: [140],
    cutoffPrice: [170],
    rating: 4.8,
    variants: ["500g"],
  },

  {
    id: 8,
    name: "Horse Gram",
    image: "/product/IMG_6291.jpg",
    price: [300],
    cutoffPrice: [350],
    rating: 4.9,
    variants: ["750ml"],
  },
  {
    id: 9,
    name: "Himalayan Salt",
    image: "/product/IMG_6260.jpg",
    price: [300],
    cutoffPrice: [350],
    rating: 4.9,
    variants: ["750ml"],
  },
];

const customerReviews = [
  {
    name: "Amit Kumar",
    review:
      "Exceptional quality! The freshness of these organic products is unmatched. You can truly taste the difference compared to store-bought options.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    review:
      "The jaggery powder is pure and has a rich, caramel-like sweetness. It dissolves beautifully in tea and is perfect for making homemade sweets.",
    rating: 4.8,
  },
  {
    name: "Rohan Verma",
    review:
      "Super fast delivery and eco-friendly packaging! Everything arrived fresh and well-sealed, which shows great care in handling and quality control.",
    rating: 5,
  },
  {
    name: "Neha Patel",
    review:
      "These pulses cook perfectly and have an amazing natural flavor. The texture is great, and I love knowing that they’re free from pesticides.",
    rating: 4.9,
  },
  {
    name: "Vikram Joshi",
    review:
      "Finally found truly organic products that are both healthy and delicious! The flavors are rich, and I feel great knowing I’m eating clean ingredients.",
    rating: 4.7,
  },
  {
    name: "Anjali Mehta",
    review:
      "The black rice has a nutty aroma and a wonderfully chewy texture. It's packed with nutrients and makes a fantastic alternative to white rice.",
    rating: 5,
  },
  {
    name: "Rajesh Sharma",
    review:
      "Loved the thoughtful, biodegradable packaging. It’s great to see a brand committed to sustainability while maintaining top-quality products.",
    rating: 4.8,
  },
  {
    name: "Sonia Kapoor",
    review:
      "The spices are incredibly fresh, fragrant, and full of flavor! I used the turmeric and cumin in my dishes, and the taste was noticeably better.",
    rating: 5,
  },
  {
    name: "Kunal Singh",
    review:
      "Hands down the best organic store online! The quality, taste, and freshness exceeded my expectations, and the variety of products is fantastic.",
    rating: 4.9,
  },
  {
    name: "Divya Reddy",
    review:
      "Customer support was friendly and helpful, guiding me to choose the best products. The overall experience, from shopping to delivery, was smooth.",
    rating: 4.7,
  },
];
