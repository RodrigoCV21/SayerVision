import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
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

  const fetchGerentes = useCallback(async () => {
    setIsLoading(true);

    // 1. Get all user_ids with role "gerente"
    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("user_id, created_at")
      .eq("role", "gerente");

    if (roleError) {
      console.error("Error fetching gerente roles:", roleError);
      toast.error("Error al cargar gerentes");
      setIsLoading(false);
      return;
    }

    if (!roleData || roleData.length === 0) {
      setGerentes([]);
      setIsLoading(false);
      return;
    }

    const userIds = roleData.map((r) => r.user_id);

    // 2. Get profiles for those user_ids
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("user_id, email, full_name, created_at")
      .in("user_id", userIds);

    if (profileError) {
      console.error("Error fetching profiles:", profileError);
      toast.error("Error al cargar perfiles de gerentes");
      setIsLoading(false);
      return;
    }

    // Merge role created_at with profile data
    const gerenteList: Gerente[] = (profileData || []).map((profile) => {
      const roleEntry = roleData.find((r) => r.user_id === profile.user_id);
      return {
        user_id: profile.user_id,
        email: profile.email || "",
        full_name: profile.full_name,
        created_at: roleEntry?.created_at || profile.created_at,
      };
    });

    setGerentes(gerenteList);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchGerentes();
  }, [fetchGerentes]);

  /**
   * Create a new gerente:
   * 1. Sign up the user via Supabase Auth (this auto-creates profile + 'user' role via trigger)
   * 2. Update their role from 'user' to 'gerente'
   */
  const createGerente = async (input: GerenteInput): Promise<boolean> => {
    // Save the current admin session before creating a new user
    const { data: currentSessionData } = await supabase.auth.getSession();
    const currentSession = currentSessionData.session;

    if (!currentSession) {
      toast.error("No hay sesión activa. Inicia sesión de nuevo.");
      return false;
    }

    // Sign up new user (this will change the active session!)
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          full_name: input.full_name || "",
        },
      },
    });

    if (signUpError) {
      toast.error("Error al crear gerente: " + signUpError.message);
      // Restore admin session in case it was partially changed
      await supabase.auth.setSession({
        access_token: currentSession.access_token,
        refresh_token: currentSession.refresh_token,
      });
      return false;
    }

    const newUserId = signUpData.user?.id;
    if (!newUserId) {
      toast.error("No se pudo obtener el ID del nuevo usuario");
      await supabase.auth.setSession({
        access_token: currentSession.access_token,
        refresh_token: currentSession.refresh_token,
      });
      return false;
    }

    // Restore admin session IMMEDIATELY so subsequent queries use admin's permissions
    await supabase.auth.setSession({
      access_token: currentSession.access_token,
      refresh_token: currentSession.refresh_token,
    });

    // Update existing 'user' role to 'gerente'
    const { error: updateRoleError } = await supabase
      .from("user_roles")
      .update({ role: "gerente" as any })
      .eq("user_id", newUserId);

    if (updateRoleError) {
      // Might not exist yet if trigger hasn't fired; try insert instead
      const { error: insertRoleError } = await supabase
        .from("user_roles")
        .insert({ user_id: newUserId, role: "gerente" as any });

      if (insertRoleError) {
        toast.error("Error al asignar rol de gerente: " + insertRoleError.message);
        return false;
      }
    }

    toast.success("Gerente creado exitosamente");
    await fetchGerentes();
    return true;
  };

  /**
   * Update a gerente's profile (full_name and/or email)
   */
  const updateGerente = async (
    userId: string,
    updates: { full_name?: string; email?: string }
  ): Promise<boolean> => {
    const { error } = await supabase
      .from("profiles")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (error) {
      toast.error("Error al actualizar gerente: " + error.message);
      return false;
    }

    toast.success("Gerente actualizado");
    await fetchGerentes();
    return true;
  };

  /**
   * Delete a gerente:
   * 1. Remove the 'gerente' role (set back to 'user')
   * Note: We don't delete the auth user from the client; that requires admin API.
   * Instead we simply revoke the gerente role.
   */
  const deleteGerente = async (userId: string): Promise<boolean> => {
    const { error } = await supabase
      .from("user_roles")
      .update({ role: "user" as any })
      .eq("user_id", userId);

    if (error) {
      toast.error("Error al eliminar gerente: " + error.message);
      return false;
    }

    toast.success("Gerente eliminado (rol revocado)");
    await fetchGerentes();
    return true;
  };

  return {
    gerentes,
    isLoading,
    fetchGerentes,
    createGerente,
    updateGerente,
    deleteGerente,
  };
}
