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
import { useEffect, useState } from "react";
import axios from "axios";
import { Product } from "@/lib/types";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function Home() {
  const screenWidth = useWindowWidth();
  const [open, setOpen] = useState(true);

  const carouselImages = [
    {
      src: "https://grabgardenn-storage.s3.ap-south-1.amazonaws.com/banners/home-banner-1.jpg",
      href: "/products",
      heading: "Purity Rooted in Tradition",
      text: "Pure, local, and nourishing ingredients passed down through generations.",
    },
    {
      src: "https://grabgardenn-storage.s3.ap-south-1.amazonaws.com/banners/home-banner-7.png",
      href: "/products",
      heading: "Nature’s Finest, Packed with Care",
      text: "Every product is a promise of purity, nutrition, and the rich heritage of the mountains.",
    },
    {
      src: "https://grabgardenn-storage.s3.ap-south-1.amazonaws.com/banners/home-banner-4.jpeg",
      href: "/products",
      heading: "Goodness from the Hills",
      text: "Naturally grown ingredients, rich in purity and Himalayan tradition.",
    },
  ];
  


  const carouselImagesMobile = [
    {
      src: "https://grabgardenn-storage.s3.ap-south-1.amazonaws.com/banners/home-banner-2.jpg",
      href: "/products",
      heading: "The Taste of Culture, The Purity of Nature",
      text: "Experience Himalayan ingredients passed down through generations—pure, local, and full of natural nourishment.",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const currentCarousel =
    screenWidth > 800 ? carouselImages : carouselImagesMobile;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % currentCarousel.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentCarousel.length]);

  const router = useRouter();
  if (screenWidth === null) return <Loading />;

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollingBanner />
      <Navbar />

      <section className="relative w-full h-screen flex items-center justify-center text-center overflow-hidden">
        {/* Background Image or Carousel */}
        <div className="top-0 left-0 right-0 bottom-0 mt-16 max-md:mt-20 w-full h-[140px] sm:h-[600px] overflow-hidden">
          {currentCarousel.map((image, index) =>
            index === currentSlide ? (
              <Link
                key={image.src}
                href={`products/collection/${image.href}`}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={image.src}
                  alt={`Banner ${index + 1}`}
                  fill
                  priority
                  unoptimized
                  className="object-cover transition-opacity duration-1000 opacity-100"
                />
              </Link>
            ) : null
          )}

          {screenWidth < 800 ? (
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-white/10 to-black/30 inset-0"></div>
          ) : (
            <></>
          )}

          {/* Dots */}
          <div className="absolute bottom-4 w-full flex justify-center gap-2 z-10">
            {carouselImages.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-end">
          <div className="relative z-10 p-10 max-w-3xl text-center px-6">
            <div className="mx-auto mb-8">
              <Image
                src={"/new-logo.png"}
                alt="LOGO"
                height={400}
                priority
                width={400}
                unoptimized
                className="mx-auto object-contain"
              />
            </div>

            {/* Only render current slide heading and text */}
            {currentCarousel.map((item, index) =>
              index === currentSlide ? (
                <div
                  key={index}
                  className=""
                >
                  <div className="text-3xl md:w-1/2 mx-auto md:text-4xl font-extrabold leading-tight bg-gradient-to-r from-green-500 via-lime-400 to-white max-md:from-gray-200 max-md:to-white max-md:mb-4 bg-clip-text text-transparent drop-shadow-lg">
                    <h1>{item.heading}</h1>
                    {screenWidth > 800 && (
                      <p className="text-lg md:text-lg md:mx-auto text-gray-100 font-normal mt-6 mb-4 lg:mb-8 leading-relaxed drop-shadow-md">
                        {item.text}
                      </p>
                    )}
                  </div>
                  <Link href="/products">
                    <Button
                      size="lg"
                      className="text-lg font-medium py-8 px-12 rounded-full shadow-xl bg-green-600 text-white hover:bg-green-500/90 hover:scale-105 transition-all duration-300"
                    >
                      Explore Our Collection
                    </Button>
                  </Link>
                </div>
              ) : null
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-[250px] bg-white [clip-path:polygon(0%_100%,0%_70%,10%_80%,20%_70%,30%_80%,40%_70%,50%_80%,60%_70%,70%_80%,80%_70%,90%_80%,100%_70%,100%_100%)]"></div>
      </section>

      {/* Categories */}
      <Categories />

      <FeaturedProducts1 />
      <FeaturedProducts3 />

      <Features />
      {/* VIDEO */}
      <VideoSection />

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
            {blogs.slice(0, 4).map((blog) => (
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
            {news.slice(0, 4).map((news) => (
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
            <h2 className="text-4xl max-md:text-2xl font-medium text-primary mb-6 leading-snug">
              Every Sale at Grab Gardenn Changes a Life
            </h2>

            <p className="text-md text-black leading-relaxed mt-2">
              Your small choice makes a big impact. Every product you buy helps
              support local Himalayan farmers and directly contributes to the
              education of underprivileged girls in remote villages.
              <br />
              <br />
              At Grab Gardenn, we believe commerce can be a force for good. We
              reinvest a portion of every sale into grassroots initiatives —
              from building classrooms and providing school supplies to
              supporting mentorship programs for young girls.
              <br />
              <br />
              Together, we’re not just promoting wellness through organic living
              — we’re cultivating hope, opportunity, and a future where every
              child has the chance to dream big and rise.
            </p>

            {/* CTA Button */}
            <div className="mt-4">
              <Button
                onClick={() => {
                  router.push("/products");
                }}
                className="px-6 py-3 bg-primary text-white font-medium text-lg rounded-lg hover:bg-green-700 transition-all duration-300"
              >
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
                className="object-cover rounded-xl"
                
              />
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="z-30 relative border-t py-8 bg-white">
        <div className="container flex flex-col justify-center items-center mx-auto px-6 text-center">
          <div className="z-0 absolute bottom-0 left-0 w-full h-full bg-secondary clip-bottom-left"></div>
          <div className="mb-6 text-center z-40">
            <h2 className="text-4xl max-md:text-2xl font-medium text-primary mb-4">
              Connect with us on Instagram
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
                <Button>Follow Now</Button>
              </Link>
            </div>
          </div>

          {/* Instagram Embed */}
          <div className="z-40 flex flex-row gap-4 items-center">
            <InstagramEmbed url={"DILaWsPpJnx"} mobileScreen={true} />
            <InstagramEmbed url={"DICT4UpT17r"} mobileScreen={false} />
            <InstagramEmbed url={"DHdUxzRJEFy"} mobileScreen={false} />
          </div>
        </div>
      </section>

      <Certifications />

    </div>
  );
}

const Categories = () => {
  const router = useRouter();
  return (
    <section className="relative py-4 max-md:py-10 bg-secondary/10">
      <div className="container mx-auto px-6 relative z-10">
        {/* Heading */}
        <div className="mb-10 max-w-xl relative z-10">
          <h2 className="text-4xl max-md:text-2xl font-semibold text-primary mb-3">
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

const featuredIds1 = [
  "67f0f763ef3a71e4b97f7c16",
  "67f0f763ef3a71e4b97f7c1b",
  "67f0faf9bfbf7a585cef8f49",
  "67f0faf9bfbf7a585cef8f4e",
  "67f0faf9bfbf7a585cef8f53",
];
const FeaturedProducts1 = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [slidesPerView, setSlidesPerView] = useState(3);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`
        );
        const allProducts: Product[] = response.data.products || [];

        const filtered = allProducts.filter((product) =>
          featuredIds1.includes(product._id)
        );
        setFeaturedProducts(filtered);
      } catch (err) {
        console.log("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Set slidesPerView based on screen width
    const updateSlides = () => {
      const width = window.innerWidth;
      if (width < 640) setSlidesPerView(2);
      else if (width < 768) setSlidesPerView(3);
      else if (width < 1024) setSlidesPerView(4);
      else setSlidesPerView(5);
    };

    updateSlides();
    window.addEventListener("resize", updateSlides);
    return () => window.removeEventListener("resize", updateSlides);
  }, []);

  return (
    <section className="relative py-16">
      <div className="z-0 absolute bottom-0 left-0 w-full h-full bg-secondary clip-bottom-left"></div>

      <div className="relative container mx-auto px-6">
        <h2 className="z-50 text-4xl max-md:text-2xl w-fit font-medium text-left mb-12">
          Natural Millets & Pulses
        </h2>

        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          loop
          spaceBetween={20}
          slidesPerView={slidesPerView}
          className="w-full"
        >
          {featuredProducts.map((product) => (
            <SwiperSlide key={product._id} className="text-center z-50">
              <div className="relative bg-card rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-200 flex flex-col">
                <Link href={`/products/${product._id}`} className="block">
                  <div className="w-full aspect-square relative">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      className="object-cover opacity-100 hover:opacity-0 transition-all duration-300 hover:scale-105"
                      fill
                      unoptimized
                      sizes="100%"
                    />

                    {product.images.length > 1 && (
                      <Image
                        src={product.images[1]}
                        alt={product.name}
                        className="object-cover opacity-0 hover:opacity-100 transition-all duration-300 hover:scale-105"
                        fill
                        sizes="100%"
                        unoptimized
                      />
                    )}
                  </div>
                </Link>
                <div className="py-4 text-center flex flex-col flex-grow px-2">
                  <h3 className="h-16 text-wrap text-lg font-semibold text-gray-800">
                    {product.name}
                  </h3>
                  <div className="flex flex-row gap-4 justify-center items-center">
                    <p className="text-lg font-medium text-primary text-gray-600 mt-1">
                      ₹{product.price?.[0]?.toLocaleString() ?? "—"}
                    </p>
                    <p className="text-lg font-medium text-gray-800  mt-1">
                      {product.variants?.[0].display?.toLocaleString() ?? "—"}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

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
  );
};

const featuredIds3 = ["67f104031676d55d895ba8ac", "67f104031676d55d895ba8a7"];
const FeaturedProducts3 = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [slidesPerView, setSlidesPerView] = useState(3);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`
        );
        const allProducts: Product[] = response.data.products || [];

        const filtered = allProducts.filter((product) =>
          featuredIds3.includes(product._id)
        );
        setFeaturedProducts(filtered);
      } catch (err) {
        console.log("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Set slidesPerView based on screen width
    const updateSlides = () => {
      const width = window.innerWidth;
      if (width < 640) setSlidesPerView(2);
      else if (width < 768) setSlidesPerView(3);
      else if (width < 1024) setSlidesPerView(4);
      else setSlidesPerView(5);
    };

    updateSlides();
    window.addEventListener("resize", updateSlides);
    return () => window.removeEventListener("resize", updateSlides);
  }, []);

  return (
    <section className="relative py-8 bg-gray-100/30">
      <div className="z-0 absolute bottom-0 left-0 w-full h-full bg-primary/5 clip-right"></div>

      <div className="relative container mx-auto px-6">
        <h2 className="z-50 text-4xl max-md:text-2xl w-fit font-medium text-left mb-12">
          Healthy Sweeteners
        </h2>

        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          spaceBetween={20}
          slidesPerView={slidesPerView}
          className="w-full"
        >
          {featuredProducts.map((product) => (
            <SwiperSlide key={product._id} className="text-center z-50">
              <div className="relative bg-card rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-200 flex flex-col">
                <Link href={`/products/${product._id}`} className="block">
                  <div className="w-full aspect-square relative">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      className="object-cover opacity-100 hover:opacity-0 transition-all duration-300 hover:scale-105"
                      fill
                      sizes="100%"
                    />

                    {product.images.length > 1 && (
                      <Image
                        src={product.images[1]}
                        alt={product.name}
                        className="object-cover opacity-0 hover:opacity-100 transition-all duration-300 hover:scale-105"
                        fill
                        sizes="100%"
                      />
                    )}
                  </div>
                </Link>
                <div className="py-4 text-center flex flex-col flex-grow px-2">
                  <h3 className="h-16 text-wrap text-lg font-semibold text-gray-800">
                    {product.name}
                  </h3>
                  <div className="flex flex-row gap-4 justify-center items-center">
                    <p className="text-lg font-medium text-primary text-gray-600 mt-1">
                      ₹{product.price?.[0]?.toLocaleString() ?? "—"}
                    </p>
                    <p className="text-lg font-medium text-gray-800  mt-1">
                      {product.variants?.[0].display?.toLocaleString() ?? "—"}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

const featuredIds2 = ["67f10c0e5b69d18777fe46f7", "67f10c0e5b69d18777fe46fa"];
const FeaturedProducts2 = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [slidesPerView, setSlidesPerView] = useState(3);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`
        );
        const allProducts: Product[] = response.data.products || [];

        const filtered = allProducts.filter((product) =>
          featuredIds2.includes(product._id)
        );
        setFeaturedProducts(filtered);
      } catch (err) {
        console.log("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Set slidesPerView based on screen width
    const updateSlides = () => {
      const width = window.innerWidth;
      if (width < 640) setSlidesPerView(2);
      else if (width < 768) setSlidesPerView(3);
      else if (width < 1024) setSlidesPerView(4);
      else setSlidesPerView(5);
    };

    updateSlides();
    window.addEventListener("resize", updateSlides);
    return () => window.removeEventListener("resize", updateSlides);
  }, []);

  return (
    <section className="relative py-8 bg-secondary/20">
      <div className="z-0 absolute bottom-0 left-0 w-full h-full bg-primary/5 clip-right"></div>

      <div className="relative container mx-auto px-6">
        <h2 className="z-50 text-4xl max-md:text-2xl w-fit font-medium text-left mb-12">
          Our Best Beverages
        </h2>

        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          spaceBetween={20}
          slidesPerView={slidesPerView}
          className="w-full"
        >
          {featuredProducts.map((product) => (
            <SwiperSlide key={product._id} className="text-center z-50">
              <div className="relative bg-card rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-200 flex flex-col">
                <Link href={`/products/${product._id}`} className="block">
                  <div className="w-full aspect-square relative">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      className={`object-cover opacity-100 ${
                        product.images.length > 2 && "hover:opacity-0"
                      } transition-all duration-300 hover:scale-105`}
                      fill
                      sizes="100%"
                      
                    />

                    {product.images.length > 1 && (
                      <Image
                        src={product.images[1]}
                        alt={product.name}
                        className="object-cover opacity-0 hover:opacity-100 transition-all duration-300 hover:scale-105"
                        fill
                        sizes="100%"
                      />
                    )}
                  </div>
                </Link>
                <div className="py-4 text-center flex flex-col flex-grow px-2">
                  <h3 className="h-16 text-wrap text-lg font-semibold text-gray-800">
                    {product.name}
                  </h3>
                  <div className="flex flex-row gap-4 justify-center items-center">
                    <p className="text-lg font-medium text-primary text-gray-600 mt-1">
                      ₹{product.price?.[0]?.toLocaleString() ?? "—"}
                    </p>
                    <p className="text-lg font-medium text-gray-800  mt-1">
                      {product.variants?.[0].display?.toLocaleString() ?? "—"}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

const Features = () => {
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

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
        {/* Left Content */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-medium text-primary mb-4">
            What makes us different?
          </h2>
          <p className="text-gray-700 text-lg">
            At Grab Gardenn, we are committed to delivering pure, healthy, and
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
  );
};

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}
const InstagramEmbed = ({
  url,
  mobileScreen,
}: {
  url: string;
  mobileScreen: boolean;
}) => {
  return (
    <div
      className={`mt-6 h-full justify-center ${
        mobileScreen ? "flex" : "max-md:hidden"
      }`}
    >
      <iframe
        src={`https://www.instagram.com/p/${url}/embed`}
        width="300"
        height="580"
        className="border border-gray-300 rounded-lg shadow-md"
      ></iframe>
    </div>
  );
};

const VideoSection = () => {
  return (
    <section className="py-12 px-4 bg-white">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left: Video */}
        <div className="w-full md:w-1/2 rounded-xl overflow-hidden shadow-md">
          <video
            src="https://grabgardenn-storage.s3.ap-south-1.amazonaws.com/videos/story.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right: Text */}
        <div className="w-full md:w-1/2">
          <h2 className="text-4xl font-medium text-primary mb-4">
            Rooted in Nature
          </h2>
          <p className="text-md text-gray-700 leading-relaxed space-y-4">
            Grab Gardenn brings the freshest organic goods straight from the
            hills to your home. From ancient grains to herbal infusions, every
            product is handpicked with care and rooted in tradition.
            <br />
            <br />
            Our mission is simple — to reconnect people with the purity of
            nature. We partner with local farmers in the Himalayas who follow
            sustainable and chemical-free farming practices passed down through
            generations.
            <br />
            <br />
            Whether you&apos;re sipping our Buransh tea or cooking with heirloom
            pulses, you&apos;re not just eating clean — you&apos;re becoming a
            part of a larger story, one that values wellness, sustainability,
            and authenticity.
          </p>
        </div>
      </div>
    </section>
  );
};

const Certifications = () => {
  const images = [
    "https://grabgardenn-storage.s3.ap-south-1.amazonaws.com/logos/fssai.png",
    "https://grabgardenn-storage.s3.ap-south-1.amazonaws.com/logos/msme.png",
    "https://grabgardenn-storage.s3.ap-south-1.amazonaws.com/logos/swach-bharat.png",
    "https://grabgardenn-storage.s3.ap-south-1.amazonaws.com/logos/make-in-india.webp",
  ];

  return (
    <div className="max-md:grid max-md:grid-cols-2 max-md:p-6 flex flex-row items-center bg-white max-md:flex-col justify-center gap-8">
      {images.map((src) => {
        return (
          <div key={src}>
            <Image
              src={src}
              alt="src"
              width={200}
              height={200}
              className="max-md:h-30 max-md:w-30"
            />
          </div>
        );
      })}
    </div>
  );
};

const customerReviews = [
  {
    name: "Amit Kumar",
    review:
      "Exceptional quality! The freshness of these natural products is unmatched. You can truly taste the difference compared to store-bought options.",
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
      "Finally found truly natural and fresh products that are both healthy and delicious! The flavors are rich, and I feel great knowing I’m eating clean ingredients.",
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
      "Hands down the best natural food products store online! The quality, taste, and freshness exceeded my expectations, and the variety of products is fantastic.",
    rating: 4.9,
  },
  {
    name: "Divya Reddy",
    review:
      "Customer support was friendly and helpful, guiding me to choose the best products. The overall experience, from shopping to delivery, was smooth.",
    rating: 4.7,
  },
];

import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useWindowWidth } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const DiscountBox = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (x: boolean) => void;
}) => {
  const {toast} = useToast();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>CONGRATULATIONS 🎉</DialogTitle>
          <DialogDescription>
            We are offering an extra 5% OFF for this summer. ORDER NOW with promo code <strong>LAUNCH5</strong>. 
          </DialogDescription>
        </DialogHeader>
        <Button
          variant={"outline"}
          onClick={() => {
            window.navigator.clipboard.writeText("LAUNCH5");
            toast({title: "Copied.", description: "LAUNCH5"});
            setOpen(false);
          }}
        >
          COPY LAUNCH5
        </Button>
      </DialogContent>
    </Dialog>
  );
};


import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

const DiscountBoxMobile = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (x: boolean) => void;
}) => {
  const {toast} = useToast();
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="">
        <DrawerHeader>
          <DrawerHeader>CONGRATULATIONS 🎉</DrawerHeader>
          <DrawerDescription>
            We are offering an extra 5% OFF for this summer. ORDER NOW with promo code <strong>LAUNCH5</strong>. 
          </DrawerDescription>
        </DrawerHeader>
        <Button
          variant={"outline"}
          onClick={() => {
            window.navigator.clipboard.writeText("LAUNCH5");
            toast({title: "Copied.", description: "LAUNCH5"})
            setOpen(false);
          }}
        >
          COPY LAUNCH5
        </Button>
      </DrawerContent>
    </Drawer>
  );
};
