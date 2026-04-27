import { Check } from "lucide-react";

export type ColorOption =
  | "moss-green" | "wine-red" | "pastel-yellow"
  | "primary-red" | "primary-blue" | "primary-yellow"
  | "white" | "black" | "orange" | "purple" | "sky-blue"
  | "beige" | "gray";

interface ColorDef {
  id: ColorOption;
  name: string;
  hex: string;
  group: string;
}

const colors: ColorDef[] = [
  // PRIMARIOS
  { id: "primary-red",    name: "Rojo",           hex: "#CC2200", group: "Colores Primarios" },
  { id: "primary-blue",   name: "Azul",           hex: "#1A3DAA", group: "Colores Primarios" },
  { id: "primary-yellow", name: "Amarillo",       hex: "#F5C800", group: "Colores Primarios" },
  // NEUTROS
  { id: "white",          name: "Blanco",         hex: "#F5F5F0", group: "Neutros" },
  { id: "black",          name: "Negro",          hex: "#1A1A1A", group: "Neutros" },
  { id: "gray",           name: "Gris",           hex: "#7A7A7A", group: "Neutros" },
  { id: "beige",          name: "Beige",          hex: "#D4B896", group: "Neutros" },
  // ESPECIALES (los originales)
  { id: "moss-green",     name: "Verde Musgo",    hex: "#4a6d4a", group: "Especiales" },
  { id: "wine-red",       name: "Rojo Vino",      hex: "#8b3a3a", group: "Especiales" },
  { id: "pastel-yellow",  name: "Amarillo Pastel",hex: "#e8d88a", group: "Especiales" },
  // EXTRAS
  { id: "orange",         name: "Naranja",        hex: "#E8630A", group: "Extras" },
  { id: "purple",         name: "Morado",         hex: "#7B2D8B", group: "Extras" },
  { id: "sky-blue",       name: "Azul Cielo",     hex: "#5EB8DD", group: "Extras" },
];

const groups = ["Colores Primarios", "Neutros", "Especiales", "Extras"];

interface ColorPaletteProps {
  selectedColor: ColorOption | null;
  onSelectColor: (color: ColorOption) => void;
}

export function ColorPalette({ selectedColor, onSelectColor }: ColorPaletteProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-lg">Selecciona el color</h3>
        <p className="text-sm text-muted-foreground mt-1">
          💡 Puedes combinar la selección de color con una descripción detallada de la superficie para un mejor resultado.
        </p>
      </div>

      {groups.map((group) => {
        const groupColors = colors.filter((c) => c.group === group);
        return (
          <div key={group}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {group}
            </p>
            <div className="flex gap-3 flex-wrap">
              {groupColors.map((color) => {
                const isSelected = selectedColor === color.id;
                return (
                  <button
                    key={color.id}
                    onClick={() => onSelectColor(color.id)}
                    title={color.name}
                    className={`
                      w-10 h-10 rounded-full cursor-pointer transition-all duration-200 ease-out
                      flex items-center justify-center
                      ring-2 ring-offset-2 ring-offset-background
                      hover:scale-110 hover:shadow-lg
                      ${isSelected ? "ring-accent scale-110 shadow-lg" : "ring-transparent"}
                    `}
                    style={{ backgroundColor: color.hex }}
                  >
                    {isSelected && (
                      <Check
                        className="w-5 h-5 drop-shadow-md"
                        style={{ color: isLight(color.hex) ? "#333" : "#fff" }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {selectedColor && (
        <div className="flex items-center gap-2 mt-2">
          <div
            className="w-5 h-5 rounded-full border border-border shadow-sm flex-shrink-0"
            style={{ backgroundColor: colors.find((c) => c.id === selectedColor)?.hex }}
          />
          <p className="text-sm text-muted-foreground">
            Color seleccionado:{" "}
            <span className="font-medium text-foreground">
              {colors.find((c) => c.id === selectedColor)?.name}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

/** Determina si un color hex es claro (para elegir el color del check) */
function isLight(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 140;
}
