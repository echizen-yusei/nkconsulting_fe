import { API } from "@/constants/api";
import BaseApi from "@/libs/base_api";
import { buildApiUrl } from "@/libs/utils";
import { EventDetailInfo, EventRequestType, EventResponseType } from "@/types/event-information";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

const baseApi = new BaseApi();

export const getEventInfoApi = (id: number): Promise<AxiosResponse<{ event_information: EventDetailInfo }>> => {
  return baseApi.get(`${API.EVENTS}/${id}`);
};

export const getEventsApi = (params: EventRequestType): Promise<AxiosResponse<EventResponseType>> => {
  const query = buildApiUrl({
    page: params.page,
    per_page: params.per_page,
  });
  return baseApi.get(`${API.EVENTS}${query}`);
};

export const joinEventApi = (id: number): Promise<AxiosResponse> => {
  return baseApi.post(`${API.EVENTS}/${id}/event_applications`, { event_information_id: id });
};

export const useGetEventInfo = (id: number) => {
  return useQuery({
    queryKey: ["event-info", id],
    queryFn: () => getEventInfoApi(id),
    enabled: !!id,
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });
};

export const useGetEvents = (params: EventRequestType) => {
  return useQuery({
    queryKey: ["events", params],
    queryFn: () => getEventsApi(params),
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });
};

export const useJoinEvent = () => {
  return useMutation({
    mutationFn: (id: number) => joinEventApi(id),
  });
};
