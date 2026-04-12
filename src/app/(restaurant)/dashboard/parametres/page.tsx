import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FormulaireParametres } from "./form";

export default async function PageParametres() {
  const session = await getSession();
  if (!session) redirect("/connexion");

  const restaurant = await prisma.restaurant.findUnique({
    where: { proprietaireId: session.id },
  });

  if (!restaurant) redirect("/dashboard");

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
      <FormulaireParametres restaurant={restaurant} />
    </div>
  );
}
