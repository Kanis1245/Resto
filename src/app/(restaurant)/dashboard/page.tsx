import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatPrix } from "@/lib/utils";
import Link from "next/link";
import { ShoppingBag, TrendingUp, Star, Clock } from "lucide-react";

export default async function PageDashboard() {
  const session = await getSession();
  if (!session) redirect("/connexion");

  const restaurant = await prisma.restaurant.findUnique({
    where: { proprietaireId: session.id },
    include: {
      _count: { select: { commandes: true } },
    },
  });

  if (!restaurant) redirect("/inscription");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [commandesAujourdhui, commandesEnAttente, revenuTotal] =
    await Promise.all([
      prisma.commande.count({
        where: {
          restaurantId: restaurant.id,
          createdAt: { gte: today },
        },
      }),
      prisma.commande.count({
        where: {
          restaurantId: restaurant.id,
          statut: { in: ["EN_ATTENTE", "CONFIRMEE", "EN_PREPARATION"] },
        },
      }),
      prisma.commande.aggregate({
        where: {
          restaurantId: restaurant.id,
          statut: "LIVREE",
        },
        _sum: { total: true },
      }),
    ]);

  const stats = [
    {
      label: "Commandes aujourd'hui",
      valeur: commandesAujourdhui.toString(),
      icone: ShoppingBag,
      couleur: "bg-blue-50 text-blue-600",
    },
    {
      label: "En attente",
      valeur: commandesEnAttente.toString(),
      icone: Clock,
      couleur:
        commandesEnAttente > 0
          ? "bg-orange-50 text-orange-600"
          : "bg-gray-50 text-gray-500",
    },
    {
      label: "Revenu total",
      valeur: formatPrix(revenuTotal._sum.total ?? 0),
      icone: TrendingUp,
      couleur: "bg-green-50 text-green-600",
    },
    {
      label: "Note moyenne",
      valeur:
        restaurant.noteMoyenne > 0
          ? `${restaurant.noteMoyenne.toFixed(1)} ★`
          : "—",
      icone: Star,
      couleur: "bg-yellow-50 text-yellow-600",
    },
  ];

  const dernieresCommandes = await prisma.commande.findMany({
    where: { restaurantId: restaurant.id },
    include: {
      client: { select: { nom: true } },
      lignes: {
        take: 1,
        include: { article: { select: { nom: true } } },
      },
      _count: { select: { lignes: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="space-y-6 max-w-screen-lg">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{restaurant.nom}</h1>
        <p className="text-gray-500 mt-0.5">
          {restaurant.estOuvert ? "🟢 Ouvert" : "🔴 Fermé"} ·{" "}
          {restaurant.ville}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm"
          >
            <div
              className={`inline-flex p-2 rounded-xl mb-3 ${stat.couleur}`}
            >
              <stat.icone className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.valeur}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">Dernières commandes</h2>
          <Link
            href="/dashboard/commandes"
            className="text-sm text-orange-500 hover:underline font-medium"
          >
            Voir tout →
          </Link>
        </div>

        {dernieresCommandes.length === 0 ? (
          <p className="text-gray-400 text-sm py-4 text-center">
            Aucune commande pour l&apos;instant
          </p>
        ) : (
          <div className="space-y-3">
            {dernieresCommandes.map((c) => (
              <Link
                key={c.id}
                href={`/dashboard/commandes/${c.id}`}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 text-sm">
                    {c.client.nom}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {c.lignes[0]?.article.nom}
                    {c._count.lignes > 1 && ` +${c._count.lignes - 1}`}
                  </p>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <p className="font-semibold text-gray-900 text-sm">
                    {formatPrix(c.total)}
                  </p>
                  <p className="text-xs text-gray-400">{c.numero}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/dashboard/commandes"
          className="bg-orange-500 text-white rounded-2xl p-4 flex flex-col gap-1 hover:bg-orange-600 transition-colors shadow-sm"
        >
          <ShoppingBag className="h-6 w-6" />
          <span className="font-semibold">Commandes</span>
          <span className="text-sm text-orange-100">Gérer les commandes</span>
        </Link>
        <Link
          href="/dashboard/menu"
          className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col gap-1 hover:shadow-md transition-shadow"
        >
          <span className="text-2xl">🍽️</span>
          <span className="font-semibold text-gray-900">Menu</span>
          <span className="text-sm text-gray-400">Modifier les plats</span>
        </Link>
      </div>
    </div>
  );
}
