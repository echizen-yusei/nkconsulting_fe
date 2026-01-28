import LayoutBackground from "@/components/layout/LayoutBackground";
import { SettingPasswordView } from "@/features/setting-password/SettingPassword";
import backgroundTopSp from "../../../../public/assets/images/background_sp_2.png";

const SettingPasswordPage = () => {
  return (
    <LayoutBackground zIndex="md:z-30" pointerEvents="pointer-events-none" isShowFooter={false} backgroundSp={backgroundTopSp}>
      <SettingPasswordView />
    </LayoutBackground>
  );
};

export default SettingPasswordPage;
