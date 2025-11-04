# Banner Module

Módulo para gestionar imágenes de banner principal con las siguientes funcionalidades:

## 🎯 Características

- ✅ Subir imágenes de banner (protegido por JWT)
- ✅ Listar todas las imágenes (protegido por JWT)
- ✅ Filtrar imágenes por diferentes criterios (protegido por JWT)
- ✅ Establecer orden de visualización (1-4) (protegido por JWT)
- ✅ Activar/desactivar imágenes en el banner (protegido por JWT)
- ✅ Eliminar imágenes (protegido por JWT)
- ✅ Endpoint público para obtener banners activos (sin autenticación)
- ✅ Logs automáticos de creación, actualización y eliminación
- ✅ Almacenamiento local de imágenes
- ✅ Validación de formato y tamaño de imágenes

## 📁 Estructura

```
banner/
├── entities/
│   └── banner-image.entity.ts      # Entidad de la tabla banner_images
├── dto/
│   ├── upload-banner.dto.ts        # DTO para subir imágenes
│   ├── update-banner-order.dto.ts  # DTO para actualizar orden
│   ├── filter-banner.dto.ts        # DTO para filtrar
│   └── index.ts                    # Exportaciones
├── pipes/
│   └── image-validation.pipe.ts    # Validación de imágenes
├── banner.service.ts               # Lógica de negocio
├── banner.controller.ts            # Endpoints REST
└── banner.module.ts                # Módulo NestJS
```

## 🗄️ Tabla de Base de Datos

```sql
banner_images:
- id: bigint (PK, auto-increment)
- imageUrl: text (URL/path de la imagen)
- originalName: text (nombre original del archivo)
- displayOrder: int (1-4, nullable, unique) - Orden de visualización
- isActive: boolean (si está activa en el banner)
- uploadedBy: bigint (FK a users)
- createdAt: timestamptz
- updatedAt: timestamptz
```

**Constraints:**
- Solo puede haber 4 imágenes activas simultáneamente
- El displayOrder debe ser único (1-4)
- Al eliminar un usuario, se eliminan sus imágenes (CASCADE)

## 🔐 Endpoints

### Protegidos (requieren JWT):

#### 1. **POST** `/api/banner/upload`
Subir una nueva imagen de banner.
- Body: `multipart/form-data` con campo `file`
- Log automático: "Imagen de banner subida exitosamente"

#### 2. **GET** `/api/banner`
Obtener todas las imágenes de banner.

#### 3. **GET** `/api/banner/filter?isActive=true&displayOrder=1`
Filtrar imágenes por criterios.
- Query params: `id`, `isActive`, `displayOrder`

#### 4. **GET** `/api/banner/:id`
Obtener una imagen específica por ID.

#### 5. **PUT** `/api/banner/:id/order`
Actualizar el orden de visualización.
- Body: `{ "displayOrder": 1 }` o `{ "displayOrder": null }` para desactivar
- Log automático: "Orden de banner actualizado exitosamente"

#### 6. **DELETE** `/api/banner/:id`
Eliminar una imagen de banner.
- Log automático: "Imagen de banner eliminada exitosamente"

### Público (sin autenticación):

#### 7. **GET** `/api/banner/active`
Obtener las imágenes activas del banner (máximo 4).
- Ordenadas por `displayOrder`
- Para consumir en el frontend/landing

## 🖼️ Validación de Imágenes

**Formatos permitidos:**
- image/jpeg
- image/jpg
- image/png
- image/webp
- image/gif

**Tamaño máximo:** 5MB

## 💾 Almacenamiento

Las imágenes se guardan en:
```
/uploads/banners/banner-{timestamp}.{extension}
```

URL accesible:
```
http://localhost:3005/uploads/banners/banner-123456789.jpg
```

## 📝 Ejemplo de uso

### Subir imagen:
```bash
curl -X POST http://localhost:3005/api/banner/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/image.jpg"
```

### Establecer como banner activo (posición 1):
```bash
curl -X PUT http://localhost:3005/api/banner/1/order \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"displayOrder": 1}'
```

### Obtener banners activos (público):
```bash
curl http://localhost:3005/api/banner/active
```

## 🎨 Lógica de negocio

1. **Solo 4 banners activos:** El sistema permite máximo 4 imágenes activas simultáneamente.
2. **Orden único:** Cada posición (1-4) es única, no puede haber dos imágenes en la misma posición.
3. **Activación/Desactivación:** Al establecer un `displayOrder`, la imagen se activa automáticamente. Al establecerlo en `null`, se desactiva.
4. **Eliminación física:** Al eliminar una imagen, se borra tanto el registro de BD como el archivo físico.
5. **Trazabilidad:** Todas las operaciones (CREATE, UPDATE, DELETE) quedan registradas en los logs de acción.

## 🚀 Pasos siguientes

1. Correr la migración: `npm run migration:run`
2. Reiniciar el servidor
3. Probar endpoints en Swagger: `http://localhost:3005/api/docs`
