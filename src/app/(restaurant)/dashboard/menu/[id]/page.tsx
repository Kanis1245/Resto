import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { FormulaireArticleMenu } from "../form";

type PageModifierArticleProps = {
  params: Promise<{ id: string }>;
};

export default async function PageModifierArticle({
  params,
}: PageModifierArticleProps) {
  const session = await getSession();
  if (!session) redirect("/connexion");

  const { id } = await params;

  const restaurant = await prisma.restaurant.findUnique({
    where: { proprietaireId: session.id },
    include: { categories: { orderBy: { ordre: "asc" } } },
  });

  if (!restaurant) redirect("/dashboard");

  const article = await prisma.articleMenu.findUnique({
    where: { id },
    include: { categorie: true },
  });

  if (!article || article.categorie.restaurantId !== restaurant.id) {
    notFound();
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Modifier le plat</h1>
      <FormulaireArticleMenu
        categories={restaurant.categories}
        restaurantId={restaurant.id}
        articleExistant={{
          id: article.id,
          nom: article.nom,
          description: article.description,
          prix: article.prix,
          categorieId: article.categorieId,
          estDisponible: article.estDisponible,
        }}
      />
    </div>
  );
}
