"use client";

import { useEffect, useState } from "react";
import { ETAPES_COMMANDE, STATUTS_COMMANDE } from "@/lib/constants";
import { cn } from "@/lib/utils";

type StatutCommande =
  | "EN_ATTENTE"
  | "CONFIRMEE"
  | "EN_PREPARATION"
  | "PRETE"
  | "EN_LIVRAISON"
  | "LIVREE"
  | "ANNULEE";

type PropsSuivi = {
  commandeId: string;
  statutInitial: StatutCommande;
};

const ORDRE_STATUTS = [
  "EN_ATTENTE",
  "CONFIRMEE",
  "EN_PREPARATION",
  "PRETE",
  "EN_LIVRAISON",
  "LIVREE",
] as const;

export function SuiviCommande({ commandeId, statutInitial }: PropsSuivi) {
  const [statut, setStatut] = useState<StatutCommande>(statutInitial);

  useEffect(() => {
    if (statut === "LIVREE" || statut === "ANNULEE") return;

    const source = new EventSource(`/api/commandes/${commandeId}/stream`);

    source.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.statut) {
          setStatut(data.statut);
        }
      } catch {
        /* ignore */
      }
    };

    source.onerror = () => {
      source.close();
    };

    return () => source.close();
  }, [commandeId, statut]);

  if (statut === "ANNULEE") {
    return (
      <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-center">
        <p className="text-red-500 font-semibold text-lg">❌ Commande annulée</p>
        <p className="text-red-400 text-sm mt-1">
          Cette commande a été annulée
        </p>
      </div>
    );
  }

  const indexActuel = ORDRE_STATUTS.indexOf(statut as (typeof ORDRE_STATUTS)[number]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900">Suivi de commande</h3>
        <span
          className={cn(
            "px-2.5 py-1 rounded-full text-xs font-medium",
            STATUTS_COMMANDE[statut]?.couleur
          )}
        >
          {STATUTS_COMMANDE[statut]?.label}
        </span>
      </div>

      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-100" />

        <div className="space-y-4">
          {ETAPES_COMMANDE.map((etape, index) => {
            const estFait = index <= indexActuel;
            const estActif = index === indexActuel;

            return (
              <div key={etape.statut} className="flex items-center gap-4 relative">
                <div
                  className={cn(
                    "relative z-10 h-10 w-10 rounded-full flex items-center justify-center text-lg flex-shrink-0",
                    estFait
                      ? "bg-orange-500"
                      : "bg-gray-100"
                  )}
                >
                  {estFait ? (
                    index < indexActuel ? "✓" : etape.icone
                  ) : (
                    <span className="text-gray-400">{etape.icone}</span>
                  )}
                </div>
                <div>
                  <p
                    className={cn(
                      "font-medium",
                      estFait ? "text-gray-900" : "text-gray-400",
                      estActif && "text-orange-500"
                    )}
                  >
                    {etape.label}
                  </p>
                  {estActif && (
                    <p className="text-sm text-gray-500 mt-0.5">
                      {STATUTS_COMMANDE[statut]?.description}
                    </p>
                  )}
                </div>
                {estActif && statut !== "LIVREE" && (
                  <div className="ml-auto">
                    <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-orange-500" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
