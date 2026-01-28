"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import lounge1 from "../../../../public/assets/images/lounge_1.png";
import lounge2 from "../../../../public/assets/images/lounge_2.png";
import lounge3 from "../../../../public/assets/images/lounge_3.png";
import lounge4 from "../../../../public/assets/images/lounge_4.png";
import lounge5 from "../../../../public/assets/images/lounge_5.png";
import lounge6 from "../../../../public/assets/images/lounge_6.png";
import lounge7 from "../../../../public/assets/images/lounge_7.png";
import lounge8 from "../../../../public/assets/images/lounge_8.png";
import type { Swiper as SwiperType } from "swiper";
import ImageSwiperModal from "@/components/molecules/ImageSwiperModal";
import useDisclosure from "@/hooks/useDisclosure";

const listImages = [lounge1, lounge2, lounge3, lounge4, lounge5, lounge6, lounge7, lounge8];

const ReservationGallery = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeIndex, setActiveIndex] = useState(0);
  const modalPrevRef = useRef<HTMLButtonElement>(null);
  const modalNextRef = useRef<HTMLButtonElement>(null);
  const modalSwiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handleOpen = (idx: number) => {
    setActiveIndex(idx);
    onOpen();
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 md:grid-cols-4">
        {listImages.map((img, idx) => (
          <button key={idx} onClick={() => handleOpen(idx)} className="cursor-zoom-in">
            <Image src={img} alt={`lounge-${idx}`} />
          </button>
        ))}
      </div>

      <ImageSwiperModal
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
        contentWidth="max-w-[600px]"
        overlayOpacity="bg-black/80"
        closeButtonClassName="text-cream"
        useIconClose={true}
      />
    </div>
  );
};

export default ReservationGallery;
