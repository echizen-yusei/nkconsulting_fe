import React from "react";
import UserLayout from "../UserLayout";

const LoungeReservationLayout = ({ children, zIndex = "" }: { children: React.ReactNode; zIndex?: string }) => {
  return (
    <UserLayout zIndex={zIndex}>
      <div className="flex">
        <div className="flex-3">{children}</div>
        <div className="hidden flex-1 md:block"></div>
      </div>
    </UserLayout>
  );
};

export default LoungeReservationLayout;
