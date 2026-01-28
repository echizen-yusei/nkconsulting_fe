import LoungeReservationLayout from "@/components/layout/LoungeReservationLayout";

function Cancel() {
  return (
    <LoungeReservationLayout zIndex="z-60">
      <div className="text-cream px-12 pt-4 text-center md:text-left">現在準備中です</div>
    </LoungeReservationLayout>
  );
}

export default Cancel;
