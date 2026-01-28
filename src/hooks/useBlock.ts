import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function useBlock(isDirty: boolean = false) {
  const router = useRouter();
  const pathname = usePathname();
  const prevPath = useRef(pathname);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "入力内容が破棄されますがそれでも実行しますか？";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      if (isDirty) {
        const ok = window.confirm("入力内容が破棄されますがそれでも実行しますか？");

        if (!ok) {
          router.push(prevPath.current);
          return;
        }
      }

      prevPath.current = pathname;
    }
  }, [pathname, isDirty, router]);
}
