# 🎨 Color Canvas AI — Guía de Ejecución Local

Esta guía explica paso a paso cómo correr el proyecto **Color Canvas AI** en tu computadora de forma local.

---

## ✅ Requisitos Previos

Antes de comenzar, necesitas tener instalado lo siguiente:

### 1. Node.js (versión 18 o superior)

- Descárgalo desde: **https://nodejs.org**
- Selecciona la versión **LTS (recomendada)**
- Instálalo con las opciones por defecto

**¿Cómo verificar que está instalado correctamente?**

Abre una terminal (PowerShell en Windows) y ejecuta:

```powershell
node --version
```

Resultado esperado (puede variar la versión):
```
v24.11.0
```

```powershell
npm --version
```

Resultado esperado:
```
11.6.1
```

> ⚠️ Si ves un error como `command not found` o `no se reconoce`, Node.js no está instalado o no está en el PATH. Reinstálalo y reinicia la terminal.

---

## 📁 Paso 1 — Obtener el Proyecto

Asegúrate de tener la carpeta del proyecto en tu computadora. La estructura debe verse así:

```
color-canvas-ai-main/
├── src/
├── supabase/
├── public/
├── package.json
├── .env
└── ...
```

---

## 📦 Paso 2 — Instalar las Dependencias

Abre una terminal **dentro de la carpeta del proyecto** y ejecuta:

```powershell
npm install
```

**Resultado esperado** (puede tardar entre 30–60 segundos la primera vez):

```
added 573 packages, and audited 574 packages in 35s

98 packages are looking for funding
  run `npm fund` for details

17 vulnerabilities (3 low, 6 moderate, 8 high)
...
```

> ✅ Los mensajes de `warn deprecated` y las vulnerabilidades son **normales** y no afectan el funcionamiento del proyecto. Puedes ignorarlos.

> ℹ️ Este paso solo necesitas hacerlo **una vez**. En ejecuciones futuras puedes omitirlo.

---

## 🚀 Paso 3 — Iniciar el Servidor de Desarrollo

En la misma terminal, ejecuta:

```powershell
npm run dev
```

**Resultado esperado** (en pocos segundos):

```
> vite_react_shadcn_ts@0.0.0 dev
> vite

  VITE v5.4.19  ready in 1325 ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: http://192.168.1.X:8080/
```

---

## 🌐 Paso 4 — Abrir la Aplicación

Abre tu navegador web (Chrome, Edge, Firefox) y escribe en la barra de direcciones:

```
http://localhost:8080/
```

La aplicación **Color Canvas AI** debería cargarse correctamente. 🎉

---

## 🔄 Cómo Detener el Servidor

Cuando ya no necesites correr la aplicación, ve a la terminal y presiona:

```
Ctrl + C
```

---

## 🌍 Acceso desde Otra Computadora (misma red WiFi)

Si quieres mostrar la aplicación desde otro dispositivo conectado a la **misma red WiFi**, usa la dirección IP que aparece en la línea `Network:` al iniciar el servidor. Por ejemplo:

```
http://192.168.1.65:8080/
```

---

## ⚡ Resumen Rápido de Comandos

```powershell
# 1. Instalar dependencias (solo la primera vez)
npm install

# 2. Correr el proyecto
npm run dev

# 3. Abrir en el navegador
# http://localhost:8080/
```

---

## 🛠️ Solución de Problemas Comunes

| Problema | Causa probable | Solución |
|---|---|---|
| `node` no reconocido | Node.js no instalado o no en PATH | Reinstalar Node.js y reiniciar la terminal |
| Puerto 8080 ocupado | Otra aplicación usa ese puerto | Cerrar la otra aplicación o reiniciar la PC |
| La página no carga | El servidor no está corriendo | Verificar que `npm run dev` sigue ejecutándose en la terminal |
| Error `ENOENT package.json` | No estás en la carpeta correcta | Navegar a la carpeta del proyecto antes de ejecutar los comandos |
| Error al instalar paquetes | Sin conexión a internet | Conectarse a internet e intentar de nuevo |

---

## ℹ️ Información del Proyecto

| | |
|---|---|
| **Framework** | React + Vite |
| **Lenguaje** | TypeScript |
| **Backend** | Supabase (en la nube, ya configurado) |
| **IA — Análisis de imagen** | Google Gemini API (`gemini-2.5-flash`) |
| **IA — Edición de imagen** | Lovable AI Gateway (`gemini-2.5-flash-image`) |
| **Puerto local** | `8080` |

> 🔑 Las credenciales de conexión al backend (Supabase) ya están incluidas en el archivo `.env` del proyecto. No necesitas configurar nada adicional.
