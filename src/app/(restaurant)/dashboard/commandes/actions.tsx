"use client";

import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type PropsMaj = {
  commandeId: string;
  nouveauStatut: string;
  label: string;
  className?: string;
};

export function MajStatutCommande({
  commandeId,
  nouveauStatut,
  label,
  className,
}: PropsMaj) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const metAJour = () => {
    startTransition(async () => {
      await fetch(`/api/commandes/${commandeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: nouveauStatut }),
      });
      router.refresh();
    });
  };

  return (
    <button
      onClick={metAJour}
      disabled={isPending}
      className={cn(
        "disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
        className
      )}
    >
      {isPending ? "..." : label}
    </button>
  );
}
