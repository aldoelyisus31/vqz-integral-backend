# Action Logs Module

Módulo para registrar automáticamente logs de acciones (CREATE, UPDATE, DELETE) en los endpoints de la aplicación.

## Estructura

```
action-logs/
├── entities/
│   └── action-log.entity.ts       # Entidad de la tabla action_logs
├── decorators/
│   └── log-action.decorator.ts    # Decorador @LogAction
├── interceptors/
│   └── action-log.interceptor.ts  # Interceptor para capturar acciones
├── action-logs.service.ts         # Servicio para gestionar logs
├── action-logs.module.ts          # Módulo
└── index.ts                       # Exportaciones
```

## Uso

### 1. Aplicar el interceptor globalmente (YA ESTÁ CONFIGURADO)

El interceptor ya está registrado globalmente en `app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ActionLogsModule, ActionLogInterceptor } from './modules/action-logs';

@Module({
  imports: [ActionLogsModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ActionLogInterceptor,
    },
  ],
})
export class AppModule {}
```

**Esto significa que NO necesitas:**
- ❌ Importar `ActionLogsModule` en otros módulos
- ❌ Usar `@UseInterceptors(ActionLogInterceptor)` en controladores
- ✅ Solo necesitas usar el decorador `@LogAction()` en los endpoints

### 2. Usar el decorador @LogAction en los endpoints

```typescript
import { Controller, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { LogAction } from '../action-logs';

@Controller('users')
export class UsersController {
  // CREATE - con descripción automática
  @Post()
  @LogAction('CREATE', 'usuario')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // UPDATE - con descripción automática
  @Patch(':id')
  @LogAction('UPDATE', 'usuario')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  // DELETE - con descripción personalizada
  @Delete(':id')
  @LogAction('DELETE', 'usuario', (result) => {
    return `Eliminación de usuario con id ${result.id}, username: ${result.username}`;
  })
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
```

## Características

- ✅ Registra automáticamente la acción (CREATE, UPDATE, DELETE)
- ✅ Guarda el usuario que realizó la acción (desde `request.user`)
- ✅ Registra el endpoint y método HTTP
- ✅ Genera descripciones automáticas o personalizadas
- ✅ Maneja errores sin afectar la respuesta del endpoint
- ✅ Solo registra logs si hay un usuario autenticado

## Campos de la tabla action_logs

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | bigint | Identificador único |
| action | text | Tipo de acción (CREATE, UPDATE, DELETE) |
| textDescription | text | Descripción legible de la acción |
| userId | bigint | ID del usuario que realizó la acción |
| endpoint | text | Ruta del endpoint |
| method | text | Método HTTP (POST, PATCH, DELETE) |
| createdAt | timestamptz | Timestamp de creación |

## Ejemplos de logs generados

```
Creación de usuario con id 3
Actualización de usuario con id 5
Eliminación de usuario con id 7
```
