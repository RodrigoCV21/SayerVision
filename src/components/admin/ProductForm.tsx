import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload, Save, AlertCircle } from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  price: z.coerce.number({ invalid_type_error: 'El precio debe ser un número' }).positive('El precio debe ser mayor a 0'),
  colorCode: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Debe ser un código hexadecimal válido (ej. #FF0000)'),
  link: z.string().url('Debe ser un enlace válido (ej. https://...)'),
  image: z.any().refine((files) => files?.length > 0, 'La imagen es obligatoria')
});

type ProductFormValues = z.infer<typeof productSchema>;

export const ProductForm: React.FC = () => {
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = async (data: ProductFormValues) => {
    // Aquí iría la lógica para enviar a tu API/backend (Supabase, etc.)
    console.log('Datos enviados:', data);
    alert('¡Producto validado y listo para guardar! (Revisa la consola)');
  };

  // Manejar la vista previa de la imagen al seleccionarla
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  // Observar el campo de color para mostrar una muestra en vivo
  const watchedColor = watch('colorCode');
  const isValidHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(watchedColor || '');

  return (
    <div className="w-full max-w-2xl mx-auto p-6 lg:p-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">Agregar Nuevo Producto</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          Completa los datos para registrar una nueva pintura en el catálogo.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Nombre del Producto */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Nombre del Producto
          </label>
          <input
            {...register('name')}
            className={`w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
              errors.name ? 'border-red-500 dark:border-red-500' : 'border-zinc-200 dark:border-zinc-700'
            }`}
            placeholder="Ej. Pintura Acrílica Premium"
          />
          {errors.name && (
            <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.name.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Precio */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Precio (MXN)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">$</span>
              <input
                type="number"
                step="0.01"
                {...register('price')}
                className={`w-full pl-8 pr-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                  errors.price ? 'border-red-500 dark:border-red-500' : 'border-zinc-200 dark:border-zinc-700'
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.price && (
              <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} /> {errors.price.message}
              </p>
            )}
          </div>

          {/* Color Hexadecimal */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Código de Color (Hex)
            </label>
            <div className="relative flex items-center">
              <input
                {...register('colorCode')}
                className={`w-full pl-4 pr-12 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                  errors.colorCode ? 'border-red-500 dark:border-red-500' : 'border-zinc-200 dark:border-zinc-700'
                }`}
                placeholder="#FF0000"
              />
              <div 
                className="absolute right-3 w-6 h-6 rounded-md border border-zinc-200 dark:border-zinc-600 shadow-inner transition-colors duration-300"
                style={{ backgroundColor: isValidHex ? watchedColor : 'transparent' }}
              />
            </div>
            {errors.colorCode && (
              <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} /> {errors.colorCode.message}
              </p>
            )}
          </div>
        </div>

        {/* Enlace de Compra */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Enlace de Compra
          </label>
          <input
            {...register('link')}
            className={`w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
              errors.link ? 'border-red-500 dark:border-red-500' : 'border-zinc-200 dark:border-zinc-700'
            }`}
            placeholder="https://tulugardecompra.com/producto"
          />
          {errors.link && (
            <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.link.message}
            </p>
          )}
        </div>

        {/* Selector de Imagen */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Imagen del Producto
          </label>
          
          <div className="flex items-center gap-6">
            <div className={`flex-1 relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-colors hover:border-blue-500 bg-zinc-50 dark:bg-zinc-800/50 ${errors.image ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'}`}>
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                {...register('image', {
                  onChange: handleImageChange
                })}
              />
              <Upload className={`mb-2 ${errors.image ? 'text-red-400' : 'text-zinc-400'}`} size={28} />
              <span className={`text-sm font-medium ${errors.image ? 'text-red-500' : 'text-zinc-600 dark:text-zinc-400'}`}>
                Haz clic para subir imagen
              </span>
            </div>

            {/* Vista Previa Mini */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 shadow-inner">
              {preview ? (
                <img src={preview} alt="Vista previa" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-zinc-400 text-center px-2">Sin imagen</span>
              )}
            </div>
          </div>
          {errors.image && (
            <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.image.message as string}
            </p>
          )}
        </div>

        {/* Botón de Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            {isSubmitting ? 'Guardando producto...' : 'Guardar Producto'}
          </button>
        </div>

      </form>
    </div>
  );
};
