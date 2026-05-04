import { useState } from "react";
import { Save, Loader2, Eye, EyeOff } from "lucide-react";
import type { Gerente, GerenteInput } from "@/hooks/useGerentes";

interface GerenteFormProps {
  initialData?: Gerente;
  onSubmit: (input: GerenteInput | { full_name?: string; email?: string }) => Promise<void>;
  onCancel: () => void;
}

export function GerenteForm({ initialData, onSubmit, onCancel }: GerenteFormProps) {
  const isEditing = !!initialData;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [fullName, setFullName] = useState(initialData?.full_name ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email inválido";
    }

    if (!isEditing) {
      if (!password) {
        newErrors.password = "La contraseña es requerida";
      } else if (password.length < 8) {
        newErrors.password = "Mínimo 8 caracteres";
      } else if (!/[A-Z]/.test(password)) {
        newErrors.password = "Debe contener al menos una mayúscula";
      } else if (!/[a-z]/.test(password)) {
        newErrors.password = "Debe contener al menos una minúscula";
      } else if (!/[0-9]/.test(password)) {
        newErrors.password = "Debe contener al menos un número";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    if (isEditing) {
      await onSubmit({
        full_name: fullName.trim() || undefined,
        email: email.trim(),
      });
    } else {
      await onSubmit({
        email: email.trim(),
        password,
        full_name: fullName.trim() || undefined,
      } as GerenteInput);
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-5">
      {/* Nombre completo */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">
          Nombre Completo
        </label>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Ej: Juan Pérez"
          className="input-instruction"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">
          Email <span className="text-destructive">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="gerente@empresa.com"
          className="input-instruction"
          required
          disabled={isEditing}
        />
        {errors.email && (
          <p className="text-destructive text-sm mt-1">{errors.email}</p>
        )}
        {isEditing && (
          <p className="text-muted-foreground text-xs mt-1">
            El email no se puede cambiar una vez creado.
          </p>
        )}
      </div>

      {/* Password (only for create) */}
      {!isEditing && (
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">
            Contraseña <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número"
              className="input-instruction pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground
                       hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-destructive text-sm mt-1">{errors.password}</p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2 border-t border-border">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 rounded-xl border border-border text-sm font-medium
                     hover:bg-secondary transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !email.trim()}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                     bg-accent text-accent-foreground text-sm font-semibold
                     hover:bg-accent/90 transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
          ) : (
            <><Save className="w-4 h-4" /> {isEditing ? "Actualizar Gerente" : "Crear Gerente"}</>
          )}
        </button>
      </div>
    </form>
  );
}
