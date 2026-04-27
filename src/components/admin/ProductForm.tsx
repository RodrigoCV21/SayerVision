import { useState } from "react";
import { ChevronDown, ChevronUp, Save, Loader2, Zap } from "lucide-react";
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
  "Alto rendimiento", "Secado rápido", "Lavable", "Antihongos", "Antibacterial",
  "Anticorrosivo", "Resistente al agua", "Resistente a la intemperie",
  "Resistente a la abrasión", "Elastomérico", "Bajo olor", "Base agua",
  "Base solvente", "Acabado mate", "Acabado satinado", "Acabado brillante",
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

// Chip toggle component
function ChipGroup({
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

  return (
    <div className="flex flex-wrap gap-2 pt-3 pb-1">
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 ${
              active
                ? "bg-accent text-accent-foreground border-accent shadow-sm"
                : "bg-background text-muted-foreground border-border hover:border-accent/50 hover:text-foreground"
            }`}
          >
            {opt}
          </button>
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
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors"
      >
        <span className="text-sm font-medium">
          {title}
          {count > 0 && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-accent/15 text-accent text-xs font-semibold">
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !category) return;
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
    });
    setIsSubmitting(false);
  };

  const otherProducts = products.filter((p) => p.id !== initialData?.id);

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-5">
      {/* Nombre + Serie */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">
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
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Serie</label>
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
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">
          Categoría / Línea <span className="text-destructive">*</span>
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="input-instruction bg-secondary/30"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Descripción adicional */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">
          Descripción adicional{" "}
          <span className="text-muted-foreground/60 font-normal">(opcional, para información extra)</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="Información adicional que no cubren las opciones predefinidas..."
          className="input-instruction resize-none"
        />
      </div>

      {/* Secciones IA */}
      <div className="rounded-xl border-l-4 border-accent bg-accent/5 px-4 py-2 flex items-center gap-2">
        <Zap className="w-4 h-4 text-accent flex-shrink-0" />
        <p className="text-xs font-semibold text-accent">Importante para la recomendación de IA</p>
      </div>

      <div className="space-y-3">
        <Section title="Superficies de Uso Aplicables" count={surfaces.length}>
          <ChipGroup options={PRESET_SURFACES} selected={surfaces} onChange={setSurfaces} />
        </Section>

        <Section title="Características del Producto" count={features.length} defaultOpen={true}>
          <ChipGroup options={PRESET_FEATURES} selected={features} onChange={setFeatures} />
        </Section>

        <Section title="Condiciones Ambientales" count={conditions.length}>
          <ChipGroup options={PRESET_CONDITIONS} selected={conditions} onChange={setConditions} />
        </Section>

        <Section title="Precauciones de Aplicación" count={precautions.length}>
          <ChipGroup options={PRESET_PRECAUTIONS} selected={precautions} onChange={setPrecautions} />
        </Section>
      </div>

      {/* Requiere Primario */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="requires_primer"
          checked={requiresPrimer}
          onChange={(e) => setRequiresPrimer(e.target.checked)}
          className="w-4 h-4 accent-accent"
        />
        <label htmlFor="requires_primer" className="text-sm cursor-pointer select-none">
          Este producto requiere primario/sellador
        </label>
      </div>

      {requiresPrimer && otherProducts.length > 0 && (
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">
            Producto Primario
          </label>
          <select
            value={primerProductId}
            onChange={(e) => setPrimerProductId(e.target.value)}
            className="input-instruction bg-secondary/30"
          >
            <option value="">— Seleccionar primario —</option>
            {otherProducts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} {p.serie ? `(${p.serie})` : ""}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Acciones */}
      <div className="flex gap-3 pt-2 border-t border-border">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 rounded-xl border border-border text-sm font-medium
                     hover:bg-secondary transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !name.trim()}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                     bg-accent text-accent-foreground text-sm font-semibold
                     hover:bg-accent/90 transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
          ) : (
            <><Save className="w-4 h-4" /> {initialData ? "Actualizar Producto" : "Crear Producto"}</>
          )}
        </button>
      </div>
    </form>
  );
}
