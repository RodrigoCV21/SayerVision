import { useState, useCallback } from "react";
import {
  getVaultImages,
  addVaultImage,
  deleteVaultImage,
  type VaultImage,
} from "@/lib/localDb";
import { toast } from "sonner";

export function useVault(clientId?: string) {
  const [images, setImages] = useState<VaultImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchImages = useCallback(
    (overrideClientId?: string) => {
      setIsLoading(true);
      const id = overrideClientId || clientId;
      const data = getVaultImages(id);
      setImages(data);
      setIsLoading(false);
    },
    [clientId]
  );

  const addImage = useCallback(
    (input: Omit<VaultImage, "id" | "created_at">): VaultImage => {
      const image = addVaultImage(input);
      toast.success(
        input.type === "uploaded"
          ? "Imagen guardada en la bóveda"
          : "Producto asignado al cliente"
      );
      fetchImages(input.client_id);
      return image;
    },
    [fetchImages]
  );

  const removeImage = useCallback(
    (id: string): boolean => {
      const success = deleteVaultImage(id);
      if (!success) {
        toast.error("Error al eliminar elemento");
        return false;
      }
      toast.success("Elemento eliminado de la bóveda");
      fetchImages();
      return true;
    },
    [fetchImages]
  );

  // Filter helpers
  const uploadedImages = images.filter((i) => i.type === "uploaded");
  const assignedPaintings = images.filter((i) => i.type === "assigned_painting");

  return {
    images,
    uploadedImages,
    assignedPaintings,
    isLoading,
    fetchImages,
    addImage,
    removeImage,
  };
}
