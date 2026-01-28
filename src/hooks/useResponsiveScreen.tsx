"use client";
import { useState, useEffect } from "react";
import useScreen from "./useScreen";

function useResponsiveScreen(initialIsMobile: boolean) {
  const { isMobile: clientIsMobile } = useScreen();
  const [hasResized, setHasResized] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setHasResized(true);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return hasResized ? clientIsMobile : initialIsMobile;
}

export default useResponsiveScreen;
