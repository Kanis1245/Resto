import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Star, Clock, Bike, MapPin, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { formatPrix } from "@/lib/utils";
import { CUISINES } from "@/lib/constants";
import { CarteArticleMenu } from "@/components/restaurant/menu-item-card";

type PageRestaurantProps = {
  params: Promise<{ slug: string }>;
};

export default async function PageRestaurant({
  params,
}: PageRestaurantProps) {
  const { slug } = await params;

  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    include: {
      categories: {
        include: {
          articles: {
            orderBy: { nom: "asc" },
          },
        },
        orderBy: { ordre: "asc" },
      },
    },
  });

  if (!restaurant || !restaurant.estActif) {
    notFound();
  }

  const cuisineInfo = CUISINES.find((c) => c.value === restaurant.cuisine);

  return (
    <div className="max-w-screen-lg mx-auto">
      <div className="relative h-56 sm:h-72 bg-gray-100">
        {restaurant.imageUrl ? (
          <Image
            src={restaurant.imageUrl}
            alt={restaurant.nom}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
            <span className="text-7xl">{cuisineInfo?.emoji ?? "🍽️"}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <Link
          href="/restaurants"
          className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-gray-700" />
        </Link>

        {!restaurant.estOuvert && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="bg-white text-gray-900 font-bold text-lg px-6 py-2 rounded-2xl">
              Actuellement fermé
            </span>
          </div>
        )}
      </div>

      <div className="px-4 pb-8">
        <div className="bg-white rounded-2xl -mt-6 relative z-10 p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-start gap-3">
            {restaurant.logoUrl && (
              <div className="relative h-14 w-14 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                <Image
                  src={restaurant.logoUrl}
                  alt={`Logo ${restaurant.nom}`}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-900">
                {restaurant.nom}
              </h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-sm text-gray-500">
                {restaurant.noteMoyenne > 0 && (
                  <span className="flex items-center gap-1 text-yellow-500 font-medium">
                    <Star className="h-3.5 w-3.5 fill-yellow-400" />
                    {restaurant.noteMoyenne.toFixed(1)}
                    <span className="text-gray-400 font-normal">
                      ({restaurant.nombreAvis} avis)
                    </span>
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {restaurant.tempsLivraison} min
                </span>
                <span className="flex items-center gap-1">
                  <Bike className="h-3.5 w-3.5" />
                  {restaurant.fraisLivraison === 0
                    ? "Livraison gratuite"
                    : formatPrix(restaurant.fraisLivraison)}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {restaurant.ville}
                </span>
              </div>
              {restaurant.description && (
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {restaurant.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {restaurant.categories.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🍽️</p>
            <p className="text-gray-500">Le menu n&apos;est pas encore disponible</p>
          </div>
        ) : (
          <div className="space-y-8">
            {restaurant.categories.map((categorie) => (
              <section key={categorie.id}>
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  {categorie.nom}
                </h2>
                <div className="space-y-3">
                  {categorie.articles.map((article) => (
                    <CarteArticleMenu
                      key={article.id}
                      id={article.id}
                      nom={article.nom}
                      description={article.description}
                      prix={article.prix}
                      imageUrl={article.imageUrl}
                      estDisponible={article.estDisponible}
                      restaurantId={restaurant.id}
                      restaurantNom={restaurant.nom}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PageRestaurantProps) {
  const { slug } = await params;
  const restaurant = await prisma.restaurant.findUnique({ where: { slug } });
  return {
    title: restaurant ? `${restaurant.nom} — Resto` : "Restaurant — Resto",
  };
}
