"use client";
import { useRouter } from "next/navigation";

const useNavigation = () => {
  const router = useRouter();
  return {
    router,
  };
};

export default useNavigation;
