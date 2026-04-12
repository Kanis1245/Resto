export const CUISINES = [
  { value: "AFRICAIN", label: "Africain", emoji: "🍲" },
  { value: "FAST_FOOD", label: "Fast Food", emoji: "🍟" },
  { value: "PIZZA", label: "Pizza", emoji: "🍕" },
  { value: "POULET", label: "Poulet", emoji: "🍗" },
  { value: "POISSON", label: "Poisson", emoji: "🐟" },
  { value: "BURGER", label: "Burger", emoji: "🍔" },
  { value: "SHAWARMA", label: "Shawarma", emoji: "🌯" },
  { value: "AUTRE", label: "Autre", emoji: "🍽️" },
] as const;

export const STATUTS_COMMANDE = {
  EN_ATTENTE: {
    label: "En attente",
    couleur: "bg-yellow-100 text-yellow-800",
    description: "Votre commande attend la confirmation du restaurant",
  },
  CONFIRMEE: {
    label: "Confirmée",
    couleur: "bg-blue-100 text-blue-800",
    description: "Le restaurant a confirmé votre commande",
  },
  EN_PREPARATION: {
    label: "En préparation",
    couleur: "bg-orange-100 text-orange-800",
    description: "Votre repas est en cours de préparation",
  },
  PRETE: {
    label: "Prête",
    couleur: "bg-purple-100 text-purple-800",
    description: "Votre commande est prête",
  },
  EN_LIVRAISON: {
    label: "En livraison",
    couleur: "bg-indigo-100 text-indigo-800",
    description: "Votre commande est en route",
  },
  LIVREE: {
    label: "Livrée",
    couleur: "bg-green-100 text-green-800",
    description: "Votre commande a été livrée",
  },
  ANNULEE: {
    label: "Annulée",
    couleur: "bg-red-100 text-red-800",
    description: "Cette commande a été annulée",
  },
} as const;

export const ETAPES_COMMANDE = [
  { statut: "EN_ATTENTE", label: "Commande passée", icone: "📝" },
  { statut: "CONFIRMEE", label: "Confirmée", icone: "✅" },
  { statut: "EN_PREPARATION", label: "En préparation", icone: "👨‍🍳" },
  { statut: "PRETE", label: "Prête", icone: "📦" },
  { statut: "EN_LIVRAISON", label: "En livraison", icone: "🛵" },
  { statut: "LIVREE", label: "Livrée", icone: "🎉" },
] as const;

export const VILLES = ["Douala", "Yaoundé", "Bafoussam", "Garoua", "Maroua"];
