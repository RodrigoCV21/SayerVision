import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { useVault } from "@/hooks/useVault";
import {
  ArrowLeft, LogOut, Camera, ShoppingBag, Trash2,
  Palette, Image,
} from "lucide-react";

type ClienteView = "dashboard" | "imagenes" | "pinturas";

export default function ClienteDashboard() {
  const navigate = useNavigate();
  const { signOut, user } = useAuthContext();
  const vault = useVault(user?.id);

  const [activeView, setActiveView] = useState<ClienteView>("dashboard");

  useEffect(() => {
    if (user?.id) {
      vault.fetchImages(user.id);
    }
  }, [user?.id]);

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  const handleBack = () => {
    if (activeView === "dashboard") {
      navigate("/app");
    } else {
      setActiveView("dashboard");
    }
  };

  // ── Dashboard ───────────────────────────────────────
  const renderDashboard = () => (
    <div className="space-y-8">
      <h2 className="font-display text-3xl font-bold text-center">
        Bienvenido, <span className="text-accent">(Cliente)</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <button onClick={() => setActiveView("imagenes")}
          className="group flex flex-col items-center justify-center gap-4 p-8 rounded-3xl
                     bg-accent text-accent-foreground shadow-medium
                     hover:shadow-xl hover:scale-[1.02] transition-all duration-300 min-h-[200px]">
          <Camera className="w-12 h-12 opacity-90 group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-lg">Mis Imagenes subidas</span>
        </button>
        <button onClick={() => setActiveView("pinturas")}
          className="group flex flex-col items-center justify-center gap-4 p-8 rounded-3xl
                     bg-accent text-accent-foreground shadow-medium
                     hover:shadow-xl hover:scale-[1.02] transition-all duration-300 min-h-[200px]">
          <ShoppingBag className="w-12 h-12 opacity-90 group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-lg">Pinturas seleccionadas</span>
        </button>
      </div>
    </div>
  );

  // ── Mis Imágenes Subidas ────────────────────────────
  const renderImagenes = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-display flex items-center gap-2">
          <Image className="w-6 h-6 text-accent" /> Mis Imágenes Subidas
        </h2>
        <p className="text-muted-foreground">Historial de imágenes enviadas a la herramienta de IA</p>
      </div>

      {vault.uploadedImages.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed border-border rounded-2xl space-y-3">
          <Camera className="w-12 h-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">No tienes imágenes subidas aún.</p>
          <button onClick={() => navigate("/app")}
            className="px-4 py-2 bg-accent text-accent-foreground rounded-xl font-medium hover:bg-accent/90 transition-colors">
            Ir a la herramienta de IA
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {vault.uploadedImages.map((img) => (
            <div key={img.id} className="relative group rounded-2xl overflow-hidden shadow-soft bg-card">
              <img src={img.image_url} alt="Imagen subida" className="w-full h-48 object-cover" />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white text-sm">{new Date(img.created_at).toLocaleDateString("es-MX", {
                  year: "numeric", month: "short", day: "numeric"
                })}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ── Pinturas Seleccionadas ──────────────────────────
  const renderPinturas = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-display flex items-center gap-2">
          <Palette className="w-6 h-6 text-accent" /> Pinturas Seleccionadas
        </h2>
        <p className="text-muted-foreground">Productos asignados por tu vendedor</p>
      </div>

      {vault.assignedPaintings.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed border-border rounded-2xl space-y-3">
          <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">Aún no tienes pinturas asignadas.</p>
          <p className="text-sm text-muted-foreground">Tu vendedor podrá asignarte productos recomendados.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {vault.assignedPaintings.map((item) => (
            <div key={item.id} className="glass-card rounded-2xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                  <Palette className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-lg">{item.product_name || "Producto"}</p>
                  <p className="text-sm text-muted-foreground">
                    Asignado por: <strong>{item.vendor_name || "Vendedor"}</strong>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.created_at).toLocaleDateString("es-MX", {
                      year: "numeric", month: "long", day: "numeric"
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={handleBack} className="p-2 hover:bg-accent/10 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-display text-xl font-bold">Panel de Cliente</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleSignOut}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors">
            <LogOut className="w-4 h-4" /> Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-8">
        {activeView === "dashboard" && renderDashboard()}
        {activeView === "imagenes" && renderImagenes()}
        {activeView === "pinturas" && renderPinturas()}
      </main>
    </div>
  );
}
