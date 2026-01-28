import { FieldErrors, FieldValues } from "react-hook-form";

export const ErrorMessage = ({ errors, name }: { errors: FieldErrors<FieldValues>; name: string }) => {
  if (!errors[name]) return null;
  return (
    <p className="text-red-light mt-1 min-h-5 text-xs sm:text-sm" data-field={name}>
      {errors[name]?.message as string}
    </p>
  );
};
