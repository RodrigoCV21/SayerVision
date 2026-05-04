import type { Product } from "@/hooks/useProducts";

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

export function detectSurfaceCategory(instruction: string): string | null {
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

export function findBestProducts(surfaceCategory: string | null, products: Product[], limit: number = 3): Product[] {
  if (!products || products.length === 0) return [];
  if (!surfaceCategory) {
    const validProducts = products.filter(p => p.applicable_surfaces && p.applicable_surfaces.length > 0);
    return validProducts.slice(0, limit).length > 0 ? validProducts.slice(0, limit) : products.slice(0, limit);
  }
  
  // Calculate score for all products
  const productsWithScore = products.map(product => {
    return { product, score: productMatchesSurface(product, surfaceCategory) };
  });
  
  // Sort by score descending
  productsWithScore.sort((a, b) => b.score - a.score);
  
  // Filter products with score > 0
  let bestProducts = productsWithScore.filter(p => p.score > 0).map(p => p.product);
  
  if (bestProducts.length === 0) {
    const categoryFallback: Record<string, string[]> = {
      madera: ["línea para madera", "madera"],
      metal: ["línea para metales", "metal"],
      muro: ["línea arquitectónica"],
      piso: ["especialidades y tráfico", "tráfico"],
      especial: ["impermeabilizantes"],
    };
    const fallbackCategories = categoryFallback[surfaceCategory] || [];
    bestProducts = products.filter(product => {
      const productCategory = product.category.toLowerCase();
      return fallbackCategories.some(fallback => productCategory.includes(fallback));
    });
  }
  
  const results = bestProducts.length > 0 ? bestProducts : products;
  return results.slice(0, limit);
}
