import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { AxiosError } from "axios";
import useNavigation from "./useNavigation";
import { PAGE } from "@/constants/page";
import { clearCookies } from "@/libs/storages";
import { userInfoAtom } from "@/atoms/user-atoms";
import { useSetAtom } from "jotai";

export type ErrorResponseData = {
  errors?: unknown;
  [key: string]: unknown;
};

export const useErrorHandler = () => {
  const t = useTranslations("components");
  const { router } = useNavigation();
  const setUserInfo = useSetAtom(userInfoAtom);
  const handleShowError = ({ error, isHandle404 = true }: { error: AxiosError<ErrorResponseData>; isHandle404?: boolean }) => {
    if (error.response?.status === 403) {
      clearCookies();
      setUserInfo(null);
      router.refresh();
      router.push(PAGE.LOGIN);
      return null;
    }

    if (error.response?.status === 500) {
      toast.error(t("commonError.systemError"));
      return null;
    }

    if (isHandle404 && error.response?.status === 404) {
      toast.error(t("commonError.systemError"));
      return null;
    }

    const errorMessage = error.response?.data?.errors;
    if (errorMessage && Array.isArray(errorMessage)) {
      toast.error(<div style={{ whiteSpace: "pre-line" }}>{(errorMessage as string[]).join("\n")}</div>);
      return null;
    }
    return error;
  };

  return handleShowError;
};
