import { Check } from "lucide-react";

export type ColorOption = "moss-green" | "wine-red" | "pastel-yellow";

interface ColorPaletteProps {
  selectedColor: ColorOption | null;
  onSelectColor: (color: ColorOption) => void;
}

const colors: { id: ColorOption; name: string; bgClass: string }[] = [
  { id: "moss-green", name: "Verde Musgo", bgClass: "bg-moss" },
  { id: "wine-red", name: "Rojo Vino", bgClass: "bg-wine" },
  { id: "pastel-yellow", name: "Amarillo Pastel", bgClass: "bg-pastel" },
];

export function ColorPalette({ selectedColor, onSelectColor }: ColorPaletteProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Selecciona el color</h3>
      <div className="flex gap-4 flex-wrap">
        {colors.map((color) => (
          <button
            key={color.id}
            onClick={() => onSelectColor(color.id)}
            className={`color-swatch ${color.bgClass} ${
              selectedColor === color.id ? "selected" : ""
            } flex items-center justify-center`}
            title={color.name}
          >
            {selectedColor === color.id && (
              <Check className="w-6 h-6 text-white drop-shadow-md" />
            )}
          </button>
        ))}
      </div>
      {selectedColor && (
        <p className="text-sm text-muted-foreground">
          Color seleccionado: <span className="font-medium text-foreground">
            {colors.find(c => c.id === selectedColor)?.name}
          </span>
        </p>
      )}
    </div>
  );
}
