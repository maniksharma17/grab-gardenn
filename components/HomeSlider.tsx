"use client";

import React, { useState } from "react";
import { useWindowWidth } from "@/lib/utils";
import Loading from "./Loading";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const HomeSlider = () => {
  const screenWidth = useWindowWidth();
  const [activeIndex, setActiveIndex] = useState(0); // <-- Track active index

  const carouselImages = [
    {
      src: "https://grabgardenn-storage-bucket.s3.ap-south-1.amazonaws.com/home-banner-1.jpg",
      href: "/products",
      heading: "Purity Rooted in Tradition",
      text: "Pure, local, and nourishing ingredients passed down through generations.",
    },
    {
      src: "https://grabgardenn-storage-bucket.s3.ap-south-1.amazonaws.com/home-banner-7.png",
      href: "/products",
      heading: "Nature’s Finest, Packed with Care",
      text: "Every product is a promise of purity, nutrition, and the rich heritage of the mountains.",
    },
    {
      src: "https://grabgardenn-storage-bucket.s3.ap-south-1.amazonaws.com/home-banner-4.jpeg",
      href: "/products",
      heading: "Goodness from the Hills",
      text: "Naturally grown ingredients, rich in purity and Himalayan tradition.",
    },
  ];

  const carouselImagesMobile = [
    {
      src: "https://grabgardenn-storage-bucket.s3.ap-south-1.amazonaws.com/home-banner-2.jpg",
      href: "/products",
      heading: "The Taste of Culture, The Purity of Nature",
      text: "Experience Himalayan ingredients passed down through generations—pure, local, and full of natural nourishment.",
    },
  ];

  if (screenWidth === null) return <Loading />;

  const currentCarousel =
    screenWidth > 800 ? carouselImages : carouselImagesMobile;

  return (
    <section className="relative w-full h-auto flex items-center justify-center text-center overflow-hidden">
      {/* Background Image Carousel */}
      <div className="top-0 left-0 right-0 bottom-0 max-md:mt-20 w-full h-[700px] sm:h-[750px] overflow-hidden">
        <Swiper
          modules={[Pagination, Autoplay]}
          slidesPerView={1}
          loop
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{
            clickable: true,
            el: ".custom-pagination",
          }}
          onSlideChange={(swiper) =>
            setActiveIndex(swiper.realIndex)
          } // <-- Track real index
          className="w-full h-full"
        >
          {currentCarousel.map((image, index) => (
            <SwiperSlide key={image.src} className="relative w-full h-full">
              <Link
                href={image.href}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={image.src}
                  alt={`Banner ${index + 1}`}
                  fill
                  priority={index === 0}
                  unoptimized
                  className="object-cover h-full w-full transition-opacity duration-1000 opacity-100"
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/10 max-md:hidden to-transparent z-10" />

        {/* Pagination dots */}
        <div className="custom-pagination absolute bottom-4 w-full flex justify-center gap-2 z-20" />
      </div>

      {/* Text Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-20 px-4 md:px-10">
        <div
          className={`relative max-w-3xl ${
            screenWidth > 800
              ? "ml-auto text-center items-end"
              : "mx-auto text-center items-center"
          } flex flex-col items-center gap-6`}
        >
          <div className="mb-4 mt-10">
            <Image
              src="/new-logo.png"
              alt="LOGO"
              height={160}
              width={160}
              unoptimized
              priority
              className="mx-auto bg-white object-contain"
            />
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-white drop-shadow-xl">
              {currentCarousel[activeIndex]?.heading}
            </h1>
            <p className="mt-4 mb-6 md:w-1/2 text-center mx-auto text-white text-md md:text-lg leading-relaxed drop-shadow-lg">
              {currentCarousel[activeIndex]?.text}
            </p>
            <Link href="/products">
              <Button
                size="lg"
                className="text-lg font-bold py-8 px-12 rounded-full shadow-xl bg-green-700 text-white hover:bg-green-900/90 hover:scale-105 transition-all duration-300"
              >
                Explore Our Collection
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeSlider;
