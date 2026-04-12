import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/commandes/[id]/stream">
) {
  const session = await getSession();
  if (!session) {
    return new Response("Non authentifié", { status: 401 });
  }

  const { id } = await ctx.params;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const envoyer = (data: unknown) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
        );
      };

      let dernierId = "";
      let essais = 0;
      const MAX_ESSAIS = 60;

      const verifier = async () => {
        try {
          const commande = await prisma.commande.findUnique({
            where: { id },
            select: { statut: true, updatedAt: true, clientId: true },
          });

          if (!commande) {
            envoyer({ erreur: "Commande introuvable" });
            controller.close();
            return;
          }

          if (commande.clientId !== session.id && session.role !== "ADMIN") {
            envoyer({ erreur: "Accès refusé" });
            controller.close();
            return;
          }

          const cle = `${commande.statut}-${commande.updatedAt.toISOString()}`;
          if (cle !== dernierId) {
            dernierId = cle;
            envoyer({ statut: commande.statut, updatedAt: commande.updatedAt });
          }

          if (
            commande.statut === "LIVREE" ||
            commande.statut === "ANNULEE"
          ) {
            controller.close();
            return;
          }

          essais++;
          if (essais >= MAX_ESSAIS) {
            controller.close();
            return;
          }

          setTimeout(verifier, 5000);
        } catch {
          controller.close();
        }
      };

      verifier();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
