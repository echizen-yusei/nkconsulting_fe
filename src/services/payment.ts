import { API } from "@/constants/api";
import BaseApi from "@/libs/base_api";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

const baseApi = new BaseApi();

export const setupIntentsApi = (user_id: string): Promise<AxiosResponse> => {
  return baseApi.post(`${API.USER_STRIPE}/${user_id}/setup_intents`, {});
};

export const useSetupIntents = (): UseMutationResult<AxiosResponse, Error, { user_id: string }> => {
  return useMutation({
    mutationFn: (data: { user_id: string }) => setupIntentsApi(data.user_id),
    retry: false,
    gcTime: 0,
  });
};

export const confirmSetupIntentApi = (data: { user: { user_id: string }; setup_intent: { payment_method_id: string } }): Promise<AxiosResponse> => {
  return baseApi.post(`${API.USER_STRIPE}/${data.user.user_id}/setup_intents/confirm`, {
    setup_intent: data.setup_intent,
  });
};

export const useConfirmSetupIntent = (): UseMutationResult<
  AxiosResponse,
  Error,
  { user: { user_id: string }; setup_intent: { payment_method_id: string; card_holder_name: string } }
> => {
  return useMutation({
    mutationFn: (data: { user: { user_id: string }; setup_intent: { payment_method_id: string; card_holder_name: string } }) => confirmSetupIntentApi(data),
    retry: false,
    gcTime: 0,
  });
};

export const getPaymentMethodIdApi = (user_id: string, payment_method_id: string): Promise<AxiosResponse> => {
  return baseApi.get(`${API.USER_STRIPE}/${user_id}/payment_methods/${payment_method_id}`);
};

export const usePaymentMethodId = (): UseMutationResult<AxiosResponse, Error, { user_id: string; payment_method_id: string }> => {
  return useMutation({
    mutationFn: (data: { user_id: string; payment_method_id: string }) => getPaymentMethodIdApi(data.user_id, data.payment_method_id),
    retry: false,
    gcTime: 0,
  });
};

export const paymentBankApi = (user_id: string): Promise<AxiosResponse> => {
  return baseApi.post(`${API.USER_STRIPE}/${user_id}/bank_methods`, {});
};

export const usePaymentBank = (): UseMutationResult<AxiosResponse, Error, { user_id: string }> => {
  return useMutation({
    mutationFn: (data: { user_id: string }) => paymentBankApi(data.user_id),
    retry: false,
    gcTime: 0,
  });
};
