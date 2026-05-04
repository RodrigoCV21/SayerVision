/**
 * LocalDB — Motor de datos local usando localStorage.
 * Reemplaza Supabase Auth y tablas de roles/perfiles para demo.
 * Supabase se mantiene SOLO para la Edge Function de IA y lectura de productos.
 */

// ── Types ──────────────────────────────────────────────

export type AppRole = "admin" | "gerente" | "vendedor" | "cliente";

export interface LocalUser {
  id: string;
  email: string;
  password: string; // stored as-is for demo (not production!)
  full_name: string;
  role: AppRole;
  created_at: string;
}

export interface VaultImage {
  id: string;
  client_id: string;
  image_url: string;
  type: "uploaded" | "assigned_painting";
  assigned_by?: string; // vendedor/gerente user_id
  product_id?: string;
  created_at: string;
}

export interface LocalProduct {
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

// ── Keys ───────────────────────────────────────────────

const KEYS = {
  USERS: "sayer_users",
  CURRENT_USER: "sayer_current_user",
  PRODUCTS: "sayer_products",
  VAULT_IMAGES: "sayer_vault_images",
  INITIALIZED: "sayer_db_initialized",
} as const;

// ── Helpers ────────────────────────────────────────────

function generateId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function read<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// ── Seed Data ──────────────────────────────────────────

const SEED_USERS: LocalUser[] = [
  {
    id: generateId(),
    email: "admin@sayervision.com",
    password: "Admin1234",
    full_name: "Administrador General",
    role: "admin",
    created_at: new Date().toISOString(),
  },
  {
    id: generateId(),
    email: "andres@gmail.com",
    password: "AndSE23bjUY284nm",
    full_name: "Subejefe de desarrollo Andrés",
    role: "admin",
    created_at: new Date().toISOString(),
  },
  {
    id: generateId(),
    email: "gerente@sayervision.com",
    password: "Gerente1234",
    full_name: "Gerente Demo",
    role: "gerente",
    created_at: new Date().toISOString(),
  },
  {
    id: generateId(),
    email: "vendedor@sayervision.com",
    password: "Vendedor1234",
    full_name: "Vendedor Demo",
    role: "vendedor",
    created_at: new Date().toISOString(),
  },
  {
    id: generateId(),
    email: "cliente@sayervision.com",
    password: "Cliente1234",
    full_name: "Cliente Demo",
    role: "cliente",
    created_at: new Date().toISOString(),
  },
];

// ── Initialization ─────────────────────────────────────

export function initLocalDb(): void {
  if (localStorage.getItem(KEYS.INITIALIZED)) return;
  write(KEYS.USERS, SEED_USERS);
  write(KEYS.VAULT_IMAGES, []);
  localStorage.setItem(KEYS.INITIALIZED, "true");
}

// ── Auth ───────────────────────────────────────────────

export function login(email: string, password: string): LocalUser | null {
  const users = read<LocalUser>(KEYS.USERS);
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (user) {
    // Store current user without password
    const safeUser = { ...user };
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(safeUser));
    return safeUser;
  }
  return null;
}

export function logout(): void {
  localStorage.removeItem(KEYS.CURRENT_USER);
}

export function getCurrentUser(): LocalUser | null {
  try {
    const raw = localStorage.getItem(KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ── Users CRUD ─────────────────────────────────────────

export function getUsers(): LocalUser[] {
  return read<LocalUser>(KEYS.USERS);
}

export function getUsersByRole(role: AppRole): LocalUser[] {
  return read<LocalUser>(KEYS.USERS).filter((u) => u.role === role);
}

export function getUserById(id: string): LocalUser | null {
  return read<LocalUser>(KEYS.USERS).find((u) => u.id === id) ?? null;
}

export function createUser(input: {
  email: string;
  password: string;
  full_name: string;
  role: AppRole;
}): LocalUser | null {
  const users = read<LocalUser>(KEYS.USERS);

  // Check duplicate email
  if (users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
    return null; // email already exists
  }

  const newUser: LocalUser = {
    id: generateId(),
    email: input.email,
    password: input.password,
    full_name: input.full_name,
    role: input.role,
    created_at: new Date().toISOString(),
  };

  users.push(newUser);
  write(KEYS.USERS, users);
  return newUser;
}

export function updateUser(
  id: string,
  updates: Partial<Pick<LocalUser, "email" | "full_name" | "password" | "role">>
): boolean {
  const users = read<LocalUser>(KEYS.USERS);
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return false;

  // If changing email, check for duplicates
  if (updates.email) {
    const dup = users.find(
      (u) => u.email.toLowerCase() === updates.email!.toLowerCase() && u.id !== id
    );
    if (dup) return false;
  }

  users[idx] = { ...users[idx], ...updates };
  write(KEYS.USERS, users);

  // If updating the current user, refresh the session
  const current = getCurrentUser();
  if (current && current.id === id) {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(users[idx]));
  }

  return true;
}

export function deleteUser(id: string): boolean {
  const users = read<LocalUser>(KEYS.USERS);
  const filtered = users.filter((u) => u.id !== id);
  if (filtered.length === users.length) return false;
  write(KEYS.USERS, filtered);
  return true;
}

// ── Products (Local fallback) ──────────────────────────

export function getLocalProducts(): LocalProduct[] {
  return read<LocalProduct>(KEYS.PRODUCTS);
}

export function createLocalProduct(input: Omit<LocalProduct, "id" | "created_at" | "updated_at">): LocalProduct {
  const products = read<LocalProduct>(KEYS.PRODUCTS);
  const now = new Date().toISOString();
  const product: LocalProduct = {
    ...input,
    id: generateId(),
    created_at: now,
    updated_at: now,
  };
  products.push(product);
  write(KEYS.PRODUCTS, products);
  return product;
}

export function updateLocalProduct(id: string, updates: Partial<LocalProduct>): boolean {
  const products = read<LocalProduct>(KEYS.PRODUCTS);
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  products[idx] = { ...products[idx], ...updates, updated_at: new Date().toISOString() };
  write(KEYS.PRODUCTS, products);
  return true;
}

export function deleteLocalProduct(id: string): boolean {
  const products = read<LocalProduct>(KEYS.PRODUCTS);
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  write(KEYS.PRODUCTS, filtered);
  return true;
}

// ── Vault Images ───────────────────────────────────────

export function getVaultImages(clientId?: string): VaultImage[] {
  const images = read<VaultImage>(KEYS.VAULT_IMAGES);
  return clientId ? images.filter((i) => i.client_id === clientId) : images;
}

export function addVaultImage(input: Omit<VaultImage, "id" | "created_at">): VaultImage {
  const images = read<VaultImage>(KEYS.VAULT_IMAGES);
  const image: VaultImage = {
    ...input,
    id: generateId(),
    created_at: new Date().toISOString(),
  };
  images.push(image);
  write(KEYS.VAULT_IMAGES, images);
  return image;
}

export function deleteVaultImage(id: string): boolean {
  const images = read<VaultImage>(KEYS.VAULT_IMAGES);
  const filtered = images.filter((i) => i.id !== id);
  if (filtered.length === images.length) return false;
  write(KEYS.VAULT_IMAGES, filtered);
  return true;
}
