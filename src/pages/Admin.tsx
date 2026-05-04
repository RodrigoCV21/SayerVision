import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { useProducts, Product, ProductInput } from "@/hooks/useProducts";
import { useGerentes, Gerente, GerenteInput } from "@/hooks/useGerentes";
import { 
  Plus, Pencil, Trash2, ArrowLeft, Package, Loader2, 
  AlertTriangle, ChevronDown, ChevronUp, Users, Boxes, Mail, User
} from "lucide-react";
import { ProductForm } from "@/components/admin/ProductForm";
import { GerenteForm } from "@/components/admin/GerenteForm";
import { toast } from "sonner";

type AdminView = "dashboard" | "productos" | "gerentes";

export default function Admin() {
  const navigate = useNavigate();
  const { signOut, user } = useAuthContext();
  const { products, isLoading, createProduct, updateProduct, deleteProduct } = useProducts();
  const {
    gerentes,
    isLoading: isLoadingGerentes,
    createGerente,
    updateGerente,
    deleteGerente,
  } = useGerentes();
  
  const [activeView, setActiveView] = useState<AdminView>("dashboard");

  // Product state
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Gerente state
  const [showGerenteForm, setShowGerenteForm] = useState(false);
  const [editingGerente, setEditingGerente] = useState<Gerente | null>(null);
  const [deletingGerenteId, setDeletingGerenteId] = useState<string | null>(null);

  const handleCreate = async (input: ProductInput) => {
    const result = await createProduct(input);
    if (result) {
      setShowForm(false);
    }
  };

  const handleUpdate = async (input: ProductInput) => {
    if (!editingProduct) return;
    const success = await updateProduct(editingProduct.id, input);
    if (success) {
      setEditingProduct(null);
    }
  };

  
  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;
    setDeletingId(id);
    await deleteProduct(id);
    setDeletingId(null);
  };

  // Gerente handlers
  const handleCreateGerente = (input: GerenteInput) => {
    const success = createGerente(input);
    if (success) {
      setShowGerenteForm(false);
    }
  };

  const handleUpdateGerente = (input: { full_name?: string; email?: string }) => {
    if (!editingGerente) return;
    const success = updateGerente(editingGerente.user_id, input);
    if (success) {
      setEditingGerente(null);
    }
  };

  const handleDeleteGerente = (userId: string) => {
    if (!confirm("¿Estás seguro de eliminar este gerente?")) return;
    setDeletingGerenteId(userId);
    deleteGerente(userId);
    setDeletingGerenteId(null);
  };

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  const handleBack = () => {
    if (activeView === "dashboard") {
      navigate("/");
    } else {
      setActiveView("dashboard");
    }
  };

  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-display text-xl font-bold">Panel de Administración</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* ── Dashboard Landing ── */}
      {activeView === "dashboard" && (
        <main className="max-w-4xl mx-auto px-4 py-16 flex flex-col items-center">
          <h2 className="text-3xl font-display font-bold mb-12 text-center">
            Bienvenido, <span className="text-accent">(Administrador)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-lg">
            {/* Card – Gestionar Productos */}
            <button
              id="admin-card-productos"
              onClick={() => setActiveView("productos")}
              className="group relative flex flex-col items-center justify-center gap-4
                         aspect-square rounded-2xl
                         bg-accent/85 text-white
                         shadow-lg hover:shadow-xl
                         transition-all duration-300 ease-out
                         hover:scale-[1.04] hover:bg-accent
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              <Boxes className="w-14 h-14 opacity-90 group-hover:opacity-100 transition-opacity" />
              <span className="text-lg font-semibold tracking-wide">Gestionar Productos</span>
            </button>

            {/* Card – Gestionar Gerentes */}
            <button
              id="admin-card-gerentes"
              onClick={() => setActiveView("gerentes")}
              className="group relative flex flex-col items-center justify-center gap-4
                         aspect-square rounded-2xl
                         bg-accent/85 text-white
                         shadow-lg hover:shadow-xl
                         transition-all duration-300 ease-out
                         hover:scale-[1.04] hover:bg-accent
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              <Users className="w-14 h-14 opacity-90 group-hover:opacity-100 transition-opacity" />
              <span className="text-lg font-semibold tracking-wide">Gestionar Gerentes</span>
            </button>
          </div>
        </main>
      )}

      {/* ── Productos Section (existing CRUD) ── */}
      {activeView === "productos" && (
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Actions */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-display font-semibold">Catálogo de Productos</h2>
              <p className="text-muted-foreground">{products.length} productos registrados</p>
            </div>
            <button
              onClick={() => {
                setEditingProduct(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-accent-foreground
                       font-medium hover:bg-accent/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nuevo Producto
            </button>
          </div>

          {/* Form Modal */}
          {(showForm || editingProduct) && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-card rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-border">
                  <h3 className="text-xl font-display font-semibold">
                    {editingProduct ? "Editar Producto" : "Nuevo Producto"}
                  </h3>
                </div>
                <ProductForm
                  initialData={editingProduct || undefined}
                  products={products}
                  onSubmit={editingProduct ? handleUpdate : handleCreate}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                  }}
                />
              </div>
            </div>
          )}

          {/* Products List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No hay productos registrados</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 text-accent hover:underline"
              >
                Crear el primer producto
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
                <div key={category}>
                  <h3 className="text-lg font-medium text-muted-foreground mb-4 uppercase tracking-wide">
                    {category}
                  </h3>
                  <div className="space-y-3">
                    {categoryProducts.map((product) => (
                      <div
                        key={product.id}
                        className="bg-card border border-border rounded-xl overflow-hidden"
                      >
                        <div
                          className="p-4 flex items-center justify-between cursor-pointer hover:bg-secondary/50 transition-colors"
                          onClick={() => setExpandedProduct(
                            expandedProduct === product.id ? null : product.id
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                              <Package className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{product.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {product.serie && `Serie: ${product.serie} • `}
                                {product.applicable_surfaces.length} superficies
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingProduct(product);
                              }}
                              className="p-2 rounded-lg hover:bg-secondary transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(product.id);
                              }}
                              disabled={deletingId === product.id}
                              className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors
                                       disabled:opacity-50"
                            >
                              {deletingId === product.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                            {expandedProduct === product.id ? (
                              <ChevronUp className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                        </div>

                        {expandedProduct === product.id && (
                          <div className="px-4 pb-4 pt-2 border-t border-border space-y-4">
                            {product.description && (
                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Descripción</p>
                                <p className="text-sm">{product.description}</p>
                              </div>
                            )}
                            
                            {product.features.length > 0 && (
                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Características</p>
                                <ul className="text-sm list-disc list-inside">
                                  {product.features.map((f, i) => <li key={i}>{f}</li>)}
                                </ul>
                              </div>
                            )}

                            {product.applicable_surfaces.length > 0 && (
                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Superficies de Uso</p>
                                <div className="flex flex-wrap gap-2">
                                  {product.applicable_surfaces.map((s, i) => (
                                    <span key={i} className="px-2 py-1 bg-secondary rounded-lg text-xs">
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {product.environmental_conditions.length > 0 && (
                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Condiciones Ambientales</p>
                                <ul className="text-sm list-disc list-inside">
                                  {product.environmental_conditions.map((c, i) => <li key={i}>{c}</li>)}
                                </ul>
                              </div>
                            )}

                            {product.precautions.length > 0 && (
                              <div className="bg-wine/5 border border-wine/20 rounded-lg p-3">
                                <div className="flex items-center gap-2 text-wine mb-2">
                                  <AlertTriangle className="w-4 h-4" />
                                  <span className="text-sm font-medium">Precauciones</span>
                                </div>
                                <ul className="text-sm list-disc list-inside text-muted-foreground">
                                  {product.precautions.map((p, i) => <li key={i}>{p}</li>)}
                                </ul>
                              </div>
                            )}

                            {product.requires_primer && (
                              <div className="bg-accent/5 border border-accent/20 rounded-lg p-3">
                                <p className="text-sm font-medium text-accent">
                                  Requiere primario antes de aplicar
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* ── Gerentes Section (full CRUD) ── */}
      {activeView === "gerentes" && (
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Actions */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-display font-semibold">Gestión de Gerentes</h2>
              <p className="text-muted-foreground">{gerentes.length} gerentes registrados</p>
            </div>
            <button
              onClick={() => {
                setEditingGerente(null);
                setShowGerenteForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-accent-foreground
                       font-medium hover:bg-accent/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nuevo Gerente
            </button>
          </div>

          {/* Gerente Form Modal */}
          {(showGerenteForm || editingGerente) && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-card rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-border">
                  <h3 className="text-xl font-display font-semibold">
                    {editingGerente ? "Editar Gerente" : "Nuevo Gerente"}
                  </h3>
                </div>
                <GerenteForm
                  initialData={editingGerente || undefined}
                  onSubmit={editingGerente ? handleUpdateGerente : (input) => handleCreateGerente(input as GerenteInput)}
                  onCancel={() => {
                    setShowGerenteForm(false);
                    setEditingGerente(null);
                  }}
                />
              </div>
            </div>
          )}

          {/* Gerentes List */}
          {isLoadingGerentes ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : gerentes.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No hay gerentes registrados</p>
              <button
                onClick={() => setShowGerenteForm(true)}
                className="mt-4 text-accent hover:underline"
              >
                Crear el primer gerente
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {gerentes.map((gerente) => (
                <div
                  key={gerente.user_id}
                  className="bg-card border border-border rounded-xl p-4 flex items-center justify-between
                           hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold">
                        {gerente.full_name || "Sin nombre"}
                      </h4>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Mail className="w-3.5 h-3.5" />
                        {gerente.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-accent/10
                                   text-accent text-xs font-medium">
                      Gerente
                    </span>
                    <button
                      onClick={() => setEditingGerente(gerente)}
                      className="p-2 rounded-lg hover:bg-secondary transition-colors"
                      title="Editar gerente"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteGerente(gerente.user_id)}
                      disabled={deletingGerenteId === gerente.user_id}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors
                               disabled:opacity-50"
                      title="Revocar rol de gerente"
                    >
                      {deletingGerenteId === gerente.user_id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}
    </div>
  );
}
