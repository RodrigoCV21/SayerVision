import { useState, useEffect, useCallback } from "react";
import { getUsersByRole, createUser, updateUser, deleteUser, type LocalUser } from "@/lib/localDb";
import { toast } from "sonner";

export interface Cliente {
  user_id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

export interface ClienteInput {
  email: string;
  password: string;
  full_name?: string;
}

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClientes = useCallback(() => {
    setIsLoading(true);
    const users = getUsersByRole("cliente");
    const list: Cliente[] = users.map((u: LocalUser) => ({
      user_id: u.id,
      email: u.email,
      full_name: u.full_name,
      created_at: u.created_at,
    }));
    setClientes(list);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  const createCliente = useCallback(
    (input: ClienteInput): boolean => {
      const user = createUser({
        email: input.email,
        password: input.password,
        full_name: input.full_name || "",
        role: "cliente",
      });
      if (!user) {
        toast.error("Error: ese email ya está registrado");
        return false;
      }
      toast.success("Cliente creado exitosamente");
      fetchClientes();
      return true;
    },
    [fetchClientes]
  );

  const updateCliente = useCallback(
    (userId: string, updates: { full_name?: string; email?: string }): boolean => {
      const success = updateUser(userId, updates);
      if (!success) {
        toast.error("Error al actualizar cliente");
        return false;
      }
      toast.success("Cliente actualizado");
      fetchClientes();
      return true;
    },
    [fetchClientes]
  );

  const deleteCliente = useCallback(
    (userId: string): boolean => {
      const success = deleteUser(userId);
      if (!success) {
        toast.error("Error al eliminar cliente");
        return false;
      }
      toast.success("Cliente eliminado");
      fetchClientes();
      return true;
    },
    [fetchClientes]
  );

  return {
    clientes,
    isLoading,
    fetchClientes,
    createCliente,
    updateCliente,
    deleteCliente,
  };
}
