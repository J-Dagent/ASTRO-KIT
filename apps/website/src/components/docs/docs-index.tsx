import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRightIcon,
  BookOpenIcon,
  DatabaseIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  Sparkles,
  CheckCircle,
} from "lucide-react";

const gettingStartedSteps = [
  {
    name: "database",
    title: "Configuration de la base de données",
    ctaLabel: "Configurer la BDD",
    description:
      "Configurez la base de données serverless et le chemin d’accès adapté à votre fournisseur.",
    icon: DatabaseIcon,
    image: "/cloudflare.png",
    badgeVariant: "default" as const,
    features: [
      "Optimisé pour l’edge",
      "Pool de connexions",
      "Proxy HTTP",
      "Prêt pour le serverless",
    ],
  },
  {
    name: "authentication",
    title: "Configuration de l’authentification",
    ctaLabel: "Configurer l’auth",
    description:
      "Configurez Better Auth, les fournisseurs sociaux et la gestion des sessions en environnement serverless.",
    icon: ShieldCheckIcon,
    image: "/better-auth.png",
    badgeVariant: "secondary" as const,
    features: [
      "OAuth social",
      "Gestion des sessions",
      "Base de données flexible",
      "Compatible edge",
    ],
  },
  {
    name: "polar",
    title: "Intégration des paiements",
    ctaLabel: "Configurer Polar",
    description:
      "Intégrez Polar pour gérer les abonnements et les paiements.",
    icon: CreditCardIcon,
    image: "/polar.png",
    badgeVariant: "outline" as const,
    features: [
      "Gestion des abonnements",
      "API Polar",
      "Pensé pour les développeurs",
      "Intégration API",
    ],
  },
];

export function DocsIndex() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <BookOpenIcon className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Documentation
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
          Guides complets pour configurer la base de données,
          l’authentification et les paiements du template Astro.
        </p>
        <Badge variant="secondary" className="text-sm">
          Architecture monorepo
        </Badge>
      </div>

      {/* Tech Stack Banner */}
      <div className="mb-12">
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Construit avec des technologies modernes
                </h3>
                <p className="text-muted-foreground">
                  Astro, React 19, TypeScript, Tailwind CSS v4 et
                  Shadcn/UI
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <img
                  src="/Astro-icon.webp"
                  alt="Astro"
                  className="h-8 w-8 rounded"
                />
                <img
                  src="/shadcn.png"
                  alt="Shadcn/UI"
                  className="h-8 w-8 rounded"
                />
                <img
                  src="/logo192.png"
                  alt="React"
                  className="h-8 w-8 rounded"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Claude Code Setup Section */}
      <div className="mb-12">
        <Card className="bg-gradient-to-b from-background to-muted/20 border">
          <CardContent className="p-8">
            <div className="text-center">
              <Badge variant="outline" className="mb-4">
                <Sparkles className="h-3 w-3 mr-1" />
                Configuration assistée
              </Badge>
              <h3 className="text-2xl font-semibold mb-4">
                Configuration rapide avec votre agent
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Appuyez-vous sur les instructions du dépôt pour configurer le
                projet avec l’agent de développement de votre choix.
              </p>
              <div className="mb-6">
                <img
                  src="/brand/Magic_Agent.webp"
                  alt="Mascotte Magic Agent d’Acadelead"
                  className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
                />
              </div>
              <div className="bg-muted/30 rounded-lg p-6 border max-w-lg mx-auto">
                <p className="text-muted-foreground mb-4">
                  Demandez simplement :
                </p>
                <div className="bg-background rounded-lg p-4 font-mono text-sm border">
                  <span className="text-primary">
                    Aide-moi à configurer ce projet
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started Section */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Guide de démarrage
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Suivez ces étapes dans l’ordre pour configurer votre site Astro.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {gettingStartedSteps.map((step) => {
            const IconComponent = step.icon;

            return (
              <Card
                key={step.name}
                className="group hover:shadow-lg transition-all duration-200 h-full"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </div>
                  <div className="flex justify-center mb-4">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="h-16 w-16 object-contain rounded-lg bg-background border p-2"
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="mb-4 leading-relaxed">
                    {step.description}
                  </CardDescription>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {step.features.map((feature) => (
                      <Badge
                        key={feature}
                        variant="secondary"
                        className="text-xs"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <a
                    href={`/docs/${step.name}`}
                    className="block w-full min-w-0"
                  >
                    <Button className="w-full min-w-0 max-w-full justify-between overflow-hidden group-hover:bg-primary/90 transition-colors">
                      <span className="min-w-0 truncate text-left">
                        {step.ctaLabel}
                      </span>
                      <ArrowRightIcon className="h-4 w-4 shrink-0 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </a>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Access Section */}
      <Card className="border-dashed bg-muted/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpenIcon className="h-5 w-5" />
            Accès rapide
          </CardTitle>
          <CardDescription>
            Accédez directement à une section de la documentation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {gettingStartedSteps.map((step) => {
              const IconComponent = step.icon;
              return (
                <a
                  key={step.name}
                  href={`/docs/${step.name}`}
                >
                  <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group border-muted">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-semibold group-hover:text-primary transition-colors">
                          {step.title}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </a>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Course Promo Section */}
      <div className="mt-16 mb-8 bg-gradient-to-b from-background to-muted/20 -mx-4 px-4 py-8">
        <div className="w-full rounded-lg overflow-hidden border bg-card">
          <img
            className="block h-auto w-full"
            src="/brand/Banniere_Acadelead_LinkedIn.webp"
            alt="Bannière Acadelead — Simplifier l’acquisition, décupler la conversion"
          />
        </div>

        <div className="mt-8 text-center">
          <Badge className="mb-4" variant="secondary">
            Template Astro de référence
          </Badge>

          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Une architecture conçue pour évoluer
          </h2>

          <p className="text-lg text-muted-foreground mb-6 max-w-3xl mx-auto">
            Découvrez les composants, les responsabilités et les exemples
            techniques conservés dans ce template.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8 text-left max-w-3xl mx-auto">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg mb-2">Architecture</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-sm">
                    Site Astro multi-pages
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-sm">
                    Service de données Cloudflare séparé
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-sm">Couche de données partagée</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-sm">Exemples de référence intentionnels</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg mb-2">
                Technologies
              </h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-sm">
                    Cloudflare Workers, Vite et pnpm
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-sm">
                    Astro, Actions et rendu à la demande
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-sm">
                    Better Auth, Drizzle ORM et Neon
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-sm">TypeScript, Drizzle ORM, pnpm</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild>
              <a
                href="https://www.acadelead.co/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Découvrir Acadelead
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
