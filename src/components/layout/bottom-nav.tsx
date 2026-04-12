"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";

const liens = [
  { href: "/restaurants", icone: Home, label: "Accueil" },
  { href: "/recherche", icone: Search, label: "Rechercher" },
  { href: "/commandes", icone: ShoppingBag, label: "Commandes" },
  { href: "/profil", icone: User, label: "Profil" },
];

export function BottomNav() {
  const chemin = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-lg sm:hidden">
      <div className="grid grid-cols-4 h-16">
        {liens.map(({ href, icone: Icone, label }) => {
          const actif = chemin === href || chemin.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 min-h-[44px]",
                "text-xs font-medium transition-colors",
                actif ? "text-orange-500" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Icone
                className={cn("h-5 w-5", actif && "text-orange-500")}
                strokeWidth={actif ? 2.5 : 2}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
