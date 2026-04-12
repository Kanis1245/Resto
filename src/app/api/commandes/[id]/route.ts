import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { StatutCommande } from "@/generated/prisma/client";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/commandes/[id]">
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
  }

  const { id } = await ctx.params;

  const commande = await prisma.commande.findUnique({
    where: { id },
    include: {
      lignes: {
        include: {
          article: { select: { nom: true, imageUrl: true } },
        },
      },
      restaurant: {
        select: {
          nom: true,
          slug: true,
          logoUrl: true,
          adresse: true,
          telephone: true,
          latitude: true,
          longitude: true,
        },
      },
    },
  });

  if (!commande) {
    return NextResponse.json({ erreur: "Commande introuvable" }, { status: 404 });
  }

  if (
    commande.clientId !== session.id &&
    session.role !== "ADMIN"
  ) {
    const restaurant = await prisma.restaurant.findUnique({
      where: { proprietaireId: session.id },
    });
    if (!restaurant || restaurant.id !== commande.restaurantId) {
      return NextResponse.json({ erreur: "Accès refusé" }, { status: 403 });
    }
  }

  return NextResponse.json(commande);
}

export async function PUT(
  request: NextRequest,
  ctx: RouteContext<"/api/commandes/[id]">
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
  }

  const { id } = await ctx.params;

  const commande = await prisma.commande.findUnique({
    where: { id },
    include: { restaurant: true },
  });

  if (!commande) {
    return NextResponse.json({ erreur: "Commande introuvable" }, { status: 404 });
  }

  const estProprietaire =
    commande.restaurant.proprietaireId === session.id;
  const estClient = commande.clientId === session.id;
  const estAdmin = session.role === "ADMIN";

  if (!estProprietaire && !estAdmin && !estClient) {
    return NextResponse.json({ erreur: "Accès refusé" }, { status: 403 });
  }

  const { statut } = await request.json();

  const statutsValides = Object.values(StatutCommande);
  if (!statutsValides.includes(statut)) {
    return NextResponse.json({ erreur: "Statut invalide" }, { status: 400 });
  }

  if (estClient && statut !== "ANNULEE") {
    return NextResponse.json(
      { erreur: "Les clients ne peuvent qu'annuler une commande" },
      { status: 403 }
    );
  }

  const commandeMaj = await prisma.commande.update({
    where: { id },
    data: { statut },
  });

  return NextResponse.json(commandeMaj);
}
