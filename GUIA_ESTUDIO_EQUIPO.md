# 📚 Guía de Estudio — Proyecto Color Canvas AI (SayerVision)

> **Para:** Todo el equipo (Rodrigo, Andrés, Jose Daniel, Alary, Jose Ángel, Edwin)  
> **Objetivo:** Entender el proyecto completo para poder explicárselo a la profesora con confianza.

---

## 🗂️ ÍNDICE RÁPIDO

| Sprint | Integrante | Tema a Estudiar |
|--------|-----------|-----------------|
| 1 | Rodrigo (Jefe) | [Configuración del proyecto](#-sprint-1--rodrigo-jefe---configuración-del-proyecto) |
| 2 | Andrés (Subjefe) | [Base de datos con Supabase](#-sprint-2--andrés-subjefe---base-de-datos) |
| 3 | Jose Daniel | [Sistema de autenticación y roles](#-sprint-3--jose-daniel---autenticación-y-roles) |
| 4 | Alary | [Integración con IA (Gemini)](#-sprint-4--alary---integración-con-ia) |
| 5 | Jose Ángel | [Componentes de interfaz de usuario](#-sprint-5--jose-ángel---componentes-de-ui) |
| 6 | Edwin | [Páginas y estilos globales](#-sprint-6--edwin---páginas-y-estilos) |
| - | Todos | [¿Cómo funciona todo junto?](#-cómo-funciona-el-sistema-completo) |

---

## 💡 ¿Qué hace la aplicación?

**SayerVision** es una aplicación web con inteligencia artificial que:

1. 📸 **Recibe una foto** de una superficie (pared, mueble, reja, piso, etc.)
2. 📝 **El usuario describe** qué parte quiere pintar (ej: "la pared del fondo")
3. 🎨 **El usuario elige un color** (Verde Musgo, Rojo Vino, Amarillo Pastel)
4. 🤖 **La IA analiza la imagen** (detecta material y condiciones con Google Gemini)
5. 🖼️ **La IA coloriza** la imagen mostrando cómo quedaría pintada
6. 🛒 **El sistema recomienda** el producto de pintura Sayer más adecuado

---

## 🔧 SPRINT 1 — Rodrigo (Jefe) — Configuración del Proyecto

### ¿Qué hizo?
Rodrigo configuró todo el proyecto **desde cero**. Sin su trabajo, nadie más podría construir nada.

### Archivos principales
| Archivo | Para qué sirve |
|---------|---------------|
| `package.json` | Lista todas las librerías que usa el proyecto |
| `vite.config.ts` | Configura el servidor de desarrollo y cómo se construye el proyecto |
| `tailwind.config.ts` | Define los colores y estilos personalizados de la marca |
| `tsconfig.json` | Configura TypeScript (reglas del lenguaje) |
| `index.html` | El HTML base de la app, punto de entrada |

### Conceptos clave para explicar

**¿Qué es Vite?**
> Vite es una herramienta que permite correr el proyecto localmente. Cuando escribimos `npm run dev`, Vite arranca un servidor que actualiza la página automáticamente mientras escribimos código.

**¿Qué es TypeScript?**
> TypeScript es JavaScript con "tipos". En lugar de escribir `let nombre = "Ana"`, puedes escribir `let nombre: string = "Ana"`. Esto ayuda a evitar errores porque si intentas guardar un número donde debería ir texto, el editor te avisa antes de correr el código.

**¿Qué es Tailwind CSS?**
> Es una librería de estilos. En lugar de escribir CSS normal, usamos clases predefinidas directamente en el HTML/JSX. Por ejemplo: `className="text-lg font-bold"` hace que el texto sea grande y negritas.

**¿Qué son los colores personalizados?** (tailwind.config.ts)
```
moss    → Verde Musgo (#4a6d4a)  → bg-moss, text-moss
wine    → Rojo Vino  (#8b3a3a)  → bg-wine, text-wine
pastel  → Amarillo   (#e8d88a)  → bg-pastel, text-pastel
```

**¿Qué hace index.html?**
```html
<!-- Solo hay UN div con id="root" -->
<!-- React mete toda la app dentro de ese div -->
<div id="root"></div>
<script src="/src/main.tsx"></script>
```

**¿Qué es React Query (`@tanstack/react-query`)?**
> Ayuda a manejar las llamadas al servidor (peticiones HTTP). Guarda las respuestas en caché para que no se tenga que volver a pedir la misma información cada segundo.

---

## 🗄️ SPRINT 2 — Andrés (Subjefe) — Base de Datos

### ¿Qué hizo?
Andrés diseñó y creó la base de datos en **Supabase** (una plataforma de base de datos en la nube que usa PostgreSQL).

### Archivos principales
| Archivo | Para qué sirve |
|---------|---------------|
| `supabase/config.toml` | Configuración del proyecto en Supabase |
| `supabase/migrations/*.sql` | Scripts SQL que crean las tablas de la base de datos |
| `src/lib/` | Cliente de Supabase para conectar el frontend con la BD |

### Las Tablas de la Base de Datos

#### 📋 Tabla: `user_roles` (Roles de usuarios)
```sql
user_id  → UUID del usuario (referencia a auth.users)
role     → "admin" o "user"
```
**¿Para qué sirve?** Guarda si cada usuario es administrador o usuario normal.

#### 👤 Tabla: `profiles` (Perfiles)
```sql
user_id    → UUID del usuario
email      → Correo electrónico
full_name  → Nombre completo
```
**¿Para qué sirve?** Información adicional del usuario que no guarda Supabase Auth.

#### 🎨 Tabla: `products` (Productos de Sayer)
```sql
name                  → Nombre del producto
serie                 → Serie o línea
category              → Categoría (Línea Arquitectónica, Línea para Madera, etc.)
description           → Descripción
features[]            → Array de características
applicable_surfaces[] → Superficies donde aplica
environmental_conditions[] → Condiciones ambientales
precautions[]         → Precauciones de uso
requires_primer       → Boolean: ¿necesita primario?
primer_product_id     → UUID del primario recomendado
```

### Seguridad: Row Level Security (RLS)
```
✅ Cualquiera puede VER los productos
✅ Solo ADMINS pueden crear/editar/borrar productos
✅ Cada usuario solo puede VER su propio perfil y rol
```

**¿Qué es RLS?** Es un sistema de seguridad de PostgreSQL. Aunque un hacker conecte directamente a la base de datos, las reglas de RLS impiden que vea datos que no le pertenecen.

### La función mágica: `handle_new_user()`
```sql
-- Esta función se ejecuta AUTOMÁTICAMENTE cada vez que alguien se registra
-- Crea el perfil y asigna el rol "user" de forma automática
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
```

---

## 🔐 SPRINT 3 — Jose Daniel — Autenticación y Roles

### ¿Qué hizo?
Jose Daniel hizo todo el **sistema de inicio de sesión**, roles y protección de rutas.

### Archivos principales
| Archivo | Para qué sirve |
|---------|---------------|
| `hooks/useAuth.ts` | Lógica de autenticación (login, logout, obtener rol) |
| `contexts/AuthContext.tsx` | Comparte el estado de auth con toda la app |
| `components/ProtectedRoute.tsx` | Bloquea páginas para usuarios no autorizados |
| `pages/Auth.tsx` | Página de inicio de sesión |

### El flujo completo de autenticación

```
Usuario abre la app
        ↓
useAuth verifica si hay sesión guardada (supabase.auth.getSession())
        ↓
Si hay sesión → consulta el rol en la tabla user_roles
        ↓
AuthContext comparte usuario + rol con toda la app
        ↓
ProtectedRoute revisa si puede ver /admin
```

### ¿Cómo funciona `useAuth.ts`?

```typescript
// 1. Escucha cambios en tiempo real (login/logout)
supabase.auth.onAuthStateChange((evento, sesion) => {
  // Se ejecuta cuando el usuario inicia o cierra sesión
  // Actualiza el estado con la nueva información
})

// 2. Funciones disponibles:
iniciarSesion(email, contraseña) → llama a Supabase Auth
registrarse(email, contraseña, nombre)
cerrarSesion()
obtenerRolUsuario(idUsuario) → consulta la tabla user_roles

// 3. Valores que expone:
user          → datos del usuario (o null si no hay sesión)
isAdmin       → true si el rol es "admin"
isAuthenticated → true si hay sesión activa
isLoading     → true mientras verifica la sesión
```

### ¿Cómo funciona `AuthContext.tsx`?

El **Context de React** es como una variable global. En lugar de pasar el usuario como prop por 10 niveles de componentes, lo ponemos en un Context y cualquier componente lo puede acceder directamente.

```
App (AuthProvider aquí)
  ├── Header → puede usar useAuthContext()
  ├── Index → puede usar useAuthContext()
  └── Admin → puede usar useAuthContext()
```

### ¿Cómo funciona `ProtectedRoute.tsx`?

```typescript
// Si está cargando → muestra spinner
if (isLoading) return <Spinner />

// Si no está autenticado → lo manda al login
if (!isAuthenticated) return <Navigate to="/auth" />

// Si requiere admin y no es admin → lo manda al inicio
if (requireAdmin && !isAdmin) return <Navigate to="/" />

// Si pasó todo → muestra el componente protegido
return <>{children}</>
```

### Validación de formulario con Zod

```typescript
// Zod valida los campos antes de enviar al servidor
const esquema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
})

// Si el email está mal escrito → muestra error sin hacer petición
// Si la contraseña tiene menos de 6 caracteres → muestra error
```

---

## 🤖 SPRINT 4 — Alary — Integración con IA

### ¿Qué hizo?
Alary integró las dos **IAs** que hacen posible la colorización: Google Gemini y el Gateway de Lovable.

### Archivos principales
| Archivo | Para qué sirve |
|---------|---------------|
| `supabase/functions/colorize-surface/index.ts` | Edge Function: toda la lógica de IA en el servidor |
| `src/integrations/supabase/` | Cliente de Supabase para el frontend |
| `hooks/useColorize.ts` | Hook que llama a la Edge Function desde el frontend |
| `hooks/useProducts.ts` | Hook para obtener productos de la BD |

### ¿Qué es una Edge Function?

> Una Edge Function es un pedazo de código que corre en la nube (en los servidores de Supabase), **no en el navegador del usuario**. Esto es importante porque:
> - Las API Keys secretas (Gemini, Lovable) están seguras en el servidor
> - El navegador del usuario no tiene acceso a esas claves
> - El proceso pesado (llamar a la IA) lo hace el servidor

### El flujo completo de la Edge Function

```
Frontend (useColorize.ts)
    │ Envía: imagen base64 + instrucción + color seleccionado
    ▼
Edge Function (colorize-surface/index.ts)
    │
    ├─► PASO 1: Google Gemini API (GRATIS con tu propia key)
    │         Analiza la imagen → detecta material y condiciones
    │         Responde en JSON: { material, conditions, surfaceCategory }
    │
    ├─► PASO 2: Lovable AI Gateway (necesita créditos)
    │         Usa gemini-2.5-flash-image para editar la imagen
    │         Solo cambia el color de la superficie indicada
    │
    ├─► PASO 3: Base de datos Supabase
    │         Busca el mejor producto de pintura para esa superficie
    │         Usa un sistema de puntuación (mayor puntaje = mejor coincidencia)
    │
    └─► Retorna al frontend:
          imageUrl        → URL de la imagen colorizada
          recommendation  → Producto de Sayer recomendado
```

### Sistema de puntuación de productos
```
Coincidencia exacta de subcategoría → +20 puntos
El nombre contiene la categoría    → +10 puntos
Coincidencia por palabras clave    → +5 puntos
La categoría del producto coincide → +15 puntos
```

### ¿Cómo funciona `useColorize.ts`?

```typescript
// El hook expone:
colorize(imagenBase64, instruccion, colorSeleccionado)
  → Llama a la Edge Function de Supabase
  → Guarda la imagen resultado y la recomendación
  → Maneja errores y estado de carga

isProcessing  → true mientras la IA trabaja
resultImage   → URL de la imagen coloreada
recommendation → Producto recomendado
error         → Mensaje si algo salió mal
reset()       → Limpia todo para empezar de nuevo
```

### Variables de entorno necesarias
```
GOOGLE_GEMINI_API_KEY  → Para el análisis de la imagen (gratuito)
LOVABLE_API_KEY        → Para la colorización de la imagen (con créditos)
SUPABASE_URL           → URL del proyecto en Supabase
SUPABASE_SERVICE_ROLE_KEY → Clave secreta del servidor
```

---

## 🧩 SPRINT 5 — Jose Ángel — Componentes de UI

### ¿Qué hizo?
Jose Ángel creó todos los **componentes visuales** que el usuario ve e interactúa.

### Archivos principales
| Archivo | Para qué sirve |
|---------|---------------|
| `components/ImageUploader.tsx` | Zona para subir imágenes (drag & drop) |
| `components/ColorPalette.tsx` | Círculos de colores para seleccionar |
| `components/ResultPreview.tsx` | Muestra original vs. colorizada + botón descargar |
| `components/ProductRecommendation.tsx` | Tarjeta con el producto de Sayer recomendado |
| `components/PrecautionsSection.tsx` | Sección de advertencias de seguridad |
| `components/admin/ProductForm.tsx` | Formulario para crear/editar productos (admin) |

### ¿Cómo funciona `ImageUploader.tsx`?

El componente tiene **dos modos**:
1. **Sin imagen**: muestra la zona de drag & drop
2. **Con imagen**: muestra la imagen cargada con botón para eliminarla

```
Usuario arrastra imagen → onDragOver + onDrop → procesarArchivo()
                                                      ↓
                           FileReader lee el archivo como base64
                                                      ↓
                           onImageSelect(base64) → sube a Index.tsx
```

**¿Qué es base64?** Una forma de convertir una imagen (archivo binario) en texto. Así se puede enviar como parte de un JSON a la API.

### ¿Cómo funciona `ColorPalette.tsx`?

```typescript
// Lista de colores disponibles
const colores = [
  { id: "moss-green",    name: "Verde Musgo",    bgClass: "bg-moss"   },
  { id: "wine-red",      name: "Rojo Vino",      bgClass: "bg-wine"   },
  { id: "pastel-yellow", name: "Amarillo Pastel", bgClass: "bg-pastel" },
]

// El color seleccionado muestra un ✓ (checkmark)
// onSelectColor(color.id) → sube el color a Index.tsx
```

### ¿Cómo funciona `ResultPreview.tsx`?

- Muestra dos imágenes lado a lado: **Original** vs **Colorizada**
- Botón **"Descargar"**: crea un `<a>` invisible, lo hace clic y descarga la imagen
- Botón **"Nueva imagen"**: llama a `onReset()` que limpia todo

### ¿Cómo funciona `PrecautionsSection.tsx`?

Muestra las precauciones de seguridad del producto recomendado (usando la data que viene de la tabla `products.precautions[]`).

---

## 🏠 SPRINT 6 — Edwin — Páginas y Estilos

### ¿Qué hizo?
Edwin ensambló las **páginas finales** que unen todos los componentes, y definió los **estilos globales**.

### Archivos principales
| Archivo | Para qué sirve |
|---------|---------------|
| `pages/Index.tsx` | Página principal (los 3 pasos para colorizar) |
| `pages/Admin.tsx` | Panel de administración de productos |
| `pages/NotFound.tsx` | Página 404 cuando la URL no existe |
| `App.tsx` | Configura las rutas y proveedores globales |
| `index.css` | Estilos globales de la aplicación |

### El sistema de rutas en `App.tsx`

```
/        → Index.tsx   (pública, cualquiera puede entrar)
/auth    → Auth.tsx    (pública, login de admin)
/admin   → Admin.tsx   (PROTEGIDA, solo admins)
/*       → NotFound.tsx (cualquier otra URL)
```

### Los 3 Pasos en `Index.tsx`

La página principal funciona con **renderizado condicional**. Los pasos aparecen en secuencia:

```
PASO 1: ImageUploader → siempre visible
        ↓ (cuando hay imagen)
PASO 2: Input de descripción → aparece con animación
        ↓ (cuando hay imagen Y descripción)
PASO 3: ColorPalette → aparece con animación
        ↓ (clic en "Colorizar superficie")
RESULTADO: ResultPreview → muestra comparación + recomendación
```

```typescript
// Condición para habilitar el botón
const puedeColorizar = imagenSubida && colorSeleccionado && instruccion.trim() && !isProcessing
//                      ↑ hay imagen    ↑ hay color          ↑ hay texto         ↑ no está procesando
```

### Estilos en `index.css`

Los estilos clave que definen el look de la app:
```css
.glass-card      → Efecto de vidrio con fondo semitransparente
.upload-zone     → Zona de drag & drop con borde punteado
.btn-process     → Botón principal de "Colorizar"
.color-swatch    → Círculos de color con animación al seleccionar
.input-instruction → Campo de texto estilizado
```

### Panel Admin (`Admin.tsx`)

El panel tiene dos secciones:
1. **Lista de productos**: tabla con todos los productos de la BD
2. **Formulario**: para crear o editar productos

Solo los usuarios con rol `admin` pueden acceder (gracias a `ProtectedRoute`).

---

## 🔄 ¿Cómo Funciona el Sistema Completo?

### Diagrama del flujo de datos

```
USUARIO NORMAL:
  Browser → Index.tsx
                ↓
           ImageUploader (Jose Ángel)
           ColorPalette   (Jose Ángel)
           input text
                ↓ clic "Colorizar"
           useColorize.ts (Alary)
                ↓ supabase.functions.invoke()
           Edge Function en Supabase (Alary)
                ├── Google Gemini API → analiza imagen
                ├── Lovable AI      → coloriza imagen
                └── Base de datos   → recomienda producto (Andrés)
                ↓ respuesta
           ResultPreview (Jose Ángel)
           ProductRecommendation (Jose Ángel)
           PrecautionsSection (Jose Ángel)

USUARIO ADMIN:
  Browser → Auth.tsx (Jose Daniel)
                ↓ login
           useAuth.ts → Supabase Auth
                ↓ verifica rol en user_roles (Andrés)
           ProtectedRoute → /admin (Jose Daniel)
                ↓
           Admin.tsx → CRUD de productos (Edwin)
```

### El árbol de proveedores (App.tsx)

```
QueryClientProvider    ← maneja caché de datos del servidor
  └─ TooltipProvider   ← tooltips en toda la app
       └─ AuthProvider ← comparte sesión y rol de usuario
            ├─ Toaster ← notificaciones emergentes (toast)
            └─ BrowserRouter
                 ├─ /auth    → Auth.tsx
                 ├─ /        → Index.tsx
                 ├─ /admin   → ProtectedRoute → Admin.tsx
                 └─ /*       → NotFound.tsx
```

---

## ❓ Preguntas Frecuentes que Puede Hacer la Profesora

### "¿Por qué usaron Supabase y no una base de datos propia?"
> Supabase nos da auth, base de datos PostgreSQL, Edge Functions y almacenamiento todo junto. En lugar de construir un servidor desde cero, nos enfocamos en la lógica del negocio.

### "¿Por qué la API Key de Gemini está en el servidor y no en el frontend?"
> Si la API Key estuviera en el código del navegador, cualquier persona podría abrirla con las DevTools y usarla. Al estar en la Edge Function (servidor), está segura.

### "¿Qué es una Edge Function y por qué la usaron?"
> Es código serverless que corre cerca del usuario en los servidores de Supabase. La usamos para:
> 1. Proteger las API Keys
> 2. Hacer las llamadas pesadas a la IA en el servidor
> 3. No exponer la lógica del negocio al cliente

### "¿Por qué base64 para las imágenes?"
> Base64 convierte la imagen en texto. Así podemos enviarla dentro de un JSON en el cuerpo de la petición HTTP, sin necesidad de formularios especiales o multipart/form-data.

### "¿Qué es React Context y por qué lo usaron?"
> Context es una forma de tener "variables globales" en React sin usar Redux u otras librerías. El AuthContext permite que cualquier componente sepa si el usuario está logueado y si es admin, sin pasar props por cada nivel.

### "¿Cómo protegieron las rutas?"
> Con el componente `ProtectedRoute`. Antes de mostrar `/admin`, verifica:
> 1. ¿Está cargando? → muestra spinner
> 2. ¿Está autenticado? → si no, go to `/auth`
> 3. ¿Es admin? → si no, go to `/`
> 4. ¿Pasó todo? → muestra la página

### "¿Qué es TypeScript y por qué lo usaron sobre JavaScript?"
> TypeScript agrega tipos al JavaScript. Permite detectar errores antes de ejecutar el código. Por ejemplo, si una función espera una imagen en string y alguien le pasa un número, TypeScript da error en el editor, no en producción.

### "¿Cuál fue el reto principal del proyecto?"
> La integración de la IA: la imagen debe convertirse a base64, enviarse a la Edge Function, pasar por la API de análisis de Gemini, y luego por el modelo de edición de imágenes, todo sin perder calidad y manejando errores de límite de velocidad (rate limiting) con reintentos automáticos.

---

## 📝 Glosario Rápido

| Término | Significado |
|---------|-------------|
| **React** | Librería de JavaScript para construir interfaces de usuario |
| **TypeScript** | JavaScript con tipos de datos |
| **Vite** | Herramienta de desarrollo rápida para apps web |
| **Tailwind CSS** | Librería de estilos con clases predefinidas |
| **Supabase** | Plataforma de backend: BD, Auth, Functions |
| **PostgreSQL** | Base de datos relacional (la que usa Supabase) |
| **Edge Function** | Código serverless que corre en la nube |
| **Hook** | Función de React que maneja estado o efectos |
| **Context** | Variable global de React |
| **RLS** | Row Level Security: seguridad a nivel de fila en la BD |
| **Base64** | Formato de texto para codificar archivos binarios |
| **JWT** | Token de autenticación que Supabase usa para las sesiones |
| **CORS** | Política de seguridad que controla quién puede hacer peticiones |
| **API Key** | Clave secreta para usar una API de terceros |
| **Zod** | Librería para validar formularios |
| **UUID** | ID único universal (formato: `550e8400-e29b-...`) |

---

## ✅ Lista de Repaso antes de la Presentación

- [ ] **Rodrigo**: Sé explicar qué hace cada archivo de configuración raíz y por qué se eligió Vite + React + TypeScript
- [ ] **Andrés**: Sé explicar las 3 tablas, qué es RLS, y cómo funciona el trigger `handle_new_user()`
- [ ] **Jose Daniel**: Sé explicar el flujo completo de autenticación: desde que el usuario escribe su contraseña hasta que ve el panel de admin
- [ ] **Alary**: Sé explicar qué hace la Edge Function paso a paso y por qué las API Keys van en el servidor
- [ ] **Jose Ángel**: Sé explicar cómo funciona el drag & drop y la conversión a base64
- [ ] **Edwin**: Sé explicar cómo el renderizado condicional crea el efecto de "pasos secuenciales" y cómo funcionan las rutas
- [ ] **Todos**: Pueden responder "¿Cómo funciona todo junto?" con el diagrama de flujo

---

*Guía generada para el proyecto SayerVision — Color Canvas AI*  
*Fecha: Abril 2026*
