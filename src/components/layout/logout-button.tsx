"use client";

import { seDeconnecter } from "@/app/actions/auth";
import { LogOut } from "lucide-react";

export function BoutonDeconnexion() {
  return (
    <form action={seDeconnecter}>
      <button
        type="submit"
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Déconnexion</span>
      </button>
    </form>
  );
}
