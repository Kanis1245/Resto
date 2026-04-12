import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatPrix, tempsEcoule } from "@/lib/utils";
import { STATUTS_COMMANDE } from "@/lib/constants";
import { ShoppingBag, ChevronRight } from "lucide-react";
import { StatutCommande } from "@/generated/prisma/client";

export default async function PageCommandes() {
  const session = await getSession();
  if (!session) redirect("/connexion");

  const commandes = await prisma.commande.findMany({
    where: { clientId: session.id },
    include: {
      restaurant: { select: { nom: true, logoUrl: true } },
      lignes: {
        take: 2,
        include: { article: { select: { nom: true } } },
      },
      _count: { select: { lignes: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  if (commandes.length === 0) {
    return (
      <div className="max-w-screen-lg mx-auto px-4 py-16 flex flex-col items-center gap-5">
        <ShoppingBag className="h-16 w-16 text-gray-300" />
        <h1 className="text-xl font-bold text-gray-900">Aucune commande</h1>
        <p className="text-gray-500 text-center">
          Vous n&apos;avez pas encore passé de commande
        </p>
        <Link
          href="/restaurants"
          className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600"
        >
          Commander maintenant
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-6 space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Mes commandes</h1>

      <div className="space-y-3">
        {commandes.map((commande) => {
          const info = STATUTS_COMMANDE[commande.statut as StatutCommande];
          return (
            <Link
              key={commande.id}
              href={`/commandes/${commande.id}`}
              className="block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-gray-900 truncate">
                      {commande.restaurant.nom}
                    </p>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${info?.couleur}`}
                    >
                      {info?.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {commande.lignes
                      .map((l) => l.article.nom)
                      .join(", ")}
                    {commande._count.lignes > 2 &&
                      ` +${commande._count.lignes - 2} autre(s)`}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 text-sm">
                    <span className="font-semibold text-orange-500">
                      {formatPrix(commande.total)}
                    </span>
                    <span className="text-gray-300">·</span>
                    <span className="text-gray-400">
                      {tempsEcoule(commande.createdAt)}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
