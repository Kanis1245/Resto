import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "RESTAURATEUR") {
    return NextResponse.json({ erreur: "Accès refusé" }, { status: 403 });
  }

  const { nom, restaurantId } = await request.json();

  if (!nom?.trim() || !restaurantId) {
    return NextResponse.json({ erreur: "Données manquantes" }, { status: 400 });
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
  });

  if (!restaurant || restaurant.proprietaireId !== session.id) {
    return NextResponse.json(
      { erreur: "Restaurant introuvable" },
      { status: 404 }
    );
  }

  const dernierOrdre = await prisma.categorieMenu.count({
    where: { restaurantId },
  });

  const categorie = await prisma.categorieMenu.create({
    data: {
      nom: nom.trim(),
      restaurantId,
      ordre: dernierOrdre,
    },
  });

  return NextResponse.json(categorie, { status: 201 });
}
