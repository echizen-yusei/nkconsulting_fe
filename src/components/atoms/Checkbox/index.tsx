import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "@/libs/utils";

function Checkbox({ className, label, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root> & { label?: string }) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-red-light size-4 shrink-0 rounded-none border bg-white shadow-xs transition-all duration-200 outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:text-white",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator data-slot="checkbox-indicator" className="flex items-center justify-center text-white transition-none">
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
      <span className="sr-only">{label}</span>
    </CheckboxPrimitive.Root>
  );
}

export default Checkbox;
