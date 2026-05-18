import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  getLocalProducts,
  createLocalProduct,
  updateLocalProduct,
  deleteLocalProduct,
} from "@/lib/localDb";
import { toast } from "sonner";

export interface Product {
  id: string;
  name: string;
  serie: string | null;
  category: string;
  description: string | null;
  features: string[];
  applicable_surfaces: string[];
  environmental_conditions: string[];
  precautions: string[];
  requires_primer: boolean;
  primer_product_id: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  price: number;
}

export interface ProductInput {
  name: string;
  serie?: string;
  category: string;
  description?: string;
  features?: string[];
  applicable_surfaces?: string[];
  environmental_conditions?: string[];
  precautions?: string[];
  requires_primer?: boolean;
  primer_product_id?: string;
  price?: number;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useLocal, setUseLocal] = useState(false);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Pure local mode for demo stability
    const localProducts = getLocalProducts();
    setProducts(localProducts as Product[]);
    setUseLocal(true);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const createProduct = async (input: ProductInput): Promise<Product | null> => {
    // Always create locally (avoids Supabase RLS issues)
    const product = createLocalProduct({
      name: input.name,
      serie: input.serie || null,
      category: input.category,
      description: input.description || null,
      features: input.features || [],
      applicable_surfaces: input.applicable_surfaces || [],
      environmental_conditions: input.environmental_conditions || [],
      precautions: input.precautions || [],
      requires_primer: input.requires_primer || false,
      primer_product_id: input.primer_product_id || null,
      price: input.price ?? 0,
      created_by: null,
    });

    toast.success("Producto creado exitosamente");
    await fetchProducts();
    return product as Product;
  };

  const updateProduct = async (id: string, input: Partial<ProductInput>): Promise<boolean> => {
    let supabaseSuccess = false;

    // Try Supabase first if not in local mode
    if (!useLocal) {
      try {
        const { error: supabaseError } = await supabase
          .from("products")
          .update({ ...input, updated_at: new Date().toISOString() })
          .eq("id", id);

        if (!supabaseError) {
          supabaseSuccess = true;
        } else {
          console.warn("Supabase update failed (likely missing 'price' column), falling back to local storage:", supabaseError);
        }
      } catch (err) {
        console.warn("Supabase exception during update:", err);
      }
    }

    if (supabaseSuccess) {
      toast.success("Producto actualizado");
      await fetchProducts();
      return true;
    }

    // Local fallback
    const success = updateLocalProduct(id, input as any);
    if (success) {
      toast.success("Producto actualizado localmente");
      await fetchProducts();
      return true;
    }

    // If it's a Supabase product that failed to update remotely, 
    // we save it as a local override.
    const originalProduct = products.find(p => p.id === id);
    if (originalProduct) {
      createLocalProduct({
        ...originalProduct,
        ...input,
        id: id // preserve ID
      } as any);
      toast.success("Cambios guardados localmente");
      await fetchProducts();
      return true;
    }

    toast.error("Error al actualizar producto");
    return false;
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    // Try Supabase first if not in local mode
    if (!useLocal) {
      try {
        const { error } = await supabase
          .from("products")
          .delete()
          .eq("id", id);

        if (!error) {
          toast.success("Producto eliminado");
          await fetchProducts();
          return true;
        }
      } catch {
        // Fall through to local
      }
    }

    // Local fallback
    const success = deleteLocalProduct(id);
    if (success) {
      toast.success("Producto eliminado");
      await fetchProducts();
      return true;
    }

    toast.error("Error al eliminar producto");
    return false;
  };

  return {
    products,
    isLoading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
