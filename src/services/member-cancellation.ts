import { API } from "@/constants/api";
import BaseApi from "@/libs/base_api";
import { MemberCancellationRequestData } from "@/types/member-cancellation";
import { useMutation } from "@tanstack/react-query";

const baseApi = new BaseApi();

export const memberCancellationService = {
  cancelMembership: async (data: MemberCancellationRequestData) => {
    const response = await baseApi.post(API.MEMBERSHIP_CANCELLATIONS, data);
    return response.data;
  },
};

export const useMemberCancellation = () =>
  useMutation({
    mutationFn: memberCancellationService.cancelMembership,
  });
