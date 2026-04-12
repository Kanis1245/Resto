import Link from "next/link";
import Image from "next/image";
import { Star, Clock, Bike } from "lucide-react";
import { formatPrix } from "@/lib/utils";
import { CUISINES } from "@/lib/constants";

type PropsCarteRestaurant = {
  id: string;
  slug: string;
  nom: string;
  imageUrl: string | null;
  logoUrl: string | null;
  cuisine: string;
  noteMoyenne: number;
  nombreAvis: number;
  tempsLivraison: number;
  fraisLivraison: number;
  estOuvert: boolean;
  ville: string;
};

export function CarteRestaurant({
  slug,
  nom,
  imageUrl,
  cuisine,
  noteMoyenne,
  nombreAvis,
  tempsLivraison,
  fraisLivraison,
  estOuvert,
}: PropsCarteRestaurant) {
  const cuisineInfo = CUISINES.find((c) => c.value === cuisine);

  return (
    <Link href={`/restaurants/${slug}`} className="block group">
      <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
        <div className="relative h-44 bg-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={nom}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
              <span className="text-5xl">{cuisineInfo?.emoji ?? "🍽️"}</span>
            </div>
          )}
          {!estOuvert && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-gray-900 font-semibold px-3 py-1 rounded-full text-sm">
                Fermé
              </span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
              {cuisineInfo?.emoji} {cuisineInfo?.label}
            </span>
          </div>
        </div>

        <div className="p-3.5">
          <h3 className="font-bold text-gray-900 text-base leading-tight mb-1.5 truncate">
            {nom}
          </h3>

          <div className="flex items-center gap-3 text-sm text-gray-500">
            {noteMoyenne > 0 && (
              <span className="flex items-center gap-1 text-yellow-500 font-medium">
                <Star className="h-3.5 w-3.5 fill-yellow-400" />
                {noteMoyenne.toFixed(1)}
                <span className="text-gray-400 font-normal">
                  ({nombreAvis})
                </span>
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {tempsLivraison} min
            </span>
            <span className="flex items-center gap-1">
              <Bike className="h-3.5 w-3.5" />
              {fraisLivraison === 0 ? "Gratuit" : formatPrix(fraisLivraison)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
