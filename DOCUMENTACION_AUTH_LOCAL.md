# Documentación de Migración: Autenticación y Roles a LocalStorage

Este documento detalla los cambios arquitectónicos realizados para migrar el sistema de autenticación, control de roles (RBAC) y gestión básica de usuarios de Supabase hacia una solución local basada en `localStorage`.

## 📌 Propósito de la Migración

El objetivo principal es permitir una demostración fluida y funcional de la aplicación sin depender de despliegues de base de datos remotos ni de migraciones (SQL) en Supabase.

**Importante:** Supabase **sigue siendo utilizado** exclusivamente para dos funciones que requieren infraestructura backend:
1. Lectura del catálogo de productos inicial.
2. Llamada a la *Edge Function* de IA (`colorize-surface`).

---

## 🏗️ Arquitectura Local (`src/lib/localDb.ts`)

Se ha creado un motor de base de datos simulado (`localDb.ts`) que intercepta todas las peticiones que antes iban a Supabase Auth o a las tablas `user_roles` / `profiles`.

### Características del Motor Local:
- **Almacenamiento:** Todo reside en el `localStorage` del navegador actual.
- **Sincronía:** Las operaciones (CRUD) son inmediatas, sin latencia de red.
- **Auto-sembrado (Seed):** La primera vez que se carga la aplicación, el motor inyecta 5 usuarios predeterminados, uno para cada rol del sistema.

### 👥 Usuarios de Demostración Pre-Cargados

Puedes iniciar sesión en la ruta raíz (`/`) usando cualquiera de estas credenciales para probar los distintos paneles:

| Rol | Correo Electrónico | Contraseña | Panel Destino |
|-----|-------------------|------------|---------------|
| **Admin** | `admin@sayervision.com` | `Admin1234` | `/admin` |
| **Admin** | `andres@gmail.com` | `AndSE23bjUY284nm` | `/admin` |
| **Gerente** | `gerente@sayervision.com` | `Gerente1234` | `/gerente` |
| **Vendedor**| `vendedor@sayervision.com`| `Vendedor1234` | `/vendedor` |
| **Cliente** | `cliente@sayervision.com` | `Cliente1234` | `/boveda` |

---

## 🔄 Resumen de Hooks Modificados

Para hacer transparente el cambio para la interfaz de usuario (React), se reescribieron los *Hooks* principales:

### 1. `useAuth.ts`
- **Antes:** Usaba `supabase.auth.signInWithPassword` y leía la tabla `user_roles`.
- **Ahora:** Usa la función local `login()` de `localDb.ts`. 
- **Mejora:** Mantiene la sesión activa guardando un token simbólico (`CURRENT_USER`) en el `localStorage`.

### 2. `useGerentes.ts`
- **Antes:** Al crear un gerente, `supabase.auth.signUp()` secuestraba (sobrescribía) la sesión activa del Administrador, expulsándolo del sistema.
- **Ahora:** La creación de gerentes se hace puramente insertando un registro en el array local de usuarios. La sesión del Administrador permanece intacta.

### 3. `useProducts.ts` (Sistema Híbrido)
- **Lectura (Read):** Intenta consultar la tabla `products` de Supabase primero. Si la base remota no responde o hay un problema de red, utiliza los productos locales como respaldo (*fallback*).
- **Escritura (Create/Update/Delete):** Se guardan **siempre** en `localStorage`. Esto se debe a que la creación de productos en Supabase dependía de las políticas de seguridad (RLS) que requieren que el usuario esté autenticado *en Supabase*, lo cual ya no es el caso.

---

## 🗺️ Ruteo Actualizado (`App.tsx` y `Auth.tsx`)

La navegación se ha simplificado para cumplir con los requisitos del flujo:
- `/` ➔ Muestra el formulario de inicio de sesión (Login Universal).
- Al iniciar sesión correctamente, el sistema evalúa el rol local y redirige al panel adecuado (`/admin`, `/gerente`, etc.).
- `/app` ➔ Contiene la herramienta principal de Colorización por IA, accesible por cualquier rol autenticado.
- `ProtectedRoute.tsx` ➔ Modificado para validar los permisos contra el estado de sesión local (`AuthContext`) en lugar de depender del JWT de Supabase.

---

## ⚠️ Consideraciones Importantes

1. **Persistencia Volátil:** Como la base de datos es `localStorage`, **los datos (gerentes nuevos, productos nuevos) se perderán si el usuario borra la caché del navegador** o si accede desde una ventana de incógnito.
2. **Seguridad (Demo):** Las contraseñas en `localDb.ts` se guardan en texto plano por motivos prácticos de demostración. Esto no debe usarse en un entorno de producción real.
3. **Imágenes (Bóvedas):** El diseño de la base de datos local ya contempla la estructura para las imágenes de los clientes (`VaultImage`), listo para cuando se desarrolle el panel del Vendedor y del Cliente.
