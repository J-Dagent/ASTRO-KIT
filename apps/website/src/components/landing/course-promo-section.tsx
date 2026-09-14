import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

export function CoursePromoSection() {
  return (
    <section className="w-full py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="w-full rounded-lg overflow-hidden border bg-card">
            <img
              className="block h-auto w-full"
              src="/brand/Banniere_Acadelead_LinkedIn.webp"
              alt="Bannière Acadelead — Simplifier l’acquisition, décupler la conversion"
            />
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-12 text-center">
          <Badge className="mb-4" variant="secondary">
            Architecture Astro de référence
          </Badge>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Une base claire pour construire sur Cloudflare
          </h2>

          <p className="text-lg text-muted-foreground mb-8">
            Un monorepo maintenable qui sépare le site web, les
            traitements de fond et la couche de données partagée.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8 text-left">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg mb-2">Ce que le kit fournit</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-sm">
                    Site Astro multi-pages prêt à personnaliser
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-sm">
                    Authentification et sessions avec Better Auth
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-sm">Paiements et abonnements avec Polar</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-sm">Exemples pédagogiques conservés</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg mb-2">
                Technologies intégrées
              </h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-sm">
                    Astro, Cloudflare Workers et Vite
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-sm">
                    Neon, PostgreSQL et Drizzle ORM
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-sm">
                    Better Auth et Polar
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-sm">TypeScript, Drizzle ORM, pnpm</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Simplifier l’acquisition, décupler la conversion
          </p>
        </div>
      </div>
    </section>
  );
}
