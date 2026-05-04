import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { Eye, EyeOff, Loader2, Palette } from "lucide-react";
import { toast } from "sonner";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const { signIn, isAuthenticated, isAdmin, isGerente, isVendedor, isCliente, isLoading } =
    useAuthContext();
  const navigate = useNavigate();

  // Redirect authenticated users to their panel
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (isAdmin) {
        navigate("/admin");
      } else if (isGerente) {
        navigate("/gerente");
      } else if (isVendedor) {
        navigate("/vendedor");
      } else if (isCliente) {
        navigate("/boveda");
      } else {
        navigate("/app");
      }
    }
  }, [isAuthenticated, isAdmin, isGerente, isVendedor, isCliente, isLoading, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!email.trim() || !password.trim()) {
      setFormError("Ingresa tu email y contraseña");
      return;
    }

    setIsSubmitting(true);

    const { user, error } = signIn(email, password);

    if (error || !user) {
      setFormError("Credenciales incorrectas");
      toast.error("Credenciales incorrectas");
    } else {
      const roleNames: Record<string, string> = {
        admin: "Administrador",
        gerente: "Gerente",
        vendedor: "Vendedor",
        cliente: "Cliente",
      };
      toast.success(`¡Bienvenido ${roleNames[user.role] || "Usuario"}!`);
    }

    setIsSubmitting(false);
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
              <h1 className="font-display text-2xl font-bold">SayerVisionAI</h1>
              <p className="text-sm text-muted-foreground">Iniciar Sesión</p>
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
                onChange={(e) => { setEmail(e.target.value); setFormError(""); }}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background 
                         focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setFormError(""); }}
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
            </div>

            {formError && (
              <p className="text-destructive text-sm text-center">{formError}</p>
            )}

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
