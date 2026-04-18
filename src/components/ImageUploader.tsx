import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  isLoading?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, isLoading = false }) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.match('image.*')) {
      alert('Por favor selecciona una imagen válida.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    onImageUpload(file);
  };

  const clearImage = () => {
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 transition-all duration-300 hover:shadow-2xl">
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">Sube una Imagen</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Selecciona o arrastra una imagen para analizar</p>
      </div>

      {!preview ? (
        <div
          className={`relative w-full h-64 rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-6 transition-colors duration-300 ${
            dragActive 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-zinc-300 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleChange}
          />
          <div className="w-16 h-16 mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 transition-transform duration-300 hover:scale-110">
            <UploadCloud size={32} />
          </div>
          <p className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-200 text-center">
            Arrastra y suelta tu imagen aquí
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
            PNG, JPG o WEBP (max. 10MB)
          </p>
          <button
            onClick={onButtonClick}
            disabled={isLoading}
            className="px-6 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Examinar archivos
          </button>
        </div>
      ) : (
        <div className="relative w-full h-64 rounded-xl overflow-hidden group border border-zinc-200 dark:border-zinc-800 shadow-inner">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              onClick={clearImage}
              disabled={isLoading}
              className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition-transform hover:scale-110 shadow-lg disabled:opacity-50 disabled:hover:scale-100"
              title="Eliminar imagen"
            >
              <X size={24} />
            </button>
          </div>
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center backdrop-blur-sm text-white">
              <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="font-medium animate-pulse">Analizando imagen...</p>
            </div>
          )}
        </div>
      )}

      {preview && !isLoading && (
        <div className="mt-4 flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <ImageIcon className="text-blue-500" size={20} />
          <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
            Imagen lista para ser analizada
          </p>
        </div>
      )}
    </div>
  );
};
