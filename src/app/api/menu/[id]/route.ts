import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  ctx: RouteContext<"/api/menu/[id]">
) {
  const session = await getSession();
  if (!session || session.role !== "RESTAURATEUR") {
    return NextResponse.json({ erreur: "Accès refusé" }, { status: 403 });
  }

  const { id } = await ctx.params;

  const article = await prisma.articleMenu.findUnique({
    where: { id },
    include: {
      categorie: { include: { restaurant: true } },
    },
  });

  if (!article || article.categorie.restaurant.proprietaireId !== session.id) {
    return NextResponse.json({ erreur: "Article introuvable" }, { status: 404 });
  }

  const body = await request.json();

  const articleMaj = await prisma.articleMenu.update({
    where: { id },
    data: {
      nom: body.nom ?? article.nom,
      description:
        body.description !== undefined ? body.description : article.description,
      prix: body.prix ?? article.prix,
      categorieId: body.categorieId ?? article.categorieId,
      estDisponible:
        body.estDisponible !== undefined
          ? body.estDisponible
          : article.estDisponible,
    },
  });

  return NextResponse.json(articleMaj);
}

export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<"/api/menu/[id]">
) {
  const session = await getSession();
  if (!session || session.role !== "RESTAURATEUR") {
    return NextResponse.json({ erreur: "Accès refusé" }, { status: 403 });
  }

  const { id } = await ctx.params;

  const article = await prisma.articleMenu.findUnique({
    where: { id },
    include: {
      categorie: { include: { restaurant: true } },
    },
  });

  if (!article || article.categorie.restaurant.proprietaireId !== session.id) {
    return NextResponse.json({ erreur: "Article introuvable" }, { status: 404 });
  }

  await prisma.articleMenu.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
