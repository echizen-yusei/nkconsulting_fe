"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Modal from "@/components/atoms/Modal";
import VerifyOtp from "../VerifyOtp";
import EditEmail from "../EditEmail";
import { UpdateEmailFormData, updateEmailSchema } from "@/schemas/membership-info";

interface EditEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const EditEmailModalContent = ({ onClose, onComplete, isOpen }: { onClose: () => void; onComplete: () => void; isOpen: boolean }) => {
  const t = useTranslations("profilePage.emailChange.editEmail");
  const tValidation = useTranslations("Validation");

  const [isVerifyOtpStep, setIsVerifyOtpStep] = useState(false);
  const [data, setData] = useState<UpdateEmailFormData & { requestId: string }>({ email: "", requestId: "" });
  const methods = useForm<UpdateEmailFormData>({
    resolver: zodResolver(updateEmailSchema(t, tValidation)),
    defaultValues: {
      email: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const handleClose = () => {
    methods.reset();
    setIsVerifyOtpStep(false);
    setData({ email: "", requestId: "" });
    onClose();
  };

  const handleOpenVerifyOtp = (newData: UpdateEmailFormData & { requestId: string }) => {
    setData(newData);
    setIsVerifyOtpStep(true);
  };

  const handleBackToEditEmail = () => {
    setIsVerifyOtpStep(false);
    setData({ email: "", requestId: "" });
  };

  const handleVerifySuccess = () => {
    handleClose();
    onComplete();
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <div className="bg-cream flex w-full flex-col gap-6 rounded-[8px] px-6 py-8 sm:w-[660px] md:px-[74px] md:py-12">
        {!isVerifyOtpStep ? (
          <EditEmail methods={methods} onOpenVerifyOtp={handleOpenVerifyOtp} />
        ) : (
          <VerifyOtp onClose={handleClose} requestData={data} onSuccess={handleVerifySuccess} onBackEmailChange={handleBackToEditEmail} />
        )}
      </div>
    </Modal>
  );
};

const EditEmailModal = ({ isOpen, onClose, onComplete }: EditEmailModalProps) => {
  return <EditEmailModalContent onClose={onClose} onComplete={onComplete} isOpen={isOpen} />;
};

export default EditEmailModal;
