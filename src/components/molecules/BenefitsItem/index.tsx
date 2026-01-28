"use client";

import useScreen from "@/hooks/useScreen";
import { StaticImageData } from "next/image";
import Image from "next/image";

type BenefitsItemProps = {
  image: StaticImageData;
  title: string;
  description: string;
};

const BenefitsItem = ({ image, title, description }: BenefitsItemProps) => {
  const { isMobile } = useScreen();
  return (
    <div className={`flex-1 min-w-80 md:p-6 p-4 rounded-md ${isMobile ? "border-gradient-gold" : "border-gradient-gold-72 border-have-shadow"}`}>
      <div className="bg-black-custom absolute inset-0 z-[-1] rounded-md"></div>
      <div className={`${isMobile ? "bg-gradient-dark-90" : "bg-gradient-dark-27"} absolute inset-0 z-[-1] rounded-md`}></div>
      <Image src={image} alt={title} className="w-full object-cover h-auto" priority />
      <h2 className="heading-3-30 text-cream text-center md:mb-4 md:mt-6 mb-2 mt-4">{title}</h2>
      <p className="text-cream text-center text-1 whitespace-pre-line">{description}</p>
    </div>
  );
};

export default BenefitsItem;
