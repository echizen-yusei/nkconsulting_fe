"use client";

import Image, { StaticImageData } from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";

import { Navigation } from "swiper/modules";

type ImageSwiperProps = {
  listImages: StaticImageData[];
  slidePerView?: number;
  initialSlide?: number;
  swiperRef: React.MutableRefObject<SwiperType | null>;
  prevRef: React.MutableRefObject<HTMLButtonElement | null>;
  nextRef: React.MutableRefObject<HTMLButtonElement | null>;
  onSwiper: (swiper: SwiperType) => void;
  onSlideChange: (swiper: SwiperType) => void;
  onClick?: (swiper: SwiperType) => void;
  showNavigationButtons?: boolean;
  isBeginning?: boolean;
  isEnd?: boolean;
  imageClassName?: string;
  navigationButtonClassName?: string;
};

const ImageSwiper = ({
  listImages,
  slidePerView = 1,
  initialSlide = 0,
  swiperRef,
  prevRef,
  nextRef,
  onSwiper,
  onSlideChange,
  onClick,
  showNavigationButtons = true,
  isBeginning = true,
  isEnd = false,
  imageClassName = "",
  navigationButtonClassName = "",
}: ImageSwiperProps) => {
  return (
    <>
      <Swiper
        initialSlide={initialSlide}
        slidesPerView={slidePerView}
        spaceBetween={16}
        onBeforeInit={(swiper) => {
          swiper.navigation.nextEl = nextRef.current as HTMLElement;
          swiper.navigation.prevEl = prevRef.current as HTMLElement;
        }}
        onSwiper={onSwiper}
        onSlideChange={onSlideChange}
        onClick={onClick}
        modules={[Navigation]}
      >
        {listImages.map((img, idx) => (
          <SwiperSlide key={idx}>
            <div className={`relative aspect-304/430 w-full ${imageClassName}`}>
              <Image src={img} alt="" fill style={{ objectFit: "contain" }} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {showNavigationButtons && (
        <>
          <button
            ref={prevRef}
            onClick={() => swiperRef.current?.slidePrev()}
            className={`absolute top-1/2 left-3 z-10 -translate-y-1/2 md:left-4 ${isBeginning ? "opacity-30" : ""} cursor-pointer ${navigationButtonClassName}`}
          >
            <div className="h-4 w-4 -rotate-45 border-t-3 border-l-3 border-white md:h-6 md:w-6" />
          </button>

          <button
            ref={nextRef}
            onClick={() => swiperRef.current?.slideNext()}
            className={`absolute top-1/2 right-3 z-10 -translate-y-1/2 md:right-4 ${isEnd ? "opacity-30" : ""} cursor-pointer ${navigationButtonClassName}`}
          >
            <div className="h-4 w-4 -rotate-45 border-r-3 border-b-3 border-white md:h-6 md:w-6" />
          </button>
        </>
      )}
    </>
  );
};

export default ImageSwiper;
