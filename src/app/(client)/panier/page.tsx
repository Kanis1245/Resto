"use client";

import { usePanier } from "@/lib/cart-store";
import { ArticlePanierItem } from "@/components/cart/cart-item";
import { formatPrix } from "@/lib/utils";
import Link from "next/link";
import { ShoppingCart, ChevronLeft, MapPin } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function PagePanier() {
  const { articles, total, restaurantActifNom, restaurantActifId, viderPanier } =
    usePanier();
  const [adresse, setAdresse] = useState("");
  const [notes, setNotes] = useState("");
  const [erreur, setErreur] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const sousTotal = total();
  const fraisLivraison = 500;
  const totalFinal = sousTotal + fraisLivraison;

  const passerCommande = () => {
    if (!adresse.trim()) {
      setErreur("Veuillez entrer votre adresse de livraison");
      return;
    }
    setErreur("");

    startTransition(async () => {
      try {
        const res = await fetch("/api/commandes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            restaurantId: restaurantActifId,
            adresseLivraison: adresse,
            notesSpeciales: notes || undefined,
            articles: articles.map((a) => ({
              articleId: a.articleId,
              quantite: a.quantite,
            })),
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setErreur(data.erreur || "Une erreur est survenue");
          return;
        }

        viderPanier();
        router.push(`/commandes/${data.id}`);
      } catch {
        setErreur("Impossible de passer la commande. Vérifiez votre connexion.");
      }
    });
  };

  if (articles.length === 0) {
    return (
      <div className="max-w-screen-lg mx-auto px-4 py-16 flex flex-col items-center gap-6">
        <div className="text-7xl">🛒</div>
        <h1 className="text-2xl font-bold text-gray-900">Votre panier est vide</h1>
        <p className="text-gray-500">
          Ajoutez des plats depuis un restaurant pour commencer
        </p>
        <Link
          href="/restaurants"
          className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
        >
          Parcourir les restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/restaurants" className="text-gray-500 hover:text-gray-700">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Votre panier</h1>
          <p className="text-sm text-gray-500">{restaurantActifNom}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {articles.map((article) => (
            <ArticlePanierItem key={article.articleId} article={article} />
          ))}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-4">
            <h2 className="font-bold text-gray-900">Livraison</h2>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <MapPin className="h-4 w-4 text-orange-500" />
                Adresse de livraison
              </label>
              <textarea
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                placeholder="Ex: Akwa, Avenue de la Liberté, Immeuble..."
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 resize-none"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Notes spéciales (facultatif)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Allergies, instructions particulières..."
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 resize-none"
                rows={2}
              />
            </div>

            {erreur && (
              <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                {erreur}
              </p>
            )}
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
            <h2 className="font-bold text-gray-900">Récapitulatif</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span>{formatPrix(sousTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Frais de livraison</span>
                <span>{formatPrix(fraisLivraison)}</span>
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span>
                <span className="text-orange-500">{formatPrix(totalFinal)}</span>
              </div>
            </div>

            <button
              onClick={passerCommande}
              disabled={isPending}
              className="w-full bg-orange-500 text-white py-3.5 rounded-xl font-bold text-base hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Commande en cours...
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5" />
                  Commander — {formatPrix(totalFinal)}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
