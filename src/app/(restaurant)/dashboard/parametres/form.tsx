"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Restaurant, TypeCuisine } from "@/generated/prisma/client";
import { CUISINES, VILLES } from "@/lib/constants";

export function FormulaireParametres({
  restaurant,
}: {
  restaurant: Restaurant;
}) {
  const [nom, setNom] = useState(restaurant.nom);
  const [description, setDescription] = useState(restaurant.description ?? "");
  const [adresse, setAdresse] = useState(restaurant.adresse);
  const [ville, setVille] = useState(restaurant.ville);
  const [telephone, setTelephone] = useState(restaurant.telephone ?? "");
  const [cuisine, setCuisine] = useState<TypeCuisine>(restaurant.cuisine);
  const [fraisLivraison, setFraisLivraison] = useState(
    restaurant.fraisLivraison.toString()
  );
  const [tempsLivraison, setTempsLivraison] = useState(
    restaurant.tempsLivraison.toString()
  );
  const [estOuvert, setEstOuvert] = useState(restaurant.estOuvert);
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const sauvegarder = (e: React.FormEvent) => {
    e.preventDefault();
    setErreur("");
    setSucces(false);

    startTransition(async () => {
      const res = await fetch(`/api/restaurants/${restaurant.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom,
          description: description || undefined,
          adresse,
          ville,
          telephone: telephone || undefined,
          cuisine,
          fraisLivraison: parseInt(fraisLivraison),
          tempsLivraison: parseInt(tempsLivraison),
          estOuvert,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErreur(data.erreur || "Erreur lors de la sauvegarde");
        return;
      }

      setSucces(true);
      router.refresh();
    });
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 min-h-[44px]";

  return (
    <form
      onSubmit={sauvegarder}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4"
    >
      {erreur && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
          {erreur}
        </div>
      )}
      {succes && (
        <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-xl">
          ✅ Modifications sauvegardées
        </div>
      )}

      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
        <div>
          <p className="font-medium text-gray-900">Restaurant ouvert</p>
          <p className="text-sm text-gray-500">
            Les clients peuvent passer commande
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEstOuvert(!estOuvert)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            estOuvert ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              estOuvert ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Nom *</label>
        <input
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${inputClass} resize-none`}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Adresse *</label>
          <input
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            required
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Ville</label>
          <select
            value={ville}
            onChange={(e) => setVille(e.target.value)}
            className={inputClass}
          >
            {VILLES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Téléphone</label>
        <input
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          type="tel"
          placeholder="+237..."
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Type de cuisine</label>
        <select
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value as TypeCuisine)}
          className={inputClass}
        >
          {CUISINES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.emoji} {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">
            Frais livraison (FCFA)
          </label>
          <input
            type="number"
            value={fraisLivraison}
            onChange={(e) => setFraisLivraison(e.target.value)}
            min="0"
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">
            Temps livraison (min)
          </label>
          <input
            type="number"
            value={tempsLivraison}
            onChange={(e) => setTempsLivraison(e.target.value)}
            min="10"
            max="120"
            className={inputClass}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3.5 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
      >
        {isPending ? (
          <>
            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Sauvegarde...
          </>
        ) : (
          "Sauvegarder"
        )}
      </button>
    </form>
  );
}
