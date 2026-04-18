import { Package, Info, AlertTriangle } from "lucide-react";

interface Product {
  id: string;
  name: string;
  serie: string;
  description: string;
  category: string;
  requiresPrimer?: {
    id: string;
    name: string;
    serie: string;
    description: string;
  };
}

interface ProductRecommendationProps {
  product: Product;
  surfaceDetected: string;
}

export function ProductRecommendation({ product, surfaceDetected }: ProductRecommendationProps) {
  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
          <Package className="w-5 h-5 text-accent" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">Producto Recomendado</h3>
          <p className="text-sm text-muted-foreground">
            Basado en la superficie: <span className="font-medium text-foreground">"{surfaceDetected}"</span>
          </p>
        </div>
      </div>

      <div className="bg-card rounded-xl p-4 border border-border/50 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-display font-semibold text-xl">{product.name}</h4>
            <p className="text-sm text-muted-foreground">Serie: {product.serie}</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
            {product.category}
          </span>
        </div>
        
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>{product.description}</p>
        </div>
      </div>

      {product.requiresPrimer && (
        <div className="bg-wine/5 border border-wine/20 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-wine">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium text-sm">Requiere preparación previa</span>
          </div>
          <div className="pl-6">
            <p className="font-medium">{product.requiresPrimer.name}</p>
            <p className="text-sm text-muted-foreground">Serie: {product.requiresPrimer.serie}</p>
            <p className="text-sm text-muted-foreground mt-1">{product.requiresPrimer.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
