"use client";

import ImageCustom from "@/components/atoms/Image/Image";
import useScreen from "@/hooks/useScreen";

type MembershipRegistrationProcessItemProps = {
  image: string;
  title: string;
  description: string;
};

const MembershipRegistrationProcessItem = ({ image, title, description }: MembershipRegistrationProcessItemProps) => {
  const { isMobile } = useScreen();

  return (
    <div className="flex-1 md:min-w-30 min-w-80 md:p-6 p-4 rounded-md border-gradient-gold">
      <div className="bg-black-custom absolute inset-0 z-[-1] rounded-md"></div>
      <div className={`${isMobile ? "bg-gradient-dark-90" : "bg-gradient-dark-27"} absolute inset-0 z-[-1] rounded-md`}></div>
      <div className="flex justify-center items-center">
        <ImageCustom src={image} alt={title} width={120} height={120} />
      </div>
      <h2 className="heading-3-30 text-cream text-center md:mb-4 md:mt-6 mb-2 mt-4">{title}</h2>
      <p className="text-cream text-center text-1 whitespace-pre-line">{description}</p>
    </div>
  );
};

export default MembershipRegistrationProcessItem;
