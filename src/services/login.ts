import { API } from "@/constants/api";
import { useMutation } from "@tanstack/react-query";
import BaseApi from "@/libs/base_api";
import { AxiosError, AxiosResponse } from "axios";
import { LoginFormDataType, LoginResponseType } from "@/types/login";
import { ErrorResponseData } from "@/hooks/useErrorHandle";

const baseApi = new BaseApi();

export const loginApi = (data: LoginFormDataType): Promise<AxiosResponse<LoginResponseType>> => {
  return baseApi.post(`${API.SESSION}`, data);
};

export const logoutApi = () => {
  return baseApi.delete(`${API.SESSION}`);
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginFormDataType) => loginApi(data),
    onSuccess: (data: AxiosResponse<LoginResponseType>) => {
      return data;
    },
    onError: (error: AxiosError<ErrorResponseData>) => {
      return error;
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: () => logoutApi(),
  });
};
