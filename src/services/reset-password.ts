import { API } from "@/constants/api";
import { useMutation } from "@tanstack/react-query";
import BaseApi from "@/libs/base_api";
import { AxiosError, AxiosResponse } from "axios";
import { ResetPasswordPayload } from "@/types/reset-password";

const baseApi = new BaseApi();

export const resetPasswordApi = (data: ResetPasswordPayload): Promise<AxiosResponse> => {
  return baseApi.post(`${API.RESET_PASSWORD}`, data);
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordPayload) => resetPasswordApi(data),
    onSuccess: (data: AxiosResponse) => {
      return data.data;
    },
    onError: (error: AxiosError) => {
      return error;
    },
  });
};
