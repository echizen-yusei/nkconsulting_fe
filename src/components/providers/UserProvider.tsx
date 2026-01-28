"use client";
import React, { createContext, useContext, useCallback, useEffect, useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useUserInfo } from "@/services/user";
import { ErrorResponseData, useErrorHandler } from "@/hooks/useErrorHandle";
import { MEMBERSHIP_PLANS_OPTIONS } from "@/constants";
import { AxiosError } from "axios";
import { clearCookies, getCurrentUser } from "@/libs/storages";
import { userInfoAtom } from "@/atoms/user-atoms";
import { useSetAtom } from "jotai";
import { isPlanAllowLoungeReservation } from "@/libs/utils";

type UserProviderProps = {
  children: React.ReactNode;
  token: string | null;
};

type UserState = {
  isLoadingUserInfo: boolean;
  clearUser: () => void;
  refetch: () => void;
  isAllowLoungeReservation: boolean;
};
const UserContext = createContext<UserState | null>(null);

export default function UserProvider({ children, token }: UserProviderProps) {
  const handleShowError = useErrorHandler();
  const queryClient = useQueryClient();
  const setUserInfo = useSetAtom(userInfoAtom);
  const [tokenClient, setTokenClient] = useState<string | null>(token);

  const { data: userInfoApi, isLoading, error, refetch } = useUserInfo(tokenClient);

  const clearUser = useCallback(() => {
    queryClient.removeQueries({ queryKey: ["user-info"] });
    clearCookies();
    setUserInfo(null);
  }, [queryClient, setUserInfo]);

  useEffect(() => {
    if (userInfoApi?.data?.user) {
      const userPlan = MEMBERSHIP_PLANS_OPTIONS.find((plan) => plan.value === userInfoApi.data.user.plan_type)?.label;
      setUserInfo({
        member_id: userInfoApi.data.user.member_id,
        full_name: userInfoApi.data.user.full_name || "○○",
        plan_type: userPlan || MEMBERSHIP_PLANS_OPTIONS[0].label,
        email: userInfoApi.data.user.email || "",
        plan_type_key: userInfoApi.data.user.plan_type,
        next_due_on: userInfoApi.data.user.next_due_on,
      });
    } else {
      setUserInfo(null);
    }
  }, [userInfoApi, setUserInfo]);

  useEffect(() => {
    if (error) {
      handleShowError({ error: error as AxiosError<ErrorResponseData> });
    }
  }, [error, handleShowError]);
  const refetchUserInfo = async () => {
    const currentToken = await getCurrentUser();
    setTokenClient(currentToken);
    refetch();
  };

  const isAllowLoungeReservation = useMemo(() => isPlanAllowLoungeReservation(userInfoApi?.data?.user.plan_type ?? ""), [userInfoApi?.data?.user.plan_type]);
  return (
    <UserContext.Provider value={{ clearUser, refetch: refetchUserInfo, isLoadingUserInfo: isLoading, isAllowLoungeReservation }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
