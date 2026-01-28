import { USER } from "@/constants";
import Cookies from "js-cookie";

export const getCurrentUser = async () => {
  const currentUser = await JSON.parse(Cookies.get(USER) ?? "{}");
  return currentUser;
};

export const clearCookies = () => {
  Cookies.remove(USER);
};
