import { z } from "zod";

export const schemaConnexion = z.object({
  identifiant: z.string().min(1, "Identifiant requis"),
  motDePasse: z.string().min(6, "Mot de passe trop court"),
});

export const schemaInscription = z.object({
  nom: z.string().min(2, "Nom trop court").max(100),
  telephone: z
    .string()
    .regex(/^\+?[0-9]{8,15}$/, "Numéro de téléphone invalide")
    .optional()
    .or(z.literal("")),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  motDePasse: z.string().min(6, "Minimum 6 caractères"),
  role: z.enum(["CLIENT", "RESTAURATEUR"]).default("CLIENT"),
});

export const schemaCommande = z.object({
  restaurantId: z.string().cuid(),
  adresseLivraison: z.string().min(5, "Adresse trop courte"),
  notesSpeciales: z.string().max(500).optional(),
  articles: z
    .array(
      z.object({
        articleId: z.string().cuid(),
        quantite: z.number().int().min(1).max(50),
      })
    )
    .min(1, "Panier vide"),
});

export const schemaArticleMenu = z.object({
  nom: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  prix: z.number().int().min(100).max(100000),
  categorieId: z.string().cuid(),
  estDisponible: z.boolean().default(true),
});

export const schemaRestaurant = z.object({
  nom: z.string().min(2).max(100),
  description: z.string().max(1000).optional(),
  adresse: z.string().min(5),
  ville: z.string().min(2),
  telephone: z.string().optional(),
  cuisine: z.enum([
    "AFRICAIN",
    "FAST_FOOD",
    "PIZZA",
    "POULET",
    "POISSON",
    "BURGER",
    "SHAWARMA",
    "AUTRE",
  ]),
  fraisLivraison: z.number().int().min(0).max(10000).default(500),
  tempsLivraison: z.number().int().min(10).max(120).default(30),
});

export type DonneesConnexion = z.infer<typeof schemaConnexion>;
export type DonneesInscription = z.infer<typeof schemaInscription>;
export type DonneesCommande = z.infer<typeof schemaCommande>;
export type DonneesArticleMenu = z.infer<typeof schemaArticleMenu>;
