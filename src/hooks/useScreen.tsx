import { useMemo, useState, useEffect } from "react";
import useWindowSize from "./useWindowSize";
import { SCREEN_MOBILE } from "@/constants";

function useScreen() {
  const { width } = useWindowSize();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const isPC = useMemo(() => {
    if (!isMounted) {
      return true;
    }
    return width > 0 && width >= SCREEN_MOBILE;
  }, [width, isMounted]);

  const isMobile = !isPC;

  return { isPC, isMobile, isMounted };
}

export default useScreen;
