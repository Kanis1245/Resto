"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ArticlePanier = {
  articleId: string;
  nom: string;
  prix: number;
  quantite: number;
  restaurantId: string;
  restaurantNom: string;
  imageUrl?: string | null;
};

type PanierState = {
  articles: ArticlePanier[];
  restaurantActifId: string | null;
  restaurantActifNom: string | null;
  ajouterArticle: (article: ArticlePanier) => "ok" | "conflit";
  retirerArticle: (articleId: string) => void;
  mettreAJourQuantite: (articleId: string, quantite: number) => void;
  viderPanier: () => void;
  total: () => number;
  nombreArticles: () => number;
};

export const usePanier = create<PanierState>()(
  persist(
    (set, get) => ({
      articles: [],
      restaurantActifId: null,
      restaurantActifNom: null,

      ajouterArticle: (article) => {
        const { restaurantActifId, articles } = get();

        if (restaurantActifId && restaurantActifId !== article.restaurantId) {
          return "conflit";
        }

        const existant = articles.find((a) => a.articleId === article.articleId);
        if (existant) {
          set({
            articles: articles.map((a) =>
              a.articleId === article.articleId
                ? { ...a, quantite: a.quantite + article.quantite }
                : a
            ),
          });
        } else {
          set({
            articles: [...articles, article],
            restaurantActifId: article.restaurantId,
            restaurantActifNom: article.restaurantNom,
          });
        }
        return "ok";
      },

      retirerArticle: (articleId) => {
        const articles = get().articles.filter((a) => a.articleId !== articleId);
        set({
          articles,
          restaurantActifId: articles.length === 0 ? null : get().restaurantActifId,
          restaurantActifNom: articles.length === 0 ? null : get().restaurantActifNom,
        });
      },

      mettreAJourQuantite: (articleId, quantite) => {
        if (quantite <= 0) {
          get().retirerArticle(articleId);
          return;
        }
        set({
          articles: get().articles.map((a) =>
            a.articleId === articleId ? { ...a, quantite } : a
          ),
        });
      },

      viderPanier: () =>
        set({ articles: [], restaurantActifId: null, restaurantActifNom: null }),

      total: () =>
        get().articles.reduce((sum, a) => sum + a.prix * a.quantite, 0),

      nombreArticles: () =>
        get().articles.reduce((sum, a) => sum + a.quantite, 0),
    }),
    {
      name: "resto-panier",
      partialize: (state) => ({
        articles: state.articles,
        restaurantActifId: state.restaurantActifId,
        restaurantActifNom: state.restaurantActifNom,
      }),
    }
  )
);
