import { useState, useEffect, useCallback } from "react";

type UseModalAnimationProps = {
  duration?: number;
  onClose?: () => void;
};

type UseModalAnimationReturn = {
  isAnimating: boolean;
  isClosing: boolean;
  handleOpen: () => void;
  handleClose: () => void;
  overlayClassName: string;
  contentClassName: string;
};

const useModalAnimation = ({ duration = 300, onClose }: UseModalAnimationProps = {}): UseModalAnimationReturn => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleOpen = useCallback(() => {
    setIsAnimating(true);
    setIsClosing(false);
    setTimeout(() => setIsAnimating(false), 10);
  }, []);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setIsAnimating(true);
    setTimeout(() => {
      onClose?.();
      setIsAnimating(false);
      setIsClosing(false);
    }, duration);
  }, [duration, onClose]);

  const overlayClassName = `transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`;

  const contentClassName = `transition-all duration-300 ease-out ${isAnimating ? "scale-90 opacity-0" : "scale-100 opacity-100"}`;

  return {
    isAnimating,
    isClosing,
    handleOpen,
    handleClose,
    overlayClassName,
    contentClassName,
  };
};

export default useModalAnimation;
