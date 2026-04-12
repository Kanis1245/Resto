import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resto — Livraison de repas",
  description:
    "Commandez vos plats préférés auprès des meilleurs restaurants près de chez vous.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full bg-gray-50">{children}</body>
    </html>
  );
}
