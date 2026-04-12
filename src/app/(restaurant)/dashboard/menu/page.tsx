import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatPrix } from "@/lib/utils";
import { Plus, Edit2, Eye, EyeOff } from "lucide-react";
import { BasculerDisponibilite } from "./actions";

export default async function PageMenu() {
  const session = await getSession();
  if (!session) redirect("/connexion");

  const restaurant = await prisma.restaurant.findUnique({
    where: { proprietaireId: session.id },
    include: {
      categories: {
        include: {
          articles: { orderBy: { nom: "asc" } },
        },
        orderBy: { ordre: "asc" },
      },
    },
  });

  if (!restaurant) redirect("/dashboard");

  return (
    <div className="space-y-6 max-w-screen-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Menu</h1>
        <Link
          href="/dashboard/menu/nouveau"
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-orange-600 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Nouveau plat
        </Link>
      </div>

      {restaurant.categories.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center space-y-3">
          <p className="text-4xl">🍽️</p>
          <p className="font-semibold text-gray-900">Votre menu est vide</p>
          <p className="text-gray-400 text-sm">
            Ajoutez votre premier plat pour commencer à recevoir des commandes
          </p>
          <Link
            href="/dashboard/menu/nouveau"
            className="inline-flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-orange-600 mt-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter un plat
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {restaurant.categories.map((categorie) => (
            <div key={categorie.id}>
              <h2 className="font-bold text-gray-700 text-lg mb-3">
                {categorie.nom}{" "}
                <span className="text-gray-400 font-normal text-sm">
                  ({categorie.articles.length})
                </span>
              </h2>
              <div className="space-y-2">
                {categorie.articles.map((article) => (
                  <div
                    key={article.id}
                    className="flex items-center justify-between bg-white rounded-xl border border-gray-100 shadow-sm p-3 gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium ${
                          article.estDisponible ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        {article.nom}
                        {!article.estDisponible && (
                          <span className="ml-2 text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">
                            Indisponible
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-orange-500 font-semibold">
                        {formatPrix(article.prix)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <BasculerDisponibilite
                        articleId={article.id}
                        estDisponible={article.estDisponible}
                      />
                      <Link
                        href={`/dashboard/menu/${article.id}`}
                        className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
