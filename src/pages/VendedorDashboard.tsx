import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { useProducts, type Product } from "@/hooks/useProducts";
import { useClientes } from "@/hooks/useClientes";
import { useVault } from "@/hooks/useVault";
import {
  ArrowLeft, LogOut, Boxes, ShoppingBag, Loader2,
  ChevronDown, ChevronUp, Search, UserCheck,
} from "lucide-react";
import { toast } from "sonner";

type VendedorView = "dashboard" | "consultar" | "asignar";

export default function VendedorDashboard() {
  const navigate = useNavigate();
  const { signOut, user } = useAuthContext();
  const { products, isLoading: isLoadingProducts } = useProducts();
  const { clientes } = useClientes();
  const vault = useVault();

  const [activeView, setActiveView] = useState<VendedorView>("dashboard");
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Assignment state
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [selectedProductId, setSelectedProductId] = useState<string>("");

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

  const handleAssign = () => {
    if (!selectedClientId || !selectedProductId) {
      toast.error("Selecciona un cliente y un producto");
      return;
    }
    const product = products.find((p) => p.id === selectedProductId);
    vault.addImage({
      client_id: selectedClientId,
      image_url: "",
      type: "assigned_painting",
      assigned_by: user?.id,
      vendor_name: user?.full_name || user?.email || "Vendedor",
      product_id: selectedProductId,
      product_name: product?.name || "Producto",
    });
    setSelectedClientId("");
    setSelectedProductId("");
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.serie && p.serie.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // ── Dashboard ───────────────────────────────────────
  const renderDashboard = () => (
    <div className="space-y-8">
      <h2 className="font-display text-3xl font-bold text-center">
        Bienvenido, <span className="text-accent">(Vendedor)</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <button onClick={() => setActiveView("consultar")}
          className="group flex flex-col items-center justify-center gap-4 p-8 rounded-3xl
                     bg-accent text-accent-foreground shadow-medium
                     hover:shadow-xl hover:scale-[1.02] transition-all duration-300 min-h-[200px]">
          <Boxes className="w-12 h-12 opacity-90 group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-lg">Consultar producto</span>
        </button>
        <button onClick={() => setActiveView("asignar")}
          className="group flex flex-col items-center justify-center gap-4 p-8 rounded-3xl
                     bg-accent text-accent-foreground shadow-medium
                     hover:shadow-xl hover:scale-[1.02] transition-all duration-300 min-h-[200px]">
          <ShoppingBag className="w-12 h-12 opacity-90 group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-lg">Asignar producto</span>
        </button>
      </div>
    </div>
  );

  // ── Consultar productos (Read-only) ─────────────────
  const renderConsultar = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-display">Catálogo de Productos</h2>
        <p className="text-muted-foreground">Consulta la información de los productos disponibles</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre, serie o categoría..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
        />
      </div>

      {isLoadingProducts ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed border-border rounded-2xl">
          <p className="text-muted-foreground">{searchTerm ? "No se encontraron resultados." : "No hay productos disponibles."}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProducts.map((product) => (
            <div key={product.id} className="glass-card rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-accent/5 transition-colors"
                onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}>
                <div className="flex items-center gap-3">
                  <Boxes className="w-5 h-5 text-accent" />
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.serie} — {product.category}</p>
                  </div>
                </div>
                {expandedProduct === product.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
              {expandedProduct === product.id && (
                <div className="px-4 pb-4 text-sm text-muted-foreground space-y-1 border-t border-border pt-3">
                  {product.description && <p>{product.description}</p>}
                  {product.features?.length > 0 && <p><strong>Características:</strong> {product.features.join(", ")}</p>}
                  {product.applicable_surfaces?.length > 0 && <p><strong>Superficies:</strong> {product.applicable_surfaces.join(", ")}</p>}
                  {product.environmental_conditions?.length > 0 && <p><strong>Condiciones:</strong> {product.environmental_conditions.join(", ")}</p>}
                  {product.precautions?.length > 0 && <p><strong>Precauciones:</strong> {product.precautions.join(", ")}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ── Asignar producto a cliente ──────────────────────
  const renderAsignar = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-display">Asignar Producto a Cliente</h2>
        <p className="text-muted-foreground">Selecciona un cliente y un producto para registrar la asignación</p>
      </div>

      <div className="glass-card rounded-2xl p-6 space-y-5 max-w-lg">
        <div>
          <label className="block text-sm font-medium mb-2">Cliente:</label>
          <select value={selectedClientId} onChange={(e) => setSelectedClientId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent focus:border-transparent transition-all">
            <option value="">— Selecciona un cliente —</option>
            {clientes.map((c) => (
              <option key={c.user_id} value={c.user_id}>{c.full_name || c.email}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Producto:</label>
          <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent focus:border-transparent transition-all">
            <option value="">— Selecciona un producto —</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
            ))}
          </select>
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-sm text-muted-foreground mb-3">
            <UserCheck className="w-4 h-4 inline mr-1" />
            Vendedor asignador: <strong>{user?.full_name || user?.email}</strong>
          </p>
          <button onClick={handleAssign}
            disabled={!selectedClientId || !selectedProductId}
            className="w-full py-3 px-4 rounded-xl bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            <ShoppingBag className="w-4 h-4" /> Asignar Producto
          </button>
        </div>
      </div>
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
              <h1 className="font-display text-xl font-bold">Panel de Vendedor</h1>
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
        {activeView === "consultar" && renderConsultar()}
        {activeView === "asignar" && renderAsignar()}
      </main>
    </div>
  );
}
