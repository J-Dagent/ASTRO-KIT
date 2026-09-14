import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Route,
  Database, 
  Zap, 
  Shield, 
  Palette, 
  Code,
  Server,
  Layers
} from "lucide-react"

const features = [
  {
    icon: Route,
    title: "Astro",
    description: "Pages et layouts basés sur les fichiers, pré-rendus par défaut avec rendu à la demande lorsque nécessaire.",
    badge: "Typage sûr"
  },
  {
    icon: Database,
    title: "Astro Actions",
    description: "Mutations serveur typées, validation Zod et appels client ciblés sans couche de cache globale.",
    badge: "Actions serveur"
  },
  {
    icon: Code,
    title: "React 19",
    description: "React stable avec fonctionnalités concurrentes, performances améliorées et pratiques modernes.",
    badge: "Stable"
  },
  {
    icon: Zap,
    title: "Vite",
    description: "Outil de build rapide avec rechargement à chaud et builds de production optimisés.",
    badge: "Rapide"
  },
  {
    icon: Shield,
    title: "TypeScript",
    description: "Prise en charge complète de TypeScript, typage strict, IntelliSense et vérification à la compilation.",
    badge: "Typage sûr"
  },
  {
    icon: Palette,
    title: "Tailwind CSS v4",
    description: "Framework CSS utility-first moderne avec variables CSS et système de design complet.",
    badge: "Styles"
  },
  {
    icon: Server,
    title: "Prêt pour le SSR",
    description: "Rendu côté serveur, hydratation fluide et bases SEO intégrées.",
    badge: "Performance"
  },
  {
    icon: Layers,
    title: "Shadcn/UI",
    description: "Bibliothèque de composants accessible, personnalisable et adaptée aux interfaces modernes.",
    badge: "Composants"
  }
]

const templateFeatures = [
  {
    image: "/cloudflare.png",
    title: "Base de données edge",
    description: "PostgreSQL serverless avec Neon et Drizzle ORM, tout en conservant des chemins alternatifs documentés.",
    badge: "Base de données",
    highlight: true
  },
  {
    image: "/better-auth.png",
    title: "Better Auth",
    description: "Solution d’authentification avec fournisseurs sociaux et gestion des sessions, compatible avec l’edge.",
    badge: "Authentification",
    highlight: true
  },
  {
    image: "/polar.png",
    title: "Paiements Polar",
    description: "Gestion moderne des abonnements et des paiements avec une API pensée pour les développeurs.",
    badge: "Paiements",
    highlight: true
  },
  {
    image: "/pnpm.webp",
    title: "Architecture monorepo",
    description: "Espaces de travail pnpm structurés entre applications, service de données et package partagé.",
    badge: "Architecture",
    highlight: true
  }
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Template Features Section */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Astro Kit prêt pour la production
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Authentification, base de données et paiements préconfigurés
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 xl:grid-cols-4">
          {templateFeatures.map((feature) => {
            return (
              <Card key={feature.title} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-background p-2">
                      <img 
                        src={feature.image} 
                        alt={feature.title}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <Badge variant="default" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Core Technologies Section */}
        <div className="mx-auto max-w-2xl text-center mt-24">
          <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Construit avec des technologies modernes
          </h3>
          <p className="mt-4 text-lg text-muted-foreground">
            Une sélection cohérente d’outils pour Astro et React
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 lg:mx-0 lg:max-w-none lg:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const IconComponent = feature.icon
            return (
              <Card key={feature.title} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
