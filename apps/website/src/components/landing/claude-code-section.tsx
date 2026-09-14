import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export function ClaudeCodeSection() {
  return (
    <section
      id="claude-code"
      className="sm:py-6 bg-gradient-to-b from-background to-muted/20"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            Configuration assistée
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Un template pensé pour les agents de développement
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Utilisez l’agent de votre choix pour configurer et faire évoluer le projet.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-4xl text-center">
          <div className="mb-8">
            <img
              src="/brand/Magic_Agent.webp"
              alt="Mascotte Magic Agent d’Acadelead"
              className="w-full max-w-md mx-auto rounded-lg shadow-lg"
            />
          </div>

          <div className="bg-muted/30 rounded-lg p-6 border max-w-2xl mx-auto">
            <p className="text-muted-foreground mb-4">
              Demandez simplement à votre agent :
            </p>
            <div className="bg-background rounded-lg p-4 font-mono text-sm border">
              <span className="text-primary">Aide-moi à configurer ce projet</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
