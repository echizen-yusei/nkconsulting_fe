"use client";

import { StaticImageData } from "next/image";
import type { Swiper as SwiperType } from "swiper";
import ImageSwiper from "@/components/molecules/ImageSwiper";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/components/ui/dialog";

type ImageSwiperModalProps = {
  activeIndex: number;
  setOpenModal: (isOpen: boolean) => void;
  listImages: StaticImageData[];
  swiperRef: React.MutableRefObject<SwiperType | null>;
  prevRef: React.MutableRefObject<HTMLButtonElement | null>;
  nextRef: React.MutableRefObject<HTMLButtonElement | null>;
  isBeginning: boolean;
  isEnd: boolean;
  setIsBeginning: (value: boolean) => void;
  setIsEnd: (value: boolean) => void;
  setActiveIndex: (value: number) => void;
  contentWidth?: string;
  overlayOpacity?: string;
  closeButtonClassName?: string;
  useIconClose?: boolean;
  isOpen: boolean;
};

const ImageSwiperModal = ({
  activeIndex,
  listImages,
  swiperRef,
  prevRef,
  nextRef,
  isBeginning,
  isEnd,
  setIsBeginning,
  setIsEnd,
  setActiveIndex,
  isOpen,
  setOpenModal,
}: ImageSwiperModalProps) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setOpenModal(open);
      }}
      modal
    >
      <DialogOverlay />
      <DialogContent
        className="w-full rounded-none p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
        showCloseButton={false}
        onPointerDownOutside={() => {
          setOpenModal(false);
        }}
        onInteractOutside={() => {
          setOpenModal(false);
        }}
        onEscapeKeyDown={() => {
          setOpenModal(false);
        }}
      >
        <DialogTitle className="sr-only">{""}</DialogTitle>
        <ImageSwiper
          listImages={listImages}
          slidePerView={1}
          initialSlide={activeIndex}
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
          showNavigationButtons={true}
          isBeginning={isBeginning}
          isEnd={isEnd}
          imageClassName="bg-black"
        />
        <button className={`text-cream absolute -top-10 right-0 z-10 cursor-pointer text-[30px] md:-top-3 md:-right-8`} onClick={() => setOpenModal(false)}>
          ✕
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default ImageSwiperModal;
