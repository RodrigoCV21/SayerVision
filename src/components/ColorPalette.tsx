import { Check } from "lucide-react";

export type ColorOption = string; // Now we use hex or id directly

interface ColorDef {
  id: string;
  name: string;
  hex: string;
  group: string;
}

const colors: ColorDef[] = [
  // VIVOS
  { id: "v-rojo", name: "Rojo", hex: "#FF0000", group: "COLORES VIVOS" },
  { id: "v-rojo-naranja", name: "Rojo naranja", hex: "#FF4500", group: "COLORES VIVOS" },
  { id: "v-naranja", name: "Naranja", hex: "#FFA500", group: "COLORES VIVOS" },
  { id: "v-ambar", name: "Ámbar", hex: "#FFBF00", group: "COLORES VIVOS" },
  { id: "v-amarillo", name: "Amarillo", hex: "#FFFF00", group: "COLORES VIVOS" },
  { id: "v-lima", name: "Lima", hex: "#BFFF00", group: "COLORES VIVOS" },
  { id: "v-verde", name: "Verde (puro)", hex: "#008000", group: "COLORES VIVOS" },
  { id: "v-verde-cian", name: "Verde cian", hex: "#00FF7F", group: "COLORES VIVOS" },
  { id: "v-cian", name: "Cian", hex: "#00FFFF", group: "COLORES VIVOS" },
  { id: "v-ceruleo", name: "Cerúleo", hex: "#007BA7", group: "COLORES VIVOS" },
  { id: "v-azul", name: "Azul", hex: "#0000FF", group: "COLORES VIVOS" },
  { id: "v-violeta", name: "Violeta", hex: "#8F00FF", group: "COLORES VIVOS" },
  { id: "v-magenta", name: "Magenta", hex: "#FF00FF", group: "COLORES VIVOS" },
  { id: "v-fucsia", name: "Fucsia", hex: "#FF00FF", group: "COLORES VIVOS" },

  // CLAROS
  { id: "c-coral", name: "Coral", hex: "#FF7F50", group: "CLAROS" },
  { id: "c-salmon", name: "Salmón", hex: "#FA8072", group: "CLAROS" },
  { id: "c-melon", name: "Melón", hex: "#FFDAB9", group: "CLAROS" },
  { id: "c-crema", name: "Crema", hex: "#FFFDD0", group: "CLAROS" },
  { id: "c-maiz", name: "Maíz", hex: "#FBEC5D", group: "CLAROS" },
  { id: "c-te-verde", name: "Té verde", hex: "#D0F0C0", group: "CLAROS" },
  { id: "c-verde-claro", name: "Verde claro", hex: "#90EE90", group: "CLAROS" },
  { id: "c-menta", name: "Menta", hex: "#98FF98", group: "CLAROS" },
  { id: "c-aguamarina", name: "Aguamarina", hex: "#7FFFD4", group: "CLAROS" },
  { id: "c-celeste", name: "Celeste", hex: "#87CEEB", group: "CLAROS" },
  { id: "c-bigaro", name: "Bígaro", hex: "#CCCCFF", group: "CLAROS" },
  { id: "c-lavanda", name: "Lavanda", hex: "#E6E6FA", group: "CLAROS" },
  { id: "c-malva", name: "Malva", hex: "#E0B0FF", group: "CLAROS" },
  { id: "c-rosado", name: "Rosado", hex: "#FFC0CB", group: "CLAROS" },

  // AGRISADOS
  { id: "a-lacre", name: "Lacre", hex: "#7C0A02", group: "AGRISADOS" },
  { id: "a-cobre", name: "Cobre", hex: "#B87333", group: "AGRISADOS" },
  { id: "a-canela", name: "Canela", hex: "#D2691E", group: "AGRISADOS" },
  { id: "a-dorado", name: "Dorado", hex: "#D4AF37", group: "AGRISADOS" },
  { id: "a-chartreuse", name: "Chartreuse", hex: "#7FFF00", group: "AGRISADOS" },
  { id: "a-verde-manzana", name: "Verde manzana", hex: "#8DB600", group: "AGRISADOS" },
  { id: "a-verde-bosque", name: "Verde bosque", hex: "#228B22", group: "AGRISADOS" },
  { id: "a-verde-mar", name: "Verde mar", hex: "#2E8B57", group: "AGRISADOS" },
  { id: "a-turquesa", name: "Turquesa", hex: "#40E0D0", group: "AGRISADOS" },
  { id: "a-azul-acero", name: "Azul acero", hex: "#4682B4", group: "AGRISADOS" },
  { id: "a-zafiro", name: "Zafiro", hex: "#0F52BA", group: "AGRISADOS" },
  { id: "a-amatista", name: "Amatista", hex: "#9966CC", group: "AGRISADOS" },
  { id: "a-purpureo", name: "Purpúreo", hex: "#800080", group: "AGRISADOS" },
  { id: "a-fandango", name: "Fandango", hex: "#B53389", group: "AGRISADOS" },

  // OSCUROS
  { id: "o-granate", name: "Granate", hex: "#800000", group: "OSCUROS" },
  { id: "o-caoba", name: "Caoba", hex: "#C04000", group: "OSCUROS" },
  { id: "o-marron", name: "Marrón", hex: "#8B4513", group: "OSCUROS" },
  { id: "o-marron-dorado", name: "Marrón dorado", hex: "#996515", group: "OSCUROS" },
  { id: "o-oliva", name: "Oliva", hex: "#808000", group: "OSCUROS" },
  { id: "o-verde-palta", name: "Verde palta", hex: "#568203", group: "OSCUROS" },
  { id: "o-verde-estandar", name: "Verde (estándar)", hex: "#008000", group: "OSCUROS" },
  { id: "o-esmeralda", name: "Esmeralda", hex: "#50C878", group: "OSCUROS" },
  { id: "o-cerceta", name: "Cerceta", hex: "#008080", group: "OSCUROS" },
  { id: "o-añil", name: "Añil", hex: "#4B0082", group: "OSCUROS" },
  { id: "o-azul-marino", name: "Azul marino", hex: "#000080", group: "OSCUROS" },
  { id: "o-azul-purpura", name: "Azul púrpura", hex: "#6A5ACD", group: "OSCUROS" },
  { id: "o-purpura", name: "Púrpura", hex: "#800080", group: "OSCUROS" },
  { id: "o-vino", name: "Vino", hex: "#722F37", group: "OSCUROS" },

  // NEUTROS
  { id: "n-blanco", name: "Blanco", hex: "#FFFFFF", group: "NEUTROS" },
  { id: "n-plateado", name: "Plateado", hex: "#C0C0C0", group: "NEUTROS" },
  { id: "n-gris", name: "Gris", hex: "#808080", group: "NEUTROS" },
  { id: "n-plomo", name: "Plomo", hex: "#778899", group: "NEUTROS" },
  { id: "n-negro", name: "Negro", hex: "#000000", group: "NEUTROS" },
];

const groups = ["COLORES VIVOS", "CLAROS", "AGRISADOS", "OSCUROS", "NEUTROS"];

interface ColorPaletteProps {
  selectedColor: ColorOption | null;
  onSelectColor: (colorId: string) => void;
}

export function ColorPalette({ selectedColor, onSelectColor }: ColorPaletteProps) {
  return (
    <div className="space-y-4 w-full">
      <div>
        <h3 className="font-semibold text-lg">Selecciona el color</h3>
        <p className="text-sm text-muted-foreground mt-1">
          💡 Puedes combinar la selección de color con una descripción detallada de la superficie.
        </p>
      </div>

      <div className="max-h-[400px] overflow-y-auto pr-2 space-y-6 custom-scrollbar">
        {groups.map((group) => {
          const groupColors = colors.filter((c) => c.group === group);
          return (
            <div key={group}>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 border-b border-border pb-1">
                {group}
              </p>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-4">
                {groupColors.map((color) => {
                  const isSelected = selectedColor === color.id;
                  return (
                    <div key={color.id} className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => onSelectColor(color.id)}
                        title={color.name}
                        className={`
                          w-10 h-10 rounded-xl cursor-pointer transition-all duration-200 ease-out
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
                      <span className="text-[10px] font-medium text-center leading-tight truncate w-full px-1" title={color.name}>
                        {color.name}
                      </span>
                      <span className="text-[8px] text-muted-foreground font-mono uppercase">
                        {color.hex}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {selectedColor && (
        <div className="flex items-center gap-2 p-3 bg-accent/5 rounded-xl border border-accent/10 animate-in fade-in zoom-in-95 duration-200">
          <div
            className="w-8 h-8 rounded-lg border border-white/20 shadow-sm flex-shrink-0"
            style={{ backgroundColor: colors.find((c) => c.id === selectedColor)?.hex }}
          />
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">Color seleccionado</p>
            <p className="text-sm font-bold text-foreground leading-none">
              {colors.find((c) => c.id === selectedColor)?.name}{" "}
              <span className="text-xs font-mono font-normal text-muted-foreground ml-1">
                ({colors.find((c) => c.id === selectedColor)?.hex})
              </span>
            </p>
          </div>
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

export function getColorHex(id: string): string {
  return colors.find(c => c.id === id)?.hex || "#000000";
}
