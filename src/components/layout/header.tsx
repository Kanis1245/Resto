import Link from "next/link";
import { getSession } from "@/lib/auth";
import { BoutonDeconnexion } from "./logout-button";
import { ShoppingCart, User, ChefHat } from "lucide-react";
import { BoutonPanier } from "@/components/cart/cart-button";

export async function Header() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-screen-lg mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-orange-500"
        >
          <ChefHat className="h-7 w-7" />
          <span className="hidden sm:inline">Resto</span>
        </Link>

        <div className="flex items-center gap-2">
          <BoutonPanier />

          {session ? (
            <div className="flex items-center gap-2">
              {session.role === "RESTAURATEUR" && (
                <Link
                  href="/dashboard"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                  <ChefHat className="h-4 w-4" />
                  Tableau de bord
                </Link>
              )}
              <Link
                href="/profil"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{session.nom.split(" ")[0]}</span>
              </Link>
              <BoutonDeconnexion />
            </div>
          ) : (
            <Link
              href="/connexion"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors"
            >
              <User className="h-4 w-4" />
              Connexion
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
