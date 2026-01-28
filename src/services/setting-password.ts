import { API } from "@/constants/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import BaseApi from "@/libs/base_api";
import { AxiosError, AxiosResponse } from "axios";
import { PasswordFormData } from "@/types/setting-password";

const baseApi = new BaseApi();

export const settingPasswordVerifyApi = (token: string): Promise<AxiosResponse> => {
  return baseApi.get(`${API.SETTING_PASSWORD_VERIFY}?reset_password_token=${token}`);
};

export const settingPasswordApi = (data: PasswordFormData): Promise<AxiosResponse> => {
  return baseApi.patch(API.SETTING_PASSWORD, data);
};

export const useSettingPasswordVerify = (token: string) => {
  return useQuery({
    queryKey: ["setting-password-verify", token],
    queryFn: () => settingPasswordVerifyApi(token),
    enabled: !!token,
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });
};

export const useSettingPassword = () => {
  return useMutation({
    mutationFn: (data: PasswordFormData) => settingPasswordApi(data),
    onSuccess: (data: AxiosResponse) => {
      return data.data;
    },
    onError: (error: AxiosError) => {
      return error;
    },
  });
};
