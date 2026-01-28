"use client";

import React, { createContext, useContext, useState } from "react";

import { BreadcrumbItem } from "../molecules/Breadcrumb";

type MemberInfoProviderProps = {
  children: React.ReactNode;
};

type UserState = {
  breadcrumbCustom: BreadcrumbItem[] | null;
  setBreadcrumbCustom: (breadcrumbCustom: BreadcrumbItem[]) => void;
};
const UserContext = createContext<UserState | null>(null);

export default function MemberInfoProvider({ children }: MemberInfoProviderProps) {
  const [breadcrumbCustom, setBreadcrumbCustom] = useState<BreadcrumbItem[] | null>([]);

  return <UserContext.Provider value={{ breadcrumbCustom, setBreadcrumbCustom }}>{children}</UserContext.Provider>;
}

export const useMemberInfoContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
