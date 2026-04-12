"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CategorieMenu } from "@/generated/prisma/client";

type PropsFormulaire = {
  categories: CategorieMenu[];
  restaurantId: string;
  articleExistant?: {
    id: string;
    nom: string;
    description: string | null;
    prix: number;
    categorieId: string;
    estDisponible: boolean;
  };
};

export function FormulaireArticleMenu({
  categories,
  restaurantId,
  articleExistant,
}: PropsFormulaire) {
  const [nom, setNom] = useState(articleExistant?.nom ?? "");
  const [description, setDescription] = useState(
    articleExistant?.description ?? ""
  );
  const [prix, setPrix] = useState(articleExistant?.prix?.toString() ?? "");
  const [categorieId, setCategorieId] = useState(
    articleExistant?.categorieId ?? categories[0]?.id ?? ""
  );
  const [nouvelleCategorie, setNouvelleCategorie] = useState("");
  const [creerCategorie, setCreerCategorie] = useState(categories.length === 0);
  const [erreur, setErreur] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const soumettre = (e: React.FormEvent) => {
    e.preventDefault();
    setErreur("");

    if (!nom.trim() || !prix || (!categorieId && !nouvelleCategorie.trim())) {
      setErreur("Tous les champs requis doivent être remplis");
      return;
    }

    startTransition(async () => {
      let catId = categorieId;

      if (creerCategorie && nouvelleCategorie.trim()) {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nom: nouvelleCategorie.trim(),
            restaurantId,
          }),
        });
        if (!res.ok) {
          setErreur("Erreur lors de la création de la catégorie");
          return;
        }
        const data = await res.json();
        catId = data.id;
      }

      const url = articleExistant
        ? `/api/menu/${articleExistant.id}`
        : "/api/menu";
      const method = articleExistant ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: nom.trim(),
          description: description.trim() || undefined,
          prix: parseInt(prix),
          categorieId: catId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErreur(data.erreur || "Erreur lors de la sauvegarde");
        return;
      }

      router.push("/dashboard/menu");
      router.refresh();
    });
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 min-h-[44px]";

  return (
    <form onSubmit={soumettre} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      {erreur && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">
          {erreur}
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">
          Nom du plat *
        </label>
        <input
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Ex: Poulet DG, Thiéboudienne..."
          required
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Décrivez les ingrédients, le mode de préparation..."
          className={`${inputClass} resize-none`}
          rows={3}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">
          Prix (FCFA) *
        </label>
        <input
          type="number"
          value={prix}
          onChange={(e) => setPrix(e.target.value)}
          placeholder="Ex: 2500"
          min="100"
          max="100000"
          required
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Catégorie *</label>
          {categories.length > 0 && (
            <button
              type="button"
              onClick={() => setCreerCategorie(!creerCategorie)}
              className="text-xs text-orange-500 hover:underline"
            >
              {creerCategorie ? "Choisir existante" : "+ Nouvelle catégorie"}
            </button>
          )}
        </div>
        {creerCategorie ? (
          <input
            value={nouvelleCategorie}
            onChange={(e) => setNouvelleCategorie(e.target.value)}
            placeholder="Ex: Plats principaux, Entrées, Desserts..."
            className={inputClass}
          />
        ) : (
          <select
            value={categorieId}
            onChange={(e) => setCategorieId(e.target.value)}
            className={inputClass}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nom}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sauvegarde...
            </>
          ) : articleExistant ? (
            "Modifier"
          ) : (
            "Ajouter au menu"
          )}
        </button>
      </div>
    </form>
  );
}
