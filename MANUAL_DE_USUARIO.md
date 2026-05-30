# Manual de Usuario — SayerVision

**Versión:** 1.0  
**Fecha:** Mayo 2026  
**Proyecto Integrador — Equipo 2**

---

## Tabla de Contenidos

1. [Introducción](#1-introducción)
2. [Descripción General del Sistema](#2-descripción-general-del-sistema)
3. [Requisitos del Sistema](#3-requisitos-del-sistema)
4. [Instalación y Puesta en Marcha](#4-instalación-y-puesta-en-marcha)
5. [Acceso al Sistema — Inicio de Sesión](#5-acceso-al-sistema--inicio-de-sesión)
6. [Módulo de Colorización con IA (SayerVisionAI)](#6-módulo-de-colorización-con-ia-sayervisionai)
7. [Panel de Administración](#7-panel-de-administración)
8. [Panel del Gerente](#8-panel-del-gerente)
9. [Panel del Vendedor](#9-panel-del-vendedor)
10. [Panel del Cliente — Bóveda](#10-panel-del-cliente--bóveda)
11. [Navegación General y Elementos Comunes](#11-navegación-general-y-elementos-comunes)
12. [Gestión de Datos y Almacenamiento](#12-gestión-de-datos-y-almacenamiento)
13. [Preguntas Frecuentes (FAQ)](#13-preguntas-frecuentes-faq)
14. [Solución de Problemas](#14-solución-de-problemas)
15. [Glosario de Términos](#15-glosario-de-términos)
16. [Información Técnica del Proyecto](#16-información-técnica-del-proyecto)

---

## 1. Introducción

### 1.1 Propósito del Documento

Este manual de usuario tiene como objetivo proporcionar una guía completa y detallada para el uso correcto de la aplicación **SayerVision** (también conocida internamente como *Color Canvas AI*). Está dirigido a todos los usuarios finales del sistema, sin importar su nivel de experiencia técnica.

### 1.2 Audiencia

Este manual está dirigido a:

- **Administradores** del sistema que gestionan productos y gerentes.
- **Gerentes** que administran el catálogo de productos, vendedores, clientes y bóvedas.
- **Vendedores** que consultan el catálogo y asignan productos a clientes.
- **Clientes** que utilizan la herramienta de colorización con IA y consultan su bóveda personal.

### 1.3 Convenciones del Documento

| Convención | Significado |
|---|---|
| **Texto en negritas** | Botones, etiquetas de menú o elementos de interfaz |
| `Texto monoespaciado` | Comandos, URLs o valores técnicos |
| ⚠️ | Advertencia o precaución importante |
| 💡 | Consejo útil |
| ✅ | Acción completada o confirmación |

---

## 2. Descripción General del Sistema

### 2.1 ¿Qué es SayerVision?

**SayerVision** es una aplicación web con inteligencia artificial diseñada para la empresa **Pinturas Sayer**. La aplicación permite a los usuarios visualizar cómo quedaría una superficie pintada con un color específico antes de realizar la compra de la pintura.

### 2.2 Funcionalidades Principales

| Funcionalidad | Descripción |
|---|---|
| **Colorización con IA** | El usuario sube una fotografía de una superficie, describe qué parte quiere pintar, selecciona un color y la IA genera una visualización del resultado. |
| **Recomendación de productos** | Al colorizar, el sistema recomienda automáticamente el producto de Pinturas Sayer más adecuado para esa superficie, incluyendo precio y precauciones. |
| **Gestión de catálogo** | Los administradores y gerentes pueden crear, editar y eliminar productos del catálogo. |
| **Gestión de usuarios** | El administrador gestiona gerentes; los gerentes gestionan vendedores y clientes. |
| **Asignación de productos** | Los vendedores asignan productos del catálogo a clientes específicos. |
| **Bóveda de cliente** | Los clientes cuentan con una bóveda personal donde se almacenan sus imágenes procesadas y los productos asignados por los vendedores. |

### 2.3 Roles del Sistema

SayerVision implementa un sistema de control de acceso basado en roles (RBAC). Cada usuario tiene asignado un rol que determina las funcionalidades a las que puede acceder.

| Rol | Permisos | Panel de acceso |
|---|---|---|
| **Administrador** | Gestión completa: productos, gerentes, y acceso a la herramienta de IA | `/admin` |
| **Gerente** | Gestión de productos, vendedores, clientes, bóvedas y acceso a la herramienta de IA | `/gerente` |
| **Vendedor** | Consulta de catálogo (solo lectura), asignación de productos a clientes y acceso a la herramienta de IA | `/vendedor` |
| **Cliente** | Uso de la herramienta de IA, consulta de su bóveda personal (imágenes y pinturas asignadas) | `/boveda` |

### 2.4 Flujo General del Sistema

```
Usuario accede a la aplicación
        ↓
Pantalla de Inicio de Sesión (/)
        ↓
Ingresa credenciales (email + contraseña)
        ↓
El sistema valida las credenciales y detecta el rol
        ↓
Redirección automática al panel correspondiente:
  • Admin    → /admin
  • Gerente  → /gerente
  • Vendedor → /vendedor
  • Cliente  → /boveda
        ↓
Desde cualquier panel → Acceso a SayerVisionAI (/app)
```

---

## 3. Requisitos del Sistema

### 3.1 Requisitos de Hardware

| Componente | Mínimo Recomendado |
|---|---|
| Procesador | Cualquier procesador moderno (Intel i3 / AMD equivalente o superior) |
| Memoria RAM | 4 GB |
| Almacenamiento | 500 MB libres |
| Conexión a Internet | Requerida (para la funcionalidad de IA) |

### 3.2 Requisitos de Software

| Software | Versión |
|---|---|
| **Sistema Operativo** | Windows 10/11, macOS 10.15+, o Linux |
| **Navegador Web** | Google Chrome (v90+), Microsoft Edge (v90+), Mozilla Firefox (v90+) |
| **Node.js** | Versión 18 o superior (para ejecución local) |
| **npm** | Incluido con Node.js |

### 3.3 Navegadores Compatibles

La aplicación ha sido optimizada para los siguientes navegadores:

- ✅ Google Chrome (recomendado)
- ✅ Microsoft Edge
- ✅ Mozilla Firefox
- ⚠️ Safari (funcional con posibles diferencias visuales menores)

---

## 4. Instalación y Puesta en Marcha

### 4.1 Obtener el Proyecto

Asegúrese de tener la carpeta del proyecto en su computadora. La estructura del proyecto debe verse así:

```
SayerVision/
├── src/          ← Código fuente de la aplicación
├── supabase/     ← Configuración del backend
├── public/       ← Archivos públicos (favicon, etc.)
├── package.json  ← Dependencias del proyecto
├── .env          ← Variables de entorno (credenciales)
└── ...
```

### 4.2 Instalar Node.js

1. Descargue Node.js desde: **https://nodejs.org**
2. Seleccione la versión **LTS (recomendada)**.
3. Instale con las opciones por defecto.
4. Verifique la instalación abriendo una terminal (PowerShell en Windows):

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

> ⚠️ Si aparece un error como `command not found` o `no se reconoce`, Node.js no está instalado correctamente o no está configurado en el PATH del sistema. Reinstale Node.js y reinicie la terminal.

### 4.3 Instalar las Dependencias

Abra una terminal **dentro de la carpeta del proyecto** y ejecute:

```powershell
npm install
```

> 💡 Este comando descarga todas las librerías necesarias. Puede tardar entre 30 y 60 segundos la primera vez. Los mensajes de `warn deprecated` y las vulnerabilidades reportadas son normales y no afectan el funcionamiento.

> ✅ Este paso solo es necesario la **primera vez** que se configura el proyecto, o cuando se actualicen las dependencias.

### 4.4 Iniciar el Servidor de Desarrollo

En la misma terminal, ejecute:

```powershell
npm run dev
```

Resultado esperado:
```
> vite_react_shadcn_ts@0.0.0 dev
> vite

  VITE v5.4.19  ready in 1325 ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: http://192.168.1.X:8080/
```

### 4.5 Abrir la Aplicación

Abra su navegador web y escriba en la barra de direcciones:

```
http://localhost:8080/
```

La aplicación SayerVision se cargará y mostrará la pantalla de inicio de sesión. 🎉

### 4.6 Detener el Servidor

Cuando no necesite la aplicación, vaya a la terminal donde se ejecutó el servidor y presione:

```
Ctrl + C
```

### 4.7 Acceso desde Otro Dispositivo (misma red WiFi)

Para acceder a la aplicación desde otro dispositivo conectado a la misma red WiFi, utilice la dirección IP que aparece en la línea `Network:` del servidor. Ejemplo:

```
http://192.168.1.65:8080/
```

### 4.8 Resumen Rápido de Comandos

| Acción | Comando |
|---|---|
| Instalar dependencias (solo la primera vez) | `npm install` |
| Iniciar el servidor | `npm run dev` |
| Abrir en el navegador | `http://localhost:8080/` |
| Detener el servidor | `Ctrl + C` en la terminal |

---

## 5. Acceso al Sistema — Inicio de Sesión

### 5.1 Pantalla de Login

Al abrir la aplicación, el usuario es recibido con la pantalla de inicio de sesión. Esta pantalla presenta:

- **Logo de SayerVisionAI** con un ícono de paleta de colores.
- **Campo de Email**: para ingresar el correo electrónico del usuario.
- **Campo de Contraseña**: con un botón de ojo (👁️) para mostrar u ocultar la contraseña.
- **Botón "Iniciar Sesión"**: para enviar las credenciales.

### 5.2 Cómo Iniciar Sesión

1. Ingrese su **correo electrónico** en el campo correspondiente.
2. Ingrese su **contraseña**.
3. (Opcional) Haga clic en el ícono del ojo (👁️) a la derecha del campo de contraseña para verificar que la contraseña esté escrita correctamente.
4. Haga clic en el botón **"Iniciar Sesión"**.

### 5.3 Resultado del Inicio de Sesión

- **✅ Exitoso**: Se muestra una notificación de bienvenida (ejemplo: *"¡Bienvenido Administrador!"*) y el sistema redirige automáticamente al panel correspondiente según el rol del usuario.
- **❌ Fallido**: Se muestra el mensaje *"Credenciales incorrectas"* en color rojo debajo de los campos del formulario, acompañado de una notificación emergente.

### 5.4 Redirección Automática por Rol

| Rol | Destino tras el inicio de sesión |
|---|---|
| Administrador | `/admin` — Panel de Administración |
| Gerente | `/gerente` — Panel del Gerente |
| Vendedor | `/vendedor` — Panel del Vendedor |
| Cliente | `/boveda` — Bóveda del Cliente |

### 5.5 Usuarios de Demostración

El sistema incluye los siguientes usuarios precargados para pruebas y demostraciones:

| Rol | Correo Electrónico | Contraseña |
|---|---|---|
| **Administrador** | `admin@sayervision.com` | `Admin1234` |
| **Administrador** | `andres@gmail.com` | `AndSE23bjUY284nm` |
| **Gerente** | `gerente@sayervision.com` | `Gerente1234` |
| **Vendedor** | `vendedor@sayervision.com` | `Vendedor1234` |
| **Cliente** | `cliente@sayervision.com` | `Cliente1234` |

> ⚠️ Estos usuarios son de demostración. En un entorno de producción, las credenciales deben ser gestionadas por el administrador del sistema.

### 5.6 Cerrar Sesión

Para cerrar sesión desde cualquier panel:

1. Localice el botón **"Cerrar Sesión"** en la esquina superior derecha del encabezado.
2. Haga clic en él.
3. El sistema lo redirigirá a la pantalla de inicio de sesión.

---

## 6. Módulo de Colorización con IA (SayerVisionAI)

### 6.1 Descripción

El módulo de **SayerVisionAI** es la funcionalidad principal de la aplicación. Permite al usuario:

1. Subir una fotografía de cualquier superficie pintable (pared, puerta, reja, mueble, piso, etc.).
2. Describir qué parte de la imagen desea pintar.
3. Seleccionar un color de la paleta Sayer.
4. Obtener una visualización generada por IA de cómo quedaría la superficie pintada.
5. Recibir una recomendación del producto Sayer más adecuado para esa superficie.

**Ruta de acceso:** `/app`

**Acceso:** Todos los roles autenticados (Administrador, Gerente, Vendedor y Cliente).

> 💡 Desde cualquier panel de gestión, puede acceder rápidamente a SayerVisionAI haciendo clic en el botón **"SayerVisionAI"** disponible en el encabezado de todos los paneles.

### 6.2 Proceso de Colorización — Paso a Paso

#### Paso 1: Subir una Imagen

1. En la página principal de SayerVisionAI, localice la sección **"Sube tu imagen"** (marcada con el número **1** en un círculo).
2. Puede subir una imagen de dos maneras:
   - **Arrastrar y soltar**: Arrastre una imagen desde su explorador de archivos y suéltela sobre la zona indicada con borde punteado. Al arrastrar sobre la zona, el texto cambiará a *"¡Suelta la imagen aquí!"*.
   - **Hacer clic**: Haga clic en la zona de carga y seleccione un archivo de imagen desde el explorador de archivos de su computadora.
3. **Formatos aceptados:** JPG, PNG, WEBP, BMP, TIFF.
4. **Tamaño máximo:** 10 MB.
5. Una vez cargada, la imagen se mostrará como vista previa en una tarjeta redondeada. Si desea cambiar la imagen, haga clic en el botón **"×"** (cerrar) que aparece en la esquina superior derecha de la imagen al pasar el cursor.

**Mensajes de error posibles:**

| Error | Mensaje |
|---|---|
| Formato no permitido | *"Formato no permitido: '[extensión]'. Solo se aceptan JPG, PNG, WEBP, BMP o TIFF."* |
| Archivo demasiado grande | *"Archivo demasiado grande (X.X MB). El límite es 10 MB."* |

> 💡 Para mejores resultados, use fotografías con buena iluminación y que muestren claramente la superficie que desea pintar.

#### Paso 2: Describir la Superficie

1. Una vez cargada la imagen, aparecerá automáticamente la sección **"Describe la superficie"** (marcada con el número **2** en un círculo) con una animación de entrada.
2. Escriba una descripción clara y específica de la superficie que desea colorizar. Ejemplos:
   - *"la pared de block del exterior"*
   - *"la puerta de metal oxidada"*
   - *"el mueble de madera de la sala"*
   - *"la reja del jardín"*
   - *"el piso de concreto del garage"*

> 💡 **Consejo**: Sea lo más específico posible. Mencione el **material** (block, madera, metal, concreto) y la **ubicación** (interior, exterior). Puede incluir condiciones adicionales como *"pared de block del cuarto, con humedad"*.

> ⚠️ Solo se pueden describir superficies pintables: paredes, madera, metal, pisos de concreto, etc. No se procesan objetos como telas, cristales o elementos orgánicos.

#### Paso 3: Seleccionar un Color

1. Después de escribir la descripción, aparecerá la sección **"Selecciona el color"** (marcada con el número **3** en un círculo).
2. La paleta presenta **más de 60 colores** organizados en 5 categorías:

| Categoría | Tipo de colores |
|---|---|
| **COLORES VIVOS** | Rojo, Naranja, Amarillo, Verde, Azul, Violeta, Magenta, etc. |
| **CLAROS** | Coral, Salmón, Crema, Menta, Celeste, Lavanda, Rosado, etc. |
| **AGRISADOS** | Lacre, Cobre, Canela, Dorado, Verde bosque, Zafiro, etc. |
| **OSCUROS** | Granate, Caoba, Marrón, Oliva, Azul marino, Púrpura, Vino, etc. |
| **NEUTROS** | Blanco, Plateado, Gris, Plomo, Negro |

3. Haga clic en el color deseado. El color seleccionado mostrará una marca de verificación (**✓**) y aparecerá una barra inferior indicando el nombre del color y su código hexadecimal.
4. Puede desplazarse (scroll) dentro de la paleta para ver todos los colores disponibles.

> 💡 Cada color muestra su nombre y su código hexadecimal (ej: `#FF0000`). Esto asegura que la IA aplique el tono exacto solicitado.

#### Paso 4: Colorizar

1. Una vez completados los tres pasos anteriores, el botón **"Colorizar superficie"** se habilitará.
2. Haga clic en el botón **"Colorizar superficie"**.
3. El botón cambiará a **"Procesando con IA..."** con un indicador de carga giratorio.
4. Espere mientras la inteligencia artificial procesa la imagen. Este proceso puede tardar entre **10 y 30 segundos** dependiendo de la complejidad de la imagen y la carga del servidor.

> ⚠️ No cierre la ventana ni navegue a otra página mientras la IA esté procesando. Esto cancelará el proceso.

### 6.3 Pantalla de Resultados

Una vez completado el procesamiento, la aplicación muestra la pantalla de resultados con las siguientes secciones:

#### 6.3.1 Comparación Visual

Se muestran dos imágenes lado a lado:

- **Imagen Original**: La fotografía que usted subió.
- **Imagen Colorizada**: La imagen generada por la IA mostrando la superficie pintada con el color seleccionado.

#### 6.3.2 Recomendación de Producto

Debajo de la comparación visual, se presenta una tarjeta con la recomendación del producto Sayer más adecuado:

- **Nombre del producto** recomendado.
- **Serie** del producto.
- **Precio de venta** del producto.
- **Descripción** del producto.
- **Características** principales.
- **Superficies de uso** compatibles.

Si el producto requiere un **sellador o primario** previo, la recomendación lo indicará junto con el nombre y precio del producto primario sugerido.

#### 6.3.3 Precauciones de Seguridad

Si el producto recomendado tiene precauciones de uso, estas se muestran en una sección destacada con estilo de alerta en color vino, incluyendo:

- Instrucciones de seguridad para la aplicación.
- Advertencias sobre ventilación, protección personal, etc.
- Precauciones especiales según el tipo de producto.

#### 6.3.4 Acciones Disponibles en Resultados

| Botón | Acción |
|---|---|
| **Descargar** | Descarga la imagen colorizada en su computadora. |
| **Nueva imagen** | Limpia todos los campos y regresa al formulario para realizar una nueva colorización. |

### 6.4 Almacenamiento Automático (Solo Clientes)

Cuando un usuario con rol **Cliente** utiliza la herramienta de colorización, la imagen subida se guarda automáticamente en su **bóveda personal** para consulta histórica. Las imágenes subidas por otros roles (Administrador, Gerente, Vendedor) **no se almacenan** en ninguna bóveda.

---

## 7. Panel de Administración

### 7.1 Acceso

- **Ruta:** `/admin`
- **Roles con acceso:** Administrador
- **Credenciales de demostración:** `admin@sayervision.com` / `Admin1234`

### 7.2 Vista Principal (Dashboard)

Al iniciar sesión como Administrador, se muestra un dashboard con un mensaje de bienvenida y dos tarjetas de navegación interactivas:

| Tarjeta | Icono | Descripción |
|---|---|---|
| **Gestionar Productos** | 📦 (Cajas) | Accede al CRUD completo del catálogo de productos Sayer. |
| **Gestionar Gerentes** | 👥 (Usuarios) | Accede al CRUD de usuarios con rol de gerente. |

Además, el encabezado muestra:
- El email del usuario actual.
- Botón de flecha **←** para retroceder (al dashboard o al inicio).
- Botón **SayerVisionAI** para acceder a la herramienta de IA.
- Botón **Cerrar Sesión**.

### 7.3 Gestión de Productos

#### 7.3.1 Vista del Catálogo

Al hacer clic en **"Gestionar Productos"**, se muestra:

- **Título**: "Catálogo de Productos" con el conteo total de productos.
- **Botón "Nuevo Producto"**: En la esquina superior derecha, con ícono de **+**.
- **Lista de productos**: Agrupados por categoría (ej: "Línea Arquitectónica", "Línea para Madera", etc.).

Cada producto en la lista muestra:
- Ícono de paquete.
- **Nombre** del producto.
- **Serie** (si aplica).
- Número de **superficies** compatibles.
- Botón de **lápiz** (✏️) para editar.
- Botón de **papelera** (🗑️) para eliminar.
- Flecha **▼/▲** para expandir/contraer los detalles.

#### 7.3.2 Detalles Expandidos de un Producto

Al hacer clic en un producto, se despliegan sus detalles completos:

| Sección | Contenido |
|---|---|
| **Descripción** | Texto descriptivo del producto. |
| **Características** | Lista con viñetas de las características técnicas. |
| **Superficies de Uso** | Etiquetas (badges) con las superficies compatibles. |
| **Condiciones Ambientales** | Lista de condiciones para su uso. |
| **Precauciones** | Sección destacada en color vino con advertencias de seguridad. |
| **Requiere Primario** | Indicador si el producto necesita sellador previo. |

#### 7.3.3 Crear un Nuevo Producto

1. Haga clic en el botón **"Nuevo Producto"** (esquina superior derecha).
2. Se abrirá un formulario modal con los siguientes campos:

**Campos básicos:**

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| Nombre del Producto | Texto | Sí | Nombre del producto (ej: *"Esmalte Acrílico Sayer"*). |
| Serie | Texto | No | Serie o línea del producto (ej: *"V-00xx"*). |
| Categoría / Línea | Desplegable | Sí | Opciones: Línea para Madera, Línea para Metales, Línea Arquitectónica, Especialidades y Tráfico, Impermeabilizantes. |
| Precio de Venta | Numérico | Sí | Precio en formato moneda con prefijo **$** (ej: *125.50*). |
| Descripción adicional | Texto largo | No | Información adicional sobre el producto. |

**Sección de IA (selección por chips):**

El formulario incluye 4 secciones colapsables con **chips de selección** (botones que se activan/desactivan al hacer clic). Estas secciones son fundamentales para la recomendación inteligente de productos por la IA:

| Sección | Opciones disponibles |
|---|---|
| **Superficies de Uso Aplicables** (23 opciones) | madera-interior, madera-exterior, muebles-madera, puertas-madera, pisos-madera, metal-ferroso, metal-galvanizado, aluminio, herrería, tanques-tuberías, estructuras-metálicas, muro-interior, muro-exterior, concreto, block, tablaroca, aplanado, piso-exterior, estacionamiento, señalización, canchas, alberca, azotea/impermeabilización |
| **Características del Producto** (16 opciones) | Alto rendimiento, Secado rápido, Lavable, Antihongos, Antibacterial, Anticorrosivo, Resistente al agua, Resistente a la intemperie, Resistente a la abrasión, Elastomérico, Bajo olor, Base agua, Base solvente, Acabado mate, Acabado satinado, Acabado brillante |
| **Condiciones Ambientales** (10 opciones) | Uso interior, Uso exterior, Alta humedad, Exposición directa al sol, Zonas costeras, Lluvias frecuentes, Temperaturas extremas, Ambiente industrial, Tráfico peatonal, Tráfico vehicular |
| **Precauciones de Aplicación** (11 opciones) | Usar guantes, Usar mascarilla, Usar lentes de protección, Aplicar en área ventilada, No fumar durante la aplicación, Mantener alejado del fuego, No ingerir, Mantener fuera del alcance de niños, Evitar contacto prolongado con la piel, Aplicar sobre superficie seca, Aplicar entre 10°C y 35°C |

> 💡 Cada sección muestra un contador con la cantidad de opciones seleccionadas. Los chips seleccionados se resaltan en color de acento.

**Campo adicional:**

| Campo | Tipo | Descripción |
|---|---|---|
| Requiere primario/sellador | Casilla (checkbox) | Marcar si el producto requiere aplicar un sellador previo. |
| Producto Primario | Desplegable | Solo aparece si se marca la casilla anterior. Lista todos los demás productos para seleccionar el primario recomendado. |

3. Complete los campos requeridos (marcados con **\***).
4. Haga clic en **"Crear Producto"** para guardar o en **"Cancelar"** para cerrar el formulario sin guardar.

#### 7.3.4 Editar un Producto

1. En la lista de productos, haga clic en el ícono de **lápiz** (✏️) del producto que desea editar.
2. Se abrirá el mismo formulario modal precargado con los datos actuales del producto.
3. Modifique los campos necesarios.
4. Haga clic en **"Guardar"** para aplicar los cambios.

#### 7.3.5 Eliminar un Producto

1. Haga clic en el ícono de **papelera** (🗑️) del producto que desea eliminar.
2. Se mostrará un diálogo de confirmación: *"¿Estás seguro de eliminar este producto?"*
3. Haga clic en **Aceptar** para confirmar o **Cancelar** para abortar.

> ⚠️ La eliminación es permanente. Los productos eliminados no pueden recuperarse.

### 7.4 Gestión de Gerentes

#### 7.4.1 Vista de la Lista de Gerentes

Al hacer clic en **"Gestionar Gerentes"**, se muestra:

- **Título**: "Gestión de Gerentes" con el conteo total.
- **Botón "Nuevo Gerente"**: En la esquina superior derecha, con ícono de **+**.
- **Lista de gerentes**: Cada entrada muestra un avatar circular, nombre completo, email y una etiqueta "Gerente".

#### 7.4.2 Crear un Nuevo Gerente

1. Haga clic en **"Nuevo Gerente"**.
2. Complete el formulario con:

| Campo | Descripción | Validación |
|---|---|---|
| Nombre completo | Nombre del gerente | Obligatorio |
| Email | Correo electrónico | Formato de email válido |
| Contraseña | Contraseña de acceso | Mínimo 8 caracteres, debe incluir mayúscula, minúscula y número |

3. Haga clic en **"Guardar"**.

#### 7.4.3 Editar un Gerente

1. Haga clic en el ícono de **lápiz** (✏️) junto al gerente que desea modificar.
2. Modifique el nombre o email según sea necesario.
3. Haga clic en **"Guardar"**.

#### 7.4.4 Eliminar un Gerente

1. Haga clic en el ícono de **papelera** (🗑️).
2. Confirme la eliminación en el diálogo que aparecerá.

> ⚠️ Al eliminar un gerente, el usuario perderá su acceso al sistema con ese rol.

---

## 8. Panel del Gerente

### 8.1 Acceso

- **Ruta:** `/gerente`
- **Roles con acceso:** Administrador, Gerente
- **Credenciales de demostración:** `gerente@sayervision.com` / `Gerente1234`

### 8.2 Vista Principal (Dashboard)

Al iniciar sesión como Gerente, se muestra un dashboard con **4 tarjetas de navegación** interactivas:

| Tarjeta | Descripción |
|---|---|
| **Gestionar Productos** | CRUD completo del catálogo de productos Sayer. |
| **Gestionar Vendedores** | Crear, editar y eliminar usuarios con rol de vendedor. |
| **Gestionar Clientes** | Crear, editar y eliminar usuarios con rol de cliente. |
| **Gestionar Bóvedas** | Consultar y administrar las bóvedas de los clientes. |

### 8.3 Gestión de Productos

La gestión de productos desde el panel del Gerente funciona de manera idéntica a la del panel de Administración (ver [Sección 7.3](#73-gestión-de-productos)). El Gerente tiene los mismos permisos para crear, editar, eliminar y consultar productos, incluyendo la gestión de precios.

### 8.4 Gestión de Vendedores

#### 8.4.1 Vista de la Lista

Se muestra la lista de todos los vendedores registrados con:
- Nombre completo.
- Correo electrónico.
- Etiqueta de rol "Vendedor".
- Botones de edición (✏️) y eliminación (🗑️).

#### 8.4.2 Crear un Vendedor

1. Haga clic en **"Nuevo Vendedor"**.
2. Complete el formulario:

| Campo | Validación |
|---|---|
| Nombre completo | Obligatorio |
| Email | Formato de email válido |
| Contraseña | Mínimo 8 caracteres, mayúscula, minúscula y número |

3. Haga clic en **"Guardar"**.

> ✅ El vendedor podrá iniciar sesión inmediatamente con las credenciales proporcionadas.

#### 8.4.3 Editar / Eliminar un Vendedor

El proceso es análogo al descrito en la gestión de gerentes (ver [Sección 7.4.3](#743-editar-un-gerente) y [Sección 7.4.4](#744-eliminar-un-gerente)).

### 8.5 Gestión de Clientes

#### 8.5.1 Vista de la Lista

Se muestra la lista de todos los clientes registrados con la misma estructura visual que vendedores y gerentes.

#### 8.5.2 Crear un Cliente

1. Haga clic en **"Nuevo Cliente"**.
2. Complete el formulario con nombre, email y contraseña (mismas validaciones que para vendedores).
3. Haga clic en **"Guardar"**.

> 💡 Al crear un cliente, automáticamente se le genera una bóveda personal para almacenar sus imágenes y productos asignados.

#### 8.5.3 Editar / Eliminar un Cliente

Mismo proceso que para vendedores.

### 8.6 Gestión de Bóvedas

La sección de bóvedas permite al Gerente supervisar el contenido de las bóvedas de todos los clientes.

#### 8.6.1 Seleccionar un Cliente

1. Al ingresar a **"Gestionar Bóvedas"**, se muestra un **menú desplegable** con la lista de todos los clientes registrados.
2. Seleccione un cliente para visualizar el contenido de su bóveda.

#### 8.6.2 Contenido de la Bóveda

Una vez seleccionado un cliente, la bóveda muestra dos tipos de elementos:

**Imágenes Subidas:**
- Miniatura de la imagen.
- Fecha y hora de subida.
- Tipo: `uploaded` (subida por el cliente al usar la herramienta de IA).

**Pinturas Asignadas:**
- Nombre del producto asignado.
- Nombre del vendedor que realizó la asignación.
- Fecha de la asignación.
- Tipo: `assigned_painting`.

#### 8.6.3 Eliminar Elementos de la Bóveda

El Gerente puede eliminar cualquier elemento de la bóveda de un cliente (imágenes subidas o pinturas asignadas) haciendo clic en el botón de eliminación correspondiente.

---

## 9. Panel del Vendedor

### 9.1 Acceso

- **Ruta:** `/vendedor`
- **Roles con acceso:** Administrador, Gerente, Vendedor
- **Credenciales de demostración:** `vendedor@sayervision.com` / `Vendedor1234`

### 9.2 Vista Principal (Dashboard)

Al iniciar sesión como Vendedor, se muestra un dashboard con **2 tarjetas de navegación**:

| Tarjeta | Descripción |
|---|---|
| **Consultar Producto** | Lista de solo lectura del catálogo completo de productos Sayer. |
| **Asignar Producto** | Formulario para asignar un producto del catálogo a un cliente. |

### 9.3 Consultar Productos

#### 9.3.1 Vista del Catálogo

Esta vista presenta el catálogo completo de productos en **modo de solo lectura**:

- **Barra de búsqueda**: Permite filtrar productos por nombre o serie.
- **Lista de productos**: Cada producto muestra su nombre, serie, precio y superficies compatibles.
- **Detalles expandibles**: Al hacer clic en un producto, se despliegan sus características completas, condiciones ambientales y precauciones.

> 💡 El vendedor puede consultar los precios de todos los productos para asesorar a los clientes durante el proceso de venta.

> ⚠️ El vendedor **no puede** crear, editar ni eliminar productos. Esta función está reservada para Administradores y Gerentes.

### 9.4 Asignar Producto a Cliente

Esta función permite registrar la asignación de un producto a un cliente específico.

#### 9.4.1 Proceso de Asignación

1. Haga clic en la tarjeta **"Asignar Producto"**.
2. **Seleccione un cliente** de la lista desplegable.
3. **Seleccione un producto** del catálogo.
4. Haga clic en **"Confirmar Asignación"**.

#### 9.4.2 Datos Registrados

Al confirmar la asignación, el sistema registra:

| Dato | Descripción |
|---|---|
| `product_name` | Nombre del producto asignado. |
| `vendor_name` | Nombre del vendedor que realizó la asignación. |
| `assigned_by` | ID del vendedor (para trazabilidad). |
| Fecha | Fecha y hora de la asignación (automática). |

> 💡 La asignación quedará visible en la bóveda del cliente, donde podrá consultar qué productos le fueron recomendados y por quién.

---

## 10. Panel del Cliente — Bóveda

### 10.1 Acceso

- **Ruta:** `/boveda`
- **Roles con acceso:** Administrador, Gerente, Cliente
- **Credenciales de demostración:** `cliente@sayervision.com` / `Cliente1234`

### 10.2 Vista Principal (Dashboard)

Al iniciar sesión como Cliente, se muestra un dashboard con **2 tarjetas de navegación**:

| Tarjeta | Descripción |
|---|---|
| **Mis Imágenes Subidas** | Galería con todas las imágenes que el cliente ha enviado a la herramienta de IA. |
| **Pinturas Seleccionadas** | Lista de productos asignados por los vendedores. |

### 10.3 Mis Imágenes Subidas

Esta sección muestra una galería con todas las imágenes que el cliente ha procesado con la herramienta de colorización:

- **Miniatura** de cada imagen subida.
- **Fecha y hora** de la subida.

> 💡 Solo las imágenes procesadas por usuarios con rol de **Cliente** se guardan en su bóveda. Las imágenes procesadas por otros roles no se almacenan.

### 10.4 Pinturas Seleccionadas

Esta sección muestra la lista de productos que los vendedores han asignado al cliente:

| Información | Descripción |
|---|---|
| **Nombre del producto** | El producto de Pinturas Sayer asignado. |
| **Vendedor** | Nombre del vendedor que realizó la asignación. |
| **Fecha** | Fecha y hora en que se realizó la asignación. |

---

## 11. Navegación General y Elementos Comunes

### 11.1 Encabezado (Header)

Todos los paneles de gestión comparten un encabezado con los siguientes elementos:

| Elemento | Ubicación | Función |
|---|---|---|
| **Botón ← (Atrás)** | Izquierda | Regresa a la vista anterior o al dashboard del panel. |
| **Título del panel** | Centro-izquierda | Indica en qué panel se encuentra. |
| **Email del usuario** | Debajo del título | Muestra el correo del usuario autenticado. |
| **Botón SayerVisionAI** | Centro | Acceso directo a la herramienta de colorización con IA. |
| **Botón Cerrar Sesión** | Derecha | Cierra la sesión y redirige al login. |

### 11.2 Encabezado en SayerVisionAI

La herramienta de IA muestra un encabezado más ligero que incluye:

| Elemento | Función |
|---|---|
| **Logo SayerVisionAI** | Identidad visual de la herramienta. |
| **Nombre del usuario** | Muestra el nombre o email del usuario autenticado. |
| **Botón Panel** | Regresa al panel de gestión correspondiente al rol del usuario. |
| **Botón Cerrar Sesión** | Ícono de puerta de salida para cerrar la sesión. |

### 11.3 Notificaciones (Toast)

El sistema utiliza notificaciones emergentes (*toasts*) para comunicar el resultado de las acciones:

| Tipo | Color | Ejemplo |
|---|---|---|
| **Éxito** | Verde | *"¡Bienvenido Administrador!"*, *"Producto creado exitosamente"* |
| **Error** | Rojo | *"Credenciales incorrectas"*, *"Error al guardar el producto"* |
| **Información** | Azul | *"Procesando imagen..."* |

Las notificaciones aparecen en la esquina de la pantalla y se ocultan automáticamente después de unos segundos.

### 11.4 Formularios Modales

Los formularios de creación y edición (productos, gerentes, vendedores, clientes) se presentan como ventanas modales que:

- Se superponen al contenido con un fondo oscuro semitransparente.
- Se centran en la pantalla.
- Incluyen un **scroll interno** si el contenido excede la altura de la pantalla.
- Se cierran al hacer clic en el botón **"Cancelar"** o al completar la acción con **"Guardar"**.

### 11.5 Página 404 (No Encontrada)

Si el usuario navega a una URL que no existe dentro de la aplicación, se mostrará una página de error **404** indicando que la página no fue encontrada, con un enlace para regresar al inicio.

---

## 12. Gestión de Datos y Almacenamiento

### 12.1 Almacenamiento Local

La aplicación utiliza el **almacenamiento local del navegador** (`localStorage`) para persistir los siguientes datos:

| Dato | Clave en localStorage |
|---|---|
| Usuarios registrados | Gestionado internamente por `localDb.ts` |
| Sesión activa | Token simbólico `CURRENT_USER` |
| Catálogo de productos | `sayer_products` |
| Bóvedas de clientes | Gestionado internamente por `localDb.ts` |

### 12.2 Datos Iniciales (Semilla)

La primera vez que se abre la aplicación, el sistema carga automáticamente:

- **5 usuarios de demostración** (uno por cada rol).
- **Catálogo base de productos Sayer** con todos los datos técnicos.

### 12.3 Consideraciones Importantes

> ⚠️ **Persistencia volátil**: Como la base de datos reside en el `localStorage` del navegador, **los datos se perderán** si:
> - El usuario borra la caché o los datos del navegador.
> - Se accede desde una ventana de **incógnito/privada**.
> - Se accede desde un **navegador diferente** o una **computadora diferente**.

> ⚠️ **Datos de la herramienta de IA**: La colorización de imágenes y las recomendaciones de productos requieren conexión a Internet, ya que utilizan servicios en la nube (Google Gemini y Supabase Edge Functions).

### 12.4 Restablecer Datos

Si desea restablecer la aplicación a su estado inicial:

1. Abra las **herramientas de desarrollador** del navegador (presione `F12`).
2. Vaya a la pestaña **Application** (o **Almacenamiento** en español).
3. En el panel izquierdo, seleccione **Local Storage** y el dominio de la aplicación.
4. Elimine todas las claves almacenadas.
5. Recargue la página. Los datos de demostración se cargarán nuevamente.

---

## 13. Preguntas Frecuentes (FAQ)

### ¿Necesito crear una cuenta para usar la aplicación?

No. La aplicación viene con usuarios de demostración precargados. Use las credenciales listadas en la [Sección 5.5](#55-usuarios-de-demostración) para acceder con cualquier rol.

### ¿Puedo usar la herramienta de IA sin iniciar sesión?

No. La herramienta de colorización con IA (`/app`) requiere autenticación. Todos los roles tienen acceso a ella una vez que inician sesión.

### ¿Cuánto tarda el proceso de colorización?

El tiempo de procesamiento varía entre **10 y 30 segundos** dependiendo de la complejidad de la imagen, la calidad de conexión a Internet y la carga del servidor.

### ¿Puedo descargar la imagen colorizada?

Sí. En la pantalla de resultados, haga clic en el botón **"Descargar"** para guardar la imagen colorizada en su computadora.

### ¿Qué sucede si la IA no puede colorizar mi imagen?

Si ocurre un error, se mostrará un mensaje descriptivo en color rojo. Posibles causas:
- La imagen no contiene superficies pintables.
- La descripción no es lo suficientemente clara.
- Error de conexión con el servicio de IA.
- Límite de solicitudes alcanzado (rate limiting).

En caso de error, intente con una descripción más específica o una imagen de mayor calidad.

### ¿Los datos que creo se guardan permanentemente?

Los datos se guardan en el `localStorage` del navegador. Son persistentes mientras no se borre la caché del navegador. No se sincronizan entre diferentes navegadores o dispositivos.

### ¿Puedo acceder a la aplicación desde mi teléfono celular?

Sí, si ambos dispositivos están conectados a la misma red WiFi. Use la dirección IP que aparece al iniciar el servidor (ejemplo: `http://192.168.1.65:8080/`). La interfaz es responsiva y se adapta a pantallas pequeñas.

### ¿Por qué no veo el botón "Nuevo Producto" siendo Vendedor?

Los vendedores solo tienen acceso de **lectura** al catálogo de productos. Para crear, editar o eliminar productos, es necesario tener el rol de Administrador o Gerente.

### ¿Cómo puedo cambiar mi contraseña?

En la versión actual de demostración, no existe una funcionalidad de cambio de contraseña desde la interfaz. Contacte al Administrador del sistema para solicitar un cambio.

---

## 14. Solución de Problemas

### 14.1 Problemas de Instalación

| Problema | Causa Probable | Solución |
|---|---|---|
| `node` no reconocido como comando | Node.js no está instalado o no está en el PATH | Reinstale Node.js desde https://nodejs.org y reinicie la terminal. |
| Error `ENOENT package.json` | No está posicionado en la carpeta correcta del proyecto | Navegue a la carpeta `SayerVision/` antes de ejecutar los comandos. |
| Error al instalar paquetes (`npm install`) | Sin conexión a Internet | Conéctese a Internet e intente de nuevo. |
| Vulnerabilidades reportadas tras `npm install` | Dependencias desactualizadas (normal) | Son advertencias informativas. No afectan el funcionamiento. Pueden ignorarse. |

### 14.2 Problemas de Ejecución

| Problema | Causa Probable | Solución |
|---|---|---|
| Puerto 8080 ocupado | Otra aplicación usa ese puerto | Cierre la otra aplicación, o reinicie la computadora. |
| La página no carga en el navegador | El servidor no está corriendo | Verifique que `npm run dev` sigue ejecutándose en la terminal. |
| Página en blanco | Error de JavaScript en el navegador | Abra la consola del navegador (F12 → Console) para ver detalles del error. |

### 14.3 Problemas de Autenticación

| Problema | Causa Probable | Solución |
|---|---|---|
| "Credenciales incorrectas" | Email o contraseña mal escritos | Verifique las credenciales usando la tabla de la [Sección 5.5](#55-usuarios-de-demostración). Use el ícono del ojo para verificar la contraseña. |
| No redirige al panel después del login | Problema de sesión | Borre la caché del navegador, recargue la página y vuelva a iniciar sesión. |
| Los usuarios de demostración no funcionan | Se borraron los datos del localStorage | Borre todo el localStorage (ver [Sección 12.4](#124-restablecer-datos)) y recargue la página para regenerar los datos de demostración. |

### 14.4 Problemas con la IA

| Problema | Causa Probable | Solución |
|---|---|---|
| "Error al procesar la imagen" | Problema de conexión con el servicio de IA | Verifique su conexión a Internet. Intente de nuevo en unos minutos. |
| La imagen tarda demasiado | Alta carga en el servidor de IA | Espere pacientemente. Si supera los 60 segundos, recargue la página e intente de nuevo. |
| La colorización no se ve natural | Descripción poco específica | Sea más detallado en la descripción de la superficie (material, ubicación, condiciones). |
| La recomendación de producto no parece adecuada | La IA no detectó correctamente el material | Intente con una descripción más específica del material (ej: "pared de block" en lugar de solo "pared"). |

---

## 15. Glosario de Términos

| Término | Definición |
|---|---|
| **Bóveda** | Espacio de almacenamiento personal de cada cliente donde se guardan sus imágenes procesadas y los productos que le fueron asignados por vendedores. |
| **Catálogo** | Conjunto completo de productos de Pinturas Sayer disponibles en el sistema, incluyendo sus características técnicas, superficies de aplicación y precios. |
| **Colorización** | Proceso de IA que modifica una fotografía para mostrar cómo se vería una superficie pintada con un color específico. |
| **CRUD** | Acrónimo de Crear, Leer, Actualizar y Eliminar. Operaciones básicas de gestión de datos. |
| **Dashboard** | Panel principal de un rol, desde donde se accede a las diferentes funcionalidades disponibles. |
| **Edge Function** | Código que se ejecuta en los servidores de la nube (Supabase) para procesar las solicitudes de IA de forma segura. |
| **IA (Inteligencia Artificial)** | Tecnología utilizada para analizar imágenes, detectar superficies y generar visualizaciones colorizadas. |
| **localStorage** | Mecanismo del navegador web que permite almacenar datos de forma persistente en la computadora del usuario. |
| **Modal** | Ventana emergente que se superpone al contenido principal para mostrar formularios o información adicional. |
| **Paleta de colores** | Conjunto de colores disponibles para seleccionar durante el proceso de colorización, organizados por categorías. |
| **Primario / Sellador** | Producto de preparación que debe aplicarse sobre la superficie antes de la pintura final, para mejorar la adherencia y durabilidad. |
| **RBAC** | Control de Acceso Basado en Roles. Sistema que determina qué funcionalidades puede usar cada usuario según su rol asignado. |
| **Rol** | Categoría asignada a cada usuario (Admin, Gerente, Vendedor, Cliente) que determina sus permisos dentro del sistema. |
| **Toast** | Notificación emergente temporal que aparece en la pantalla para informar el resultado de una acción. |

---

## 16. Información Técnica del Proyecto

### 16.1 Stack Tecnológico

| Componente | Tecnología |
|---|---|
| **Framework Frontend** | React 18 |
| **Bundler** | Vite 5 |
| **Lenguaje** | TypeScript |
| **Estilos** | Tailwind CSS + CSS personalizado |
| **Componentes UI** | Radix UI + shadcn/ui |
| **Backend** | Supabase (Base de datos PostgreSQL + Edge Functions) |
| **IA — Análisis de imagen** | Google Gemini API (`gemini-2.5-flash`) |
| **IA — Edición de imagen** | Lovable AI Gateway (`gemini-2.5-flash-image`) |
| **Gestión de estado** | React Context + React Query |
| **Routing** | React Router DOM v6 |
| **Validación de formularios** | Zod + React Hook Form |
| **Puerto local** | `8080` |

### 16.2 Estructura de Archivos Relevantes

```
SayerVision/
├── src/
│   ├── pages/                  ← Páginas de la aplicación
│   │   ├── Auth.tsx            ← Pantalla de inicio de sesión
│   │   ├── Index.tsx           ← Herramienta de colorización (SayerVisionAI)
│   │   ├── Admin.tsx           ← Panel del Administrador
│   │   ├── GerenteDashboard.tsx ← Panel del Gerente
│   │   ├── VendedorDashboard.tsx ← Panel del Vendedor
│   │   ├── ClienteDashboard.tsx ← Panel del Cliente (Bóveda)
│   │   └── NotFound.tsx        ← Página 404
│   ├── components/             ← Componentes reutilizables
│   │   ├── ImageUploader.tsx   ← Zona de carga de imágenes (drag & drop)
│   │   ├── ColorPalette.tsx    ← Paleta de colores (+60 colores)
│   │   ├── ResultPreview.tsx   ← Comparación original vs colorizada
│   │   ├── ProductRecommendation.tsx ← Tarjeta de recomendación
│   │   ├── PrecautionsSection.tsx ← Precauciones de seguridad
│   │   ├── ProtectedRoute.tsx  ← Protección de rutas por rol
│   │   ├── admin/              ← Componentes del panel admin
│   │   └── shared/             ← Componentes compartidos
│   ├── hooks/                  ← Lógica de negocio
│   │   ├── useAuth.ts          ← Autenticación y sesión
│   │   ├── useColorize.ts      ← Llamadas a la IA
│   │   ├── useProducts.ts      ← CRUD de productos
│   │   ├── useGerentes.ts      ← CRUD de gerentes
│   │   ├── useVendedores.ts    ← CRUD de vendedores
│   │   ├── useClientes.ts      ← CRUD de clientes
│   │   └── useVault.ts         ← Gestión de bóvedas
│   ├── contexts/               ← Estado global
│   │   └── AuthContext.tsx     ← Contexto de autenticación
│   ├── lib/                    ← Utilidades y base de datos local
│   │   └── localDb.ts          ← Motor de BD simulado
│   ├── App.tsx                 ← Configuración de rutas
│   └── index.css               ← Estilos globales
├── supabase/
│   └── functions/
│       └── colorize-surface/   ← Edge Function de IA
├── .env                        ← Variables de entorno
├── package.json                ← Dependencias
└── vite.config.ts              ← Configuración del servidor
```

### 16.3 Mapa de Rutas

| Ruta | Componente | Roles con Acceso | Descripción |
|---|---|---|---|
| `/` | Auth | Todos (público) | Pantalla de inicio de sesión |
| `/auth` | Auth | Todos (público) | Alias de la pantalla de login |
| `/app` | Index | Admin, Gerente, Vendedor, Cliente | Herramienta de colorización con IA |
| `/admin` | Admin | Admin | Panel de administración |
| `/gerente` | GerenteDashboard | Admin, Gerente | Panel del gerente |
| `/vendedor` | VendedorDashboard | Admin, Gerente, Vendedor | Panel del vendedor |
| `/boveda` | ClienteDashboard | Admin, Gerente, Cliente | Panel del cliente (bóveda) |
| `/*` | NotFound | Todos | Página 404 |

### 16.4 Variables de Entorno

El archivo `.env` contiene las credenciales de conexión necesarias. Estas ya están preconfiguradas en el proyecto:

| Variable | Descripción |
|---|---|
| `VITE_SUPABASE_PROJECT_ID` | ID del proyecto en Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Clave pública de Supabase |
| `VITE_SUPABASE_URL` | URL del proyecto en Supabase |
| `VITE_SUPABASE_ANON_KEY` | Clave anónima de Supabase |

> 💡 Las credenciales del backend ya están incluidas en el archivo `.env` del proyecto. No es necesario configurar nada adicional para ejecutar la aplicación.

---

*Manual de Usuario generado para el proyecto **SayerVision — Color Canvas AI***  
*Proyecto Integrador — Equipo 2*  
*Mayo 2026*
