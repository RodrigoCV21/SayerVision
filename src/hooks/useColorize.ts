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
  recommendations?: Recommendation[];
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
                description: primer.description || "Aplicar antes del producto principal"
              };
            }
          }

          return {
            product: {
              ...product,
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
