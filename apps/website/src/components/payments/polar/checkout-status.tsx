import { useEffect, useRef, useState } from "react";
import { actions } from "astro:actions";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resolveCheckoutState, type CheckoutState } from "./checkout-state";

export function CheckoutStatus({
  checkoutId,
  initialStatus = "processing",
  initialPaymentConfirmed = false,
}: {
  checkoutId: string;
  initialStatus?: CheckoutState;
  initialPaymentConfirmed?: boolean;
}) {
  const [status, setStatus] = useState<CheckoutState>(initialStatus);
  const paymentConfirmed = useRef(initialPaymentConfirmed);

  useEffect(() => {
    if (status !== "processing") return;
    let active = true;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const poll = async () => {
      const result = await resolveCheckoutState(
        checkoutId,
        paymentConfirmed.current,
        {
          validatePayment: (id) => actions.validPayment({ checkoutId: id }),
          collectSubscription: () => actions.collectSubscription(),
        },
      );
      if (!active) return;
      paymentConfirmed.current = result.paymentConfirmed;
      if (result.status === "processing") timeout = setTimeout(poll, 2000);
      else setStatus(result.status);
    };

    void poll();
    return () => {
      active = false;
      if (timeout) clearTimeout(timeout);
    };
  }, [checkoutId, status]);

  const message = {
    processing: {
      title: "Traitement de votre paiement",
      description: "Nous vérifions les détails du paiement. Cela peut prendre quelques instants…",
    },
    success: { title: "Paiement confirmé !", description: "Votre abonnement a bien été activé." },
    error: {
      title: "Erreur de traitement du paiement",
      description: "Le paiement n’a pas pu être traité. Veuillez contacter l’assistance.",
    },
  }[status];

  return (
    <div className="h-full flex flex-col items-center justify-center bg-background px-6 py-12">
      <div className="max-w-lg w-full text-center space-y-8">
        <div className="flex justify-center">
          {status === "success" ? <CheckCircle2 className="w-16 h-16 text-primary" /> :
            status === "error" ? <AlertCircle className="w-16 h-16 text-destructive" /> :
              <Loader2 className="w-12 h-12 text-primary animate-spin" />}
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">{message.title}</h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">{message.description}</p>
        </div>
        {status === "success" && <Button asChild size="lg" className="px-8 py-3"><a href="/app">Continuer vers le tableau de bord</a></Button>}
        {status === "error" && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => window.location.reload()} variant="outline" size="lg">Réessayer</Button>
            <Button asChild size="lg"><a href="/app/polar/subscriptions">Retour aux offres</a></Button>
          </div>
        )}
        <div className="pt-8"><p className="text-sm text-muted-foreground">Identifiant de transaction :{" "}<span className="font-mono text-foreground">{checkoutId.slice(-8)}</span></p></div>
      </div>
    </div>
  );
}
