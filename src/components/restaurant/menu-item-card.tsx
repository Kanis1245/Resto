"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { formatPrix } from "@/lib/utils";
import { usePanier } from "@/lib/cart-store";
import { useState } from "react";
import { cn } from "@/lib/utils";

type PropsArticleMenu = {
  id: string;
  nom: string;
  description: string | null;
  prix: number;
  imageUrl: string | null;
  estDisponible: boolean;
  restaurantId: string;
  restaurantNom: string;
};

export function CarteArticleMenu({
  id,
  nom,
  description,
  prix,
  imageUrl,
  estDisponible,
  restaurantId,
  restaurantNom,
}: PropsArticleMenu) {
  const { ajouterArticle, restaurantActifId, viderPanier } = usePanier();
  const [confirmerVider, setConfirmerVider] = useState(false);
  const [ajoute, setAjoute] = useState(false);

  const handleAjouter = () => {
    const resultat = ajouterArticle({
      articleId: id,
      nom,
      prix,
      quantite: 1,
      restaurantId,
      restaurantNom,
      imageUrl,
    });

    if (resultat === "conflit") {
      setConfirmerVider(true);
      return;
    }

    setAjoute(true);
    setTimeout(() => setAjoute(false), 1200);
  };

  const handleViderEtAjouter = () => {
    viderPanier();
    ajouterArticle({
      articleId: id,
      nom,
      prix,
      quantite: 1,
      restaurantId,
      restaurantNom,
      imageUrl,
    });
    setConfirmerVider(false);
    setAjoute(true);
    setTimeout(() => setAjoute(false), 1200);
  };

  return (
    <>
      <div
        className={cn(
          "flex gap-3 p-3 rounded-xl border border-gray-100 bg-white",
          !estDisponible && "opacity-60"
        )}
      >
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900">{nom}</h4>
          {description && (
            <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
              {description}
            </p>
          )}
          <p className="text-orange-500 font-bold mt-1.5">{formatPrix(prix)}</p>
        </div>

        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          {imageUrl ? (
            <div className="relative h-20 w-20 rounded-xl overflow-hidden">
              <Image src={imageUrl} alt={nom} fill className="object-cover" />
            </div>
          ) : (
            <div className="h-20 w-20 rounded-xl bg-orange-50 flex items-center justify-center text-3xl">
              🍽️
            </div>
          )}

          {estDisponible ? (
            <button
              onClick={handleAjouter}
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold transition-all",
                ajoute
                  ? "bg-green-500 text-white"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              )}
            >
              {ajoute ? "✓" : <Plus className="h-4 w-4" />}
              {ajoute ? "Ajouté" : "Ajouter"}
            </button>
          ) : (
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
              Indisponible
            </span>
          )}
        </div>
      </div>

      {confirmerVider && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-sm p-6 space-y-4">
            <h3 className="font-bold text-gray-900 text-lg">
              Nouveau restaurant ?
            </h3>
            <p className="text-gray-600 text-sm">
              Votre panier contient des articles d&apos;un autre restaurant.
              Voulez-vous vider votre panier et commander ici ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmerVider(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700"
              >
                Annuler
              </button>
              <button
                onClick={handleViderEtAjouter}
                className="flex-1 py-2.5 bg-orange-500 text-white rounded-xl font-semibold"
              >
                Vider et ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
