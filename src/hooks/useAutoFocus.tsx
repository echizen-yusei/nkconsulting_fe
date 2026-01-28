import { isEmpty } from "@/libs/utils";
import { useEffect } from "react";

const useAutoFocus = () => {
  useEffect(() => {
    const listInput = document.querySelectorAll("input");
    if (!isEmpty(listInput)) {
      listInput[0].focus();
    }
  }, []);
};

export default useAutoFocus;
