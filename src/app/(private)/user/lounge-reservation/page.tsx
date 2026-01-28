// import LougeReservation from "@/components/organisms/user/LoungeReservation";

import UserLayout from "@/components/layout/UserLayout";
import ReservationStaticPage from "@/features/user/reservation-static";

const LougeReservationPage = () => {
  return (
    <UserLayout>
      <ReservationStaticPage />
    </UserLayout>
  );
};

export default LougeReservationPage;
