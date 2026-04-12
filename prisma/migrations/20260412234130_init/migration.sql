-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT,
    "telephone" TEXT,
    "motDePasseHash" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'CLIENT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Restaurant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "adresse" TEXT NOT NULL,
    "ville" TEXT NOT NULL DEFAULT 'Douala',
    "latitude" REAL,
    "longitude" REAL,
    "telephone" TEXT,
    "logoUrl" TEXT,
    "imageUrl" TEXT,
    "cuisine" TEXT NOT NULL DEFAULT 'AFRICAIN',
    "estOuvert" BOOLEAN NOT NULL DEFAULT true,
    "fraisLivraison" INTEGER NOT NULL DEFAULT 500,
    "tempsLivraison" INTEGER NOT NULL DEFAULT 30,
    "noteMoyenne" REAL NOT NULL DEFAULT 0,
    "nombreAvis" INTEGER NOT NULL DEFAULT 0,
    "estActif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "proprietaireId" TEXT NOT NULL,
    CONSTRAINT "Restaurant_proprietaireId_fkey" FOREIGN KEY ("proprietaireId") REFERENCES "Utilisateur" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CategorieMenu" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "restaurantId" TEXT NOT NULL,
    CONSTRAINT "CategorieMenu_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ArticleMenu" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "prix" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "estDisponible" BOOLEAN NOT NULL DEFAULT true,
    "categorieId" TEXT NOT NULL,
    CONSTRAINT "ArticleMenu_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "CategorieMenu" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Commande" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numero" TEXT NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "clientId" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "adresseLivraison" TEXT NOT NULL,
    "latitudeLivraison" REAL,
    "longitudeLivraison" REAL,
    "sousTotal" INTEGER NOT NULL,
    "fraisLivraison" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "notesSpeciales" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Commande_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Utilisateur" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Commande_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LigneCommande" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "commandeId" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "quantite" INTEGER NOT NULL,
    "prixUnitaire" INTEGER NOT NULL,
    "sousTotal" INTEGER NOT NULL,
    "notes" TEXT,
    CONSTRAINT "LigneCommande_commandeId_fkey" FOREIGN KEY ("commandeId") REFERENCES "Commande" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LigneCommande_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "ArticleMenu" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Avis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "note" INTEGER NOT NULL,
    "commentaire" TEXT,
    "commandeId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Avis_commandeId_fkey" FOREIGN KEY ("commandeId") REFERENCES "Commande" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Avis_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Utilisateur" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Avis_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AdresseClient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "libelle" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "latitude" REAL,
    "longitude" REAL,
    "estDefaut" BOOLEAN NOT NULL DEFAULT false,
    "utilisateurId" TEXT NOT NULL,
    CONSTRAINT "AdresseClient_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_telephone_key" ON "Utilisateur"("telephone");

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_slug_key" ON "Restaurant"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_proprietaireId_key" ON "Restaurant"("proprietaireId");

-- CreateIndex
CREATE UNIQUE INDEX "Commande_numero_key" ON "Commande"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "Avis_commandeId_key" ON "Avis"("commandeId");
