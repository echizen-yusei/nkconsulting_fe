import { API } from "@/constants/api";
import BaseApi from "@/libs/base_api";
import { MemberPlanMe, MembershipInformation } from "@/types/membership-infomation";
import { RegisterMemberFormDataType } from "@/types/register";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

const baseApi = new BaseApi();

export const getProfileApi = (): Promise<AxiosResponse<MembershipInformation>> => {
  return baseApi.get(API.GET_MEMBERSHIP_INFORMATION);
};

export const useGetProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfileApi(),
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

export const updateProfileApi = (data: RegisterMemberFormDataType): Promise<AxiosResponse<MembershipInformation>> => {
  return baseApi.patch(API.UPDATE_MEMBERSHIP_INFORMATION, data);
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: (data: RegisterMemberFormDataType) => updateProfileApi(data),
  });
};

export const getMemberPlanMeApi = async (): Promise<MemberPlanMe> => {
  const response = await baseApi.get(`${API.MEMBER_PLAN}/me`);
  return response.data;
};

export const useMemberPlanMe = () =>
  useQuery({
    queryKey: ["member-plan-me"],
    queryFn: getMemberPlanMeApi,
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

export const getPaymentMethodIdApi = (payment_method_id: string): Promise<AxiosResponse> => {
  return baseApi.get(`${API.MEMBER_PLAN}/payment_methods/${payment_method_id}`);
};

export const useGetPaymentMethodId = () => {
  return useMutation({
    mutationFn: (payment_method_id: string) => getPaymentMethodIdApi(payment_method_id),
  });
};

export const memberPlanSetupIntentsApi = (): Promise<AxiosResponse> => {
  return baseApi.post(`${API.MEMBER_PLAN}/setup_intents`, {});
};

export const useMemberPlanSetupIntents = () => {
  return useMutation({
    mutationFn: memberPlanSetupIntentsApi,
    retry: false,
    gcTime: 0,
  });
};

export const setupIntentsConfirmApi = (setup_intent_id: string, card_holder_name: string): Promise<AxiosResponse> => {
  return baseApi.post(`${API.MEMBER_PLAN}/setup_intents/confirm`, {
    setup_intent: {
      payment_method_id: setup_intent_id,
      card_holder_name: card_holder_name,
    },
  });
};

export const useSetupIntentsConfirm = () => {
  return useMutation({
    mutationFn: (data: { setup_intent_id: string; card_holder_name: string }) => setupIntentsConfirmApi(data.setup_intent_id, data.card_holder_name),
    retry: false,
    gcTime: 0,
  });
};

export const upgradeMemberPlanApi = (plan_type: string): Promise<AxiosResponse> => {
  return baseApi.post(`${API.MEMBER_PLAN}/upgrade_plans`, {
    member_plan: {
      plan_type: plan_type,
    },
  });
};

export const useUpgradeMemberPlan = () => {
  return useMutation({
    mutationFn: (data: { plan_type: string }) => upgradeMemberPlanApi(data.plan_type),
    retry: false,
    gcTime: 0,
  });
};

export const upgradeMemberPlanWithNewBankApi = (plan_type: string): Promise<AxiosResponse> => {
  return baseApi.post(`${API.MEMBER_PLAN}/upgrade_plan_from_bank_to_stripe`, {
    upgrade_plan_from_bank_to_stripe: { plan_type: plan_type },
  });
};

export const useUpgradeMemberPlanWithNewBank = () => {
  return useMutation({
    mutationFn: (data: { plan_type: string }) => upgradeMemberPlanWithNewBankApi(data.plan_type),
    retry: false,
    gcTime: 0,
  });
};

export const getUpgradePlanStatusApi = async (): Promise<AxiosResponse> => {
  const response = await baseApi.get(`${API.MEMBER_PLAN}/upgrade_status`);
  return response;
};

export const useGetUpgradePlanStatus = () => {
  return useMutation({
    mutationFn: getUpgradePlanStatusApi,
    retry: false,
    gcTime: 0,
  });
};

export const useGetUpgradePlanStatusQuery = () => {
  return useQuery({
    queryKey: ["upgrade-plan-status-query"],
    queryFn: () => getUpgradePlanStatusApi(),
    retry: false,
    gcTime: 0,
  });
};
