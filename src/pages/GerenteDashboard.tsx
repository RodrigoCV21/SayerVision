import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { useProducts, type Product, type ProductInput } from "@/hooks/useProducts";
import { useVendedores, type Vendedor, type VendedorInput } from "@/hooks/useVendedores";
import { useClientes, type Cliente, type ClienteInput } from "@/hooks/useClientes";
import { useVault } from "@/hooks/useVault";
import { getUsersByRole } from "@/lib/localDb";
import { ProductForm } from "@/components/admin/ProductForm";
import { UserForm } from "@/components/shared/UserForm";
import {
  ArrowLeft, Boxes, Users, UserPlus, FolderOpen, LogOut,
  Plus, Pencil, Trash2, Loader2, ChevronDown, ChevronUp,
  Mail, User, Image, ShoppingBag, Palette,
} from "lucide-react";

type GerenteView = "dashboard" | "productos" | "vendedores" | "clientes" | "bovedas";

export default function GerenteDashboard() {
  const navigate = useNavigate();
  const { signOut, user } = useAuthContext();

  // Hooks
  const { products, isLoading: isLoadingProducts, createProduct, updateProduct, deleteProduct } = useProducts();
  const { vendedores, isLoading: isLoadingVendedores, createVendedor, updateVendedor, deleteVendedor } = useVendedores();
  const { clientes, isLoading: isLoadingClientes, createCliente, updateCliente, deleteCliente } = useClientes();
  const vault = useVault();

  const [activeView, setActiveView] = useState<GerenteView>("dashboard");

  // Product state
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Vendedor state
  const [showVendedorForm, setShowVendedorForm] = useState(false);
  const [editingVendedor, setEditingVendedor] = useState<Vendedor | null>(null);
  const [deletingVendedorId, setDeletingVendedorId] = useState<string | null>(null);

  // Cliente state
  const [showClienteForm, setShowClienteForm] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [deletingClienteId, setDeletingClienteId] = useState<string | null>(null);

  // Boveda state
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedClientId) {
      vault.fetchImages(selectedClientId);
    }
  }, [selectedClientId]);

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  const handleBack = () => {
    if (activeView === "dashboard") {
      navigate("/app");
    } else {
      setActiveView("dashboard");
      setShowProductForm(false);
      setShowVendedorForm(false);
      setShowClienteForm(false);
      setEditingProduct(null);
      setEditingVendedor(null);
      setEditingCliente(null);
    }
  };

  // ── Dashboard Cards ─────────────────────────────────
  const renderDashboard = () => (
    <div className="space-y-8">
      <h2 className="font-display text-3xl font-bold text-center">
        Bienvenido, <span className="text-accent">(Gerente)</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { id: "productos" as const, label: "Gestionar productos", icon: Boxes },
          { id: "vendedores" as const, label: "Gestionar vendedores", icon: Users },
          { id: "clientes" as const, label: "Gestionar Clientes", icon: UserPlus },
          { id: "bovedas" as const, label: "Gestionar bovedas", icon: FolderOpen },
        ].map((card) => (
          <button
            key={card.id}
            onClick={() => setActiveView(card.id)}
            className="group flex flex-col items-center justify-center gap-4 p-8 rounded-3xl
                       bg-accent text-accent-foreground shadow-medium
                       hover:shadow-xl hover:scale-[1.02] transition-all duration-300 min-h-[200px]"
          >
            <card.icon className="w-12 h-12 opacity-90 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-lg">{card.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // ── Productos View ──────────────────────────────────
  const renderProductos = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display">Gestión de Productos</h2>
          <p className="text-muted-foreground">Catálogo de productos Sayer</p>
        </div>
        {!showProductForm && !editingProduct && (
          <button onClick={() => setShowProductForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-xl font-medium hover:bg-accent/90 transition-colors">
            <Plus className="w-4 h-4" /> Nuevo Producto
          </button>
        )}
      </div>

      {(showProductForm || editingProduct) && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <ProductForm
            initialData={editingProduct || undefined}
            products={products}
            onSubmit={async (input) => {
              if (editingProduct) {
                await updateProduct(editingProduct.id, input);
                setEditingProduct(null);
              } else {
                await createProduct(input);
                setShowProductForm(false);
              }
            }}
            onCancel={() => { setShowProductForm(false); setEditingProduct(null); }}
          />
        </div>
      )}

      {isLoadingProducts ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>
      ) : products.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed border-border rounded-2xl">
          <p className="text-muted-foreground">No hay productos registrados aún.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
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
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); setEditingProduct(product); }}
                    className="p-2 text-muted-foreground hover:text-accent hover:bg-accent/10 rounded-lg transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={async (e) => { e.stopPropagation(); if (confirm("¿Eliminar este producto?")) { setDeletingProductId(product.id); await deleteProduct(product.id); setDeletingProductId(null); } }}
                    disabled={deletingProductId === product.id}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50">
                    {deletingProductId === product.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                  {expandedProduct === product.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>
              {expandedProduct === product.id && (
                <div className="px-4 pb-4 text-sm text-muted-foreground space-y-1 border-t border-border pt-3">
                  {product.description && <p>{product.description}</p>}
                  {product.features?.length > 0 && <p><strong>Características:</strong> {product.features.join(", ")}</p>}
                  {product.applicable_surfaces?.length > 0 && <p><strong>Superficies:</strong> {product.applicable_surfaces.join(", ")}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ── Vendedores View ─────────────────────────────────
  const renderVendedores = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display">Gestión de Vendedores</h2>
          <p className="text-muted-foreground">Administra el personal de ventas</p>
        </div>
        {!showVendedorForm && !editingVendedor && (
          <button onClick={() => setShowVendedorForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-xl font-medium hover:bg-accent/90 transition-colors">
            <Plus className="w-4 h-4" /> Nuevo Vendedor
          </button>
        )}
      </div>

      {(showVendedorForm || editingVendedor) && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <UserForm
            roleName="Vendedor"
            initialData={editingVendedor || undefined}
            onSubmit={(input) => {
              if (editingVendedor) {
                updateVendedor(editingVendedor.user_id, input as { full_name?: string; email?: string });
                setEditingVendedor(null);
              } else {
                createVendedor(input as VendedorInput);
                setShowVendedorForm(false);
              }
            }}
            onCancel={() => { setShowVendedorForm(false); setEditingVendedor(null); }}
          />
        </div>
      )}

      {isLoadingVendedores ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>
      ) : vendedores.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed border-border rounded-2xl">
          <p className="text-muted-foreground">No hay vendedores registrados aún.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {vendedores.map((v) => (
            <div key={v.user_id} className="glass-card rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-semibold">{v.full_name || "Sin nombre"}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3" />{v.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setEditingVendedor(v)}
                  className="p-2 text-muted-foreground hover:text-accent hover:bg-accent/10 rounded-lg transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => { if (confirm("¿Eliminar este vendedor?")) { setDeletingVendedorId(v.user_id); deleteVendedor(v.user_id); setDeletingVendedorId(null); } }}
                  disabled={deletingVendedorId === v.user_id}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50">
                  {deletingVendedorId === v.user_id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ── Clientes View ───────────────────────────────────
  const renderClientes = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display">Gestión de Clientes</h2>
          <p className="text-muted-foreground">Administra los clientes del sistema</p>
        </div>
        {!showClienteForm && !editingCliente && (
          <button onClick={() => setShowClienteForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-xl font-medium hover:bg-accent/90 transition-colors">
            <Plus className="w-4 h-4" /> Nuevo Cliente
          </button>
        )}
      </div>

      {(showClienteForm || editingCliente) && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <UserForm
            roleName="Cliente"
            initialData={editingCliente || undefined}
            onSubmit={(input) => {
              if (editingCliente) {
                updateCliente(editingCliente.user_id, input as { full_name?: string; email?: string });
                setEditingCliente(null);
              } else {
                createCliente(input as ClienteInput);
                setShowClienteForm(false);
              }
            }}
            onCancel={() => { setShowClienteForm(false); setEditingCliente(null); }}
          />
        </div>
      )}

      {isLoadingClientes ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>
      ) : clientes.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed border-border rounded-2xl">
          <p className="text-muted-foreground">No hay clientes registrados aún.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {clientes.map((c) => (
            <div key={c.user_id} className="glass-card rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-semibold">{c.full_name || "Sin nombre"}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3" />{c.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setEditingCliente(c)}
                  className="p-2 text-muted-foreground hover:text-accent hover:bg-accent/10 rounded-lg transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => { if (confirm("¿Eliminar este cliente?")) { setDeletingClienteId(c.user_id); deleteCliente(c.user_id); setDeletingClienteId(null); } }}
                  disabled={deletingClienteId === c.user_id}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50">
                  {deletingClienteId === c.user_id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ── Bóvedas View ────────────────────────────────────
  const allClientes = getUsersByRole("cliente");

  const renderBovedas = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-display">Bóvedas de Clientes</h2>
        <p className="text-muted-foreground">Consulta, actualiza y elimina elementos en bóvedas</p>
      </div>

      {/* Client selector */}
      <div>
        <label className="block text-sm font-medium mb-2">Seleccionar cliente:</label>
        <select
          value={selectedClientId || ""}
          onChange={(e) => setSelectedClientId(e.target.value || null)}
          className="w-full max-w-md px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
        >
          <option value="">— Selecciona un cliente —</option>
          {allClientes.map((c) => (
            <option key={c.id} value={c.id}>{c.full_name || c.email} ({c.email})</option>
          ))}
        </select>
      </div>

      {selectedClientId && (
        <div className="space-y-6">
          {/* Uploaded images */}
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-3">
              <Image className="w-5 h-5 text-accent" /> Imágenes Subidas
            </h3>
            {vault.uploadedImages.length === 0 ? (
              <div className="p-6 text-center border-2 border-dashed border-border rounded-2xl">
                <p className="text-muted-foreground text-sm">Este cliente no tiene imágenes subidas.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {vault.uploadedImages.map((img) => (
                  <div key={img.id} className="relative group rounded-2xl overflow-hidden shadow-soft">
                    <img src={img.image_url} alt="Imagen subida" className="w-full h-40 object-cover" />
                    <button onClick={() => vault.removeImage(img.id)}
                      className="absolute top-2 right-2 p-1.5 bg-destructive/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <p className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white text-xs">
                      {new Date(img.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assigned paintings */}
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-3">
              <ShoppingBag className="w-5 h-5 text-accent" /> Pinturas Asignadas
            </h3>
            {vault.assignedPaintings.length === 0 ? (
              <div className="p-6 text-center border-2 border-dashed border-border rounded-2xl">
                <p className="text-muted-foreground text-sm">No hay pinturas asignadas a este cliente.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {vault.assignedPaintings.map((item) => (
                  <div key={item.id} className="glass-card rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Palette className="w-5 h-5 text-accent" />
                      <div>
                        <p className="font-semibold">{item.product_name || "Producto"}</p>
                        <p className="text-sm text-muted-foreground">
                          Asignado por: {item.vendor_name || "Desconocido"} — {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => vault.removeImage(item.id)}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={handleBack} className="p-2 hover:bg-accent/10 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-display text-xl font-bold">Panel de Gerente</h1>
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
        {activeView === "productos" && renderProductos()}
        {activeView === "vendedores" && renderVendedores()}
        {activeView === "clientes" && renderClientes()}
        {activeView === "bovedas" && renderBovedas()}
      </main>
    </div>
  );
}
