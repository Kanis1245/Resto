"use server";

import { prisma } from "@/lib/prisma";
import { creerSession, supprimerSession } from "@/lib/auth";
import { schemaConnexion, schemaInscription } from "@/lib/validations";
import { slugifier } from "@/lib/utils";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export type EtatFormulaire = {
  erreur?: string;
  succes?: boolean;
};

export async function seConnecter(
  _etat: EtatFormulaire,
  formData: FormData
): Promise<EtatFormulaire> {
  const resultat = schemaConnexion.safeParse({
    identifiant: formData.get("identifiant"),
    motDePasse: formData.get("motDePasse"),
  });

  if (!resultat.success) {
    return { erreur: resultat.error.issues[0].message };
  }

  const { identifiant, motDePasse } = resultat.data;

  const utilisateur = await prisma.utilisateur.findFirst({
    where: {
      OR: [{ email: identifiant }, { telephone: identifiant }],
    },
  });

  if (!utilisateur) {
    return { erreur: "Identifiants incorrects" };
  }

  const motDePasseValide = await bcrypt.compare(
    motDePasse,
    utilisateur.motDePasseHash
  );

  if (!motDePasseValide) {
    return { erreur: "Identifiants incorrects" };
  }

  await creerSession({
    id: utilisateur.id,
    nom: utilisateur.nom,
    email: utilisateur.email,
    telephone: utilisateur.telephone,
    role: utilisateur.role as "CLIENT" | "RESTAURATEUR" | "ADMIN",
  });

  redirect("/restaurants");
}

export async function sInscrire(
  _etat: EtatFormulaire,
  formData: FormData
): Promise<EtatFormulaire> {
  const resultat = schemaInscription.safeParse({
    nom: formData.get("nom"),
    telephone: formData.get("telephone") || undefined,
    email: formData.get("email") || undefined,
    motDePasse: formData.get("motDePasse"),
    role: formData.get("role") || "CLIENT",
  });

  if (!resultat.success) {
    return { erreur: resultat.error.issues[0].message };
  }

  const { nom, telephone, email, motDePasse, role } = resultat.data;

  if (!telephone && !email) {
    return { erreur: "Téléphone ou email requis" };
  }

  const existant = await prisma.utilisateur.findFirst({
    where: {
      OR: [
        telephone ? { telephone } : undefined,
        email ? { email } : undefined,
      ].filter(Boolean) as { telephone?: string; email?: string }[],
    },
  });

  if (existant) {
    return { erreur: "Ce compte existe déjà" };
  }

  const hash = await bcrypt.hash(motDePasse, 10);

  const utilisateur = await prisma.utilisateur.create({
    data: {
      nom,
      telephone: telephone || null,
      email: email || null,
      motDePasseHash: hash,
      role: role as "CLIENT" | "RESTAURATEUR",
    },
  });

  if (role === "RESTAURATEUR") {
    await prisma.restaurant.create({
      data: {
        nom: `Restaurant de ${nom}`,
        slug: slugifier(`restaurant-${nom}-${utilisateur.id.slice(0, 6)}`),
        adresse: "À configurer",
        ville: "Douala",
        proprietaireId: utilisateur.id,
      },
    });
  }

  await creerSession({
    id: utilisateur.id,
    nom: utilisateur.nom,
    email: utilisateur.email,
    telephone: utilisateur.telephone,
    role: utilisateur.role as "CLIENT" | "RESTAURATEUR" | "ADMIN",
  });

  redirect(role === "RESTAURATEUR" ? "/dashboard" : "/restaurants");
}

export async function seDeconnecter() {
  await supprimerSession();
  redirect("/");
}
