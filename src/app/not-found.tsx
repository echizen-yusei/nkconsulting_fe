import LayoutBackground from "@/components/layout/LayoutBackground";
import NotFoundPage from "@/features/not-found/NotFound";
import { ReactElement } from "react";

export default function NotFound(): ReactElement {
  return (
    <LayoutBackground>
      <NotFoundPage />
    </LayoutBackground>
  );
}
