import { useState, useEffect, useCallback } from "react";
import {
  initLocalDb,
  login as localLogin,
  logout as localLogout,
  getCurrentUser,
  type LocalUser,
  type AppRole,
} from "@/lib/localDb";

interface AuthState {
  user: LocalUser | null;
  role: AppRole | null;
  isLoading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    role: null,
    isLoading: true,
  });

  // Initialize local DB and check for existing session
  useEffect(() => {
    initLocalDb();
    const user = getCurrentUser();
    setAuthState({
      user,
      role: user?.role ?? null,
      isLoading: false,
    });
  }, []);

  const signIn = useCallback(
    (email: string, password: string): { user: LocalUser | null; error: string | null } => {
      const user = localLogin(email, password);
      if (user) {
        setAuthState({ user, role: user.role, isLoading: false });
        return { user, error: null };
      }
      return { user: null, error: "Credenciales incorrectas" };
    },
    []
  );

  const signOut = useCallback(() => {
    localLogout();
    setAuthState({ user: null, role: null, isLoading: false });
  }, []);

  // Refresh user from localStorage (useful after CRUD operations)
  const refreshUser = useCallback(() => {
    const user = getCurrentUser();
    setAuthState({
      user,
      role: user?.role ?? null,
      isLoading: false,
    });
  }, []);

  const isAdmin = authState.role === "admin";
  const isGerente = authState.role === "gerente";
  const isVendedor = authState.role === "vendedor";
  const isCliente = authState.role === "cliente";
  const isAuthenticated = !!authState.user;

  return {
    ...authState,
    signIn,
    signOut,
    refreshUser,
    isAdmin,
    isGerente,
    isVendedor,
    isCliente,
    isAuthenticated,
  };
}
