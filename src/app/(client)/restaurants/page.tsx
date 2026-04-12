import { prisma } from "@/lib/prisma";
import { CarteRestaurant } from "@/components/restaurant/restaurant-card";
import { FiltreCuisine } from "@/components/restaurant/cuisine-filter";
import { SqueletteCarteRestaurant } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { TypeCuisine } from "@/generated/prisma/client";

type PageRestaurantsProps = {
  searchParams: Promise<{ cuisine?: string; q?: string; ville?: string }>;
};

async function ListeRestaurants({
  cuisine,
  q,
}: {
  cuisine?: string;
  q?: string;
}) {
  const restaurants = await prisma.restaurant.findMany({
    where: {
      estActif: true,
      ...(cuisine && { cuisine: cuisine as TypeCuisine }),
      ...(q && {
        nom: { contains: q },
      }),
    },
    orderBy: [{ estOuvert: "desc" }, { noteMoyenne: "desc" }],
    take: 50,
  });

  if (restaurants.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <p className="text-5xl mb-4">🍽️</p>
        <p className="text-gray-500 text-lg font-medium">
          Aucun restaurant trouvé
        </p>
        <p className="text-gray-400 text-sm mt-1">
          Essayez un autre filtre ou revenez plus tard
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {restaurants.map((r) => (
        <CarteRestaurant
          key={r.id}
          id={r.id}
          slug={r.slug}
          nom={r.nom}
          imageUrl={r.imageUrl}
          logoUrl={r.logoUrl}
          cuisine={r.cuisine}
          noteMoyenne={r.noteMoyenne}
          nombreAvis={r.nombreAvis}
          tempsLivraison={r.tempsLivraison}
          fraisLivraison={r.fraisLivraison}
          estOuvert={r.estOuvert}
          ville={r.ville}
        />
      ))}
    </div>
  );
}

function SqueletteGrille() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <SqueletteCarteRestaurant key={i} />
      ))}
    </div>
  );
}

export default async function PageRestaurants({
  searchParams,
}: PageRestaurantsProps) {
  const { cuisine, q } = await searchParams;

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">
          🍽️ Que voulez-vous manger ?
        </h1>
        <Link
          href="/recherche"
          className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-gray-400 hover:border-orange-300 transition-colors shadow-sm"
        >
          <Search className="h-5 w-5 text-orange-400" />
          Rechercher un plat ou restaurant...
        </Link>
      </div>

      <FiltreCuisine />

      {q && (
        <p className="text-sm text-gray-500">
          Résultats pour <strong>&quot;{q}&quot;</strong>
        </p>
      )}

      <Suspense fallback={<SqueletteGrille />}>
        <ListeRestaurants cuisine={cuisine} q={q} />
      </Suspense>
    </div>
  );
}
