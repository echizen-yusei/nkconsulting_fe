import React from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { FormControl } from "../../atoms/FormField";
import Button from "../../atoms/Button/Button";
import z from "zod";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";

interface InquiryFormProps {
  onSendInquiries: (data: FieldValues, callbacks?: { onSuccess?: () => void; onError?: (error: unknown) => void }) => void;
  isLoading?: boolean;
}

const inquiryFormSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    content: z
      .string()
      .trim()
      .min(1, { message: t("Validation.required", { field: t("inquiryForm.content.label") }) })
      .max(2000, { message: t("Validation.maxLength", { field: t("inquiryForm.content.label"), length: 2000 }) }),
  });

const InquiryForm = ({ onSendInquiries, isLoading }: InquiryFormProps) => {
  const t = useTranslations();
  const methods = useForm<z.infer<ReturnType<typeof inquiryFormSchema>>>({
    resolver: zodResolver(inquiryFormSchema(t)),
    defaultValues: {
      content: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });
  const onSubmit = (data: FieldValues) => {
    onSendInquiries(data, {
      onSuccess: () => {
        methods.reset();
      },
    });
  };
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <FormControl name="content" label={t("inquiryForm.content.label")} type="textarea" isShowLabel={false} heightInput="h-60" />
        <Button buttonType="secondary" type="submit" className="heading-5 mt-4 w-full md:mt-6 md:w-60" isDisabled={isLoading}>
          {t("inquiryForm.send")}
        </Button>
      </form>
    </FormProvider>
  );
};

export default InquiryForm;
