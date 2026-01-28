import { Api } from "@/constants/api";
import BaseApi from "@/libs/base_api";
import { isPlanAllowLoungeReservation } from "@/libs/utils";
import { Reservation } from "@/types/reservation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

const baseApi = new BaseApi();
export const reservationApi = (data: { reserved_date: string; reserved_time: string; guest_count: string }): Promise<AxiosResponse> => {
  return baseApi.post(Api.louge_reservations, data);
};
export const useReservation = () => {
  return useMutation({
    mutationFn: (data: { reserved_date: string; reserved_time: string; guest_count: string }) => reservationApi(data),
  });
};

export const getReservationApi = (page: number = 1): Promise<AxiosResponse<{ reservations: Reservation[]; pagination: { total_pages: number } }>> => {
  return baseApi.get(Api.lougeReservations(page));
};

export const useGetReservation = (page: number = 1, planType: string) => {
  return useQuery({
    queryKey: ["reservation", page],
    queryFn: () => getReservationApi(page),
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    enabled: isPlanAllowLoungeReservation(planType),
  });
};

export const getReservationDetail = ({ id }: { id: string }): Promise<AxiosResponse> => {
  return baseApi.get(Api.lougeReservationDetail(id));
};

export const useGetReservationDetail = (id: string) => {
  return useQuery({
    queryKey: ["reservation"],
    queryFn: () => getReservationDetail({ id }),
    enabled: !!id,
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });
};

export const cancelReservationApi = ({ id }: { id: string }): Promise<AxiosResponse> => {
  return baseApi.delete(Api.lougeReservationDetail(id));
};

export const useCancelReservation = () => {
  return useMutation({
    mutationFn: ({ id }: { id: string }) => cancelReservationApi({ id }),
  });
};
