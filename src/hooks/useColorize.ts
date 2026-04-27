import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { ColorOption } from "@/components/ColorPalette";

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

interface ColorizeResult {
  success: boolean;
  imageUrl?: string;
  message?: string;
  error?: string;
  recommendation?: Recommendation;
}

// Mapa de descripciones de color para enviar a la IA
// Esto permite añadir colores nuevos sin redeploy de la Edge Function
const COLOR_DESCRIPTIONS: Record<ColorOption, string> = {
  "moss-green":     "Verde musgo — verde profundo y natural como el musgo del bosque, tono #4a6d4a",
  "wine-red":       "Rojo vino — rojo intenso y elegante como el vino tinto, tono #8b3a3a",
  "pastel-yellow":  "Amarillo pastel — amarillo suave y cálido, tono crema claro #e8d88a",
  "primary-red":    "Rojo — rojo primario puro y vibrante, tono #CC2200",
  "primary-blue":   "Azul — azul primario profundo, tono #1A3DAA",
  "primary-yellow": "Amarillo — amarillo primario brillante, tono #F5C800",
  "white":          "Blanco — blanco clásico para interiores y exteriores, tono #F5F5F0",
  "black":          "Negro — negro profundo y elegante, tono #1A1A1A",
  "gray":           "Gris — gris neutro versátil, tono #7A7A7A",
  "beige":          "Beige — tono cálido y suave, tono #D4B896",
  "orange":         "Naranja — naranja vibrante y energético, tono #E8630A",
  "purple":         "Morado — morado profundo y sofisticado, tono #7B2D8B",
  "sky-blue":       "Azul cielo — azul claro y fresco, tono #5EB8DD",
};

export function useColorize() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

  const colorize = async (
    imageBase64: string,
    surfaceInstruction: string,
    selectedColor: ColorOption
  ): Promise<boolean> => {
    setIsProcessing(true);
    setError(null);
    setResultImage(null);
    setRecommendation(null);

    // Enviamos la descripción real del color en lugar del ID
    // Así el backend acepta cualquier color sin necesitar redeploy
    const colorDescription = COLOR_DESCRIPTIONS[selectedColor];

    try {
      const { data, error: fnError } = await supabase.functions.invoke<ColorizeResult>(
        "colorize-surface",
        {
          body: {
            imageBase64,
            surfaceInstruction,
            // Siempre un color válido para el backend actual
            selectedColor: "moss-green",
            // Override con la descripción real del color elegido
            colorDescriptionOverride: colorDescription,
          },
        }
      );

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.success && data.imageUrl) {
        setResultImage(data.imageUrl);
        if (data.recommendation) {
          setRecommendation(data.recommendation);
        }
        return true;
      }

      throw new Error("No se recibió una imagen del servidor");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al procesar la imagen";
      setError(message);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setResultImage(null);
    setError(null);
    setRecommendation(null);
  };

  return {
    colorize,
    isProcessing,
    error,
    resultImage,
    recommendation,
    reset,
  };
}
