import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
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
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .order("category", { ascending: true })
      .order("name", { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
      toast.error("Error al cargar productos");
    } else {
      setProducts(data || []);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const createProduct = async (input: ProductInput): Promise<Product | null> => {
    const { data, error } = await supabase
      .from("products")
      .insert({
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
      })
      .select()
      .single();

    if (error) {
      toast.error("Error al crear producto: " + error.message);
      return null;
    }

    toast.success("Producto creado exitosamente");
    await fetchProducts();
    return data;
  };

  const updateProduct = async (id: string, input: Partial<ProductInput>): Promise<boolean> => {
    const { error } = await supabase
      .from("products")
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      toast.error("Error al actualizar producto: " + error.message);
      return false;
    }

    toast.success("Producto actualizado");
    await fetchProducts();
    return true;
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Error al eliminar producto: " + error.message);
      return false;
    }

    toast.success("Producto eliminado");
    await fetchProducts();
    return true;
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
