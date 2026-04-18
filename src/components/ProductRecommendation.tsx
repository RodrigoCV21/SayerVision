import React from 'react';
import { ShoppingCart, ExternalLink, PaintBucket } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  image: string;
  colorCode: string;
  price: number;
  link: string;
}

interface ProductRecommendationProps {
  products: Product[];
}

export const ProductRecommendation: React.FC<ProductRecommendationProps> = ({ products }) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8 flex items-center gap-3">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
          <PaintBucket size={24} />
        </div>
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-zinc-800 dark:text-zinc-100">
            Productos Recomendados
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Encuentra las pinturas exactas basadas en el análisis de tu imagen
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div 
            key={product.id}
            className="group flex flex-col bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Contenedor de Imagen */}
            <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800 p-6 flex items-center justify-center">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-500 group-hover:scale-110"
              />
              {/* Badge de color superpuesto */}
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-zinc-200 dark:border-zinc-700">
                <span 
                  className="w-4 h-4 rounded-full border border-zinc-200 dark:border-zinc-600 shadow-inner"
                  style={{ backgroundColor: product.colorCode }}
                />
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-200 uppercase tracking-wider">
                  {product.colorCode}
                </span>
              </div>
            </div>

            {/* Detalles del Producto */}
            <div className="p-5 flex flex-col flex-grow">
              <div className="flex-grow">
                <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-1 line-clamp-2 leading-tight">
                  {product.name}
                </h3>
                <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-3">
                  ${product.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>

              {/* Botón de Compra */}
              <a 
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full flex items-center justify-center gap-2 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 rounded-xl font-semibold transition-colors group/btn"
              >
                <ShoppingCart size={18} className="transition-transform group-hover/btn:-translate-x-1" />
                Comprar ahora
                <ExternalLink size={16} className="opacity-70" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
