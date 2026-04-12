import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface PropsInput extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  erreur?: string;
  iconeGauche?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, PropsInput>(
  ({ className, label, erreur, iconeGauche, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {iconeGauche && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {iconeGauche}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              "w-full rounded-xl border border-gray-200 bg-white px-4 py-3",
              "text-gray-900 placeholder-gray-400",
              "focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100",
              "transition-all duration-150",
              "min-h-[44px]",
              iconeGauche && "pl-10",
              erreur && "border-red-400 focus:border-red-400 focus:ring-red-100",
              className
            )}
            {...props}
          />
        </div>
        {erreur && <p className="text-sm text-red-500">{erreur}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
