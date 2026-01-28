import { useTranslations } from "next-intl";
import z from "zod";

const reservationSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    reserved_date: z.string().min(1, { message: t("Validation.requiredSelect", { field: t("loungeReservation.form.date.label") }) }),
    reserved_time: z.string().min(1, { message: t("Validation.requiredSelect", { field: t("loungeReservation.form.time.label") }) }),
    guest_count: z.string().min(1, { message: t("Validation.requiredSelect", { field: t("loungeReservation.form.guestCount.label") }) }),
  });
export default reservationSchema;
export type ReservationSchemaType = z.infer<ReturnType<typeof reservationSchema>>;
