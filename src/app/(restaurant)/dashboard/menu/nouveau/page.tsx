import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FormulaireArticleMenu } from "../form";

export default async function PageNouvelArticle() {
  const session = await getSession();
  if (!session) redirect("/connexion");

  const restaurant = await prisma.restaurant.findUnique({
    where: { proprietaireId: session.id },
    include: {
      categories: { orderBy: { ordre: "asc" } },
    },
  });

  if (!restaurant) redirect("/dashboard");

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Nouveau plat</h1>
      <FormulaireArticleMenu
        categories={restaurant.categories}
        restaurantId={restaurant.id}
      />
    </div>
  );
}
