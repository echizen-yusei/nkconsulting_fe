import { PER_PAGE } from "@/constants";
import { API } from "@/constants/api";
import BaseApi from "@/libs/base_api";
import { buildApiUrlWithParams } from "@/libs/utils";
import { PaginationResponseType } from "@/types/common";
import { ConsultingService, MemberOnlyPost } from "@/types/membership-content";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FieldValues } from "react-hook-form";

const baseApi = new BaseApi();

export const getMemberOnlyServices = async (
  page: number,
  perPage?: number,
): Promise<{ consulting_services: ConsultingService[]; pagination: PaginationResponseType }> => {
  const response = await baseApi.get(buildApiUrlWithParams(API.GET_CONSULTING_SERVICES, { page, per_page: perPage ?? PER_PAGE }));
  return response.data;
};

export const useGetMemberOnlyServices = (page?: number, perPage?: number, id?: string | string[]) => {
  return useQuery({
    queryKey: ["consultingServices", page, id],
    queryFn: () => getMemberOnlyServices(page ?? 1, perPage),
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });
};

export const getMemberOnlyServicesDetail = async (id: number) => {
  const response = await baseApi.get(`${API.GET_CONSULTING_SERVICES}/${id}`);
  return response.data;
};

export const useGetMemberOnlyServicesDetail = (id: number) => {
  return useQuery({
    queryKey: ["consultingServicesDetail", id],
    queryFn: () => getMemberOnlyServicesDetail(id),
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

export const getMemberOnlyPost = async (
  page: number,
  perPage?: number,
): Promise<{ member_only_posts: MemberOnlyPost[]; pagination: PaginationResponseType }> => {
  const response = await baseApi.get(buildApiUrlWithParams(API.GET_MEMBER_ONLY_POSTS, { page, per_page: perPage ?? PER_PAGE }));
  return response.data;
};

export const useGetMemberOnlyPost = (page?: number, perPage?: number, id?: string | string[]) => {
  return useQuery({
    queryKey: ["memberOnlyPosts", page, id],
    queryFn: () => getMemberOnlyPost(page ?? 1, perPage),
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

export const getMemberOnlyPostDetail = async (id: number) => {
  const response = await baseApi.get(`${API.GET_MEMBER_ONLY_POSTS}/${id}`);
  return response.data;
};

export const useGetMemberOnlyPostDetail = (id: number) => {
  return useQuery({
    queryKey: ["memberOnlyPostDetail", id],
    queryFn: () => getMemberOnlyPostDetail(id),
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });
};

export const sendMemberOnlyPostContactForm = async (id: string, data: FieldValues) => {
  const response = await baseApi.post(`${API.GET_MEMBER_ONLY_POSTS}/${id}/inquiries`, data);
  return response.data;
};

export const useSendMemberOnlyPostContactForm = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FieldValues }) => sendMemberOnlyPostContactForm(id, data),
  });
};

export const sendMemberOnlyServiceContactForm = async (id: string, data: FieldValues) => {
  const response = await baseApi.post(`${API.GET_CONSULTING_SERVICES}/${id}/inquiries`, data);
  return response.data;
};

export const useSendMemberOnlyServiceContactForm = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FieldValues }) => sendMemberOnlyServiceContactForm(id, data),
  });
};
