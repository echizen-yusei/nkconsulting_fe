import { TAB_TITLE } from "@/constants";
import { UserType } from "@/types/user";
import { atom } from "jotai";

export const userInfoAtom = atom<(UserType & { plan_type_key: string }) | null>(null);
export const activeTabAtom = atom<keyof typeof TAB_TITLE | undefined>(undefined);
export const customEventTabTitleAtom = atom<string | null>(null);
export const customMembershipTitleAtom = atom<string | null>(null);
