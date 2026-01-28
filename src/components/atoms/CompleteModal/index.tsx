"use client";
import { cn } from "@/libs/utils";
import Modal from "../Modal";

interface CompleteModalProps {
  title?: string;
  description: string;
  isOpen: boolean;
  closeModal: () => void;
  contentClassName?: string;
  containerClassName?: string;
  descriptionClassName?: string;
  titleClassName?: string;
}

const CompleteModal = ({
  title,
  description,
  isOpen,
  closeModal,
  contentClassName = "",
  titleClassName = "text-[20px]",
  containerClassName = "w-full gap-6 px-6 py-12 sm:w-[660px] sm:py-[132px] md:h-[440px] md:px-[74px] ",
  descriptionClassName = "heading-3-30 text-center whitespace-pre-line",
}: CompleteModalProps) => {
  if (!isOpen) return null;

  return (
    <Modal open={isOpen} onClose={closeModal}>
      <div className={cn("bg-cream rounded-[8px]", containerClassName)} onClick={(e) => e.stopPropagation()}>
        <div className={cn("flex flex-col gap-4", contentClassName)}>
          {title && <h2 className={cn("text-black-custom font-noto-serif-jp font-semibold", titleClassName)}>{title}</h2>}
          <p className={cn("text-black-custom", descriptionClassName)}>{description}</p>
        </div>
      </div>
    </Modal>
  );
};

export default CompleteModal;
