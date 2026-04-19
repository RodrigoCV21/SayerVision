import { AlertTriangle, Shield, Eye, Hand } from "lucide-react";

interface PrecautionsSectionProps {
  precautions: string[];
  productName: string;
}

const getIcon = (precaution: string) => {
  const lower = precaution.toLowerCase();
  if (lower.includes("guante") || lower.includes("mano")) {
    return <Hand className="w-4 h-4" />;
  }
  if (lower.includes("lente") || lower.includes("ojo") || lower.includes("visual")) {
    return <Eye className="w-4 h-4" />;
  }
  if (lower.includes("mascara") || lower.includes("respirador") || lower.includes("ventilación")) {
    return <Shield className="w-4 h-4" />;
  }
  return <AlertTriangle className="w-4 h-4" />;
};

export function PrecautionsSection({ precautions, productName }: PrecautionsSectionProps) {
  if (!precautions || precautions.length === 0) {
    return null;
  }

  return (
    <div className="bg-wine/5 border border-wine/20 rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-wine/10 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-wine" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-wine">Precauciones de Aplicación</h3>
          <p className="text-sm text-muted-foreground">
            Para el uso seguro de <span className="font-medium">{productName}</span>
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {precautions.map((precaution, index) => (
          <div
            key={index}
            className="flex items-start gap-3 bg-background/50 rounded-xl p-4 border border-wine/10"
          >
            <div className="w-8 h-8 rounded-lg bg-wine/10 flex items-center justify-center flex-shrink-0 text-wine">
              {getIcon(precaution)}
            </div>
            <p className="text-sm text-foreground">{precaution}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground pt-2 border-t border-wine/10">
        ⚠️ Siempre lea las instrucciones completas en la etiqueta del producto antes de su uso.
      </p>
    </div>
  );
}
