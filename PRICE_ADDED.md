# Documentación: Integración de Precios en Productos

Este documento describe la implementación de la característica de **Precios de Venta** en el catálogo de productos de SayerVision.

## 🎯 Objetivo
Proporcionar a los Gerentes y Administradores la capacidad de asignar y gestionar precios competitivos para los productos, y asegurar que los clientes puedan ver esta información tanto en el catálogo como en las recomendaciones de IA.

## 🛠️ Cambios Realizados

### 1. Estructura de Datos
- Se añadió el campo `price` (tipo `number`) a la interfaz `LocalProduct` en `database.types.ts`.
- Se configuró un valor predeterminado de `$0.00` para todos los productos existentes y nuevos.

### 2. Gestión (Admin / Gerente)
- **Formulario de Producto**: Se integró un campo de entrada numérico en `ProductForm.tsx` con validación para pasos decimales (moneda).
- **Listado de Gestión**: El precio ahora es visible en la tarjeta principal del producto dentro del Panel de Gerente.

### 3. Visualización (Vendedor)
- Se añadió la columna de precio en el catálogo de consulta del Vendedor para facilitar la labor de venta.

### 4. Inteligencia Artificial
- **Ventana de Recomendaciones**: Al usar la herramienta de colorización, la tarjeta de recomendación ahora muestra el precio del producto sugerido.
- **Productos Primarios**: Si un producto requiere sellador/primario, la recomendación también desglosa el precio de dicho producto adicional.

## 💡 Notas de Uso
- Los precios se gestionan de forma local en esta fase de la aplicación.
- Solo los usuarios con rol `admin` o `gerente` tienen permisos para modificar el precio de venta.
