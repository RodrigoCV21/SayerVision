import { Download, RefreshCw } from "lucide-react";
import { ProductRecommendation } from "./ProductRecommendation";

interface Product {
  id: string;
  name: string;
  serie: string;
  description: string;
  category: string;
  features?: string[];
  applicable_surfaces?: string[];
  environmental_conditions?: string[];
  precautions?: string[];
  requiresPrimer?: {
    id: string;
    name: string;
    serie: string;
    description: string;
  };
}

interface Recommendation {
  product: Product;
  surfaceDetected: string;
}

interface ResultPreviewProps {
  originalImage: string;
  resultImage: string;
  recommendation?: Recommendation | null;
  onReset: () => void;
}

export function ResultPreview({ originalImage, resultImage, recommendation, onReset }: ResultPreviewProps) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = resultImage;
    link.download = `colorize-result-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-2xl font-semibold">Resultado</h3>
        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-secondary-foreground
                       hover:bg-secondary/80 transition-colors font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Nueva imagen
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-accent-foreground
                       hover:bg-accent/90 transition-colors font-medium"
          >
            <Download className="w-4 h-4" />
            Descargar
          </button>
        </div>
      </div>

      {/* Product Recommendation */}
      {recommendation && (
        <ProductRecommendation 
          product={recommendation.product} 
          surfaceDetected={recommendation.surfaceDetected} 
        />
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Original</p>
          <div className="rounded-2xl overflow-hidden shadow-soft bg-card">
            <img
              src={originalImage}
              alt="Imagen original"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-medium text-accent uppercase tracking-wide">Colorizada</p>
          <div className="rounded-2xl overflow-hidden shadow-medium ring-2 ring-accent/20 bg-card">
            <img
              src={resultImage}
              alt="Imagen colorizada"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
