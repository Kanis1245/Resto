"use client";

import { useActionState } from "react";
import { seConnecter } from "@/app/actions/auth";
import Link from "next/link";
import { ChefHat } from "lucide-react";

export default function PageConnexion() {
  const [etat, action, pending] = useActionState(seConnecter, {});

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-orange-500 shadow-lg mb-2">
            <ChefHat className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Bon retour !</h1>
          <p className="text-gray-500">Connectez-vous à votre compte Resto</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          {etat.erreur && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
              {etat.erreur}
            </div>
          )}

          <form action={action} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="identifiant"
                className="text-sm font-medium text-gray-700"
              >
                Téléphone ou email
              </label>
              <input
                id="identifiant"
                name="identifiant"
                type="text"
                placeholder="+237 6XX XXX XXX ou email"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all min-h-[44px]"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="motDePasse"
                className="text-sm font-medium text-gray-700"
              >
                Mot de passe
              </label>
              <input
                id="motDePasse"
                name="motDePasse"
                type="password"
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all min-h-[44px]"
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-orange-500 text-white py-3.5 rounded-xl font-bold text-base hover:bg-orange-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 min-h-[52px]"
            >
              {pending ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500">
          Pas encore de compte ?{" "}
          <Link
            href="/inscription"
            className="text-orange-500 font-semibold hover:underline"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
