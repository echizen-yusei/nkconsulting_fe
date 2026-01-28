"use client";

import { useState } from "react";
import Image from "next/image";
import zoom1 from "../../../../public/assets/images/rectangle_97.png";
import zoom2 from "../../../../public/assets/images/rectangle_98.png";
import zoom3 from "../../../../public/assets/images/rectangle_99.png";
import zoom4 from "../../../../public/assets/images/rectangle_100.png";
import zoom5 from "../../../../public/assets/images/rectangle_101.png";

import zoomLarge1 from "../../../../public/assets/images/rectangle_97_large.png";
import zoomLarge2 from "../../../../public/assets/images/rectangle_98_large.png";
import zoomLarge3 from "../../../../public/assets/images/rectangle_99_large.png";
import zoomLarge4 from "../../../../public/assets/images/rectangle_100_large.png";
import zoomLarge5 from "../../../../public/assets/images/rectangle_101_large.png";

const listImageLounge = [
  { image: zoom1, largeImage: zoomLarge1 },
  { image: zoom2, largeImage: zoomLarge2 },
  { image: zoom3, largeImage: zoomLarge3 },
  { image: zoom4, largeImage: zoomLarge4 },
  { image: zoom5, largeImage: zoomLarge5 },
];

const LoungeGallery = () => {
  const [activeImage, setActiveImage] = useState({ image: zoom1, largeImage: zoomLarge1 });

  return (
    <div className="mt-6 flex flex-col gap-2 md:flex-row">
      <div className="bg-gray333 relative aspect-774/520 w-full flex-1 overflow-hidden">
        <Image src={activeImage.largeImage} alt="lounge-main" fill priority sizes="(min-width: 768px) 90vw, 100vw" className="object-contain" />
      </div>

      <div className="grid grid-cols-5 gap-2 md:w-[11.3%] md:grid-cols-1">
        {listImageLounge.map((img, idx) => {
          const isActive = activeImage.image === img.image;

          return (
            <button
              key={idx}
              onClick={() => setActiveImage(img)}
              className={`bg-gray333 relative aspect-square w-full overflow-hidden border hover:cursor-pointer ${isActive ? "border-cream border-2 opacity-100" : "border-transparent opacity-65"} transition hover:opacity-100`}
            >
              <Image src={img.image} alt={`lounge-${idx}`} fill className="object-contain" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LoungeGallery;
