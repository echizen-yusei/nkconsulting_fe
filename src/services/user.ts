import { useQuery } from "@tanstack/react-query";
import BaseApi from "@/libs/base_api";
import { AxiosResponse } from "axios";
import { API } from "@/constants/api";

const baseApi = new BaseApi();

export const userInfoApi = (): Promise<AxiosResponse> => {
  return baseApi.get(API.USER_INFO);
};

export const useUserInfo = (token: string | null) => {
  return useQuery({
    queryKey: ["user-info"],
    queryFn: () => userInfoApi(),
    retry: false,
    staleTime: 0,
    gcTime: 0,
    enabled: !!token,
  });
};
