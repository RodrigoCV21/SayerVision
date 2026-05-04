# Documentación: Paneles de Gerente, Vendedor y Cliente

Este documento describe la implementación de los paneles de gestión para los tres roles operativos del sistema: **Gerente**, **Vendedor** y **Cliente**. Cada panel sigue el mismo patrón visual del Panel de Administrador (header + tarjetas de navegación + vistas CRUD internas).

---

## 📋 Resumen de Funcionalidades por Rol

| Rol | Funcionalidades | Ruta |
|-----|----------------|------|
| **Gerente** | CRUD Productos, CRUD Vendedores, CRUD Clientes, Gestión de Bóvedas | `/gerente` |
| **Vendedor** | Consultar Productos (solo lectura), Asignar Producto a Cliente | `/vendedor` |
| **Cliente** | Ver historial de imágenes subidas, Ver pinturas asignadas por el vendedor | `/boveda` |

---

## 🏗️ Panel del Gerente (`/gerente`)

### Layout
Al iniciar sesión como gerente, se muestra un dashboard con 4 tarjetas interactivas:
- **Gestionar productos** → CRUD completo del catálogo de productos Sayer.
- **Gestionar vendedores** → Crear, editar y eliminar usuarios con rol de vendedor.
- **Gestionar Clientes** → Crear, editar y eliminar usuarios con rol de cliente.
- **Gestionar bovedas** → Seleccionar un cliente y consultar/eliminar elementos de su bóveda.

### Archivos involucrados
- `src/pages/GerenteDashboard.tsx` — Página principal con las 4 vistas.
- `src/hooks/useVendedores.ts` — Hook CRUD para usuarios vendedor.
- `src/hooks/useClientes.ts` — Hook CRUD para usuarios cliente.
- `src/hooks/useVault.ts` — Hook para gestionar bóvedas (imágenes + pinturas asignadas).
- `src/components/shared/UserForm.tsx` — Formulario reutilizable para crear/editar vendedores y clientes.
- `src/components/admin/ProductForm.tsx` — Se reutiliza el formulario de productos ya existente del Admin.

### Funciones de Bóvedas
El gerente puede:
1. Seleccionar un cliente desde un menú desplegable.
2. Ver las **imágenes subidas** por ese cliente (con fecha y miniatura).
3. Ver las **pinturas asignadas** al cliente (nombre del producto, nombre del vendedor que asignó, fecha).
4. Eliminar cualquier elemento de la bóveda.

---

## 🛒 Panel del Vendedor (`/vendedor`)

### Layout
Al iniciar sesión como vendedor, se muestra un dashboard con 2 tarjetas:
- **Consultar producto** → Lista de solo lectura del catálogo completo, con barra de búsqueda y detalles expandibles.
- **Asignar producto** → Formulario donde selecciona un cliente y un producto, registrando la asignación con su nombre para control de comisiones.

### Archivos involucrados
- `src/pages/VendedorDashboard.tsx` — Página principal con las 2 vistas.

### Flujo de Asignación
1. El vendedor selecciona un **cliente** de la lista.
2. Selecciona un **producto** del catálogo.
3. Al confirmar, se registra en la bóveda del cliente como `type: "assigned_painting"` con:
   - `vendor_name`: Nombre del vendedor que hizo la asignación.
   - `product_name`: Nombre del producto asignado.
   - `assigned_by`: ID del vendedor (para trazabilidad).

---

## 📦 Panel del Cliente — Bóveda (`/boveda`)

### Layout
Al iniciar sesión como cliente, se muestra un dashboard con 2 tarjetas:
- **Mis Imágenes subidas** → Galería con las imágenes que el cliente ha enviado a la herramienta de IA.
- **Pinturas seleccionadas** → Lista de productos asignados por vendedores, mostrando quién lo asignó y cuándo.

### Archivos involucrados
- `src/pages/ClienteDashboard.tsx` — Página principal con las 2 vistas.

### Nota sobre las imágenes
Solo las imágenes subidas por usuarios con rol `cliente` se guardarán automáticamente en su bóveda. Las imágenes subidas por otros roles (admin, gerente, vendedor) no se almacenan en ninguna bóveda.

---

## 🗃️ Cambios en la Base de Datos Local (`localDb.ts`)

Se agregaron dos campos al tipo `VaultImage`:
- `vendor_name` — Nombre del vendedor que asignó el producto (para mostrar en la bóveda del cliente sin necesidad de buscar el usuario).
- `product_name` — Nombre del producto asignado (para mostrar directamente sin consultas adicionales).

Se agregó la función `updateVaultImage()` para modificar elementos existentes en la bóveda.

---

## 🔀 Rutas Actualizadas (`App.tsx`)

| Ruta | Componente | Roles con acceso |
|------|-----------|-----------------|
| `/` | Auth (Login) | Todos |
| `/app` | Index (Herramienta IA) | admin, gerente, vendedor, cliente |
| `/admin` | Admin | admin |
| `/gerente` | GerenteDashboard | admin, gerente |
| `/vendedor` | VendedorDashboard | admin, gerente, vendedor |
| `/boveda` | ClienteDashboard | admin, gerente, cliente |

### Redirección automática al iniciar sesión
- Admin → `/admin`
- Gerente → `/gerente`
- Vendedor → `/vendedor`
- Cliente → `/boveda`

---

## 🧩 Componentes Reutilizables Creados

### `UserForm.tsx` (`src/components/shared/`)
Formulario genérico parametrizado por `roleName` que sirve para crear y editar tanto vendedores como clientes. Incluye validación de email y contraseña (mínimo 8 caracteres, mayúscula, minúscula, número).

### Hooks creados
- `useVendedores.ts` — CRUD de usuarios con rol vendedor.
- `useClientes.ts` — CRUD de usuarios con rol cliente.
- `useVault.ts` — Gestión de bóvedas con filtros por tipo (`uploaded` / `assigned_painting`).

---

## ⚠️ Notas Importantes

1. **Sin impacto en la herramienta de IA**: Ninguno de estos cambios modifica el flujo de procesamiento de imágenes, la Edge Function de Supabase, ni el sistema de recomendaciones de productos.
2. **Datos locales**: Todo se almacena en `localStorage`, por lo que los datos se perderán si se borra la caché del navegador.
3. **Comisiones**: La asignación de productos solo registra el nombre del vendedor para trazabilidad. No hay cálculo de comisión implementado.
