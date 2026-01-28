import React from "react";
import ColorPalette from "@/components/ui/ColorPalette";
import TypographyGuide from "@/components/ui/TypographyGuide";
import SpacingGuide from "@/components/ui/SpacingGuide";
import { redirect } from "next/navigation";

const DesignSystemPage = () => {
  if (process.env.NODE_ENV !== "development") {
    redirect("/");
  }
  return (
    <div>
      <ColorPalette />
      <TypographyGuide />
      <SpacingGuide />
    </div>
  );
};

export default DesignSystemPage;
