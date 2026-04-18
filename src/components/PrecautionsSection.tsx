import React from 'react';
import { Wind, Flame, ShieldAlert, Baby, AlertTriangle } from 'lucide-react';

export const PrecautionsSection: React.FC = () => {
  const precautions = [
    {
      title: 'Uso de mascarilla',
      description: 'Utiliza protección respiratoria adecuada para evitar la inhalación de vapores tóxicos o polvos finos.',
      icon: ShieldAlert,
    },
    {
      title: 'Ventilación adecuada',
      description: 'Asegúrate de aplicar en espacios abiertos o mantener un flujo de aire constante en interiores.',
      icon: Wind,
    },
    {
      title: 'Fuera del alcance',
      description: 'Mantén este producto, solventes y herramientas alejados de niños pequeños y mascotas.',
      icon: Baby,
    },
    {
      title: 'Líquido inflamable',
      description: 'Evita estrictamente la exposición al calor excesivo, chispas o llamas abiertas durante su uso.',
      icon: Flame,
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Contenedor principal con fondo de advertencia suave */}
      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-3xl p-6 lg:p-10 shadow-sm transition-all duration-300">
        
        {/* Header de la sección */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-xl text-amber-600 dark:text-amber-500 mt-1 shadow-inner">
              <AlertTriangle size={28} />
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-amber-900 dark:text-amber-500 mb-2">
                Precauciones de Uso
              </h2>
              <p className="text-amber-800/70 dark:text-amber-400/70 text-sm max-w-2xl font-medium">
                Tu seguridad es primero. Sigue estas recomendaciones estándar de la industria al aplicar pinturas para prevenir accidentes o problemas de salud.
              </p>
            </div>
          </div>
        </div>

        {/* Grid de tarjetas de precauciones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {precautions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl p-6 border border-amber-100 dark:border-amber-900/30 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden"
              >
                {/* Acento decorativo superior */}
                <div className="absolute top-0 left-0 w-full h-1 bg-amber-200 dark:bg-amber-800/50 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-500 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:bg-amber-200 dark:group-hover:bg-amber-900/60">
                  <Icon size={24} />
                </div>
                
                <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-2">
                  {item.title}
                </h3>
                
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
