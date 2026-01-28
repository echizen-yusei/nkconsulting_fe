import { API } from "@/constants/api";
import BaseApi from "@/libs/base_api";
import { SendEmailOtpRequest, SendEmailOtpResponse, VerifyEmailOtpRequest, VerifyEmailOtpResponse } from "@/types/email-change";
import { useMutation } from "@tanstack/react-query";

const baseApi = new BaseApi();

export const emailChangeService = {
  sendOtp: async (data: SendEmailOtpRequest): Promise<SendEmailOtpResponse> => {
    const response = await baseApi.post(API.EMAIL_CHANGE_REQUESTS, data);
    return response.data;
  },

  verifyOtp: async (id: string, data: VerifyEmailOtpRequest): Promise<VerifyEmailOtpResponse> => {
    const response = await baseApi.patch(`${API.EMAIL_CHANGE_REQUESTS}/${id}`, data);
    return response.data;
  },
};

export const useSendEmailOtp = () =>
  useMutation({
    mutationFn: emailChangeService.sendOtp,
  });

export const useVerifyEmailOtp = () =>
  useMutation({
    mutationFn: ({ requestId, data }: { requestId: string; data: VerifyEmailOtpRequest }) => emailChangeService.verifyOtp(requestId, data),
  });
