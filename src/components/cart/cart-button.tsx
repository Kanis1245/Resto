"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { usePanier } from "@/lib/cart-store";
import { formatPrix } from "@/lib/utils";

export function BoutonPanier() {
  const { nombreArticles, total } = usePanier();
  const nb = nombreArticles();

  if (nb === 0) return null;

  return (
    <Link
      href="/panier"
      className="flex items-center gap-2 bg-orange-500 text-white rounded-xl px-3 py-2 text-sm font-semibold hover:bg-orange-600 transition-colors shadow-md"
    >
      <div className="relative">
        <ShoppingCart className="h-5 w-5" />
        <span className="absolute -top-2 -right-2 bg-white text-orange-500 text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
          {nb}
        </span>
      </div>
      <span className="hidden sm:inline">{formatPrix(total())}</span>
    </Link>
  );
}
