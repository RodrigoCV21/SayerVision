# Gestión de Productos: Arquitectura Local (Desconexión de Supabase)

Para garantizar la estabilidad de la "muestra temporal" y evitar errores de esquema (como la falta de columnas de precio en el servidor), el módulo de productos se ha configurado para operar en modo **Local-First**.

## 🏗️ Cómo funciona actualmente
1.  **Semilla de Datos**: El archivo `src/lib/seedProducts.ts` contiene el catálogo base de Sayer.
2.  **Inicialización**: Al detectar que la base local de productos está vacía, `localDb.ts` carga automáticamente el catálogo semilla.
3.  **Persistencia**: Todas las ediciones, creaciones y eliminaciones se guardan en el `localStorage` del navegador.

---

## 🔄 Instrucciones para Revincular a Supabase

Si en el futuro deseas que los productos se lean y escriban nuevamente en la base de datos remota de Supabase, sigue estos pasos:

### 1. Preparar el Servidor
Asegúrate de que la tabla `products` en Supabase tenga la siguiente columna:
- `price`: tipo `numeric` o `float8`, default `0`.

### 2. Modificar el Hook `useProducts.ts`
En el archivo `src/hooks/useProducts.ts`, restaura la lógica original del `fetchProducts`:

```typescript
// Cambiar esto:
const fetchProducts = useCallback(async () => {
  setIsLoading(true);
  const localProducts = getLocalProducts();
  setProducts(localProducts as Product[]);
  setUseLocal(true); // <--- Cambiar a false
  setIsLoading(false);
}, []);

// Por esto (o similar):
const fetchProducts = useCallback(async () => {
  setIsLoading(true);
  const { data } = await supabase.from("products").select("*");
  setProducts(data);
  setUseLocal(false);
  setIsLoading(false);
}, []);
```

### 3. Activar Sincronización en `updateProduct`
Asegúrate de que la bandera `useLocal` esté en `false` para que el bloque `try/catch` de Supabase se ejecute primero.

---

## 🛡️ Instrucciones para mantener el Modo Local
Para añadir productos nuevos a la "semilla", simplemente edita `src/lib/seedProducts.ts`. Si quieres limpiar la base local y forzar una nueva carga de la semilla, borra el objeto `sayer_products` de las herramientas de desarrollador del navegador (Application -> Local Storage).
