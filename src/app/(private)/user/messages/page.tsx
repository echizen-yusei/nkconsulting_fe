import UserLayout from "@/components/layout/UserLayout";
import MessagePage from "@/features/user/message/MessagePage";

const Messages = () => {
  return (
    <UserLayout isShowFooter={false} mobilePaddingBottom="pb-0">
      <MessagePage />
    </UserLayout>
  );
};

export default Messages;
