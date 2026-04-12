import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";
import path from "path";
import "dotenv/config";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || `file://${path.resolve(process.cwd(), "dev.db")}`,
});
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

async function main() {
  console.log("🌱 Seeding database...");

  const hash = await bcrypt.hash("password123", 10);

  const client = await prisma.utilisateur.upsert({
    where: { telephone: "+237677000001" },
    update: {},
    create: {
      nom: "Marie Ngono",
      telephone: "+237677000001",
      email: "marie@exemple.com",
      motDePasseHash: hash,
      role: "CLIENT",
    },
  });

  const proprio1 = await prisma.utilisateur.upsert({
    where: { telephone: "+237699000001" },
    update: {},
    create: {
      nom: "Papa Diallo",
      telephone: "+237699000001",
      email: "papa@exemple.com",
      motDePasseHash: hash,
      role: "RESTAURATEUR",
    },
  });

  const proprio2 = await prisma.utilisateur.upsert({
    where: { telephone: "+237699000002" },
    update: {},
    create: {
      nom: "Mama Biya",
      telephone: "+237699000002",
      email: "mama@exemple.com",
      motDePasseHash: hash,
      role: "RESTAURATEUR",
    },
  });

  const proprio3 = await prisma.utilisateur.upsert({
    where: { telephone: "+237699000003" },
    update: {},
    create: {
      nom: "Tony Burger",
      telephone: "+237699000003",
      email: "tony@exemple.com",
      motDePasseHash: hash,
      role: "RESTAURATEUR",
    },
  });

  const proprio4 = await prisma.utilisateur.upsert({
    where: { telephone: "+237699000004" },
    update: {},
    create: {
      nom: "Salam Snack",
      telephone: "+237699000004",
      email: "salam@exemple.com",
      motDePasseHash: hash,
      role: "RESTAURATEUR",
    },
  });

  const resto1 = await prisma.restaurant.upsert({
    where: { slug: "chez-mama-biya" },
    update: {},
    create: {
      slug: "chez-mama-biya",
      nom: "Chez Mama Biya",
      description:
        "La meilleure cuisine camerounaise traditionnelle. Ndolé, Poulet DG, Eru — fait maison avec amour.",
      adresse: "Akwa, Rue de l'Hôpital",
      ville: "Douala",
      telephone: "+237699000002",
      cuisine: "AFRICAIN",
      fraisLivraison: 500,
      tempsLivraison: 35,
      noteMoyenne: 4.8,
      nombreAvis: 124,
      estOuvert: true,
      proprietaireId: proprio2.id,
    },
  });

  const resto2 = await prisma.restaurant.upsert({
    where: { slug: "papa-diallo-thiebou" },
    update: {},
    create: {
      slug: "papa-diallo-thiebou",
      nom: "Papa Diallo Thiébou",
      description:
        "Spécialités sénégalaises authentiques. Thiéboudienne, Yassa Poulet, Mafé de viande.",
      adresse: "Bonanjo, Rue des Ambassadeurs",
      ville: "Douala",
      telephone: "+237699000001",
      cuisine: "AFRICAIN",
      fraisLivraison: 0,
      tempsLivraison: 40,
      noteMoyenne: 4.6,
      nombreAvis: 89,
      estOuvert: true,
      proprietaireId: proprio1.id,
    },
  });

  const resto3 = await prisma.restaurant.upsert({
    where: { slug: "tony-burger-co" },
    update: {},
    create: {
      slug: "tony-burger-co",
      nom: "Tony Burger & Co",
      description:
        "Les meilleurs burgers de Douala. Burgers artisanaux, frites maison, sauces spéciales.",
      adresse: "Makepe, Carrefour Mobil",
      ville: "Douala",
      telephone: "+237699000003",
      cuisine: "BURGER",
      fraisLivraison: 500,
      tempsLivraison: 25,
      noteMoyenne: 4.4,
      nombreAvis: 203,
      estOuvert: true,
      proprietaireId: proprio3.id,
    },
  });

  const resto4 = await prisma.restaurant.upsert({
    where: { slug: "salam-shawarma" },
    update: {},
    create: {
      slug: "salam-shawarma",
      nom: "Salam Shawarma",
      description:
        "Shawarmas et sandwichs orientaux. Rapide, savoureux, frais.",
      adresse: "Deïdo, Marché Central",
      ville: "Douala",
      telephone: "+237699000004",
      cuisine: "SHAWARMA",
      fraisLivraison: 300,
      tempsLivraison: 20,
      noteMoyenne: 4.2,
      nombreAvis: 156,
      estOuvert: true,
      proprietaireId: proprio4.id,
    },
  });

  const catMama = await prisma.categorieMenu.upsert({
    where: { id: "cat-mama-plats" },
    update: {},
    create: {
      id: "cat-mama-plats",
      nom: "Plats Traditionnels",
      ordre: 0,
      restaurantId: resto1.id,
    },
  });

  const catMama2 = await prisma.categorieMenu.upsert({
    where: { id: "cat-mama-soupes" },
    update: {},
    create: {
      id: "cat-mama-soupes",
      nom: "Soupes & Sauces",
      ordre: 1,
      restaurantId: resto1.id,
    },
  });

  const catMama3 = await prisma.categorieMenu.upsert({
    where: { id: "cat-mama-boissons" },
    update: {},
    create: {
      id: "cat-mama-boissons",
      nom: "Boissons",
      ordre: 2,
      restaurantId: resto1.id,
    },
  });

  const articlesMama = [
    {
      id: "art-ndole",
      nom: "Ndolé au crevettes",
      description: "Plat national camerounais avec des crevettes, cacahuètes et légumes amers. Servi avec du miondo ou plantain",
      prix: 3500,
      categorieId: catMama.id,
    },
    {
      id: "art-poulet-dg",
      nom: "Poulet DG",
      description: "Poulet sauté avec plantains mûrs, carottes et légumes frais. La star des restaurants camerounais",
      prix: 4500,
      categorieId: catMama.id,
    },
    {
      id: "art-eru",
      nom: "Eru & Waterleaf",
      description: "Légumes traditionnels des Bamiléké, cuits avec de la viande fumée et de l'huile de palme",
      prix: 3000,
      categorieId: catMama.id,
    },
    {
      id: "art-kpem",
      nom: "Kpem (Gombo)",
      description: "Sauce gombo onctueuse avec viande de bœuf et crevettes fumées, servie avec du riz blanc",
      prix: 2800,
      categorieId: catMama2.id,
    },
    {
      id: "art-okok",
      nom: "Okok (Feuilles de manioc)",
      description: "Feuilles de manioc écrasées cuites avec de la viande de porc et de l'huile de palme",
      prix: 2500,
      categorieId: catMama2.id,
    },
    {
      id: "art-bissap",
      nom: "Jus de Bissap",
      description: "Boisson fraîche à la fleur d'hibiscus, légèrement sucrée",
      prix: 500,
      categorieId: catMama3.id,
    },
  ];

  for (const article of articlesMama) {
    await prisma.articleMenu.upsert({
      where: { id: article.id },
      update: {},
      create: { ...article, estDisponible: true },
    });
  }

  const catPapa = await prisma.categorieMenu.upsert({
    where: { id: "cat-papa-riz" },
    update: {},
    create: {
      id: "cat-papa-riz",
      nom: "Plats de Riz",
      ordre: 0,
      restaurantId: resto2.id,
    },
  });

  const catPapa2 = await prisma.categorieMenu.upsert({
    where: { id: "cat-papa-viandes" },
    update: {},
    create: {
      id: "cat-papa-viandes",
      nom: "Viandes & Poissons",
      ordre: 1,
      restaurantId: resto2.id,
    },
  });

  const articlesPapa = [
    {
      id: "art-thiebou",
      nom: "Thiéboudienne au Poisson",
      description: "Le plat national sénégalais. Riz au poisson et légumes variés cuits dans une sauce tomate parfumée",
      prix: 4000,
      categorieId: catPapa.id,
    },
    {
      id: "art-yassa",
      nom: "Yassa Poulet",
      description: "Poulet mariné au citron et oignons, lentement braisé. Servi avec du riz blanc parfumé",
      prix: 4500,
      categorieId: catPapa.id,
    },
    {
      id: "art-mafe",
      nom: "Mafé de Bœuf",
      description: "Ragoût de bœuf à la pâte d'arachide. Riche, savoureux et réconfortant",
      prix: 4200,
      categorieId: catPapa.id,
    },
    {
      id: "art-poisson-braise",
      nom: "Poisson Braisé + Alloco",
      description: "Bar ou tilapia grillé sur braises avec des bananes plantains frites et sauce tomate pimentée",
      prix: 3800,
      categorieId: catPapa2.id,
    },
    {
      id: "art-brochettes",
      nom: "Brochettes de Bœuf",
      description: "Brochettes de bœuf marinées aux épices locales, grillées sur charbon",
      prix: 2500,
      categorieId: catPapa2.id,
    },
  ];

  for (const article of articlesPapa) {
    await prisma.articleMenu.upsert({
      where: { id: article.id },
      update: {},
      create: { ...article, estDisponible: true },
    });
  }

  const catTony = await prisma.categorieMenu.upsert({
    where: { id: "cat-tony-burgers" },
    update: {},
    create: {
      id: "cat-tony-burgers",
      nom: "Burgers",
      ordre: 0,
      restaurantId: resto3.id,
    },
  });

  const catTony2 = await prisma.categorieMenu.upsert({
    where: { id: "cat-tony-frites" },
    update: {},
    create: {
      id: "cat-tony-frites",
      nom: "Frites & Extras",
      ordre: 1,
      restaurantId: resto3.id,
    },
  });

  const articlesTony = [
    {
      id: "art-burger-classic",
      nom: "Burger Classic",
      description: "Steak 150g, fromage fondu, laitue, tomate, oignons caramélisés, sauce maison",
      prix: 3500,
      categorieId: catTony.id,
    },
    {
      id: "art-burger-poulet",
      nom: "Burger Poulet Croustillant",
      description: "Filet de poulet pané et frit, sauce barbecue, coleslaw maison",
      prix: 3200,
      categorieId: catTony.id,
    },
    {
      id: "art-burger-double",
      nom: "Double Smash Burger",
      description: "2 steaks smash 100g, double fromage, cornichons, sauce spéciale. La bombe !",
      prix: 4500,
      categorieId: catTony.id,
    },
    {
      id: "art-frites-maison",
      nom: "Frites Maison",
      description: "Frites coupées épaisses, assaisonnées à l'ail et herbes",
      prix: 1000,
      categorieId: catTony2.id,
    },
    {
      id: "art-onion-rings",
      nom: "Onion Rings",
      description: "Rondelles d'oignons en panure croustillante",
      prix: 1200,
      categorieId: catTony2.id,
    },
  ];

  for (const article of articlesTony) {
    await prisma.articleMenu.upsert({
      where: { id: article.id },
      update: {},
      create: { ...article, estDisponible: true },
    });
  }

  const catSalam = await prisma.categorieMenu.upsert({
    where: { id: "cat-salam-shawarmas" },
    update: {},
    create: {
      id: "cat-salam-shawarmas",
      nom: "Shawarmas",
      ordre: 0,
      restaurantId: resto4.id,
    },
  });

  const catSalam2 = await prisma.categorieMenu.upsert({
    where: { id: "cat-salam-sandwichs" },
    update: {},
    create: {
      id: "cat-salam-sandwichs",
      nom: "Sandwichs",
      ordre: 1,
      restaurantId: resto4.id,
    },
  });

  const articlesSalam = [
    {
      id: "art-shawarma-poulet",
      nom: "Shawarma Poulet",
      description: "Galette garnie de poulet mariné aux épices, légumes frais, sauce blanche et harissa",
      prix: 2000,
      categorieId: catSalam.id,
    },
    {
      id: "art-shawarma-viande",
      nom: "Shawarma Viande",
      description: "Lamelles de viande de bœuf épicée, tomates, salade, oignons, sauce tahini",
      prix: 2500,
      categorieId: catSalam.id,
    },
    {
      id: "art-shawarma-mix",
      nom: "Shawarma Mix (Poulet+Viande)",
      description: "Le meilleur des deux mondes ! Double garniture, extra sauce",
      prix: 3000,
      categorieId: catSalam.id,
    },
    {
      id: "art-sandwich-chaud",
      nom: "Sandwich Chaud au Fromage",
      description: "Pain de mie grillé, jambon, fromage fondu, moutarde",
      prix: 1500,
      categorieId: catSalam2.id,
    },
    {
      id: "art-panini",
      nom: "Panini Végétarien",
      description: "Légumes grillés, mozzarella, pesto de basilic dans un pain ciabatta croustillant",
      prix: 2000,
      categorieId: catSalam2.id,
    },
  ];

  for (const article of articlesSalam) {
    await prisma.articleMenu.upsert({
      where: { id: article.id },
      update: {},
      create: { ...article, estDisponible: true },
    });
  }

  console.log("✅ Seed terminé !");
  console.log("\n📋 Comptes de test :");
  console.log("  Client    : téléphone=+237677000001, mot de passe=password123");
  console.log("  Resto 1   : téléphone=+237699000002, mot de passe=password123");
  console.log("  Resto 2   : téléphone=+237699000001, mot de passe=password123");
  console.log("  Resto 3   : téléphone=+237699000003, mot de passe=password123");
  console.log("  Resto 4   : téléphone=+237699000004, mot de passe=password123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
