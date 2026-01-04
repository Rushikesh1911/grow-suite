import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  containerClassName?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, containerClassName, label, id, ...props }, ref) => {
    const checkboxId = id || React.useId();
    
    return (
      <div className={cn("flex items-center space-x-2", containerClassName)}>
        <div className="relative flex items-center">
          <input
            type="checkbox"
            id={checkboxId}
            ref={ref}
            className={cn(
              "peer h-4 w-4 shrink-0 appearance-none rounded-sm border border-gray-300 dark:border-gray-600",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "checked:bg-primary checked:border-primary",
              "dark:checked:bg-primary dark:checked:border-primary",
              className
            )}
            {...props}
          />
          <Check
            className={cn(
              "absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity",
              "peer-checked:opacity-100"
            )}
            strokeWidth={3}
          />
        </div>
        {label && (
          <label
            htmlFor={checkboxId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
