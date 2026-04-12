import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { schemaCommande } from "@/lib/validations";
import { genererNumeroCommande } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ erreur: "Corps invalide" }, { status: 400 });
  }

  const resultat = schemaCommande.safeParse(body);
  if (!resultat.success) {
    return NextResponse.json(
      { erreur: resultat.error.issues[0].message },
      { status: 400 }
    );
  }

  const { restaurantId, adresseLivraison, notesSpeciales, articles } =
    resultat.data;

  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
  });

  if (!restaurant || !restaurant.estActif || !restaurant.estOuvert) {
    return NextResponse.json(
      { erreur: "Restaurant indisponible" },
      { status: 400 }
    );
  }

  const articleIds = articles.map((a) => a.articleId);
  const articlesDb = await prisma.articleMenu.findMany({
    where: {
      id: { in: articleIds },
      categorie: { restaurantId },
      estDisponible: true,
    },
  });

  if (articlesDb.length !== articleIds.length) {
    return NextResponse.json(
      { erreur: "Certains articles sont indisponibles" },
      { status: 400 }
    );
  }

  const prixMap = new Map(articlesDb.map((a) => [a.id, a.prix]));

  let sousTotal = 0;
  const lignes = articles.map((a) => {
    const prix = prixMap.get(a.articleId)!;
    const total = prix * a.quantite;
    sousTotal += total;
    return {
      articleId: a.articleId,
      quantite: a.quantite,
      prixUnitaire: prix,
      sousTotal: total,
    };
  });

  const fraisLivraison = restaurant.fraisLivraison;
  const total = sousTotal + fraisLivraison;

  const commande = await prisma.commande.create({
    data: {
      numero: genererNumeroCommande(),
      clientId: session.id,
      restaurantId,
      adresseLivraison,
      notesSpeciales: notesSpeciales || null,
      sousTotal,
      fraisLivraison,
      total,
      lignes: {
        create: lignes,
      },
    },
    include: {
      lignes: {
        include: { article: true },
      },
      restaurant: true,
    },
  });

  return NextResponse.json(commande, { status: 201 });
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
  }

  const commandes = await prisma.commande.findMany({
    where: { clientId: session.id },
    include: {
      restaurant: { select: { nom: true, slug: true, logoUrl: true } },
      lignes: { include: { article: { select: { nom: true } } } },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json(commandes);
}
