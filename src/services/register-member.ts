import { API } from "@/constants/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import BaseApi from "@/libs/base_api";
import { AxiosError, AxiosResponse } from "axios";
import { RegisterMemberFormDataType, SchoolParamsType, SchoolResponseType, SchoolType } from "@/types/register";
import { buildApiUrl } from "@/libs/utils";

const baseApi = new BaseApi();

export const registerMemberApi = (data: RegisterMemberFormDataType): Promise<AxiosResponse> => {
  return baseApi.post(API.REGISTER_MEMBER, data);
};
export const getSchoolApi = (params: SchoolParamsType): Promise<AxiosResponse<SchoolResponseType>> => {
  let url = "";
  switch (params.type) {
    case SchoolType.SHOUGAKKOU:
      url = API.GET_SCHOOL_SHOUGAKKOU;
      break;
    case SchoolType.CHUUGAKKOU:
      url = API.GET_SCHOOL_CHUUGAKKOU;
      break;
    case SchoolType.KOUKOU:
      url = API.GET_SCHOOL_KOUKOU;
      break;
    case SchoolType.DAIGAKU_OR_SENMON:
      url = API.GET_SCHOOL_DAIGAKU_OR_SENMON;
      break;
  }
  const query = buildApiUrl({ name: params.name, page: params.page, per_page: params.per_page });
  return baseApi.get(`${url}${query}`);
};

export const useRegisterMember = () => {
  return useMutation({
    mutationFn: (data: RegisterMemberFormDataType) => registerMemberApi(data),
    onSuccess: (data: AxiosResponse) => {
      return data.data;
    },
    onError: (error: AxiosError) => {
      return error;
    },
  });
};
export const useGetSchool = (params: SchoolParamsType) => {
  return useQuery({
    queryKey: ["getSchool", params.name, params.page, params.per_page],
    queryFn: () => getSchoolApi(params),
  });
};
