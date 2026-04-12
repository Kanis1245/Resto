import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { schemaArticleMenu } from "@/lib/validations";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "RESTAURATEUR") {
    return NextResponse.json({ erreur: "Accès refusé" }, { status: 403 });
  }

  const body = await request.json();
  const resultat = schemaArticleMenu.safeParse(body);
  if (!resultat.success) {
    return NextResponse.json(
      { erreur: resultat.error.issues[0].message },
      { status: 400 }
    );
  }

  const { nom, description, prix, categorieId, estDisponible } = resultat.data;

  const categorie = await prisma.categorieMenu.findUnique({
    where: { id: categorieId },
    include: { restaurant: true },
  });

  if (!categorie || categorie.restaurant.proprietaireId !== session.id) {
    return NextResponse.json({ erreur: "Catégorie introuvable" }, { status: 404 });
  }

  const article = await prisma.articleMenu.create({
    data: { nom, description, prix, categorieId, estDisponible },
  });

  return NextResponse.json(article, { status: 201 });
}
