import { useState } from "react";
import { Link } from "react-router-dom";
import { ImageUploader } from "@/components/ImageUploader";
import { ColorPalette, type ColorOption } from "@/components/ColorPalette";
import { ResultPreview } from "@/components/ResultPreview";
import { PrecautionsSection } from "@/components/PrecautionsSection";
import { useColorize } from "@/hooks/useColorize";
import { Palette, Sparkles, Loader2, AlertCircle, Lock } from "lucide-react";

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);
  const [instruction, setInstruction] = useState("");

  const { colorize, isProcessing, error, resultImage, recommendations, reset } = useColorize();

  const handleProcess = async () => {
    if (!uploadedImage || !selectedColor || !instruction.trim()) return;
    await colorize(uploadedImage, instruction.trim(), selectedColor);
  };

  const handleReset = () => {
    setUploadedImage(null);
    setSelectedColor(null);
    setInstruction("");
    reset();
  };

  const canProcess = uploadedImage && selectedColor && instruction.trim() && !isProcessing;

  // Show result view if we have a result
  if (resultImage && uploadedImage) {
    return (
      <div className="min-h-screen" style={{ background: "linear-gradient(135deg, hsl(200 55% 90%) 0%, hsl(220 45% 94%) 35%, hsl(10 55% 90%) 70%, hsl(35 65% 93%) 100%)" }}>
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container max-w-5xl py-4 px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Palette className="w-6 h-6 text-accent" />
              <span className="font-display font-bold">SayerVisionAI</span>
            </div>
            <Link
              to="/auth"
              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </div>
        </header>

        <div className="container max-w-5xl py-12 px-4 space-y-8">
          <ResultPreview
            originalImage={uploadedImage}
            resultImage={resultImage}
            recommendations={recommendations}
            onReset={handleReset}
          />

          {/* Precautions Section */}
          {recommendations?.[0]?.product?.precautions && recommendations[0].product.precautions.length > 0 && (
            <PrecautionsSection
              precautions={recommendations[0].product.precautions}
              productName={recommendations[0].product.name}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, hsl(200 55% 90%) 0%, hsl(220 45% 94%) 35%, hsl(10 55% 90%) 70%, hsl(35 65% 93%) 100%)" }}>
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container max-w-5xl py-4 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Palette className="w-6 h-6 text-accent" />
            <span className="font-display font-bold">SayerVisionAI</span>
          </div>
          <Link
            to="/auth"
            className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Lock className="w-4 h-4" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        </div>
      </header>

      {/* Hero section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-moss/5 pointer-events-none" />

        <div className="container max-w-5xl py-16 px-4 relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Potenciado por IA
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
              Coloriza tus
              <span className="block text-accent">superficies</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Sube una imagen, indica qué superficie quieres cambiar y selecciona un color.
              Nuestra IA hará el resto.
            </p>
          </div>

          {/* Main card */}
          <div className="glass-card rounded-3xl p-6 md:p-8 space-y-8 shadow-2xl border border-white/40">
            {/* Step 1: Upload */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-semibold text-sm">
                  1
                </div>
                <h2 className="font-semibold text-lg">Sube tu imagen</h2>
              </div>
              <ImageUploader
                onImageSelect={setUploadedImage}
                currentImage={uploadedImage}
                onClear={() => setUploadedImage(null)}
              />
            </div>

            {/* Step 2: Instruction */}
            {uploadedImage && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-semibold text-sm">
                    2
                  </div>
                  <h2 className="font-semibold text-lg">Describe la superficie</h2>
                </div>
                <input
                  type="text"
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  placeholder="Ej: la pared de block del exterior, la puerta de metal oxidada..."
                  className="input-instruction"
                />
                <p className="text-xs text-muted-foreground">
                  💡 <strong>Consejo:</strong> Sé específico: menciona el material y la ubicación.
                  Puedes describir <strong>varias características</strong> (ej: "pared de block del cuarto, con humedad").
                  Solo superficies pintables: paredes, madera, metal, pisos, etc.
                </p>
              </div>
            )}

            {/* Step 3: Color selection */}
            {uploadedImage && instruction.trim() && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-semibold text-sm">
                    3
                  </div>
                  <ColorPalette
                    selectedColor={selectedColor}
                    onSelectColor={setSelectedColor}
                  />
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 text-destructive">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Process button */}
            {uploadedImage && (
              <div className="pt-4">
                <button
                  onClick={handleProcess}
                  disabled={!canProcess}
                  className="btn-process w-full flex items-center justify-center gap-3"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Procesando con IA...
                    </>
                  ) : (
                    <>
                      <Palette className="w-5 h-5" />
                      Colorizar superficie
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Color preview chips */}
          <div className="flex justify-center gap-4 mt-8">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card shadow-soft">
              <div className="w-3 h-3 rounded-full bg-moss" />
              <span className="text-xs text-muted-foreground">Verde Musgo</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card shadow-soft">
              <div className="w-3 h-3 rounded-full bg-wine" />
              <span className="text-xs text-muted-foreground">Rojo Vino</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card shadow-soft">
              <div className="w-3 h-3 rounded-full bg-pastel" />
              <span className="text-xs text-muted-foreground">Amarillo Pastel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
