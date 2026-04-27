import { useCallback, useState, useRef } from "react";
import { Upload, ImageIcon, X, AlertCircle } from "lucide-react";

interface ImageUploaderProps {
  onImageSelect: (base64: string) => void;
  currentImage: string | null;
  onClear: () => void;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/bmp", "image/tiff"];
const ALLOWED_EXTENSIONS = ".jpg,.jpeg,.png,.webp,.bmp,.tiff";
const MAX_SIZE_MB = 10;

export function ImageUploader({ onImageSelect, currentImage, onClear }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [formatError, setFormatError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    setFormatError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setFormatError(
        `Formato no permitido: "${file.name.split(".").pop()?.toUpperCase()}". Solo se aceptan JPG, PNG, WEBP, BMP o TIFF.`
      );
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setFormatError(
        `Archivo demasiado grande (${(file.size / 1024 / 1024).toFixed(1)} MB). El límite es ${MAX_SIZE_MB} MB.`
      );
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
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleClick = () => fileInputRef.current?.click();

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so the same file can be re-selected after an error
    e.target.value = "";
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
    <div className="space-y-3">
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`upload-zone flex flex-col items-center justify-center min-h-[260px] ${
          isDragging ? "dragover" : ""
        } ${formatError ? "border-destructive bg-destructive/5" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_EXTENSIONS}
          onChange={handleFileInput}
          className="hidden"
        />

        <div className={`p-4 rounded-full mb-5 ${isDragging ? "bg-accent/20" : "bg-accent/10"}`}>
          {isDragging ? (
            <ImageIcon className="w-10 h-10 text-accent" />
          ) : (
            <Upload className="w-10 h-10 text-muted-foreground" />
          )}
        </div>

        <h3 className="text-lg font-semibold mb-2">
          {isDragging ? "¡Suelta la imagen aquí!" : "Sube tu imagen"}
        </h3>
        <p className="text-muted-foreground text-sm text-center max-w-xs">
          Arrastra y suelta una imagen o haz clic para seleccionar
        </p>
        <p className="text-muted-foreground/60 text-xs mt-2 font-medium">
          📎 Formatos aceptados: <strong>JPG, PNG, WEBP, BMP, TIFF</strong> — Máx. {MAX_SIZE_MB} MB
        </p>
        <p className="text-muted-foreground/50 text-xs mt-1 text-center max-w-xs">
          💡 Para mejores resultados, usa una foto bien iluminada donde la superficie sea claramente visible.
        </p>
      </div>

      {/* Error de formato */}
      {formatError && (
        <div className="flex items-start gap-3 p-3 rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p className="text-sm">{formatError}</p>
        </div>
      )}
    </div>
  );
}
