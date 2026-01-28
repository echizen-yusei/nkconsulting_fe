import { ReactElement } from "react";
import HomePage from "@/features/home/HomePage";
import LayoutBackground from "@/components/layout/LayoutBackground";

export default function Home(): ReactElement {
  return (
    <LayoutBackground>
      <HomePage />
    </LayoutBackground>
  );
}
