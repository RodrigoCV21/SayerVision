import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { z } from "zod";
import { Eye, EyeOff, Loader2, Palette } from "lucide-react";
import { toast } from "sonner";

const authSchema = z.object({
  email: z.string().email("Email inválido").max(255),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").max(72),
});

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { signIn, signUp, isAuthenticated, isAdmin, isLoading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated && isAdmin) {
      navigate("/admin");
    } else if (!isLoading && isAuthenticated && !isAdmin) {
      toast.error("Acceso solo para administradores");
      navigate("/");
    }
  }, [isAuthenticated, isAdmin, isLoading, navigate]);

  const validateForm = () => {
    try {
      authSchema.parse({ email, password });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach((e) => {
          if (e.path[0]) {
            newErrors[e.path[0] as string] = e.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Try to sign in first
      const { error: signInError } = await signIn(email, password);
      
      if (signInError) {
        // If login fails and it's the admin email, try to register first
        if (signInError.message.includes("Invalid login credentials") && 
            email.toLowerCase() === "admin@colorizeai.com") {
          // Try to sign up the admin
          const { error: signUpError } = await signUp(email, password, "Administrador");
          
          if (signUpError) {
            if (signUpError.message.includes("already registered")) {
              toast.error("Credenciales incorrectas");
            } else {
              toast.error(signUpError.message);
            }
            return;
          }
          
          // Now try to sign in again
          const { error: retryError } = await signIn(email, password);
          if (retryError) {
            toast.error("Error al iniciar sesión. Intenta de nuevo.");
            return;
          }
          
          toast.success("¡Cuenta de administrador creada! Bienvenido.");
          return;
        }
        
        toast.error("Credenciales incorrectas");
        return;
      }
      
      toast.success("¡Bienvenido Administrador!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="glass-card rounded-3xl p-8 shadow-medium">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
              <Palette className="w-6 h-6 text-accent" />
            </div>
            <div className="text-center">
              <h1 className="font-display text-2xl font-bold">ColorizeAI</h1>
              <p className="text-sm text-muted-foreground">Panel de Administración</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background 
                         focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                placeholder="tu@email.com"
                required
              />
              {errors.email && (
                <p className="text-destructive text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background 
                           focus:ring-2 focus:ring-accent focus:border-transparent transition-all pr-12"
                  placeholder="••••••••"
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-accent text-accent-foreground font-medium
                       hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
