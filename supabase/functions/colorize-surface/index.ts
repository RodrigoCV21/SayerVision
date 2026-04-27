import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const COLOR_DESCRIPTIONS: Record<string, string> = {
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

// Surface categories mapping
const SURFACE_CATEGORIES: Record<string, string[]> = {
  madera: ["madera-interior", "madera-exterior", "muebles-madera", "puertas-madera", "pisos-madera"],
  metal: ["metal-ferroso", "metal-galvanizado", "aluminio", "herreria", "tanques-tuberias", "estructuras-metalicas"],
  muro: ["muro-interior", "muro-exterior", "concreto", "block", "tablaroca", "aplanado"],
  piso: ["piso-exterior", "estacionamiento", "señalizacion", "canchas"],
  especial: ["alberca", "azotea", "impermeabilizacion"],
};

const SURFACE_KEYWORDS: Record<string, string[]> = {
  madera: ["madera", "mueble", "puerta de madera", "wood", "duela", "parquet", "closet", "gabinete", "muebles", "ventana de madera", "mesa", "silla", "estante", "librero", "cajonera", "cocina de madera", "piso de madera"],
  metal: ["metal", "hierro", "acero", "herrería", "reja", "barandal", "tanque", "tubería", "portón", "puerta de metal", "ventana de metal", "estructura", "galvanizado", "aluminio", "fierro", "metálico", "cancela", "protección", "escalera de metal"],
  muro: ["muro", "pared", "wall", "fachada", "interior", "exterior", "concreto", "block", "tablaroca", "yeso", "aplanado", "cemento", "casa", "edificio", "cuarto", "habitación", "sala", "recámara"],
  piso: ["piso", "pavimento", "estacionamiento", "calle", "señalización", "tráfico", "cancha", "banqueta", "cochera", "garage"],
  especial: ["alberca", "piscina", "pool", "azotea", "techo", "roof", "impermeabiliz", "losa", "terraza"],
};

interface Product {
  id: string;
  name: string;
  serie: string | null;
  category: string;
  description: string | null;
  features: string[];
  applicable_surfaces: string[];
  environmental_conditions: string[];
  precautions: string[];
  requires_primer: boolean;
  primer_product_id: string | null;
}

function detectSurfaceCategory(instruction: string): string | null {
  const lowerInstruction = instruction.toLowerCase();
  let bestMatch: { category: string; score: number } | null = null;
  for (const [category, keywords] of Object.entries(SURFACE_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerInstruction.includes(keyword.toLowerCase())) {
        const score = keyword.length;
        if (!bestMatch || score > bestMatch.score) {
          bestMatch = { category, score };
        }
      }
    }
  }
  return bestMatch?.category || null;
}

function productMatchesSurface(product: Product, surfaceCategory: string): number {
  const categorySurfaces = SURFACE_CATEGORIES[surfaceCategory] || [];
  if (!product.applicable_surfaces || product.applicable_surfaces.length === 0) return 0;
  let score = 0;
  for (const productSurface of product.applicable_surfaces) {
    if (categorySurfaces.includes(productSurface)) score += 20;
    if (productSurface.includes(surfaceCategory)) score += 10;
    const lowerSurface = productSurface.toLowerCase();
    const keywords = SURFACE_KEYWORDS[surfaceCategory] || [];
    for (const keyword of keywords) {
      if (lowerSurface.includes(keyword.toLowerCase())) score += 5;
    }
  }
  const categoryMap: Record<string, string[]> = {
    madera: ["línea para madera", "madera"],
    metal: ["línea para metales", "metal"],
    muro: ["línea arquitectónica", "arquitect"],
    piso: ["especialidades y tráfico", "tráfico"],
    especial: ["impermeabilizantes", "especialidades"],
  };
  const matchingCategories = categoryMap[surfaceCategory] || [];
  for (const cat of matchingCategories) {
    if (product.category.toLowerCase().includes(cat)) score += 15;
  }
  return score;
}

function findBestProduct(surfaceCategory: string | null, products: Product[]): Product | null {
  if (!products || products.length === 0) return null;
  if (!surfaceCategory) {
    return products.find(p => p.applicable_surfaces && p.applicable_surfaces.length > 0) || products[0];
  }
  let bestProduct: Product | null = null;
  let bestScore = 0;
  for (const product of products) {
    const score = productMatchesSurface(product, surfaceCategory);
    if (score > bestScore) {
      bestScore = score;
      bestProduct = product;
    }
  }
  if (!bestProduct || bestScore === 0) {
    const categoryFallback: Record<string, string[]> = {
      madera: ["línea para madera", "madera"],
      metal: ["línea para metales", "metal"],
      muro: ["línea arquitectónica"],
      piso: ["especialidades y tráfico", "tráfico"],
      especial: ["impermeabilizantes"],
    };
    const fallbackCategories = categoryFallback[surfaceCategory] || [];
    for (const product of products) {
      const productCategory = product.category.toLowerCase();
      for (const fallback of fallbackCategories) {
        if (productCategory.includes(fallback)) return product;
      }
    }
  }
  return bestProduct || products[0];
}

// Helper to call Lovable AI Gateway
async function callLovableAI(apiKey: string, model: string, messages: any[], responseModalities?: string[]): Promise<any> {
  const body: any = {
    model,
    messages,
  };
  if (responseModalities) {
    body.modalities = responseModalities;
  }

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Lovable AI error (${model}):`, response.status, errorText);
    if (response.status === 429) {
      throw new Error("Límite de solicitudes excedido. Intenta de nuevo en unos segundos.");
    }
    if (response.status === 402) {
      throw new Error("Créditos de IA agotados. Agrega fondos en la configuración de tu workspace.");
    }
    throw new Error(`Error de IA: ${response.status}`);
  }

  return await response.json();
}

// Helper to call native Google Gemini API
async function callGoogleGemini(apiKey: string, model: string, contents: any[], generationConfig?: any): Promise<any> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const body: any = { contents };
  if (generationConfig) body.generationConfig = generationConfig;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Google Gemini error (${model}):`, response.status, errorText);
    if (response.status === 429) {
      throw new Error("Límite de solicitudes excedido. Intenta de nuevo en unos segundos.");
    }
    throw new Error(`Error de Gemini: ${response.status} - ${errorText.substring(0, 200)}`);
  }

  return await response.json();
}

// Step 1: Analyze the image with AI to detect material, conditions, and validate surface
async function analyzeImage(apiKey: string, imageBase64: string, surfaceInstruction: string): Promise<{
  esSuperficiePintable: boolean;
  razonRechazo?: string;
  material: string;
  conditions: string;
  surfaceCategory: string | null;
}> {
  const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");

  try {
    const data = await callGoogleGemini(apiKey, "gemini-2.5-flash", [{
      parts: [
        {
          text: `Analiza esta imagen. El usuario quiere pintar: "${surfaceInstruction}".

PRIMERO, determina si la superficie mencionada es pintable con pintura física.
Superficies VÁLIDAS para pintar: paredes, muros, madera, metal, pisos de concreto, fachadas, muebles, puertas, rejas, estructuras, azoteas, albercas, etc.
Superficies INVÁLIDAS (rechaza): personas, animales, plantas vivas, árboles, cielo, nubes, agua natural, tierra, piel humana o animal, vegetación natural, ropa, etc.

Responde SOLO con un JSON válido (sin markdown, sin backticks) con esta estructura exacta:
{
  "esSuperficiePintable": true o false,
  "razonRechazo": "solo si esSuperficiePintable es false, explica brevemente en español",
  "material": "tipo de material detectado (madera, metal, concreto, ladrillo, etc.)",
  "conditions": "condiciones ambientales visibles (soleado, húmedo, interior, exterior, lluvia, etc.)",
  "surfaceCategory": "una de estas categorías exactas: madera, metal, muro, piso, especial"
}

Categorías:
- madera: superficies de madera, muebles, puertas de madera
- metal: hierro, acero, rejas, barandales, estructuras metálicas
- muro: paredes, fachadas, concreto, block, tablaroca
- piso: pisos, pavimentos, estacionamientos
- especial: albercas, azoteas, impermeabilización`
        },
        { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } }
      ]
    }], { responseMimeType: "application/json" });

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("AI analysis raw response:", text);

    const cleanText = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const parsed = JSON.parse(cleanText);
    return {
      esSuperficiePintable: parsed.esSuperficiePintable !== false,
      razonRechazo: parsed.razonRechazo,
      material: parsed.material || "no detectado",
      conditions: parsed.conditions || "no detectadas",
      surfaceCategory: parsed.surfaceCategory || detectSurfaceCategory(surfaceInstruction)
    };
  } catch (err) {
    console.error("Analysis error:", err);
    return {
      esSuperficiePintable: true,
      material: "no detectado",
      conditions: "no detectadas",
      surfaceCategory: detectSurfaceCategory(surfaceInstruction)
    };
  }
}

// Step 2: Generate the colorized image with AI
async function colorizeImage(apiKey: string, imageBase64: string, surfaceInstruction: string, colorDescription: string): Promise<string> {
  const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");

  const data = await callLovableAI(apiKey, "google/gemini-2.5-flash-image", [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: `Edita esta imagen cambiando el color de la siguiente superficie: "${surfaceInstruction}".

Cambia esa superficie específica al siguiente color: ${colorDescription}

INSTRUCCIONES:
- Solo cambia el color de la superficie mencionada, mantén todo lo demás igual
- El cambio debe verse natural y realista
- Mantén las texturas, sombras y reflejos originales
- No modifiques otras partes de la imagen
- El resultado debe parecer una foto real con pintura aplicada profesionalmente`
        },
        {
          type: "image_url",
          image_url: { url: `data:image/jpeg;base64,${cleanBase64}` }
        }
      ]
    }
  ], ["image", "text"]);

  const message = data.choices?.[0]?.message;

  if (message?.images && Array.isArray(message.images)) {
    for (const img of message.images) {
      if (img.type === "image_url" && img.image_url?.url) {
        return img.image_url.url;
      }
    }
  }

  if (message?.content && Array.isArray(message.content)) {
    for (const part of message.content) {
      if (part.type === "image_url" && part.image_url?.url) {
        return part.image_url.url;
      }
    }
  }

  console.error("Model response structure:", JSON.stringify(Object.keys(message || {})));
  if (message?.content && typeof message.content === "string") {
    console.error("Model returned text instead of image:", message.content.substring(0, 200));
  }

  throw new Error("No se generó una imagen editada. El modelo no devolvió una imagen.");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const GOOGLE_GEMINI_API_KEY = Deno.env.get("GOOGLE_GEMINI_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }
    if (!GOOGLE_GEMINI_API_KEY) {
      throw new Error("GOOGLE_GEMINI_API_KEY is not configured");
    }
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase configuration missing");
    }

    const { imageBase64, surfaceInstruction, selectedColor, colorDescriptionOverride } = await req.json();

    if (!imageBase64) throw new Error("No image provided");
    if (!surfaceInstruction) throw new Error("No surface instruction provided");

    // Usar la descripción override si viene del frontend (para nuevos colores sin redeploy)
    // Si no, buscar en el mapa local de colores
    const colorDescription = colorDescriptionOverride || COLOR_DESCRIPTIONS[selectedColor];
    if (!colorDescription) throw new Error("Invalid color selection");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch products
    const { data: products, error: dbError } = await supabase.from("products").select("*");
    if (dbError) throw new Error("Failed to fetch products from database");

    console.log(`Found ${products?.length || 0} products`);

    // 1. ANÁLISIS: Esto usa Gemini Nativo (también valida si la superficie es pintable)
    const analysis = await analyzeImage(GOOGLE_GEMINI_API_KEY, imageBase64, surfaceInstruction);

    // Rechazar si la IA determinó que la superficie no es pintable
    if (!analysis.esSuperficiePintable) {
      return new Response(
        JSON.stringify({
          error: `⚠️ No es posible colorizar esta superficie: ${
            analysis.razonRechazo ||
            "Solo se pueden colorizar superficies que pueden ser pintadas físicamente (paredes, madera, metal, pisos, etc.)."
          }`
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. EDICIÓN: Esto usa Lovable Gateway
    let colorizedImageUrl: string = "";
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        colorizedImageUrl = await colorizeImage(LOVABLE_API_KEY, imageBase64, surfaceInstruction, colorDescription);
        break;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "";
        if (msg.includes("Límite de solicitudes") && attempt < 2) {
          console.log(`Rate limited, retrying in ${(attempt + 1) * 5}s (attempt ${attempt + 1}/3)`);
          await new Promise((resolve) => setTimeout(resolve, (attempt + 1) * 5000));
          continue;
        }
        throw err;
      }
    }

    console.log("AI Analysis:", analysis);

    const surfaceCategory = analysis.surfaceCategory || detectSurfaceCategory(surfaceInstruction);
    const recommendedProduct = findBestProduct(surfaceCategory, products || []);

    console.log("Recommendation:", {
      detectedMaterial: analysis.material,
      detectedConditions: analysis.conditions,
      surfaceCategory,
      recommendedProduct: recommendedProduct?.name || "None",
    });

    // Fetch primer if needed
    let primerProduct: Product | null = null;
    if (recommendedProduct?.requires_primer && recommendedProduct.primer_product_id) {
      const { data: primer } = await supabase
        .from("products")
        .select("*")
        .eq("id", recommendedProduct.primer_product_id)
        .single();
      primerProduct = primer;
    }

    const recommendation = recommendedProduct ? {
      product: {
        id: recommendedProduct.id,
        name: recommendedProduct.name,
        serie: recommendedProduct.serie || "",
        description: recommendedProduct.description || "",
        category: recommendedProduct.category,
        features: recommendedProduct.features,
        applicable_surfaces: recommendedProduct.applicable_surfaces,
        environmental_conditions: recommendedProduct.environmental_conditions,
        precautions: recommendedProduct.precautions,
        requiresPrimer: recommendedProduct.requires_primer ? {
          id: primerProduct?.id || "",
          name: primerProduct?.name || "Primario recomendado",
          serie: primerProduct?.serie || "",
          description: primerProduct?.description || "Aplicar antes del producto principal"
        } : undefined,
      },
      surfaceDetected: `${analysis.material} (${analysis.conditions})`,
    } : null;

    return new Response(
      JSON.stringify({
        success: true,
        imageUrl: colorizedImageUrl,
        message: `Material detectado: ${analysis.material}. Condiciones: ${analysis.conditions}.`,
        recommendation,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Colorize error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
