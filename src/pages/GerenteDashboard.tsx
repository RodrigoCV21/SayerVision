import { useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { Users, UserPlus, ShoppingBag, FolderOpen, LogOut, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function GerenteDashboard() {
  const { user, signOut } = useAuthContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"productos" | "vendedores" | "clientes" | "bovedas">("vendedores");

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-display text-xl font-bold text-foreground hover:text-accent transition-colors">
              SayerVisionAI
            </Link>
            <span className="text-sm px-2 py-1 rounded bg-accent/10 text-accent font-medium">
              Panel de Gerente
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-2">
          <button
            onClick={() => setActiveTab("vendedores")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              activeTab === "vendedores" ? "bg-accent text-accent-foreground shadow-md" : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
            }`}
          >
            <Users className="w-5 h-5" />
            Vendedores
          </button>
          <button
            onClick={() => setActiveTab("clientes")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              activeTab === "clientes" ? "bg-accent text-accent-foreground shadow-md" : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
            }`}
          >
            <UserPlus className="w-5 h-5" />
            Clientes
          </button>
          <button
            onClick={() => setActiveTab("productos")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              activeTab === "productos" ? "bg-accent text-accent-foreground shadow-md" : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            Productos
          </button>
          <button
            onClick={() => setActiveTab("bovedas")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              activeTab === "bovedas" ? "bg-accent text-accent-foreground shadow-md" : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
            }`}
          >
            <FolderOpen className="w-5 h-5" />
            Bóvedas
          </button>
        </aside>

        {/* Content Area */}
        <section className="flex-1 glass-card rounded-3xl p-6 md:p-8 min-h-[500px]">
          {activeTab === "vendedores" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold font-display">Gestión de Vendedores</h2>
                  <p className="text-muted-foreground">Administra el personal de ventas</p>
                </div>
                <button className="px-4 py-2 bg-accent text-accent-foreground rounded-xl font-medium hover:bg-accent/90 transition-colors">
                  + Nuevo Vendedor
                </button>
              </div>
              <div className="p-8 text-center border-2 border-dashed border-border rounded-2xl">
                <p className="text-muted-foreground">No hay vendedores registrados aún.</p>
              </div>
            </div>
          )}

          {activeTab === "clientes" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold font-display">Gestión de Clientes</h2>
                  <p className="text-muted-foreground">Administra los clientes del sistema</p>
                </div>
                <button className="px-4 py-2 bg-accent text-accent-foreground rounded-xl font-medium hover:bg-accent/90 transition-colors">
                  + Nuevo Cliente
                </button>
              </div>
              <div className="p-8 text-center border-2 border-dashed border-border rounded-2xl">
                <p className="text-muted-foreground">No hay clientes registrados aún.</p>
              </div>
            </div>
          )}

          {activeTab === "productos" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold font-display">Gestión de Productos</h2>
                  <p className="text-muted-foreground">Catálogo de productos (CRUD)</p>
                </div>
                <button className="px-4 py-2 bg-accent text-accent-foreground rounded-xl font-medium hover:bg-accent/90 transition-colors">
                  + Nuevo Producto
                </button>
              </div>
              <div className="p-8 text-center border-2 border-dashed border-border rounded-2xl">
                <p className="text-muted-foreground">Próximamente: Lista de productos</p>
              </div>
            </div>
          )}

          {activeTab === "bovedas" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold font-display">Bóvedas de Clientes</h2>
                  <p className="text-muted-foreground">Consulta, actualiza y elimina elementos en bóvedas</p>
                </div>
              </div>
              <div className="p-8 text-center border-2 border-dashed border-border rounded-2xl">
                <p className="text-muted-foreground">Selecciona un cliente para ver su bóveda.</p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
