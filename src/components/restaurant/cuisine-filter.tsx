"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { CUISINES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function FiltreCuisine() {
  const router = useRouter();
  const chemin = usePathname();
  const params = useSearchParams();
  const cuisineActive = params.get("cuisine");

  const filtrer = (valeur: string | null) => {
    const p = new URLSearchParams(params.toString());
    if (valeur) {
      p.set("cuisine", valeur);
    } else {
      p.delete("cuisine");
    }
    router.push(`${chemin}?${p.toString()}`);
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
      <button
        onClick={() => filtrer(null)}
        className={cn(
          "flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all",
          !cuisineActive
            ? "bg-orange-500 text-white shadow-sm"
            : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300"
        )}
      >
        🍽️ Tout
      </button>
      {CUISINES.map((c) => (
        <button
          key={c.value}
          onClick={() => filtrer(c.value)}
          className={cn(
            "flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all",
            cuisineActive === c.value
              ? "bg-orange-500 text-white shadow-sm"
              : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300"
          )}
        >
          {c.emoji} {c.label}
        </button>
      ))}
    </div>
  );
}
