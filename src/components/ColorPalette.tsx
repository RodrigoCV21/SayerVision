import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface ColorPaletteProps {
  colors: string[];
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({ colors }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = async (color: string, index: number) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Error al copiar el color: ', err);
    }
  };

  if (!colors || colors.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">Paleta de Colores</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">Esperando colores para mostrar...</p>
        </div>
        <div className="flex items-center justify-center h-32 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700">
          <p className="text-zinc-400 dark:text-zinc-500">Ningún color disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 transition-all duration-300 hover:shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">Paleta de Colores</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Colores detectados o recomendados basados en el análisis</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {colors.map((color, index) => (
          <div 
            key={`${color}-${index}`} 
            className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            {/* Area de muestra de color */}
            <div 
              className="relative w-full h-24 sm:h-32 transition-colors cursor-pointer"
              style={{ backgroundColor: color }}
              onClick={() => copyToClipboard(color, index)}
              title="Haz clic para copiar"
            >
              {/* Overlay (capa sobrepuesta) en hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 dark:group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="bg-white/90 dark:bg-zinc-900/90 p-2 rounded-full shadow-sm backdrop-blur-sm transform scale-90 group-hover:scale-100 transition-transform">
                  {copiedIndex === index ? (
                    <Check size={20} className="text-green-600 dark:text-green-400" />
                  ) : (
                    <Copy size={20} className="text-zinc-700 dark:text-zinc-300" />
                  )}
                </div>
              </div>
            </div>
            
            {/* Detalles y Acciones */}
            <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-800">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200 uppercase tracking-wide">
                {color}
              </span>
              <button
                onClick={() => copyToClipboard(color, index)}
                className="p-1.5 rounded-md text-zinc-500 hover:bg-white hover:shadow-sm dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100 transition-all"
                title="Copiar color"
              >
                {copiedIndex === index ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
