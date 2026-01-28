"use client";

import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";

type ModalProps = {
  title?: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal = ({ title, open, onClose, children }: ModalProps) => {
  return (
    <Dialog open={open} modal>
      <DialogContent showCloseButton={false} onPointerDownOutside={onClose} onEscapeKeyDown={onClose}>
        <div className="relative">
          <DialogClose
            type="button"
            aria-label="Close modal"
            className="absolute top-0 right-3 z-10 cursor-pointer rounded-xs text-[30px] text-black opacity-70 transition-opacity hover:opacity-100"
            onClick={onClose}
          >
            ✕
          </DialogClose>
          <DialogTitle className="sr-only">{title}</DialogTitle>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
