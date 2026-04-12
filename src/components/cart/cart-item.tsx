"use client";

import { usePanier, ArticlePanier } from "@/lib/cart-store";
import { formatPrix } from "@/lib/utils";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";

export function ArticlePanierItem({ article }: { article: ArticlePanier }) {
  const { mettreAJourQuantite, retirerArticle } = usePanier();

  return (
    <div className="flex gap-3 p-3 rounded-xl border border-gray-100 bg-white">
      {article.imageUrl ? (
        <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden">
          <Image
            src={article.imageUrl}
            alt={article.nom}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-orange-50 flex items-center justify-center text-2xl">
          🍽️
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{article.nom}</p>
        <p className="text-sm text-orange-500 font-semibold mt-0.5">
          {formatPrix(article.prix)}
        </p>

        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() =>
              mettreAJourQuantite(article.articleId, article.quantite - 1)
            }
            className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <Minus className="h-3.5 w-3.5 text-gray-600" />
          </button>
          <span className="font-semibold text-gray-900 w-6 text-center">
            {article.quantite}
          </span>
          <button
            onClick={() =>
              mettreAJourQuantite(article.articleId, article.quantite + 1)
            }
            className="h-7 w-7 rounded-full bg-orange-100 flex items-center justify-center hover:bg-orange-200 transition-colors"
          >
            <Plus className="h-3.5 w-3.5 text-orange-600" />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between">
        <button
          onClick={() => retirerArticle(article.articleId)}
          className="text-red-400 hover:text-red-600 p-1"
        >
          <Trash2 className="h-4 w-4" />
        </button>
        <p className="font-bold text-gray-900">
          {formatPrix(article.prix * article.quantite)}
        </p>
      </div>
    </div>
  );
}
