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

    try {
      const { data, error: fnError } = await supabase.functions.invoke<ColorizeResult>(
        "colorize-surface",
        {
          body: {
            imageBase64,
            surfaceInstruction,
            selectedColor,
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
