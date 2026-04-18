import { useCallback, useState, useRef } from "react";
import { Upload, ImageIcon, X } from "lucide-react";

interface ImageUploaderProps {
  onImageSelect: (base64: string) => void;
  currentImage: string | null;
  onClear: () => void;
}

export function ImageUploader({ onImageSelect, currentImage, onClear }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      onImageSelect(base64);
    };
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  if (currentImage) {
    return (
      <div className="relative group">
        <div className="rounded-2xl overflow-hidden shadow-medium bg-card">
          <img
            src={currentImage}
            alt="Imagen subida"
            className="w-full h-auto max-h-[500px] object-contain"
          />
        </div>
        <button
          onClick={onClear}
          className="absolute top-4 right-4 p-2 rounded-full bg-card/90 backdrop-blur-sm shadow-md 
                     opacity-0 group-hover:opacity-100 transition-opacity duration-200
                     hover:bg-destructive hover:text-destructive-foreground"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`upload-zone flex flex-col items-center justify-center min-h-[300px] ${
        isDragging ? "dragover" : ""
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
      
      <div className="p-4 rounded-full bg-accent/10 mb-6">
        {isDragging ? (
          <ImageIcon className="w-10 h-10 text-accent" />
        ) : (
          <Upload className="w-10 h-10 text-muted-foreground" />
        )}
      </div>
      
      <h3 className="text-lg font-semibold mb-2">
        {isDragging ? "Suelta la imagen aquí" : "Sube tu imagen"}
      </h3>
      <p className="text-muted-foreground text-sm text-center max-w-xs">
        Arrastra y suelta una imagen o haz clic para seleccionar
      </p>
      <p className="text-muted-foreground/60 text-xs mt-2">
        PNG, JPG, WEBP hasta 10MB
      </p>
    </div>
  );
}
