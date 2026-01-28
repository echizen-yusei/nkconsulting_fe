import { useUserContext } from "@/components/providers/UserProvider";
import { useLogout } from "@/services/login";
import useNavigation from "./useNavigation";
import { PAGE } from "@/constants/page";

const useActionAuth = () => {
  const { mutate, isPending: isLoadingLogout } = useLogout();
  const { clearUser } = useUserContext();
  const { router } = useNavigation();

  const handleLogout = () => {
    mutate(undefined, {
      onSettled: () => {
        clearUser();
        router.refresh();
        router.push(PAGE.LOGIN);
      },
    });
  };

  return { handleLogout, isLoadingLogout };
};

export default useActionAuth;
