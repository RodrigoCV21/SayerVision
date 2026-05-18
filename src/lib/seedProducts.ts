import { LocalProduct } from "./database.types";

export const INITIAL_PRODUCTS: Omit<LocalProduct, "id" | "created_at" | "updated_at">[] = [
  {
    name: "ImpreSayer Pro 5 Años",
    serie: "IMP-700",
    category: "Impermeabilizantes",
    description: "Recubrimiento elástico diseñado para evitar filtraciones de agua.",
    price: 450.00,
    features: ["elastomérico", "resistente-agua", "resistente-intemperie", "base-agua"],
    applicable_surfaces: ["azotea", "muro-exterior", "concreto"],
    environmental_conditions: ["exterior", "lluvia"],
    precautions: ["evitar-contacto-piel", "ventilacion"],
    requires_primer: false,
    primer_product_id: null,
    created_by: null
  },
  {
    name: "Pintura Tráfico Base Solvente",
    serie: "TR-200",
    category: "Especialidades y Tráfico",
    description: "Pintura de alta visibilidad y resistencia a la fricción para zonas viales.",
    price: 520.00,
    features: ["secado-rapido", "alta-visibilidad", "resistente-abrasion"],
    applicable_surfaces: ["pavimento", "concreto", "estacionamiento"],
    environmental_conditions: ["exterior", "trafico-pesado"],
    precautions: ["inflamable", "usar-mascarilla"],
    requires_primer: false,
    primer_product_id: null,
    created_by: null
  },
  {
    name: "Barniz Marino Poliuretano",
    serie: "BM-500",
    category: "Línea para Madera",
    description: "Protección premium para maderas expuestas a condiciones extremas.",
    price: 380.00,
    features: ["filtro-uv", "resistente-humedad", "acabado-brillante"],
    applicable_surfaces: ["madera-exterior", "puertas-madera", "muebles-madera"],
    environmental_conditions: ["exterior", "zonas-costeras"],
    precautions: ["ventilacion-adecuada", "usar-guantes"],
    requires_primer: true,
    primer_product_id: "seed-primer-1",
    created_by: null
  },
  {
    name: "Sellador para Madera (Base)",
    serie: "SM-100",
    category: "Línea para Madera",
    description: "Primario para tapar poro y preparar la madera antes del barniz.",
    price: 210.00,
    features: ["tapa-poro", "facil-lija", "secado-rapido"],
    applicable_surfaces: ["madera-interior", "madera-exterior"],
    environmental_conditions: ["interior", "exterior"],
    precautions: ["ventilacion"],
    requires_primer: false,
    primer_product_id: null,
    created_by: null
  },
  {
    name: "Satín Premium Interior",
    serie: "V-01x",
    category: "Línea Arquitectónica",
    description: "Pintura vinil-acrílica de acabado satinado muy lavable.",
    price: 680.00,
    features: ["lavable", "bajo-olor", "antibacterial"],
    applicable_surfaces: ["muro-interior", "tablaroca", "yeso"],
    environmental_conditions: ["interior"],
    precautions: ["ninguna"],
    requires_primer: false,
    primer_product_id: null,
    created_by: null
  }
];
