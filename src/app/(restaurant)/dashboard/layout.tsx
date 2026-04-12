import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutGrid, ClipboardList, UtensilsCrossed, Settings, ChefHat } from "lucide-react";
import { BoutonDeconnexion } from "@/components/layout/logout-button";

const liensNav = [
  { href: "/dashboard", icone: LayoutGrid, label: "Tableau de bord" },
  { href: "/dashboard/commandes", icone: ClipboardList, label: "Commandes" },
  { href: "/dashboard/menu", icone: UtensilsCrossed, label: "Menu" },
  { href: "/dashboard/parametres", icone: Settings, label: "Paramètres" },
];

export default async function LayoutDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.role !== "RESTAURATEUR") {
    redirect("/connexion");
  }

  return (
    <div className="min-h-screen flex">
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 p-4 gap-2 fixed h-full">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 mb-4 font-bold text-xl text-orange-500"
        >
          <ChefHat className="h-6 w-6" />
          Resto
        </Link>

        {liensNav.map(({ href, icone: Icone, label }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-orange-50 hover:text-orange-500 transition-colors font-medium"
          >
            <Icone className="h-5 w-5" />
            {label}
          </Link>
        ))}

        <div className="mt-auto">
          <p className="text-xs text-gray-400 px-3 mb-2">{session.nom}</p>
          <BoutonDeconnexion />
        </div>
      </aside>

      <main className="flex-1 lg:ml-64">
        <div className="lg:hidden bg-white border-b border-gray-100 px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-orange-500 flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            Resto
          </Link>
          <div className="flex gap-1">
            {liensNav.map(({ href, icone: Icone }) => (
              <Link
                key={href}
                href={href}
                className="p-2 rounded-lg text-gray-600 hover:bg-orange-50 hover:text-orange-500"
              >
                <Icone className="h-5 w-5" />
              </Link>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-6">{children}</div>
      </main>
    </div>
  );
}
