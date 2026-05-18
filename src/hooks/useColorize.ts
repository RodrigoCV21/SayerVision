import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getLocalProducts } from "@/lib/localDb";
import { detectSurfaceCategory, findBestProducts } from "@/lib/recommendations";
import type { Product } from "@/hooks/useProducts";
import type { ColorOption } from "@/components/ColorPalette";

interface Product {
  id: string;
  name: string;
  serie: string;
  description: string;
  category: string;
  price?: number;
  features?: string[];
  applicable_surfaces?: string[];
  environmental_conditions?: string[];
  precautions?: string[];
  requiresPrimer?: {
    id: string;
    name: string;
    serie: string;
    description: string;
    price?: number;
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
  recommendations?: Recommendation[];
}

import { getColorHex } from "@/components/ColorPalette";

// No longer using COLOR_DESCRIPTIONS map, we send Hex directly

export function useColorize() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);

  const colorize = async (
    imageBase64: string,
    surfaceInstruction: string,
    selectedColor: ColorOption
  ): Promise<boolean> => {
    setIsProcessing(true);
    setError(null);
    setResultImage(null);
    setRecommendations(null);

    // Enviamos solo el valor hexadecimal para máxima precisión
    const colorDescription = getColorHex(selectedColor);

    try {
      const { data, error: fnError } = await supabase.functions.invoke<ColorizeResult>(
        "colorize-surface",
        {
          body: {
            imageBase64,
            surfaceInstruction,
            // Siempre un color base válido para el backend, el override hace el trabajo real
            selectedColor: "moss-green",
            colorDescriptionOverride: `Color Hexadecimal exacto: ${colorDescription}`,
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

        // Fetch products locally to calculate recommendations
        let availableProducts = getLocalProducts() as unknown as Product[];
        
        // Try to fetch from Supabase if local is empty
        if (availableProducts.length === 0) {
          try {
            const { data: remoteProducts } = await supabase.from("products").select("*");
            if (remoteProducts) {
              availableProducts = remoteProducts as Product[];
            }
          } catch (e) {
            // ignore
          }
        }

        // Parse surface detected from message (e.g. "Material detectado: madera. Condiciones: interior.")
        let surfaceDetected = "superficie";
        let surfaceCat = detectSurfaceCategory(surfaceInstruction);
        
        if (data.message) {
          const materialMatch = data.message.match(/Material detectado: ([^.]+)/i);
          const material = materialMatch ? materialMatch[1].trim() : "desconocido";
          const conditionsMatch = data.message.match(/Condiciones: ([^.]+)/i);
          const conditions = conditionsMatch ? conditionsMatch[1].trim() : "";
          
          surfaceDetected = `${material} ${conditions ? `(${conditions})` : ""}`;
          
          if (!surfaceCat) {
             surfaceCat = detectSurfaceCategory(material);
          }
        }

        const bestProducts = findBestProducts(surfaceCat, availableProducts);
        
        // Map to Recommendation format
        const finalRecommendations = bestProducts.map(product => {
          let primerInfo = undefined;
          
          if (product.requires_primer && product.primer_product_id) {
            const primer = availableProducts.find(p => p.id === product.primer_product_id);
            if (primer) {
              primerInfo = {
                id: primer.id,
                name: primer.name,
                serie: primer.serie || "",
                description: primer.description || "Aplicar antes del producto principal",
                price: primer.price ?? 0
              };
            }
          }

          return {
            product: {
              ...product,
              price: product.price ?? 0,
              requiresPrimer: primerInfo
            },
            surfaceDetected
          };
        });

        setRecommendations(finalRecommendations);
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
    setRecommendations(null);
  };

  return {
    colorize,
    isProcessing,
    error,
    resultImage,
    recommendations,
    reset,
  };
}
