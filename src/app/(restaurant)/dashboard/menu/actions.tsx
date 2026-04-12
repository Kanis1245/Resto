"use client";

import { useTransition } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export function BasculerDisponibilite({
  articleId,
  estDisponible,
}: {
  articleId: string;
  estDisponible: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      onClick={() =>
        startTransition(async () => {
          await fetch(`/api/menu/${articleId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ estDisponible: !estDisponible }),
          });
          router.refresh();
        })
      }
      disabled={isPending}
      className={`p-2 rounded-lg transition-colors ${
        estDisponible
          ? "text-green-500 hover:bg-green-50"
          : "text-gray-400 hover:bg-gray-100"
      }`}
      title={estDisponible ? "Marquer indisponible" : "Marquer disponible"}
    >
      {estDisponible ? (
        <Eye className="h-4 w-4" />
      ) : (
        <EyeOff className="h-4 w-4" />
      )}
    </button>
  );
}
