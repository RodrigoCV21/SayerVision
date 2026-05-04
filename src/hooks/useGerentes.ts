import { useState, useEffect, useCallback } from "react";
import { getUsersByRole, createUser, updateUser, deleteUser, type LocalUser } from "@/lib/localDb";
import { toast } from "sonner";

export interface Gerente {
  user_id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

export interface GerenteInput {
  email: string;
  password: string;
  full_name?: string;
}

export function useGerentes() {
  const [gerentes, setGerentes] = useState<Gerente[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGerentes = useCallback(() => {
    setIsLoading(true);
    const users = getUsersByRole("gerente");
    const list: Gerente[] = users.map((u: LocalUser) => ({
      user_id: u.id,
      email: u.email,
      full_name: u.full_name,
      created_at: u.created_at,
    }));
    setGerentes(list);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchGerentes();
  }, [fetchGerentes]);

  const createGerente = useCallback(
    (input: GerenteInput): boolean => {
      const user = createUser({
        email: input.email,
        password: input.password,
        full_name: input.full_name || "",
        role: "gerente",
      });

      if (!user) {
        toast.error("Error: ese email ya está registrado");
        return false;
      }

      toast.success("Gerente creado exitosamente");
      fetchGerentes();
      return true;
    },
    [fetchGerentes]
  );

  const updateGerente = useCallback(
    (userId: string, updates: { full_name?: string; email?: string }): boolean => {
      const success = updateUser(userId, updates);
      if (!success) {
        toast.error("Error al actualizar gerente");
        return false;
      }
      toast.success("Gerente actualizado");
      fetchGerentes();
      return true;
    },
    [fetchGerentes]
  );

  const deleteGerente = useCallback(
    (userId: string): boolean => {
      const success = deleteUser(userId);
      if (!success) {
        toast.error("Error al eliminar gerente");
        return false;
      }
      toast.success("Gerente eliminado");
      fetchGerentes();
      return true;
    },
    [fetchGerentes]
  );

  return {
    gerentes,
    isLoading,
    fetchGerentes,
    createGerente,
    updateGerente,
    deleteGerente,
  };
}
