"use client";
import Button from "@/components/atoms/Button/Button";
import Modal from "../Modal";
import { cn } from "@/libs/utils";

interface ConfirmDialogProps {
  title?: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
  onClose: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmButtonType?: "primary" | "secondary" | "outline" | "underline" | "white";
  cancelButtonType?: "primary" | "secondary" | "outline" | "underline" | "white";
  closeModal: () => void;
  openModal: () => void;
  descriptionClassName?: string;
}

const ConfirmDialog = ({
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = "はい",
  cancelText = "いいえ",
  confirmButtonType = "secondary",
  cancelButtonType = "white",
  isOpen,
  closeModal,
  descriptionClassName = "heading-3-30",
}: ConfirmDialogProps) => {
  if (!isOpen) return null;
  const handleConfirm = () => {
    onConfirm();
    closeModal();
  };

  const handleCancel = () => {
    onCancel();
    closeModal();
  };

  return (
    <Modal open={isOpen} onClose={closeModal}>
      <div
        className="bg-cream flex w-full flex-col gap-6 rounded-[8px] px-6 py-12 md:w-[660px] lg:gap-12 lg:px-[74px] lg:py-[132px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-4">
          {title && <h2 className="text-black-custom heading-5">{title}</h2>}
          <p className={cn("text-black-custom font-noto-serif-jp text-center leading-[1.2]! font-semibold whitespace-pre-line", descriptionClassName)}>
            {description}
          </p>
        </div>
        <div className="flex flex-wrap justify-between gap-4">
          <div className="flex-1">
            <Button buttonType={confirmButtonType} onClick={handleConfirm} className="heading-5 h-14! w-full py-0!">
              {confirmText}
            </Button>
          </div>
          <div className="flex-1">
            <Button buttonType={cancelButtonType} onClick={handleCancel} className="heading-5 h-14! w-full py-0!" isBorderNoneSP={false}>
              {cancelText}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
