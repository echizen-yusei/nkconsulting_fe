"use client";
import { useEffect, useState } from "react";
import { useCreateContact } from "@/services/contact";
import Button from "@/components/atoms/Button/Button";
import { FormProvider, useForm } from "react-hook-form";
import { CreateContactPayload } from "@/types/contact";
import { FormControl } from "@/components/atoms/FormField";
import { useTranslations } from "next-intl";
import Breadcrumb from "@/components/molecules/Breadcrumb";
import Checkbox from "@/components/atoms/Checkbox";
import { toast } from "sonner";
import useNavigation from "@/hooks/useNavigation";
import LoadingSpinner from "@/components/atoms/Loading";
import { PAGE } from "@/constants/page";
import { actionScrollToTop, getLocalDateTime, handleTrimValue } from "@/libs";
import useBlock from "@/hooks/useBlock";
import useAutoFocus from "@/hooks/useAutoFocus";

const ContactPage = () => {
  const t = useTranslations("ContactPage");
  const [isChecked, setIsChecked] = useState(false);
  const { router } = useNavigation();

  const methods = useForm<CreateContactPayload>({
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phoneNumber: "",
      body: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });
  useBlock(methods.formState.isDirty);
  const { mutate, isPending } = useCreateContact();

  const onSubmit = (data: CreateContactPayload) => {
    if (isPending) return;
    const newData = { ...data, clientTime: getLocalDateTime() };

    mutate(handleTrimValue(newData), {
      onSuccess: () => {
        methods.reset();
        methods.clearErrors();
        setIsChecked(false);
        router.push(PAGE.CONTACT_COMPLETE);
      },
      onError: () => {
        toast.error(t("form_contact.error"));
      },
    });
  };
  useAutoFocus();

  useEffect(() => {
    actionScrollToTop();
  }, []);

  return (
    <div className="max-w-xxl mx-auto px-5 md:px-0">
      {isPending && <LoadingSpinner />}
      <div className="mb-8 ml-0 flex min-h-dvh flex-col justify-center sm:mb-16 sm:ml-4 md:mt-32 md:mb-24 md:ml-8 md:block md:min-h-auto lg:mt-[232px] lg:mb-30 lg:ml-[162px]">
        <span className="heading-1 text-cream noto-serif-jp pointer-events-auto md:text-left">
          {t.rich("title", {
            highlight: (chunks) => <span className="text-red-primary">{chunks}</span>,
          })}
        </span>
        <Breadcrumb autoGenerate className="pointer-events-auto mt-6 md:mt-10" />
      </div>
      <FormProvider {...methods}>
        <div className="relative">
          <form
            className="bg-cream/20 relative mx-0 mb-16 flex flex-col gap-6 rounded-md px-4 py-16 backdrop-blur-xs sm:mx-4 sm:mb-16 sm:px-8 md:mx-8 md:mb-24 md:px-16 lg:mx-12 lg:mb-30 lg:px-[114px]"
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            <FormControl
              inputClassName="w-full max-w-full xl:max-w-[660px]"
              name="name"
              label={t("form_contact.name.label")}
              placeholder={t("form_contact.name.placeholder")}
              className="pointer-events-auto rounded-md"
              maxLength={255}
              borderClassName="rounded-[4px] md:rounded-[8px]"
              required
            />
            <FormControl
              inputClassName="w-full max-w-full xl:max-w-[660px]"
              name="company"
              label={t("form_contact.companyName.label")}
              placeholder={t("form_contact.companyName.placeholder")}
              className="pointer-events-auto rounded-md"
              maxLength={255}
              borderClassName="rounded-[4px] md:rounded-[8px]"
              required
            />
            <FormControl
              inputClassName="w-full max-w-full xl:max-w-[660px]"
              name="email"
              label={t("form_contact.email.label")}
              placeholder={t("form_contact.email.placeholder")}
              className="pointer-events-auto rounded-md"
              maxLength={255}
              borderClassName="rounded-[4px] md:rounded-[8px]"
              required
              isEmail
            />
            <FormControl
              inputClassName="w-full max-w-full xl:max-w-[660px]"
              name="phoneNumber"
              label={t("form_contact.phone.label")}
              placeholder={t("form_contact.phone.placeholder")}
              className="pointer-events-auto rounded-md"
              maxLength={20}
              borderClassName="rounded-[4px] md:rounded-[8px]"
              required
              isPhone
            />
            <FormControl
              inputClassName="w-full max-w-full xl:max-w-[660px]"
              name="body"
              label={t("form_contact.message.label")}
              placeholder={t("form_contact.message.placeholder")}
              className="pointer-events-auto rounded-md"
              type="textarea"
              maxLength={2000}
              borderClassName="rounded-[4px] md:rounded-[8px]"
              required
              heightInput="h-60 md:h-56"
            />
            <div className="flex justify-end">
              <div className="pointer-events-auto flex w-full max-w-full items-center xl:max-w-[660px]">
                <Checkbox id="confirm-checkbox" checked={isChecked} onCheckedChange={(checked) => setIsChecked(checked === true)} />
                <label htmlFor="confirm-checkbox" className="text-cream ml-2 block cursor-pointer text-sm">
                  {t("form_contact.confirm")}
                </label>
              </div>
            </div>
            <div className="pointer-events-auto mt-6 flex w-full justify-center">
              <Button type="submit" isDisabled={isPending || !isChecked} className="heading-5 w-full py-[18]! sm:w-auto sm:min-w-[280px] md:w-[560px]">
                {t("form_contact.submit")}
              </Button>
            </div>
          </form>
        </div>
      </FormProvider>
    </div>
  );
};

export default ContactPage;
