export type AppRole = "admin" | "gerente" | "vendedor" | "cliente";

export interface LocalUser {
  id: string;
  email: string;
  password: string;
  full_name: string;
  role: AppRole;
  created_at: string;
}

export interface VaultImage {
  id: string;
  client_id: string;
  image_url: string;
  type: "uploaded" | "assigned_painting";
  assigned_by?: string;
  vendor_name?: string;
  product_id?: string;
  product_name?: string;
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
  price: number;
}
