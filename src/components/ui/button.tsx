import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type VarianteBouton = "primaire" | "secondaire" | "fantome" | "danger";
type TailleBouton = "sm" | "md" | "lg";

interface PropsBouton extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: VarianteBouton;
  taille?: TailleBouton;
  enChargement?: boolean;
}

const varianteClasses: Record<VarianteBouton, string> = {
  primaire:
    "bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700 shadow-sm",
  secondaire:
    "bg-white text-orange-500 border border-orange-500 hover:bg-orange-50 active:bg-orange-100",
  fantome: "bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200",
  danger: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-sm",
};

const tailleClasses: Record<TailleBouton, string> = {
  sm: "px-3 py-1.5 text-sm min-h-[36px]",
  md: "px-4 py-2.5 text-base min-h-[44px]",
  lg: "px-6 py-3 text-lg min-h-[52px]",
};

export const Bouton = forwardRef<HTMLButtonElement, PropsBouton>(
  (
    {
      className,
      variante = "primaire",
      taille = "md",
      enChargement = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || enChargement}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-semibold",
          "transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          varianteClasses[variante],
          tailleClasses[taille],
          className
        )}
        {...props}
      >
        {enChargement ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Bouton.displayName = "Bouton";
