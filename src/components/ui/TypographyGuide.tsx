import React from "react";

const TypographyGuide = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Main Title */}
      <h1 className="text-6xl font-bold mb-12 text-center">Typography</h1>

      {/* Noto Serif JP Section */}
      <div className="mb-12">
        <div className="font-noto-serif-jp text-2xl font-bold underline mb-8">Noto Serif JP あa 123</div>

        <div className="space-y-4">
          <div className="heading-1">Heading1 48px Black</div>

          <div className="heading-2">Heading2 40px Bold</div>
          <div className="heading-2-1">Heading2-1 36px Bold</div>

          <div className="heading-3">Heading3 32px Semibold</div>

          <div className="heading-4">Heading4 24px Semibold</div>

          <div className="heading-5">Heading5 20px Semibold</div>
        </div>
      </div>

      {/* Noto Sans JP Section */}
      <div>
        <div className="font-noto-sans-jp text-2xl font-bold underline mb-8">Noto Sans JP あa 123</div>

        <div className="space-y-4">
          <div className="text-1">Body 16px Regular</div>

          <div className="text-2">Body2 14px Regular</div>
        </div>
      </div>
    </div>
  );
};

export default TypographyGuide;
