import { API } from "@/constants/api";
import BaseApi from "@/libs/base_api";
import { buildApiUrl } from "@/libs/utils";
import { NotificationDetailInfo, NotificationRequestType, NotificationResponseType } from "@/types/notification";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

const baseApi = new BaseApi();

export const getNotificationsInfoApi = ({ id }: { id: number }): Promise<AxiosResponse<{ announcement: NotificationDetailInfo }>> => {
  return baseApi.get(`${API.NOTIFICATIONS}/${id}`);
};

export const readNotificationsApi = ({ id }: { id: number }): Promise<AxiosResponse> => {
  return baseApi.post(`${API.NOTIFICATIONS}/${id}/reads`, {});
};

export const getNotificationsApi = (params: NotificationRequestType): Promise<AxiosResponse<NotificationResponseType>> => {
  const query = buildApiUrl({
    page: params.page,
    per_page: params.per_page,
  });
  return baseApi.get(`${API.NOTIFICATIONS}${query}`);
};

export const useGetNotifications = (params: NotificationRequestType) => {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: () => getNotificationsApi(params),
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });
};

export const useGetNotificationsInfo = (id: number | null) => {
  return useQuery({
    queryKey: ["notifications-info", id],
    queryFn: () => getNotificationsInfoApi({ id: id || 0 }),
    retry: false,
    staleTime: 0,
    gcTime: 0,
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

export const useReadNotifications = () => {
  return useMutation({
    mutationFn: (id: number) => readNotificationsApi({ id }),
  });
};
