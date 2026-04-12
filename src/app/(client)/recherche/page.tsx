"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

export default function PageRecherche() {
  const [q, setQ] = useState("");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const rechercher = () => {
    if (q.trim()) {
      startTransition(() => {
        router.push(`/restaurants?q=${encodeURIComponent(q.trim())}`);
      });
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-6 space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Rechercher</h1>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-400" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && rechercher()}
            placeholder="Pizza, Thiéboudienne, Poulet..."
            autoFocus
            className="w-full pl-10 pr-10 py-3.5 rounded-2xl border border-gray-200 bg-white focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 text-gray-900 placeholder-gray-400 min-h-[48px]"
          />
          {q && (
            <button
              onClick={() => setQ("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <button
          onClick={rechercher}
          disabled={!q.trim() || isPending}
          className="bg-orange-500 text-white px-5 rounded-2xl font-semibold hover:bg-orange-600 disabled:opacity-50 transition-colors min-h-[48px]"
        >
          Chercher
        </button>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500 mb-3">
          Suggestions populaires
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            "Thiéboudienne",
            "Poulet DG",
            "Pizza",
            "Shawarma",
            "Ndolé",
            "Alloco",
            "Burger",
            "Poisson braisé",
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => {
                setQ(suggestion);
                startTransition(() => {
                  router.push(
                    `/restaurants?q=${encodeURIComponent(suggestion)}`
                  );
                });
              }}
              className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-orange-300 hover:text-orange-500 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
