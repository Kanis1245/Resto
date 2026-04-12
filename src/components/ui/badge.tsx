import { cn } from "@/lib/utils";

interface PropsBadge {
  children: React.ReactNode;
  className?: string;
  variante?: "default" | "success" | "warning" | "danger" | "info";
}

const varianteClasses = {
  default: "bg-gray-100 text-gray-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  danger: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
};

export function Badge({ children, className, variante = "default" }: PropsBadge) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        varianteClasses[variante],
        className
      )}
    >
      {children}
    </span>
  );
}
