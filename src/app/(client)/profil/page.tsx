import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BoutonDeconnexion } from "@/components/layout/logout-button";
import { User, ShoppingBag, ChefHat, Phone, Mail } from "lucide-react";

export default async function PageProfil() {
  const session = await getSession();
  if (!session) redirect("/connexion");

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-6 space-y-5">
      <h1 className="text-xl font-bold text-gray-900">Mon profil</h1>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-orange-100 flex items-center justify-center">
            <User className="h-8 w-8 text-orange-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{session.nom}</h2>
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-orange-100 text-orange-600 mt-1">
              {session.role === "RESTAURATEUR" ? (
                <>
                  <ChefHat className="h-3 w-3" /> Restaurateur
                </>
              ) : session.role === "ADMIN" ? (
                "Administrateur"
              ) : (
                "Client"
              )}
            </span>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          {session.telephone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              {session.telephone}
            </div>
          )}
          {session.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              {session.email}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <Link
          href="/commandes"
          className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors border-b border-gray-100"
        >
          <div className="flex items-center gap-3 text-gray-700">
            <ShoppingBag className="h-5 w-5 text-orange-500" />
            Mes commandes
          </div>
          <span className="text-gray-400">→</span>
        </Link>

        {session.role === "RESTAURATEUR" && (
          <Link
            href="/dashboard"
            className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3 text-gray-700">
              <ChefHat className="h-5 w-5 text-orange-500" />
              Tableau de bord restaurant
            </div>
            <span className="text-gray-400">→</span>
          </Link>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <BoutonDeconnexion />
      </div>
    </div>
  );
}
