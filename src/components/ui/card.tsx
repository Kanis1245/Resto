import { cn } from "@/lib/utils";

interface PropsCarte {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Carte({ children, className, onClick }: PropsCarte) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-2xl bg-white shadow-sm border border-gray-100",
        onClick && "cursor-pointer hover:shadow-md transition-shadow duration-200",
        className
      )}
    >
      {children}
    </div>
  );
}

export function EnteteCarte({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("p-4 pb-2", className)}>{children}</div>;
}

export function ContenuCarte({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("p-4 pt-2", className)}>{children}</div>;
}
