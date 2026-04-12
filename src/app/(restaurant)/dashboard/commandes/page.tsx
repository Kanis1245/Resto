import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatPrix, tempsEcoule } from "@/lib/utils";
import { STATUTS_COMMANDE } from "@/lib/constants";
import Link from "next/link";
import { StatutCommande } from "@/generated/prisma/client";
import { MajStatutCommande } from "./actions";

export const dynamic = "force-dynamic";

export default async function PageCommandesDashboard() {
  const session = await getSession();
  if (!session) redirect("/connexion");

  const restaurant = await prisma.restaurant.findUnique({
    where: { proprietaireId: session.id },
  });

  if (!restaurant) redirect("/dashboard");

  const commandes = await prisma.commande.findMany({
    where: {
      restaurantId: restaurant.id,
      statut: { notIn: ["LIVREE", "ANNULEE"] },
    },
    include: {
      client: { select: { nom: true, telephone: true } },
      lignes: {
        include: { article: { select: { nom: true } } },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const commandesTerminees = await prisma.commande.findMany({
    where: {
      restaurantId: restaurant.id,
      statut: { in: ["LIVREE", "ANNULEE"] },
    },
    include: {
      client: { select: { nom: true } },
      _count: { select: { lignes: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: 10,
  });

  return (
    <div className="space-y-6 max-w-screen-lg">
      <h1 className="text-2xl font-bold text-gray-900">
        Commandes{" "}
        {commandes.length > 0 && (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-white text-sm font-bold ml-1">
            {commandes.length}
          </span>
        )}
      </h1>

      {commandes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
          <p className="text-4xl mb-3">✅</p>
          <p className="font-semibold text-gray-900">Aucune commande en cours</p>
          <p className="text-gray-400 text-sm mt-1">
            Les nouvelles commandes apparaîtront ici
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {commandes.map((commande) => {
            const info = STATUTS_COMMANDE[commande.statut as StatutCommande];
            return (
              <div
                key={commande.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-gray-900">
                        {commande.client.nom}
                      </p>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${info?.couleur}`}
                      >
                        {info?.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {commande.numero} · {tempsEcoule(commande.createdAt)}
                    </p>
                  </div>
                  <p className="font-bold text-orange-500 text-lg flex-shrink-0">
                    {formatPrix(commande.total)}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                  {commande.lignes.map((l) => (
                    <div
                      key={l.id}
                      className="flex justify-between text-sm text-gray-700"
                    >
                      <span>
                        {l.quantite}× {l.article.nom}
                      </span>
                      <span className="text-gray-500">
                        {formatPrix(l.sousTotal)}
                      </span>
                    </div>
                  ))}
                  {commande.adresseLivraison && (
                    <p className="text-xs text-gray-400 pt-1 border-t border-gray-200 mt-1">
                      📍 {commande.adresseLivraison}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  {commande.statut === "EN_ATTENTE" && (
                    <>
                      <MajStatutCommande
                        commandeId={commande.id}
                        nouveauStatut="CONFIRMEE"
                        label="✅ Accepter"
                        className="flex-1 bg-green-500 text-white py-2 rounded-xl text-sm font-semibold hover:bg-green-600"
                      />
                      <MajStatutCommande
                        commandeId={commande.id}
                        nouveauStatut="ANNULEE"
                        label="❌ Refuser"
                        className="flex-1 bg-red-50 text-red-600 border border-red-200 py-2 rounded-xl text-sm font-semibold hover:bg-red-100"
                      />
                    </>
                  )}
                  {commande.statut === "CONFIRMEE" && (
                    <MajStatutCommande
                      commandeId={commande.id}
                      nouveauStatut="EN_PREPARATION"
                      label="👨‍🍳 Commencer la préparation"
                      className="flex-1 bg-orange-500 text-white py-2 rounded-xl text-sm font-semibold hover:bg-orange-600"
                    />
                  )}
                  {commande.statut === "EN_PREPARATION" && (
                    <MajStatutCommande
                      commandeId={commande.id}
                      nouveauStatut="PRETE"
                      label="📦 Marquer comme prête"
                      className="flex-1 bg-purple-500 text-white py-2 rounded-xl text-sm font-semibold hover:bg-purple-600"
                    />
                  )}
                  {commande.statut === "PRETE" && (
                    <MajStatutCommande
                      commandeId={commande.id}
                      nouveauStatut="EN_LIVRAISON"
                      label="🛵 En livraison"
                      className="flex-1 bg-indigo-500 text-white py-2 rounded-xl text-sm font-semibold hover:bg-indigo-600"
                    />
                  )}
                  {commande.statut === "EN_LIVRAISON" && (
                    <MajStatutCommande
                      commandeId={commande.id}
                      nouveauStatut="LIVREE"
                      label="🎉 Marquer comme livrée"
                      className="flex-1 bg-green-500 text-white py-2 rounded-xl text-sm font-semibold hover:bg-green-600"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {commandesTerminees.length > 0 && (
        <div>
          <h2 className="font-bold text-gray-700 mb-3">
            Commandes terminées (10 dernières)
          </h2>
          <div className="space-y-2">
            {commandesTerminees.map((c) => {
              const info = STATUTS_COMMANDE[c.statut as StatutCommande];
              return (
                <div
                  key={c.id}
                  className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {c.client.nom}
                    </p>
                    <p className="text-xs text-gray-400">{c.numero}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 text-sm">
                      {formatPrix(c.total)}
                    </p>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${info?.couleur}`}
                    >
                      {info?.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
