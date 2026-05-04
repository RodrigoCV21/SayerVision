import { useState, useEffect, useCallback } from "react";
import { getUsersByRole, createUser, updateUser, deleteUser, type LocalUser } from "@/lib/localDb";
import { toast } from "sonner";

export interface Vendedor {
  user_id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

export interface VendedorInput {
  email: string;
  password: string;
  full_name?: string;
}

export function useVendedores() {
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVendedores = useCallback(() => {
    setIsLoading(true);
    const users = getUsersByRole("vendedor");
    const list: Vendedor[] = users.map((u: LocalUser) => ({
      user_id: u.id,
      email: u.email,
      full_name: u.full_name,
      created_at: u.created_at,
    }));
    setVendedores(list);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchVendedores();
  }, [fetchVendedores]);

  const createVendedor = useCallback(
    (input: VendedorInput): boolean => {
      const user = createUser({
        email: input.email,
        password: input.password,
        full_name: input.full_name || "",
        role: "vendedor",
      });
      if (!user) {
        toast.error("Error: ese email ya está registrado");
        return false;
      }
      toast.success("Vendedor creado exitosamente");
      fetchVendedores();
      return true;
    },
    [fetchVendedores]
  );

  const updateVendedor = useCallback(
    (userId: string, updates: { full_name?: string; email?: string }): boolean => {
      const success = updateUser(userId, updates);
      if (!success) {
        toast.error("Error al actualizar vendedor");
        return false;
      }
      toast.success("Vendedor actualizado");
      fetchVendedores();
      return true;
    },
    [fetchVendedores]
  );

  const deleteVendedor = useCallback(
    (userId: string): boolean => {
      const success = deleteUser(userId);
      if (!success) {
        toast.error("Error al eliminar vendedor");
        return false;
      }
      toast.success("Vendedor eliminado");
      fetchVendedores();
      return true;
    },
    [fetchVendedores]
  );

  return {
    vendedores,
    isLoading,
    fetchVendedores,
    createVendedor,
    updateVendedor,
    deleteVendedor,
  };
}
