"use client";

import Breadcrumb from "@/components/molecules/Breadcrumb";
import { useSettingPasswordVerify } from "@/services/setting-password";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import SettingPasswordForm from "./SettingPasswordForm";
import VerifyError from "./VerifyError";
import LoadingSpinner from "@/components/atoms/Loading";

export const SettingPasswordView = () => {
  const t = useTranslations("settingPasswordPage");
  const searchParams = useSearchParams();
  const token = searchParams.get("reset_password_token") || "";

  const { data, isLoading, error } = useSettingPasswordVerify(token);

  const renderContent = () => {
    if (!token) {
      return <VerifyError />;
    }

    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (error || !data?.data) {
      return <VerifyError />;
    }

    return <SettingPasswordForm token={token} />;
  };

  return (
    <div className="max-w-xxl mx-auto min-h-[calc(100vh-112px)] px-4 md:px-12">
      <div className="mb-16 px-4 pt-[172px] md:px-[114px]">
        <h1 className="heading-1 text-cream pointer-events-auto hidden text-left whitespace-pre-line md:block">
          {t.rich("title", {
            highlight: (chunks) => <span className="text-red-primary">{chunks}</span>,
          })}
        </h1>
        <Breadcrumb autoGenerate className="pointer-events-auto mt-6 hidden md:mt-10 md:block" />
      </div>

      <div>{renderContent()}</div>
    </div>
  );
};
