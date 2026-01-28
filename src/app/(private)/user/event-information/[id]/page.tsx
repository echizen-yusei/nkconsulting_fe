import UserLayout from "@/components/layout/UserLayout";
import EventInformationDetail from "@/features/user/event-information/detail/EventInformation";

const EventInformationDetailPage = () => {
  return (
    <UserLayout zIndex="z-60">
      <EventInformationDetail />
    </UserLayout>
  );
};

export default EventInformationDetailPage;
