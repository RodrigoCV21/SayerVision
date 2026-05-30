# Documentación: Mejoras en Herramienta SayerVisionAI

Este documento detalla las actualizaciones realizadas en el motor de colorización y la experiencia de usuario.

## 🎨 Nueva Paleta de Colores "Sayer"
Se ha implementado una paleta masiva de más de 60 colores categorizados por:
- **VIVOS**: Tonos saturados y energéticos.
- **CLAROS**: Tonos pastel y suaves.
- **AGRISADOS**: Colores con base gris y tonos tierra.
- **OSCUROS**: Tonos profundos y elegantes.
- **NEUTROS**: Blanco, Negro, Grises y Metálicos.

### Comunicación con la IA
Para mejorar la precisión del resultado, el sistema ahora envía el **valor hexadecimal exacto** (ej: `#722F37`) al modelo de lenguaje. Esto elimina la ambigüedad de los nombres de colores y garantiza que la IA aplique el tono real solicitado por el usuario.

---

## 🔒 Privacidad y Almacenamiento (Bóveda)
Se ha optimizado la lógica de guardado de imágenes en la base de datos local:
- **Clientes**: Las imágenes subidas se guardan automáticamente en su bóveda personal para consulta histórica.
- **Gerentes, Vendedores y Admins**: Pueden usar la herramienta libremente, pero sus imágenes subidas **no se persisten** en la base de datos, manteniendo la base local ligera y centrada en los datos del cliente final.

---

## ⚠️ Seguridad y Precauciones
Se ha aumentado la jerarquía visual de las precauciones en las recomendaciones de productos:
- **Títulos**: Uso de `font-black` (negrita extra) y tamaño `text-xl`.
- **Contenido**: Aumento de tamaño a `text-base` para una lectura obligatoria.
- **Estética**: Diseño estilo "Alerta" con bordes reforzados en color vino para llamar la atención del aplicador.

---

## 🚀 Acceso Global
Se integró el componente `SayerVisionAILink` en los encabezados de todos los paneles. Esto permite a cualquier usuario operativo saltar a la herramienta de visualización desde cualquier parte del sistema con un solo clic.
