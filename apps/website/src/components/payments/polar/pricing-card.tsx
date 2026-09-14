import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { Price, Product, Subscription } from "./types";

interface PricingCardProps {
  product: Product;
  subscription: Subscription;
  onCheckout: (productId: string) => void;
  isCheckoutPending: boolean;
}

export function PricingCard({
  product,
  subscription,
  onCheckout,
  isCheckoutPending,
}: PricingCardProps) {
  const price = product.prices[0];

  const formatPrice = (price: Price | undefined) => {
    if (!price) {
      return "Prix indisponible";
    }
    if (price.type !== "recurring") {
      return "Devise non précisée";
    }

    if (price.amountType === "fixed" && price.priceAmount) {
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: price.priceCurrency.toUpperCase(),
      }).format(price.priceAmount / 100);
    }

    if (price.amountType === "custom") {
      const min = price.minimumAmount ? price.minimumAmount / 100 : 0;
      const max = price.maximumAmount ? price.maximumAmount / 100 : null;
      const formatter = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: price.priceCurrency.toUpperCase(),
      });

      if (max) {
        return `${formatter.format(min)} - ${formatter.format(max)}`;
      }
      return `À partir de ${formatter.format(min)}`;
    }

    return "Tarification personnalisée";
  };

  const getFeatures = (metadata: Record<string, any>) => {
    return Object.entries(metadata)
      .filter(([key]) => key.includes("feature"))
      .map(([_, value]) => value);
  };

  const features = getFeatures(product.metadata);

  const renderButton = () => {
    if (!price) {
      return (
        <Button disabled className="w-full" size="lg">
          Indisponible
        </Button>
      );
    }

    if (subscription) {
      if (subscription.productId === price.productId) {
        return (
          <div className="space-y-2">
            <div className="text-center">
              <Badge variant="default" className="mb-2">
                Offre actuelle
              </Badge>
              <p className="text-sm text-muted-foreground">
                Statut : {subscription.status}
              </p>
            </div>
            <Button asChild className="w-full" size="lg" variant="outline">
              <a href="/app/polar/portal">Gérer l’abonnement</a>
            </Button>
          </div>
        );
      } else {
        return (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Gérez votre abonnement depuis le portail
            </p>
            <Button asChild className="w-full" size="lg" variant="secondary">
              <a href="/app/polar/portal">Ouvrir le portail</a>
            </Button>
          </div>
        );
      }
    }

    return (
      <Button
        disabled={isCheckoutPending}
        onClick={() => onCheckout(price.productId)}
        className="w-full"
        size="lg"
      >
        Commencer
      </Button>
    );
  };

  return (
    <Card key={product.id} className="relative">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{product.name}</CardTitle>
          {product.isRecurring && (
            <Badge variant="secondary">{product.recurringInterval}</Badge>
          )}
        </div>
        {product.description && (
          <CardDescription>{product.description}</CardDescription>
        )}
      </CardHeader>

      <CardContent>
        <div className="mb-6">
          <div className="text-3xl font-bold">{formatPrice(price)}</div>
          {price?.type === "recurring" && (
            <div className="text-sm text-muted-foreground">
              par {price.recurringInterval}
            </div>
          )}
        </div>

        {features.length > 0 && (
          <div className="space-y-3 mb-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        )}

        {renderButton()}
      </CardContent>
    </Card>
  );
}
