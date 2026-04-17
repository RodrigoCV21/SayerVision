// Opciones predefinidas para productos - usadas tanto en frontend como en la lógica de IA

export const CATEGORIES = [
  "Línea Arquitectónica",
  "Línea para Metales",
  "Línea para Madera",
  "Especialidades y Tráfico",
  "Impermeabilizantes",
  "Primarios",
] as const;

export const APPLICABLE_SURFACES = [
  // Madera
  { id: "madera-interior", label: "Madera interior", category: "madera" },
  { id: "madera-exterior", label: "Madera exterior", category: "madera" },
  { id: "muebles-madera", label: "Muebles de madera", category: "madera" },
  { id: "puertas-madera", label: "Puertas de madera", category: "madera" },
  { id: "pisos-madera", label: "Pisos de madera / duela", category: "madera" },
  
  // Metales
  { id: "metal-ferroso", label: "Metal ferroso (hierro, acero)", category: "metal" },
  { id: "metal-galvanizado", label: "Metal galvanizado", category: "metal" },
  { id: "aluminio", label: "Aluminio", category: "metal" },
  { id: "herreria", label: "Herrería (rejas, puertas, ventanas)", category: "metal" },
  { id: "tanques-tuberias", label: "Tanques y tuberías", category: "metal" },
  { id: "estructuras-metalicas", label: "Estructuras metálicas", category: "metal" },
  
  // Muros y concreto
  { id: "muro-interior", label: "Muro interior", category: "muro" },
  { id: "muro-exterior", label: "Muro exterior / fachada", category: "muro" },
  { id: "concreto", label: "Concreto", category: "muro" },
  { id: "block", label: "Block", category: "muro" },
  { id: "tablaroca", label: "Tablaroca / yeso", category: "muro" },
  { id: "aplanado", label: "Aplanado", category: "muro" },
  
  // Pisos y tráfico
  { id: "piso-exterior", label: "Piso exterior / pavimento", category: "piso" },
  { id: "estacionamiento", label: "Estacionamiento", category: "piso" },
  { id: "señalizacion", label: "Señalización vial", category: "piso" },
  { id: "canchas", label: "Canchas deportivas", category: "piso" },
  
  // Especiales
  { id: "alberca", label: "Alberca / piscina", category: "especial" },
  { id: "azotea", label: "Azotea / techo", category: "especial" },
  { id: "impermeabilizacion", label: "Superficies a impermeabilizar", category: "especial" },
] as const;

export const FEATURES = [
  { id: "alto-rendimiento", label: "Alto rendimiento" },
  { id: "secado-rapido", label: "Secado rápido" },
  { id: "lavable", label: "Lavable" },
  { id: "antihongos", label: "Antihongos" },
  { id: "antibacterial", label: "Antibacterial" },
  { id: "anticorrosivo", label: "Anticorrosivo" },
  { id: "resistente-agua", label: "Resistente al agua" },
  { id: "resistente-intemperie", label: "Resistente a la intemperie" },
  { id: "resistente-abrasion", label: "Resistente a la abrasión" },
  { id: "elastomerico", label: "Elastomérico" },
  { id: "bajo-olor", label: "Bajo olor" },
  { id: "base-agua", label: "Base agua" },
  { id: "base-solvente", label: "Base solvente" },
  { id: "mate", label: "Acabado mate" },
  { id: "satinado", label: "Acabado satinado" },
  { id: "brillante", label: "Acabado brillante" },
] as const;

export const ENVIRONMENTAL_CONDITIONS = [
  { id: "interior", label: "Uso interior" },
  { id: "exterior", label: "Uso exterior" },
  { id: "alta-humedad", label: "Alta humedad" },
  { id: "exposicion-sol", label: "Exposición directa al sol" },
  { id: "zonas-costeras", label: "Zonas costeras" },
  { id: "lluvias-frecuentes", label: "Lluvias frecuentes" },
  { id: "temperatura-extrema", label: "Temperaturas extremas" },
  { id: "ambiente-industrial", label: "Ambiente industrial" },
  { id: "trafico-peatonal", label: "Tráfico peatonal" },
  { id: "trafico-vehicular", label: "Tráfico vehicular" },
] as const;

export const PRECAUTIONS = [
  { id: "guantes", label: "Usar guantes" },
  { id: "mascarilla", label: "Usar mascarilla" },
  { id: "lentes", label: "Usar lentes de protección" },
  { id: "ventilacion", label: "Aplicar en área ventilada" },
  { id: "no-fumar", label: "No fumar durante la aplicación" },
  { id: "lejos-fuego", label: "Mantener alejado del fuego" },
  { id: "no-ingerir", label: "No ingerir" },
  { id: "fuera-alcance-ninos", label: "Mantener fuera del alcance de niños" },
  { id: "evitar-contacto-piel", label: "Evitar contacto prolongado con la piel" },
  { id: "superficie-seca", label: "Aplicar sobre superficie seca" },
  { id: "temperatura-adecuada", label: "Aplicar entre 10°C y 35°C" },
] as const;

// Tipos
export type Category = typeof CATEGORIES[number];
export type SurfaceOption = typeof APPLICABLE_SURFACES[number];
export type FeatureOption = typeof FEATURES[number];
export type ConditionOption = typeof ENVIRONMENTAL_CONDITIONS[number];
export type PrecautionOption = typeof PRECAUTIONS[number];
