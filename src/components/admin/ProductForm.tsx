import { useState } from "react";
import { ChevronDown, ChevronUp, Save, Loader2, Zap, LayoutGrid, AlertTriangle } from "lucide-react";
import type { Product, ProductInput } from "@/hooks/useProducts";

interface ProductFormProps {
  initialData?: Product;
  products: Product[];
  onSubmit: (input: ProductInput) => Promise<void>;
  onCancel: () => void;
}

const CATEGORIES = [
  "Línea para Madera",
  "Línea para Metales",
  "Línea Arquitectónica",
  "Especialidades y Tráfico",
  "Impermeabilizantes",
];

const PRESET_FEATURES = [
  "Acabado brillante", "Acabado extremadamente liso", "Acabado mate", "Acabado satinado",
  "Alto rendimiento", "Amarillea en blanco", "Antibacterial", "Anticorrosivo", "Antihongos",
  "Baja toxicidad", "Bajo olor", "Base agua", "Base solvente", "Da color sin ocultar veta",
  "Elastomérico", "Lavable", "Limpieza de herramientas", "Mejora adherencia",
  "No amarillea", "No exige lijar previamente", "Olor fuerte", "Optimiza secado", "Optimiza viscosidad",
  "Poco roce", "Resistencia a la abrasión", "Resistencia a la intemperie",
  "Resistencia al agua", "Resistencia mecánica", "Resistencia química",
  "Secado lento", "Secado rápido", "Uso rudo",
];

const PRESET_SURFACES = [
  // Madera
  "madera-interior", "madera-exterior", "muebles-madera", "puertas-madera", "pisos-madera",
  // Metal
  "metal-ferroso", "metal-galvanizado", "aluminio", "herreria", "tanques-tuberias", "estructuras-metalicas",
  // Muro
  "muro-interior", "muro-exterior", "concreto", "block", "tablaroca", "aplanado",
  // Piso
  "piso-exterior", "estacionamiento", "señalizacion", "canchas",
  // Especial
  "alberca", "azotea", "impermeabilizacion",
];

const PRESET_CONDITIONS = [
  "Uso interior", "Uso exterior", "Alta humedad", "Exposición directa al sol",
  "Zonas costeras", "Lluvias frecuentes", "Temperaturas extremas",
  "Ambiente industrial", "Tráfico peatonal", "Tráfico vehicular",
];

const PRESET_PRECAUTIONS = [
  "Usar guantes", "Usar mascarilla", "Usar lentes de protección",
  "Aplicar en área ventilada", "No fumar durante la aplicación",
  "Mantener alejado del fuego", "No ingerir", "Mantener fuera del alcance de niños",
  "Evitar contacto prolongado con la piel", "Aplicar sobre superficie seca",
  "Aplicar entre 10°C y 35°C",
];

const PRODUCT_TYPES = [
  {
    name: "Barnices al agua",
    features: ["Baja toxicidad", "Secado rápido", "Base agua"],
    conditions: ["Uso interior"],
    surfaces: ["madera-interior"],
    precautions: ["Aplicar sobre superficie seca"]
  },
  {
    name: "Barnices al solvente",
    features: ["Olor fuerte", "Resistencia química", "Resistencia mecánica", "Base solvente"],
    conditions: ["Uso exterior", "Exposición directa al sol"],
    surfaces: ["madera-exterior"],
    precautions: ["Usar mascarilla", "Aplicar en área ventilada", "Mantener alejado del fuego"]
  },
  {
    name: "Tintes",
    features: ["Da color sin ocultar veta"],
    conditions: ["Uso interior", "Uso exterior"],
    surfaces: ["madera-interior", "madera-exterior", "muebles-madera"],
    precautions: ["Usar mascarilla", "Aplicar en área ventilada"]
  },
  {
    name: "Selladores",
    features: ["Mejora adherencia"],
    conditions: ["Uso interior", "Uso exterior"],
    surfaces: ["madera-interior", "madera-exterior", "muro-interior", "muro-exterior"],
    precautions: ["Aplicar sobre superficie seca"]
  },
  {
    name: "Esmalte Sintético",
    features: ["Olor fuerte", "Secado lento", "Amarillea en blanco", "Uso rudo", "Base solvente"],
    conditions: ["Uso exterior", "Temperaturas extremas"],
    surfaces: ["metal-ferroso", "metal-galvanizado", "herreria"],
    precautions: ["Usar mascarilla", "Aplicar en área ventilada", "Mantener alejado del fuego"]
  },
  {
    name: "Esmalte al Agua",
    features: ["Secado rápido", "Base agua", "No amarillea"],
    conditions: ["Uso interior"],
    surfaces: ["metal-ferroso", "puertas-madera"],
    precautions: ["Usar mascarilla"]
  },
  {
    name: "Lacas",
    features: ["Acabado extremadamente liso"],
    conditions: ["Uso interior"],
    surfaces: ["muebles-madera"],
    precautions: ["Usar mascarilla", "Aplicar en área ventilada", "Evitar contacto prolongado con la piel"]
  },
  {
    name: "Pintura a la Tiza",
    features: ["No exige lijar previamente", "Base agua"],
    conditions: ["Uso interior"],
    surfaces: ["muebles-madera", "muro-interior"],
    precautions: ["Aplicar sobre superficie seca"]
  },
  {
    name: "Pintura Acrílica / Látex",
    features: ["Base agua", "Poco roce"],
    conditions: ["Uso interior"],
    surfaces: ["muro-interior", "tablaroca", "aplanado"],
    precautions: ["Usar mascarilla"]
  },
  {
    name: "Diluyentes",
    features: ["Optimiza secado", "Optimiza viscosidad", "Base solvente"],
    conditions: [],
    surfaces: [],
    precautions: ["Usar mascarilla", "Aplicar en área ventilada", "Mantener alejado del fuego", "Usar lentes de protección", "No ingerir"]
  },
  {
    name: "Solventes (Limpieza)",
    features: ["Limpieza de herramientas", "Base solvente"],
    conditions: [],
    surfaces: [],
    precautions: ["Usar mascarilla", "Aplicar en área ventilada", "Mantener alejado del fuego", "Usar guantes", "Usar lentes de protección", "Evitar contacto prolongado con la piel", "No ingerir"]
  }
];

// Chip toggle component
function ChipGroup({
  options,
  selected,
  onChange,
  variant = "default",
}: {
  options: string[];
  selected: string[];
  onChange: (vals: string[]) => void;
  variant?: "default" | "warning";
}) {
  const toggle = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter((v) => v !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 pt-3 pb-1">
      {options.map((opt) => {
        const active = selected.includes(opt);
        let baseClass = "bg-background text-muted-foreground border-border hover:border-accent/50 hover:text-foreground";
        let activeClass = "bg-accent text-accent-foreground border-accent shadow-md scale-105";

        if (variant === "warning") {
          baseClass = "bg-background text-orange-600/70 border-orange-200 hover:border-orange-500 hover:text-orange-600";
          activeClass = "bg-orange-500 text-white border-orange-500 shadow-md scale-105";
        }

        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`px-4 py-2 rounded-full text-sm md:text-base font-semibold border transition-all duration-150 ${
              active ? activeClass : baseClass
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

// Grouped Chip toggle for features
function GroupedChipGroup({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (vals: string[]) => void;
}) {
  const toggle = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter((v) => v !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  // Auto-group features
  const groups: Record<string, string[]> = {
    "Base y Composición": ["Base agua", "Base solvente", "Baja toxicidad", "Olor fuerte", "Bajo olor"],
    "Acabado": ["Acabado brillante", "Acabado extremadamente liso", "Acabado mate", "Acabado satinado", "Amarillea en blanco", "No amarillea", "Da color sin ocultar veta"],
    "Desempeño y Resistencia": ["Alto rendimiento", "Antibacterial", "Anticorrosivo", "Antihongos", "Elastomérico", "Lavable", "Poco roce", "Resistencia a la abrasión", "Resistencia a la intemperie", "Resistencia al agua", "Resistencia mecánica", "Resistencia química", "Uso rudo"],
    "Aplicación y Tiempos": ["Mejora adherencia", "No exige lijar previamente", "Optimiza secado", "Optimiza viscosidad", "Secado lento", "Secado rápido"],
    "Otros": ["Limpieza de herramientas"]
  };

  return (
    <div className="space-y-4 pt-3 pb-1">
      {Object.entries(groups).map(([groupName, groupOptions]) => {
        const validOptions = groupOptions.filter(o => options.includes(o)).sort();
        if (validOptions.length === 0) return null;
        
        return (
          <div key={groupName} className="bg-secondary/20 p-3 rounded-xl border border-border/50">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{groupName}</h4>
            <div className="flex flex-wrap gap-2">
              {validOptions.map((opt) => {
                const active = selected.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggle(opt)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-150 ${
                      active
                        ? "bg-moss text-white border-moss shadow-md"
                        : "bg-background text-muted-foreground border-border hover:border-moss/50 hover:text-foreground"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Accordion section
function Section({
  title,
  count,
  children,
  defaultOpen = false,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors"
      >
        <span className="text-sm font-bold text-foreground">
          {title}
          {count > 0 && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
              {count}
            </span>
          )}
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && <div className="px-4 pb-4 border-t border-border">{children}</div>}
    </div>
  );
}

export function ProductForm({ initialData, products, onSubmit, onCancel }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName]           = useState(initialData?.name ?? "");
  const [serie, setSerie]         = useState(initialData?.serie ?? "");
  const [category, setCategory]   = useState(initialData?.category ?? CATEGORIES[2]);
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [features, setFeatures]   = useState<string[]>(initialData?.features ?? []);
  const [surfaces, setSurfaces]   = useState<string[]>(initialData?.applicable_surfaces ?? []);
  const [conditions, setConditions] = useState<string[]>(initialData?.environmental_conditions ?? []);
  const [precautions, setPrecautions] = useState<string[]>(initialData?.precautions ?? []);
  const [requiresPrimer, setRequiresPrimer] = useState(initialData?.requires_primer ?? false);
  const [primerProductId, setPrimerProductId] = useState(initialData?.primer_product_id ?? "");
  const [price, setPrice]             = useState<number>(initialData?.price ?? 0);

  const isValidBaseInfo = name.trim().length > 0 && category && price > 0;

  const handleProductTypeSelect = (type: typeof PRODUCT_TYPES[0]) => {
    setFeatures(Array.from(new Set([...features, ...type.features])));
    setConditions(Array.from(new Set([...conditions, ...type.conditions])));
    setSurfaces(Array.from(new Set([...surfaces, ...type.surfaces])));
    setPrecautions(Array.from(new Set([...precautions, ...type.precautions])));
    if (type.name === "Pintura a la Tiza" || type.name === "Pintura Acrílica / Látex") {
      setRequiresPrimer(true);
    }
  };

  const handleClearAllAttributes = () => {
    setFeatures([]);
    setConditions([]);
    setSurfaces([]);
    setPrecautions([]);
    setRequiresPrimer(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidBaseInfo) return;
    setIsSubmitting(true);
    await onSubmit({
      name: name.trim(),
      serie: serie.trim() || undefined,
      category,
      description: description.trim() || undefined,
      features,
      applicable_surfaces: surfaces,
      environmental_conditions: conditions,
      precautions,
      requires_primer: requiresPrimer,
      primer_product_id: requiresPrimer && primerProductId ? primerProductId : undefined,
      price: Number(price) || 0,
    });
    setIsSubmitting(false);
  };

  const otherProducts = products.filter((p) => p.id !== initialData?.id);

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="space-y-5 bg-card p-5 rounded-2xl border border-border shadow-sm">
        <h3 className="font-bold text-lg border-b border-border pb-2 mb-4">1. Información Básica</h3>
        {/* Nombre + Serie */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">
              Nombre del Producto <span className="text-destructive">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Ej: Esmalte Acrílico Sayer"
              className="input-instruction"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1.5">Serie</label>
            <input
              value={serie}
              onChange={(e) => setSerie(e.target.value)}
              placeholder="Ej: V-00xx"
              className="input-instruction"
            />
          </div>
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-xs font-bold text-muted-foreground mb-1.5">
            Categoría / Línea <span className="text-destructive">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="input-instruction bg-secondary/30 font-semibold"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        {/* Precio */}
        <div>
          <label className="block text-xs font-bold text-muted-foreground mb-1.5">
            Precio de Venta <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={price || ""}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
              placeholder="0.00"
              className={`input-instruction pl-7 font-semibold ${price <= 0 ? "border-destructive focus:ring-destructive" : ""}`}
            />
          </div>
          {price <= 0 && <p className="text-xs text-destructive mt-1 font-semibold">El precio debe ser mayor a 0</p>}
        </div>

        {/* Descripción adicional */}
        <div>
          <label className="block text-xs font-bold text-muted-foreground mb-1.5">
            Descripción adicional{" "}
            <span className="text-muted-foreground/60 font-normal">(opcional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Información extra..."
            className="input-instruction resize-none"
          />
        </div>
      </div>

      {/* Secciones IA - Deshabilitadas si falta info básica */}
      <div className={`space-y-5 transition-opacity duration-300 ${!isValidBaseInfo ? 'opacity-50 pointer-events-none' : ''}`}>
        
        <div className="bg-accent/5 p-5 rounded-2xl border border-accent/20">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-accent flex-shrink-0" />
            <h3 className="font-bold text-lg text-accent">2. Configuración para IA</h3>
          </div>
          
          <div className="mb-6 bg-card p-4 rounded-xl shadow-sm border border-border">
            <div className="flex items-center gap-2 mb-3">
              <LayoutGrid className="w-4 h-4 text-muted-foreground" />
              <label className="block text-sm font-bold text-foreground">
                Auto-completar por Tipo de Producto
              </label>
            </div>
            <p className="text-xs text-muted-foreground mb-3">Selecciona un tipo para rellenar automáticamente las características y precauciones.</p>
            <div className="flex flex-wrap gap-2">
              {PRODUCT_TYPES.map((type) => (
                <button
                  key={type.name}
                  type="button"
                  onClick={() => handleProductTypeSelect(type)}
                  className="px-3 py-1.5 text-xs font-bold bg-secondary hover:bg-accent hover:text-white rounded-lg transition-colors border border-border"
                >
                  {type.name}
                </button>
              ))}
              <div className="w-px h-6 bg-border mx-1 self-center" />
              <button
                type="button"
                onClick={handleClearAllAttributes}
                className="px-3 py-1.5 text-xs font-bold text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-destructive/30"
                title="Descartar todos los atributos y empezar de cero"
              >
                Limpiar Todo
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            <Section title="Superficies de Uso Aplicables" count={surfaces.length}>
              <ChipGroup options={PRESET_SURFACES} selected={surfaces} onChange={setSurfaces} />
            </Section>

            <Section title="Condiciones Ambientales" count={conditions.length}>
              <ChipGroup options={PRESET_CONDITIONS} selected={conditions} onChange={setConditions} />
            </Section>

            <div className="lg:col-span-2">
              <Section title="Características del Producto" count={features.length} defaultOpen={true}>
                <GroupedChipGroup options={PRESET_FEATURES} selected={features} onChange={setFeatures} />
              </Section>
            </div>

            <div className="lg:col-span-2">
              <Section title="Precauciones de Aplicación" count={precautions.length}>
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl mb-2 mt-2">
                  <p className="text-xs font-bold text-orange-600 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Advertencias críticas que se mostrarán al cliente:
                  </p>
                </div>
                <ChipGroup options={PRESET_PRECAUTIONS} selected={precautions} onChange={setPrecautions} variant="warning" />
              </Section>
            </div>
          </div>

          {/* Requiere Primario */}
          <div className="mt-5 p-4 bg-card rounded-xl border border-border flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="requires_primer"
                checked={requiresPrimer}
                onChange={(e) => setRequiresPrimer(e.target.checked)}
                className="w-5 h-5 accent-accent rounded"
              />
              <label htmlFor="requires_primer" className="text-sm font-bold cursor-pointer select-none">
                Este producto requiere primario/sellador
              </label>
            </div>

            {requiresPrimer && otherProducts.length > 0 && (
              <div className="pl-8 animate-in fade-in zoom-in-95 duration-200">
                <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                  Producto Primario Sugerido
                </label>
                <select
                  value={primerProductId}
                  onChange={(e) => setPrimerProductId(e.target.value)}
                  className="input-instruction bg-secondary/30 py-2"
                >
                  <option value="">— Opcional: Seleccionar primario específico —</option>
                  {otherProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.serie ? `(${p.serie})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex gap-3 pt-4 border-t border-border sticky bottom-0 bg-background/90 backdrop-blur py-4 z-10">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 rounded-xl border border-border text-sm font-bold
                     hover:bg-secondary transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !isValidBaseInfo}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                     bg-accent text-accent-foreground text-sm font-bold shadow-lg
                     hover:bg-accent/90 hover:scale-[1.02] transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Guardando...</>
          ) : (
            <><Save className="w-5 h-5" /> {initialData ? "Actualizar Producto" : "Crear Producto"}</>
          )}
        </button>
      </div>
    </form>
  );
}
