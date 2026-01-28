import { cn } from "@/libs/utils";

const ErrorMsg = ({ message, name, className = "mt-1" }: { message: string; name: string; className?: string }) => {
  return (
    <p className={cn("text-red-light min-h-5 text-xs sm:text-sm", className)} data-field={name} data-work-history-error="true">
      {message}
    </p>
  );
};

export default ErrorMsg;
