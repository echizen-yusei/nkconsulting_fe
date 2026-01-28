"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { mergeList } from "@/libs/utils";
import { useGetMemberOnlyPost, useGetMemberOnlyServices } from "@/services/membership-content";
import { ConsultingService, MemberOnlyPost } from "@/types/membership-content";
import { useParams, usePathname } from "next/navigation";

type UserMemberOnlyDetailProps = {
  children: React.ReactNode;
};

type UserMemberOnlyDetailState = {
  serviceData: ConsultingService[];
  handleLoadMorePosts: () => void;
  handleLoadMoreServices: () => void;
  isLoadingConsultingServices: boolean;
  isLoadMoreServices: boolean;
  isLoadingMemberOnlyPosts: boolean;
  isLoadMorePosts: boolean;
  postData: MemberOnlyPost[];
  setPostData: React.Dispatch<React.SetStateAction<MemberOnlyPost[]>>;
  hasLoadMoreServices: boolean;
  hasLoadMorePosts: boolean;
  isMemberOnlyServiceDetailPage: boolean;
  isMemberOnlyBenefitDetailPage: boolean;
};
const UserMemberOnlyDetailContext = createContext<UserMemberOnlyDetailState | null>(null);

const UserMemberOnlyDetailProvider = ({ children }: UserMemberOnlyDetailProps) => {
  const { id } = useParams();
  const [currentServicePage, setCurrentServicePage] = useState<number>(1);
  const [serviceData, setServiceData] = useState<ConsultingService[]>([]);
  const [currentPostPage, setCurrentPostPage] = useState<number>(1);
  const [postData, setPostData] = useState<MemberOnlyPost[]>([]);
  const pathName = usePathname();
  const isMemberOnlyServiceDetailPage = pathName.includes("/user/member-only-service");
  const isMemberOnlyBenefitDetailPage = pathName.includes("/user/member-only-benefit");

  const { data: consultingServices, isLoading: isLoadingConsultingServices } = useGetMemberOnlyServices(currentServicePage, 5, id);
  const { data: memberOnlyPosts, isLoading: isLoadingMemberOnlyPosts } = useGetMemberOnlyPost(currentPostPage, 5, id);

  useEffect(() => {
    const list = consultingServices?.consulting_services;
    if (!list || list.length === 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setServiceData((prev) => mergeList(prev, list));
  }, [consultingServices, id, isMemberOnlyServiceDetailPage, setServiceData]);

  useEffect(() => {
    const list = memberOnlyPosts?.member_only_posts;
    if (!list || list.length === 0) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPostData((prev) => mergeList(prev, list));
  }, [id, isMemberOnlyBenefitDetailPage, memberOnlyPosts, setPostData]);

  const handleLoadMoreServices = () => {
    setCurrentServicePage((prev) => prev + 1);
  };

  const handleLoadMorePosts = () => {
    setCurrentPostPage((prev) => prev + 1);
  };

  const hasLoadMoreServices = currentServicePage < (consultingServices?.pagination.total_pages ?? 0);
  const hasLoadMorePosts = currentPostPage < (memberOnlyPosts?.pagination.total_pages ?? 0);
  const isLoadMoreServices = isLoadingConsultingServices && currentServicePage > 1;
  const isLoadMorePosts = isLoadingMemberOnlyPosts && currentPostPage > 1;

  return (
    <UserMemberOnlyDetailContext.Provider
      value={{
        serviceData,
        handleLoadMorePosts,
        handleLoadMoreServices,
        isLoadingConsultingServices,
        isLoadMoreServices,
        isLoadingMemberOnlyPosts,
        isLoadMorePosts,
        postData,
        setPostData,
        hasLoadMoreServices,
        hasLoadMorePosts,
        isMemberOnlyServiceDetailPage,
        isMemberOnlyBenefitDetailPage,
      }}
    >
      {children}
    </UserMemberOnlyDetailContext.Provider>
  );
};

export const useUserMemberOnlyDetailContext = () => {
  const context = useContext(UserMemberOnlyDetailContext);
  if (!context) {
    throw new Error("useUserMemberOnlyDetailContext must be used within a UserProvider");
  }
  return context;
};

export default UserMemberOnlyDetailProvider;
