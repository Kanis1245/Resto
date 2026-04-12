import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { schemaRestaurant } from "@/lib/validations";

export async function PUT(
  request: NextRequest,
  ctx: RouteContext<"/api/restaurants/[id]">
) {
  const session = await getSession();
  if (!session || session.role !== "RESTAURATEUR") {
    return NextResponse.json({ erreur: "Accès refusé" }, { status: 403 });
  }

  const { id } = await ctx.params;

  const restaurant = await prisma.restaurant.findUnique({ where: { id } });

  if (!restaurant || restaurant.proprietaireId !== session.id) {
    return NextResponse.json(
      { erreur: "Restaurant introuvable" },
      { status: 404 }
    );
  }

  const body = await request.json();
  const resultat = schemaRestaurant.partial().safeParse(body);
  if (!resultat.success) {
    return NextResponse.json(
      { erreur: resultat.error.issues[0].message },
      { status: 400 }
    );
  }

  const restaurantMaj = await prisma.restaurant.update({
    where: { id },
    data: {
      ...resultat.data,
      estOuvert: body.estOuvert ?? restaurant.estOuvert,
    },
  });

  return NextResponse.json(restaurantMaj);
}
