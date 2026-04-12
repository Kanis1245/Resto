import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { formatPrix, formatDate } from "@/lib/utils";
import { SuiviCommande } from "@/components/order/order-tracker";
import { ChevronLeft, Phone, MapPin, Hash } from "lucide-react";
import Link from "next/link";
import { StatutCommande } from "@/generated/prisma/client";

type PageCommandeProps = {
  params: Promise<{ id: string }>;
};

export default async function PageCommande({ params }: PageCommandeProps) {
  const session = await getSession();
  if (!session) redirect("/connexion");

  const { id } = await params;

  const commande = await prisma.commande.findUnique({
    where: { id },
    include: {
      lignes: {
        include: { article: { select: { nom: true, imageUrl: true } } },
      },
      restaurant: {
        select: {
          nom: true,
          slug: true,
          logoUrl: true,
          adresse: true,
          telephone: true,
        },
      },
    },
  });

  if (!commande || commande.clientId !== session.id) {
    notFound();
  }

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/commandes" className="text-gray-500 hover:text-gray-700">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {commande.restaurant.nom}
          </h1>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Hash className="h-3.5 w-3.5" />
            <span>{commande.numero}</span>
          </div>
        </div>
      </div>

      <SuiviCommande
        commandeId={commande.id}
        statutInitial={commande.statut as StatutCommande}
      />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
        <h3 className="font-bold text-gray-900">Votre commande</h3>
        {commande.lignes.map((ligne) => (
          <div key={ligne.id} className="flex justify-between text-sm">
            <span className="text-gray-700">
              {ligne.quantite}× {ligne.article.nom}
            </span>
            <span className="font-medium text-gray-900">
              {formatPrix(ligne.sousTotal)}
            </span>
          </div>
        ))}
        <div className="border-t border-gray-100 pt-3 space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Sous-total</span>
            <span>{formatPrix(commande.sousTotal)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Livraison</span>
            <span>{formatPrix(commande.fraisLivraison)}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 text-base pt-1">
            <span>Total</span>
            <span className="text-orange-500">{formatPrix(commande.total)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
        <h3 className="font-bold text-gray-900">Informations</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
            <span>{commande.adresseLivraison}</span>
          </div>
          {commande.restaurant.telephone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-orange-500 flex-shrink-0" />
              <a
                href={`tel:${commande.restaurant.telephone}`}
                className="text-blue-500 hover:underline"
              >
                {commande.restaurant.telephone}
              </a>
            </div>
          )}
          <p className="text-gray-400 text-xs mt-2">
            Commandé le {formatDate(commande.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
