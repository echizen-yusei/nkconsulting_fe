"use client";

import { StaticImageData } from "next/image";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";

import { useEffect, useRef, useState } from "react";
import useScreen from "@/hooks/useScreen";
import MenuSwiperModal from "@/components/molecules/MenuSwiperModal";
import ImageSwiper from "@/components/molecules/ImageSwiper";
import useModal from "@/hooks/useDisclosure";

type Props = {
  listImages: StaticImageData[];
  slidePerView?: number;
  activeImage?: number;
};

const MenuSwiper = ({ listImages, slidePerView = 1.1187, activeImage = 0 }: Props) => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const modalPrevRef = useRef<HTMLButtonElement>(null);
  const modalNextRef = useRef<HTMLButtonElement>(null);
  const modalSwiperRef = useRef<SwiperType | null>(null);
  const { isMobile } = useScreen();

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const { isOpen, onOpen, onClose } = useModal();
  const [activeIndex, setActiveIndex] = useState(activeImage);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveIndex(activeImage);
    if (swiperRef.current) {
      swiperRef.current.slideTo(activeImage);
    }
  }, [activeImage]);

  return (
    <>
      <div className="relative mt-6 w-full overflow-hidden">
        <ImageSwiper
          listImages={listImages}
          slidePerView={slidePerView}
          initialSlide={activeImage}
          swiperRef={swiperRef}
          prevRef={prevRef}
          nextRef={nextRef}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.activeIndex);
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          onClick={(swiper) => {
            setActiveIndex(swiper.activeIndex);
            onOpen();
          }}
          isBeginning={isBeginning}
          isEnd={isEnd}
          imageClassName="bg-black"
        />
      </div>

      {isOpen && isMobile && (
        <MenuSwiperModal
          isOpen={isOpen}
          activeIndex={activeIndex}
          listImages={listImages}
          setOpenModal={onClose}
          swiperRef={modalSwiperRef}
          prevRef={modalPrevRef}
          nextRef={modalNextRef}
          isBeginning={isBeginning}
          isEnd={isEnd}
          setIsBeginning={setIsBeginning}
          setIsEnd={setIsEnd}
          setActiveIndex={setActiveIndex}
        />
      )}
    </>
  );
};

export default MenuSwiper;
