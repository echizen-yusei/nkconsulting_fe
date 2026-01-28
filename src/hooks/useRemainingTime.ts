"use client";
import { useEffect, useState } from "react";

export const useRemainingTime = (initialTime: number) => {
  const [remainingTime, setRemainingTime] = useState(initialTime);

  useEffect(() => {
    if (remainingTime <= 0) return;
    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [remainingTime]);
  return { remainingTime, setRemainingTime };
};

export default useRemainingTime;
