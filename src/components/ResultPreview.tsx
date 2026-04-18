import React from 'react';
import { Download, Sparkles, ArrowRight, Tag } from 'lucide-react';

interface ResultPreviewProps {
  originalImage: string;
  processedImage: string;
  summaryText?: string;
  tags?: string[];
  onDownload?: () => void;
}

export const ResultPreview: React.FC<ResultPreviewProps> = ({
  originalImage,
  processedImage,
  summaryText = 'Análisis completado con éxito.',
  tags = [],
  onDownload,
}) => {
  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      // Fallback simple para descargar la imagen procesada
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = 'imagen_procesada_sayervision.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 lg:p-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-zinc-800 dark:text-zinc-100 mb-2 flex items-center gap-2">
            <Sparkles className="text-blue-500" size={28} />
            Resultado del Análisis
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            Comparativa entre tu imagen original y el resultado procesado
          </p>
        </div>
        <button
          onClick={handleDownload}
          className="group flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <Download size={20} className="group-hover:animate-bounce" />
          Descargar Resultado
        </button>
      </div>

      {/* Before / After Images */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] items-center gap-6 mb-8">
        {/* Original */}
        <div className="flex flex-col gap-3 group">
          <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 px-2 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-600"></span>
            Original
          </span>
          <div className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 aspect-video lg:aspect-square group-hover:shadow-lg transition-all duration-300">
            <img 
              src={originalImage} 
              alt="Original" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Divider / Arrow */}
        <div className="hidden md:flex justify-center text-zinc-400 dark:text-zinc-600">
          <ArrowRight size={32} />
        </div>

        {/* Processed */}
        <div className="flex flex-col gap-3 group">
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 px-2 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Procesada
          </span>
          <div className="relative rounded-2xl overflow-hidden border-2 border-blue-400 dark:border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.15)] bg-zinc-100 dark:bg-zinc-800 aspect-video lg:aspect-square group-hover:shadow-[0_0_30px_rgba(59,130,246,0.25)] transition-all duration-300">
            <img 
              src={processedImage} 
              alt="Procesada" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>
      </div>

      {/* Summary and Tags Section */}
      <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800">
        <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-3">
          Resumen del Análisis
        </h3>
        <p className="text-zinc-600 dark:text-zinc-300 mb-4 leading-relaxed">
          {summaryText}
        </p>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700/50">
            <Tag size={16} className="text-zinc-400 mr-1" />
            {tags.map((tag, idx) => (
              <span 
                key={idx}
                className="px-3 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-full text-xs font-medium shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
