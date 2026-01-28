import { CreateContactPayload } from "@/types/contact";
import { API } from "@/constants/api";
import { useMutation } from "@tanstack/react-query";
import BaseApi from "@/libs/base_api";
import { AxiosError, AxiosResponse } from "axios";

const baseApi = new BaseApi();

export const createContactApi = (data: CreateContactPayload): Promise<AxiosResponse> => {
  return baseApi.post(`${API.CONTACT}`, data);
};

export const useCreateContact = () => {
  return useMutation({
    mutationFn: (data: CreateContactPayload) => createContactApi(data),
    onSuccess: (data: AxiosResponse) => {
      return data.data;
    },
    onError: (error: AxiosError) => {
      return error.response?.data;
    },
  });
};
