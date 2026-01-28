"use client";
import LayoutBackground from "@/components/layout/LayoutBackground";
import ErrorPage from "@/features/error/Error";
import { ReactElement } from "react";

export default function Error(): ReactElement {
  return (
    <LayoutBackground>
      <ErrorPage />
    </LayoutBackground>
  );
}
