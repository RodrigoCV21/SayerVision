-- 1. Add new roles to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'gerente';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'vendedor';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'cliente';

-- 2. Create client_vaults table
CREATE TABLE IF NOT EXISTS public.client_vaults (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS policies for client_vaults
ALTER TABLE public.client_vaults ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clientes pueden ver su propia bóveda"
ON public.client_vaults FOR SELECT
USING (auth.uid() = client_id);

CREATE POLICY "Gerentes pueden ver todas las bóvedas"
ON public.client_vaults FOR SELECT
USING (public.has_role(auth.uid(), 'gerente'));

CREATE POLICY "Gerentes pueden gestionar todas las bóvedas"
ON public.client_vaults FOR ALL
USING (public.has_role(auth.uid(), 'gerente'));

-- 3. Create vault_images table
CREATE TABLE IF NOT EXISTS public.vault_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID REFERENCES public.client_vaults(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('uploaded', 'assigned_painting')),
    assigned_by UUID REFERENCES auth.users(id), -- vendedor o gerente
    product_id UUID REFERENCES public.products(id), -- si es assigned_painting
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS policies for vault_images
ALTER TABLE public.vault_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clientes pueden ver imágenes en su bóveda"
ON public.vault_images FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.client_vaults v WHERE v.id = vault_id AND v.client_id = auth.uid()
));

CREATE POLICY "Clientes pueden subir imágenes"
ON public.vault_images FOR INSERT
WITH CHECK (
    type = 'uploaded' AND EXISTS (
        SELECT 1 FROM public.client_vaults v WHERE v.id = vault_id AND v.client_id = auth.uid()
    )
);

CREATE POLICY "Gerentes pueden ver y editar todas las imágenes"
ON public.vault_images FOR ALL
USING (public.has_role(auth.uid(), 'gerente'));

CREATE POLICY "Vendedores pueden asignar pinturas"
ON public.vault_images FOR INSERT
WITH CHECK (
    type = 'assigned_painting' AND public.has_role(auth.uid(), 'vendedor')
);

CREATE POLICY "Vendedores pueden ver imágenes asignadas por ellos"
ON public.vault_images FOR SELECT
USING (assigned_by = auth.uid());

-- Trigger for client_vaults updated_at
CREATE TRIGGER update_client_vaults_updated_at
BEFORE UPDATE ON public.client_vaults
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update products policies to allow Gerentes
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
CREATE POLICY "Admins y Gerentes pueden insertar productos"
ON public.products FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'gerente'));

DROP POLICY IF EXISTS "Admins can update products" ON public.products;
CREATE POLICY "Admins y Gerentes pueden actualizar productos"
ON public.products FOR UPDATE
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'gerente'));

DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
CREATE POLICY "Admins y Gerentes pueden eliminar productos"
ON public.products FOR DELETE
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'gerente'));
