import type { Swiper as SwiperType } from "swiper";
import ImageSwiperModal from "@/components/molecules/ImageSwiperModal";
import { StaticImageData } from "next/image";

type Props = {
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
  isOpen: boolean;
};

const MenuSwiperModal = (props: Props) => {
  return <ImageSwiperModal {...props} />;
};

export default MenuSwiperModal;
