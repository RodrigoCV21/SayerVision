# Reporte de Actualización de Base de Datos (Supabase)

**Fecha:** 28 de Abril de 2026  
**Entorno:** Producción (Gestionado por Lovable Cloud)

## Resumen Ejecutivo

Se han aplicado con éxito una serie de actualizaciones estructurales y de permisos en la base de datos de producción. El proceso se llevó a cabo sincronizando los cambios locales del equipo de desarrollo y solicitando su despliegue seguro a través del entorno administrado de Lovable Cloud, finalizando con la promoción manual de un usuario específico al rol de administrador.

---

## 1. Despliegue de Migración de Control de Acceso (RBAC) y Bóvedas

Se aplicó la migración local `supabase/migrations/20260428172800_add_rbac_and_vaults.sql`. Para evitar conflictos de transacciones en PostgreSQL al usar los nuevos roles inmediatamente en las políticas de seguridad, el sistema de Lovable dividió automáticamente la migración en dos fases:

### Fase A: Ampliación de Roles (ENUM)
Se actualizaron los roles del sistema de la enumeración `app_role` sin duplicar las estructuras existentes:
- `gerente`
- `vendedor`
- `cliente`

### Fase B: Creación de Tablas y Políticas RLS
Se crearon las siguientes tablas relacionales con sus respectivas políticas de Row Level Security (RLS) usando los nuevos roles:

**Tabla `client_vaults` (Bóvedas de clientes):**
- Políticas configuradas para que los **clientes** solo puedan ver su propia bóveda.
- Políticas configuradas para que los **gerentes** puedan ver y gestionar todas las bóvedas del sistema.

**Tabla `vault_images` (Imágenes dentro de bóvedas):**
- **Clientes:** Pueden ver imágenes en su bóveda y subir nuevas imágenes (con validación `type = 'uploaded'`).
- **Gerentes:** Pueden ver y editar todas las imágenes del sistema.
- **Vendedores:** Tienen permisos para asignar pinturas (`type = 'assigned_painting'`) y pueden ver únicamente las imágenes que ellos mismos han asignado.

**Tabla `products` (Actualización de políticas):**
- Se modificaron las políticas existentes para permitir que no solo los administradores, sino también los **gerentes**, puedan *insertar*, *actualizar* y *eliminar* productos en el catálogo.

**Triggers:**
- Se activó el trigger `update_client_vaults_updated_at` para actualizar automáticamente la fecha de modificación en las bóvedas.

---

## 2. Promoción de Usuario a Administrador

Como paso final, se ejecutó un query directo en producción para otorgar el rol de administrador (`admin`) a un usuario en específico, garantizándole acceso total.

**Usuario modificado:** `andres@gmail.com`  
**Nuevo Rol:** `admin`

**Consulta ejecutada:**
```sql
UPDATE public.user_roles
SET role = 'admin'
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'andres@gmail.com');
```

## Estado Final
> [!NOTE]
> Todos los cambios fueron verificados y aplicados correctamente en la base de datos de producción por el asistente de Lovable Cloud. El sistema RBAC está completamente operativo y el usuario designado ya cuenta con privilegios administrativos.
